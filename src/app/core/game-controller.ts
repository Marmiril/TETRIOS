/**
 * GameController
 *
 * Manages the game session and controls transitions between application states.
 * Handles starting, pausing, resuming, and ending games, as well as returning
 * to the main menu.
 * Ensures that state transitions only occur when permitted.
 */

import { LOCK_DELAY } from '../config/constants';
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

    constructor() {
        this.session = new GameSession();
        this.pieceBag = new PieceBag();
        this.pieceFactory = new PieceFactory();
        this.collisionSystem = new CollisionSystem();
        this.rotationSystem = new RotationSystem();
    }

    public getSession(): GameSession { return this.session; }

    public startGame(): void {
        this.session = new GameSession();
        this.pieceBag = new PieceBag();
        this.session.state = AppState.PLAYING;
        this.spawnPiece();
        this.startGravity();
    }

    public pauseGame(): void {
        if (this.session.state != AppState.PLAYING) return;
        this.session.state = AppState.PAUSED;
        this.stopGravity();
    }

    public resumeGame(): void {
        if (this.session.state !== AppState.PAUSED) return;
        this.session.state = AppState.PLAYING;
        this.startGravity();
    }

    public endGame(): void {
        if (this.session.state !== AppState.PLAYING) return;
        this.session.state = AppState.GAME_OVER;
        this.stopGravity();
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

            if (this.collisionSystem.isGrounded(this.session.board, piece)) { this.startLockDelay(); }
            else { this.stopLockDelay(); }

            return moved;
    }

    // Locks the active piece into the board
    public lockActivePiece(): void {
        const piece = this.session.activePieces[0];
        if (!piece) { return; }
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
        
        return this.rotationSystem.tryRotate(
            this.session.board,
            piece, 
            this.collisionSystem,
            clockwise
        );
    }

    ///////// PRIVATE MODES //////////////////////////////////////////

        // Generates the next tetromino and adds it to the game session.
    private spawnPiece(): void {
        const type = this.pieceBag.nextType();
        const color = this.pieceFactory.colorPiece();
        const piece = this.pieceFactory.createPiece(type, color);

        if (!this.checkCanSpawn(piece)) { return; }

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
        this.lockTimer = setTimeout(() => {
            this.lockTimer = null;
            if (this.session.state !== AppState.PLAYING) { return; }

            const piece = this.session.activePieces[0];
            if (!piece) { return; }
            if (this.collisionSystem.isGrounded(this.session.board, piece)) { this.lockActivePiece(); }
        }, LOCK_DELAY);
    }

    private stopLockDelay(): void {
        if (this.lockTimer === null) { return; }
        clearTimeout(this.lockTimer);
        this.lockTimer = null;
    }
} 