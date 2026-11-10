
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
                (_, col) => shape[rows - 1 - col][row]
            )
        );
    }

        /**
     * Attempts to rotate a piece using the SRS wall kick system.
     * Applies the first valid rotation and position adjustment.
     * Restores the original shape if all attempts fail.
     */
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

        const offsets = this.getWallKickOffsets(
            piece, 
            fromRotation,
            toRotation
        );
        
        piece.shape = rotatedShape;

        for (const [deltaX, deltaY] of offsets) {
            const newX = piece.x + deltaX;
            const newY = piece.y + deltaY;
            
            if (collisionSystem.canPlacePiece(board, piece, newX, newY)) {

                piece.x = newX;
                piece.y = newY;

                return true;
            }        
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
                (_, col) => shape[col][cols - 1 - row]
            )
        );
    }

    // Tests clockwise and counterclockwise rotations.
    public testRotation(): void {
        const shape = [
            [0, 1, 0],
            [1, 1, 1], 
            [0, 0, 0]
        ];

        console.log("Clockwise:");
        console.table(this.rotateClockwise(shape));

        console.log("Counterclockwise:");
        console.table(this.rotateCounterClockwise(shape));

        const piece = new Piece(
            TetrominoType.T,
            [
                [0, 1, 0],
                [1, 1, 1,],
                [0, 0, 0,]
            ],
            "purple",
            4,
            5,
            0
        );
    console.log('Before rotation:', piece.x, piece.y, piece.rotation);
    console.table(piece.shape);

    const board = new Board();
    const collisionSystem = new CollisionSystem();
    const success = this.tryRotate(board, piece, collisionSystem, true);

    console.log('Rotation successful:', success);
    console.log('After rotation:', piece.x, piece.y, piece.rotation);
    console.table(piece.shape);
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