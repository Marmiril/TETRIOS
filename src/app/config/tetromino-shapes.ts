/**
 * TetrominoShapes
 *
 * Defines the initial shapes of all seven tetrominoes.
 * Uses fixed-size matrices to preserve SRS rotation centers.
 * Each occupied cell is represented by 1 and each empty cell by 0.
 */
import { TetrominoType } from './enum';

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
    [TetrominoType.I]: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [TetrominoType.O]: [
        [1, 1],
        [1, 1]
    ],
    [TetrominoType.T]: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [TetrominoType.S]: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [TetrominoType.Z]: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ],
    [TetrominoType.J]: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [TetrominoType.L]: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ]
};