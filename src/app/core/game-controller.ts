/**
 * GameController
 *
 * Manages the game session and controls transitions between application states.
 * Handles starting, pausing, resuming, and ending games, as well as returning
 * to the main menu.
 * Ensures that state transitions only occur when permitted.
 */

import { BASE_FALL_INTERVAL, FALL_INTERVAL_DECREMENT, LINE_CLEAR_POINTS, LINE_CLEAR_DELAY, LOCK_DELAY, MAX_LEVEL, MAX_LOCK_RESETS } from '../config/constants';
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
    // Controls the delay before completed rows are removed.
    private lineClearTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private readonly onScoreChanged: (score: number) => void,
        private readonly onLevelChanged: (level: number) => void,
        private readonly onLinesChanged: (lines: number) => void,
        private readonly onPieceSpawned: (piece: number) => void,
        private readonly onStateChanged: (state: AppState) => void = () => {}
    ) {
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
        this.stopLineClearDelay();
        
        this.session = new GameSession();
        this.onLevelChanged(this.session.level);
        this.onScoreChanged(this.session.score);
        this.onLinesChanged(this.session.lines);

        this.pieceBag = new PieceBag();
        this.session.state = AppState.PLAYING;
        // Notify Angular that the game has started.
        this.onStateChanged(AppState.PLAYING);
        
        this.spawnPiece();
        this.startGravity();
        
    }

    public openRecords(): void {
        if (this.session.state !== AppState.MAIN_MENU) { return; }

        this.session.state = AppState.RECORDS;
        this.onStateChanged(AppState.RECORDS);
    }

    public pauseGame(): void {
        if (this.session.state != AppState.PLAYING) { return; }
        this.session.state = AppState.PAUSED;
        // Notify Angular that the game has been paused.
        this.onStateChanged(AppState.PAUSED);

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
        // Notify Angular that the game has resumed
        this.onStateChanged(AppState.PLAYING);

        this.startGravity();

        if (this.lockPaused) {
            this.lockPaused = false;
            this.startLockDelay();
        }
    }

    public endGame(result: AppState.GAME_OVER | AppState.VICTORY = AppState.GAME_OVER): void {
        if (this.session.state !== AppState.PLAYING &&
            this.session.state !== AppState.PAUSED
        ) { return; }
        this.session.state = result;
        this.onStateChanged(result);
        this.stopGravity();
        this.stopLockDelay();
    }

    public returnToMainMenu(): void {
        if (this.session.state !== AppState.GAME_OVER &&
            this.session.state !== AppState.VICTORY &&
            this.session.state !== AppState.RECORDS) { return; }
        this.session.state = AppState.MAIN_MENU;

        // Notify Angluar that the main menu is now active.
        this.onStateChanged(AppState.MAIN_MENU);
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
        
        // Identify completed rows before removing thme
        const fullRows = this.session.board.getFullRows();

        if (fullRows.length > 0) {
            this.session.clearingRows = fullRows;

            // Delay row removal until the animation finishes
            this.lineClearTimer = setTimeout(() => {
                this.lineClearTimer = null;
                this.finishLineClear();
            }, LINE_CLEAR_DELAY);
            return;
        }
        this.finishLineClear();
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

    public softDrop(): void {
        const moved = this.moveActivePiece(0, 1);
        if (!moved) { return; }
        this.session.score += 1;
        this.onScoreChanged(this.session.score);
    }

    public hardDrop(): void {
        if (this.session.state != AppState.PLAYING) { return; }

        const piece = this.session.activePieces[0];
        if (!piece) { return; }

        let droppedCells = 0;

        while(this.collisionSystem.movePiece(
            this.session.board,
            piece, 
            0,
            1
        )) { droppedCells++; }

        this.session.score += droppedCells * 2;
        this.onScoreChanged(this.session.score);

        this.lockActivePiece();

    }

    ///////// PRIVATE MODES //////////////////////////////////////////

        // Generates the next tetromino and adds it to the game session.
    private spawnPiece(): void {
        const piece = this.session.nextPiece ??
            this.pieceFactory.createPiece(this.pieceBag.nextType(), this.pieceFactory.colorPiece());

        if (!this.checkCanSpawn(piece)) { return; }

        this.lockResetCount = 0;
        this.session.activePieces.push(piece);
        this.session.piecesSpawned++;

        this.onPieceSpawned(this.session.piecesSpawned);

        this.session.nextPiece = this.pieceFactory.createPiece(this.pieceBag.nextType(), this.pieceFactory.colorPiece());
    }

    // Starts the automatic gravity timer.
    private startGravity(): void {
        if (this.gravityTimer !== null) { clearInterval(this.gravityTimer); }

        console.log(`Level: ${this.session.level} | Fall interval: ${this.session.fallInterval} ms`);

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

            // Preserve the expired state until the piece can be locked
            this.lockTimeRemaining = 0;
            this.lockDeadline = null;

           
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

        if (!isGrounded) {
            // Preserve the remaining lock time when the piece becomes airborne.
/*          if (this.lockTimer !== null && this.lockDeadline !== null) {
                this.lockTimeRemaining = Math.max(
                    0,
                    this.lockDeadline - Date.now()
                );

                clearTimeout(this.lockTimer);
                this.lockTimer = null;
                this.lockDeadline = null;
            }
*/            return;
        }

        if (
            canReset && 
            this.lockTimer !== null &&
            this.lockResetCount < MAX_LOCK_RESETS
        ) {
            // Reset the lock delay only while the reset limimt allows it.
            this.stopLockDelay();
            this.lockResetCount++;
        } 
        this.startLockDelay();
    }

    private updateLevel(): void {
        const newLevel = Math.floor(this.session.lines / 10) + 1;
        if (newLevel === this.session.level) { return; }
        
        this.session.level = newLevel;
        this.onLevelChanged(newLevel);

        this.updateFallInterval();
        this.startGravity();

    }

    private updateFallInterval(): void {
        this.session.fallInterval = BASE_FALL_INTERVAL - (this.session.level - 1) * FALL_INTERVAL_DECREMENT;
    }

    // Removes completed rows, updates statistics and spawns the next piece.
    private  finishLineClear(): void {
        const clearedRows = this.session.board.clearFullRows();

        this.session.clearingRows = [];

        this.session.lines += clearedRows;

        if (clearedRows > 0) { this.onLinesChanged(this.session.lines); }

        this.session.score += LINE_CLEAR_POINTS[clearedRows] * this.session.level;

        if (clearedRows > 0) {
            this.onScoreChanged(this.session.score); 

            if (this.session.lines >= MAX_LEVEL * 10) {
                this.endGame(AppState.VICTORY);
                return;
            }
            this.updateLevel();
        }
        this.spawnPiece();
    }
    
    // Cancels the lne clear timer and resets pending rows
    private stopLineClearDelay(): void {
        if (this.lineClearTimer !== null) {
            clearTimeout(this.lineClearTimer);
            this.lineClearTimer = null;
        }

        this.session.clearingRows = [];
    }
} 
