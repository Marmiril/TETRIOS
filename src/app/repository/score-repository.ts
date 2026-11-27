import { ScoreRecord } from '../models/score-records';
import { AppState } from '../config/enum';

export class ScoreRepository {

    private readonly storageKey = 'tetrios-record';
    private readonly maxRecords = 15;
    private readonly initialsKey = 'tetrios-player-initials';

    // Retrieves stored recores or initializes the default ranking
    public getRecords(): ScoreRecord[] {
        const storedRecords = localStorage.getItem(this.storageKey);

        if (storedRecords !== null) {
            try {
                const records: unknown = JSON.parse(storedRecords);

                if (Array.isArray(records) && 
                    records.length === this.maxRecords &&
                    records.every(record => this.isValidRecord(record))
                ) {
                    return records.sort((a, b) => b.score - a.score);
                }
            } catch (error) {
                console.warn('Invalid stored ranking.', error);
            }
        }
        // Restore the default ranking if sorted data is missing or invalid
        const defaultRecords = this.createDefaultRecords();
        this.saveRecords(defaultRecords);

        return defaultRecords;    
    }

    // Generates the initial ranking in descending score order.
    private createDefaultRecords(): ScoreRecord[] {
        return Array.from(
            { length: this.maxRecords },
            (_, index): ScoreRecord => ({
                initials: 'CPU',
                score: (this.maxRecords - index) * 10,
                level: 1,
                lines: 0,
                pieces: 0, 
                result: AppState.GAME_OVER
            })
        );
    }

    // Serializes and persists the ranking.
    private saveRecords(records: ScoreRecord[]): void {
        localStorage.setItem(
            this.storageKey,
            JSON.stringify(records)
        );
    }

    // Checks whether a score exceeds the lowest ranked score.
    public isHighScore(score: number): boolean {
        const records = this.getRecords();
        const lowestRecord = records.at(-1);
        if (!lowestRecord) { return false}
        return score > lowestRecord.score;
    }

    // Adds a qualifying record and preserves the top scores.

    public addRecord(record: ScoreRecord): boolean {
        if (!this.isHighScore(record.score)) { return false; }

        const records = this.getRecords();
        records.push(record);

        // Sort recores by score in descending order.
        records.sort((a, b) => b.score - a.score);

        // Keep only the highest-ranked records
        this.saveRecords(records.slice(0, this.maxRecords));

        return true;
    }

    // Validates the structure of an individual stored record.
    private isValidRecord(record: unknown): record is ScoreRecord {
        if (typeof record !== 'object' || record == null) { return false; }

        const candidate = record as Partial<ScoreRecord>;

        return (
            typeof candidate.initials === 'string' &&
            candidate.initials.length === 3 &&
            typeof candidate.score === 'number' &&
            typeof candidate.level === 'number' &&
            typeof candidate.lines === 'number' &&
            typeof candidate.pieces === 'number' &&
            (
                candidate.result === AppState.GAME_OVER ||
                candidate.result === AppState.VICTORY
            )
        );        
    }
/*
    // Retrieves the last registered player initials.
    public getPlayerInitials(): string {
        return localStorage.getItem(this.initialsKey) ?? '';
    }

    // Persists the last registered player initials.
    public savePlayerInitials(initials: string): void {
        localStorage.setItem(this.initialsKey, initials);
    }
*/
}

