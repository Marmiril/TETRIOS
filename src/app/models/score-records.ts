import { AppState } from '../config/enum';

// Represents a completed game stored in the Wall of Fame. 
 
export interface ScoreRecord {
    initials: string;
    score: number;
    level: number;
    lines: number;
    pieces: number;
    result: AppState.GAME_OVER | AppState.VICTORY;
}