/**
 * GameController
 *
 * Manages the game session and controls transitions between application states.
 * Handles starting, pausing, resuming, and ending games, as well as returning
 * to the main menu.
 * Ensures that state transitions only occur when permitted.
 */

import { AppState } from '../config/enum';
import { CollisionSystem } from '../logic/collision-system';
import { PieceBag } from '../logic/piece-bag';
import { PieceFactory } from '../logic/piece-factory';
import { GameSession } from '../models/game-session';

export class GameController {

    private session: GameSession;
    private pieceBag: PieceBag;
    private pieceFactory: PieceFactory;
    private collisionSystem: CollisionSystem;

    constructor() {
        this.session = new GameSession();
        this.pieceBag = new PieceBag();
        this.pieceFactory = new PieceFactory();
        this.collisionSystem = new CollisionSystem();
    }

    public getSession(): GameSession { return this.session; }

    public startGame(): void {
        this.session = new GameSession();
        this.pieceBag = new PieceBag();
        this.session.state = AppState.PLAYING;
        this.spawnPiece();
    }

    public pauseGame(): void {
        if (this.session.state != AppState.PLAYING) return;
        this.session.state = AppState.PAUSED;
    }

    public resumeGame(): void {
        if (this.session.state !== AppState.PAUSED) return;
        this.session.state = AppState.PLAYING;
    }

    public endGame(): void {
        if (this.session.state !== AppState.PLAYING) return;
        this.session.state = AppState.GAME_OVER;
    }

    // Generates the next tetromino and adds it to the game session.
    private spawnPiece(): void {
        const type = this.pieceBag.nextType();
        const color = this.pieceFactory.colorPiece();
        const piece = this.pieceFactory.createPiece(type, color);

        if (!this.collisionSystem.canPlacePiece(
            this.session.board,
            piece, 
            piece.x,
            piece.y
        )) {
            this.endGame();
            return;
        }

        this.session.activePieces.push(piece);
    }
}