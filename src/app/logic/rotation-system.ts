
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
import { JLSTZ_WALL_KICKS, I_WALL_KICKS, KickOffset } from '../config/wall-kicks';

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

    // Attempst ot rotate a piece using the wallkickoffsets
    // Applies the rotation only if the new position is valid or restores the original shape
    public tryRotate(
        board: Board,
        piece: Piece,
        collisionSystem: CollisionSystem, 
        clockwise: boolean
    ): boolean {

        // Skips rotatios for square trominoes,
        if (piece.type === TetrominoType.O) { return true; }

        const originalShape = piece.shape;

        const fromRotation = piece.rotation;
        const toRotation = (fromRotation + (clockwise ? 90 : 270)) % 360;

        const rotatedShape = clockwise
            ? this.rotateClockwise(piece.shape)
            : this.rotateCounterClockwise(piece.shape);
        
        piece.shape = rotatedShape;

        for (const [deltaX, deltaY] of this.getWallKickOffsets(piece, fromRotation, toRotation)) {
            const newX = piece.x + deltaX;
            const newY = piece.y + deltaY;
            
            if (collisionSystem.canPlacePiece(board, piece, newX, newY)) {

                piece.x = newX;
                piece.y = newY;

                piece.rotation = (
                    piece.rotation + (clockwise ? 90 : 270)
                ) % 360;
                return true;
            }        
        }

        if (!collisionSystem.canPlacePiece(board, piece, piece.x, piece.y)) {
            piece.shape = originalShape;
            return false;
        }

        piece.shape = originalShape;
        return false;
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

    // Returns the SRS wall kick offsets for a specific rotation.
    // Selects the appropriate table based on the tetromino type.

    private getWallKickOffsets(
        piece: Piece,
        fromRotation: number,
        toRotation: number
    ): KickOffset[] {
        const key = `${fromRotation}>${toRotation}`;

        const kickTable = piece.type === TetrominoType.I
            ? I_WALL_KICKS
            : JLSTZ_WALL_KICKS;
        
        return kickTable[key] ?? [];
    }

    
}