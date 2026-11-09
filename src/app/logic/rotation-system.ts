
/**
 * RotationSystem
 *
 * Handles the rotation of tetromino shapes.
 * Calculates rotated matrices without modifying the original shape.
 * Will later validate rotations against board collisions and boundaries.
 */

import { Board } from '../models/board';
import { Piece } from '../models/piece';
import { CollisionSystem } from './collision-system';
import { TetrominoType } from '../config/enum';

export class RotationSystem {
    // Rotates a shape 90 degrees clokwise
    public rotateClockwise(shape: number[][]): number [][]{
        const rows = shape.length;
        const cols = shape[0].length;

        return Array.from(
            { length: cols },
            (_, row) => Array.from(
                { length: rows },
                (_, col) => shape[row - 1 - col][row]
            )
        );
    }

    // Attempst ot rotate a piece in the specified direction
    // Applies the rotation only if the new position is valid.
    public tryRotate(
        board: Board,
        piece: Piece,
        collisionSystem: CollisionSystem, 
        clockwise: boolean
    ): boolean {

        // Skips rotatios for square trominoes,
        if (piece.type === TetrominoType.O) { return true; }

        const originalShape = piece.shape;

        const rotatedShape = clockwise
            ? this.rotateClockwise(piece.shape)
            : this.rotateCounterClockwise(piece.shape);
        
        piece.shape = rotatedShape;
        
        if (!collisionSystem.canPlacePiece(board, piece, piece.x, piece.y)) {
            piece.shape = originalShape;
            return false;
        }

        piece.rotation = (piece.rotation ? 90 : 270) % 360;
        return true;
    }

    // Rotates a shape 90 degrees copunterclockwise
    // Returns a new matiex without modifying the original
    public rotateCounterClockwise(shape: number[][]): number[][] {
        
        const rows = shape.length;
        const cols = shape[0].length;

        return Array.from(
            { length: cols },
            (_, row) => Array.from(
                { length: rows },
                (_, col) => shape[col][col - 1 - row]
            )
        );
    }

    // Returns candidate position offsets for a rotation
    // These offsets allow piece to rotate near obstacles

    private getWallKickOffsets(): number[][] {
        return[
            [0, 0],
            [-1, 0],
            [-2, 0],
            [1, 0],
            [2, 0]
        ];
    }

    
}