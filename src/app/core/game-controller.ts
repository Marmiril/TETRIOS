/**
 * GameController
 *
 * Manages the game session and controls transitions between application states.
 * Handles starting, pausing, resuming, and ending games, as well as returning
 * to the main menu.
 * Ensures that state transitions only occur when permitted.
 */

import { AppState } from '../config/enum';
import { GameSession } from '../models/game-session';

export class GameController {

    private session: GameSession;

    constructor() { this.session = new GameSession(); }

    public getSession(): GameSession { return this.session; }

    public startGame(): void {
        this.session = new GameSession();
        this.session.state = AppState.PLAYING;
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
}