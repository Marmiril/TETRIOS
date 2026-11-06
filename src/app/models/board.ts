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
        this.grid = this.createGrid();
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

    // Places a block in a specified board cell
    public setCell(row: number, col: number, color: string): boolean {
        if (!this.isEmpty(row, col)) { return false; }
        this.grid[row][col] = color;
        return true;
    }

    // Returns the content of a specified board cell
    public getCell(row: number, col: number): string | null {
        if (!this.isInside(row, col)) { return; }
        return this.grid[row][col];
    }

    // Resets the board by clearing all cells
    public reset(): void {
        this.grid = this.createGrid();
    }

    // Creates an empty board grid
    private createGrid(): (string | null)[][] {
        return Array.from(
            {length: BOARD_ROWS },
            () => Array(BOARD_COLUMNS).fill(null)
        );
    }

    // Checks whether all cells in a row are occupied
    public isRowFull(row: number): boolean{
        if (row < 0 || row >= BOARD_ROWS) { return false; }
        return this.grid[row].every(cell => cell !== null);
    }

}