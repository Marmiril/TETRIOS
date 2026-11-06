/**
 * Board
 *
 * Represents the logical structure of the TETRIOS game board.
 * Manages the grid containing fixed blocks and empty cells.
 * Provides methods to access the grid and validate positions
 * within the board boundaries.
 */

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

    // Checks whether a position is within the board boundaries.
    public isInside(row: number, col: number): boolean {
        return (
            row >= 0 &&
            row < BOARD_ROWS &&
            col >= 0 &&
            col < BOARD_COLUMNS
        );
    }

    // Cheks wether the cell is empty
    public isEmpty(row: number, col: number): boolean {
        if (!this.isInside(row, col)) { return false; }
        return this.grid[row][col] === null;
    }

}