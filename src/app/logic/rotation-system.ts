
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

    // Attempst ot rotate a piece clockwise
    // Applies the rotation only if the new position is valid.
    public tryRotate(
        board: Board,
        piece: Piece,
        collisionSystem: CollisionSystem
    ): boolean {
        
        const rotatedShape = this.rotateClockwise(piece.shape);
        const originalShape = piece.shape;
        
        piece.shape = rotatedShape;
        
        if (!collisionSystem.canPlacePiece(board, piece, piece.x, piece.y)) {
            piece.shape = originalShape;
            return false;
        }

        piece.rotation = (piece.rotation + 90) % 360;
        return true;
    }



    
}