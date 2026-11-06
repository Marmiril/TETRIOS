import { AppState, GameMode, GameDifficulty } from '../config/enum';
import { DEFAULT_DIFFICULTY, BASE_FALL_INTERVAL } from '../config/constants';
import { Board } from './board';
import { Piece } from './piece';

export class GameSession {

    public state: AppState;
    public mode: GameMode;
    public difficulty: GameDifficulty;

    public board: Board;
    public activePieces: Piece[];

    public score: number;
    public lines: number;
    public level: number;
    public fallInterval: number;

    constructor() {
        this.state = AppState.MAIN_MENU;
        this.mode = GameMode.CLASSIC;
        this.difficulty = DEFAULT_DIFFICULTY;

        this.board = new Board();
        this.activePieces = [];

        this.score = 0;
        this.lines = 0;
        this.level = 1;
        this.fallInterval = BASE_FALL_INTERVAL;
    }
}
