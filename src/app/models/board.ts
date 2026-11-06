import { BOARD_COLUMNS, BOARD_ROWS } from '../config/constants';

export class Board {

    private grid: (string | null)[][]

    constructor() {
        this.grid = Array.from(
            { length: BOARD_ROWS },
            () => Array(BOARD_COLUMNS).fill(null)
        );
    }

    public getGrid(): (string | null)[][] {
        return this.grid
    }
}