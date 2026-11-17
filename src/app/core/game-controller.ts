/**
 * GameController
 *
 * Manages the game session and controls transitions between application states.
 * Handles starting, pausing, resuming, and ending games, as well as returning
 * to the main menu.
 * Ensures that state transitions only occur when permitted.
 */

import { LOCK_DELAY, MAX_LOCK_RESETS } from '../config/constants';
import { AppState } from '../config/enum';
import { CollisionSystem } from '../logic/collision-system';
import { PieceBag } from '../logic/piece-bag';
import { PieceFactory } from '../logic/piece-factory';
import { RotationSystem } from '../logic/rotation-system';
import { GameSession } from '../models/game-session';
import { Piece } from '../models/piece';

export class GameController {

    private session: GameSession;
    private pieceBag: PieceBag;
    private pieceFactory: PieceFactory;
    private collisionSystem: CollisionSystem;
    private gravityTimer: ReturnType<typeof setInterval> | null = null;
    private rotationSystem: RotationSystem;

    private lockTimer: ReturnType<typeof setTimeout> | null = null;
    private lockResetCount = 0;
    private lockTimeRemaining = LOCK_DELAY;
    private lockDeadline: number | null = null;
    private lockPaused = false;

    constructor() {
        this.session = new GameSession();
        this.pieceBag = new PieceBag();
        this.pieceFactory = new PieceFactory();
        this.collisionSystem = new CollisionSystem();
        this.rotationSystem = new RotationSystem();
    }

    public getSession(): GameSession { return this.session; }

    public startGame(): void {
        this.stopGravity();
        this.stopLockDelay();

        this.session = new GameSession();
        this.pieceBag = new PieceBag();
        this.session.state = AppState.PLAYING;
        this.spawnPiece();
        this.startGravity();
    }

    public pauseGame(): void {
        if (this.session.state != AppState.PLAYING) { return; }
        this.session.state = AppState.PAUSED;
        this.stopGravity();

        if (this.lockTimer !== null && this.lockDeadline !== null) {
            const remaining = Math.max(0, this.lockDeadline - Date.now());
            this.stopLockDelay();
            this.lockTimeRemaining = remaining
            this.lockPaused = true;
        }
    }

    public resumeGame(): void {
        if (this.session.state !== AppState.PAUSED) { return; }
        this.session.state = AppState.PLAYING;
        this.startGravity();

        if (this.lockPaused) {
            this.lockPaused = false;
            this.startLockDelay();
        }
    }

    public endGame(): void {
        if (this.session.state !== AppState.PLAYING &&
            this.session.state !== AppState.PAUSED
        ) { return; }
        this.session.state = AppState.GAME_OVER;
        this.stopGravity();
        this.stopLockDelay();
    }

    public returnToMainMenu(): void {
        if (this.session.state !== AppState.GAME_OVER) { return; }
        this.session.state = AppState.MAIN_MENU;
    }

    // Moves the active piece if the game is running.
    public moveActivePiece(
        deltaX: number,
        deltaY: number): boolean {
            if (this.session.state !== AppState.PLAYING) { return false; }

            const piece = this.session.activePieces[0];

            if (!piece) { return false; }

            const moved = this.collisionSystem.movePiece(
                this.session.board,
                piece,
                deltaX,
                deltaY
            );

            this.updateLockDelay(piece, moved && deltaX !== 0);
            return moved;
    }

    // Locks the active piece into the board
    public lockActivePiece(): void {
        const piece = this.session.activePieces[0];
        if (!piece) { return; }

        this.stopLockDelay();

        this.collisionSystem.lockPiece(
            this.session.board,
            piece
        );
        this.session.activePieces.shift();

        const clearedRows =  this.session.board.clearFullRows();

        this.session.lines += clearedRows;

        this.spawnPiece();
    }

    // Advances the game by one gravity step.
    public tick(): void {
        if(this.session.state != AppState.PLAYING) { return; }
        this.moveActivePiece(0, 1);
    }

    public rotateActivePiece(clockwise: boolean): boolean {
        if (this.session.state != AppState.PLAYING) { return false; }

        const piece = this.session.activePieces[0];
        if (!piece) { return false; }
        
        const rotated = this.rotationSystem.tryRotate(
            this.session.board,
            piece,
            this.collisionSystem,
            clockwise
        );

        this.updateLockDelay(piece, rotated);
        return rotated;
    }

    public hardDrop(): void {
        if (this.session.state != AppState.PLAYING) { return; }

        const piece = this.session.activePieces[0];
        if (!piece) { return; }

        while(this.collisionSystem.movePiece(
            this.session.board,
            piece, 
            0,
            1
        )) {}

        this.lockActivePiece();

    }

    ///////// PRIVATE MODES //////////////////////////////////////////

        // Generates the next tetromino and adds it to the game session.
    private spawnPiece(): void {
        const type = this.pieceBag.nextType();
        const color = this.pieceFactory.colorPiece();
        const piece = this.pieceFactory.createPiece(type, color);

        if (!this.checkCanSpawn(piece)) { return; }
        this.lockResetCount = 0;
        this.session.activePieces.push(piece);
    }

    // Starts the automatic gravity timer.
    private startGravity(): void {
        if (this.gravityTimer !== null) { clearInterval(this.gravityTimer); }

        this.gravityTimer = setInterval(
            () => this.tick(),
            this.session.fallInterval
        );
    }

    // Stops the gravity timer
    private stopGravity(): void {
        if (this.gravityTimer === null) { return; }

        clearInterval(this.gravityTimer);
        this.gravityTimer = null;
    }
    
    private checkCanSpawn(piece: Piece): boolean {
        if (!this.collisionSystem.canPlacePiece(
            this.session.board,
            piece, 
            piece.x,
            piece.y
        )) {
            this.endGame();
            return false;
        }
        return true;
    }

    private startLockDelay(): void {
        if (this.lockTimer !== null) { return; }

        this.lockDeadline = Date.now() + this.lockTimeRemaining;

        this.lockTimer = setTimeout(() => {
            this.lockTimer = null;
            if (this.session.state !== AppState.PLAYING) { return; }

            const piece = this.session.activePieces[0];
            if (!piece) { return; }
            if (this.collisionSystem.isGrounded(this.session.board, piece)) { this.lockActivePiece(); }
        }, this.lockTimeRemaining);
    }

    private stopLockDelay(): void {
        if (this.lockTimer !== null) { 
        clearTimeout(this.lockTimer);
        this.lockTimer = null; }

        this.lockDeadline = null;
        this.lockTimeRemaining = LOCK_DELAY;
        this.lockPaused = false;
    }

    private updateLockDelay(piece: Piece, canReset: boolean): void {
        const isGrounded = this.collisionSystem.isGrounded(
            this.session.board,
            piece
        );

        if (!isGrounded) { this.stopLockDelay(); }
        else if (
            canReset &&
            this.lockTimer !== null &&
            this.lockResetCount < MAX_LOCK_RESETS
        ) { this.stopLockDelay();
            this.lockResetCount++;
            this.startLockDelay();
        } else {
            this.startLockDelay();
        }
    }
} 
