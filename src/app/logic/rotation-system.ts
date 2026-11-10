
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
import { TetrominoType, Rotation } from '../config/enum';
import { TETROMINO_SHAPES } from '../config/tetromino-shapes';
import { JLSTZ_WALL_KICKS, I_WALL_KICKS, KickOffset } from '../config/wall-kicks';

export class RotationSystem {
    // Rotates a shape 90 degrees clokwise
    public rotateClockwise(shape: number[][]): number[][] {
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
                piece.rotation = toRotation as Rotation;
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
        const shape = TETROMINO_SHAPES[TetrominoType.T];
        console.table(shape);

        console.log("Clockwise:");
        console.table(this.rotateClockwise(shape));

        console.log("Counterclockwise:");
        console.table(this.rotateCounterClockwise(shape));

        const piece = new Piece(
            TetrominoType.T,
            TETROMINO_SHAPES[TetrominoType.T],
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

        // Test the kick against a fixed block
        const wallPiece = new Piece(
            TetrominoType.T,
            TETROMINO_SHAPES[TetrominoType.T],
            "red",
            4,
            5,
            Rotation.DEG_0
        );

        board.setCell(7, 5, 'red');

        const wallKickSuccess = this.tryRotate(
            board,
            wallPiece,
            collisionSystem,
            true
        );

        console.log("Wallkick successful:", wallKickSuccess);
        console.log('Final position: ', wallPiece.x, wallPiece.y);
        console.log('Final rotation:', wallPiece.rotation);

        // Tests four consecutive clockwise rotations.
        for (let i = 0; i < 4; i++) {
            const success = this.tryRotate(
                board,
                piece,
                collisionSystem,
                false
            );

            console.log(
                `Rotation ${i + 1}:`,
                success,
                piece.rotation
            );
        }

        const blockedBoard = new Board();
        const blockedPiece = new Piece(
            TetrominoType.T,
            TETROMINO_SHAPES[TetrominoType.T],
            'purple',
            4,
            5, 
            Rotation.DEG_0
        );

        // Fill the board except for the piece's occupied cells.
        for (let row = 0; row < blockedBoard.getGrid().length; row++) {
            for (let col = 0; col < blockedBoard.getGrid()[row].length; col++) {
                const localRow = row - blockedPiece.y;
                const localCol = col - blockedPiece.x;

                const occupiedByPiece = blockedPiece.shape[localRow]?.[localCol] === 1;

                if(!occupiedByPiece) { blockedBoard.setCell(row, col, 'red'); }
            }
        }

        const originalShape = JSON.stringify(blockedPiece.shape);

        const blockedSuccess = this.tryRotate(
            blockedBoard,
            blockedPiece,
            collisionSystem,
            true
        );

        console.log('Blocked rotation:', blockedSuccess);
        console.log('Position:', blockedPiece.y);
        console.log('Rotation:', blockedPiece.x);
        console.log(
            'Shape unchanged:',
            JSON.stringify(blockedPiece.shape) === originalShape
        );

        // Tests the I tetromino wall kick
        const iBoard = new Board();
        const iPiece = new Piece(
            TetrominoType.I,
            TETROMINO_SHAPES[TetrominoType.I],
            'cyan',
            4,
            5,
            Rotation.DEG_0
        );

        // Blocks the initial clockwise rotation
        iBoard.setCell(5, 6, 'red');

        const iSuccess = this.tryRotate(
            iBoard,
            iPiece,
            collisionSystem,
            true
        );

        console.log('I wall kick successful:', iSuccess);
        console.log('I final position:', iPiece.x, iPiece.y);
        console.log('I final rotation:', iPiece.rotation);
        console.log(iPiece.shape);

        const oPiece = new Piece(
            TetrominoType.O,
            TETROMINO_SHAPES[TetrominoType.O],
            'yellow',
            4,
            5,
            Rotation.DEG_0
        );

        const oOriginalShape =JSON.stringify(oPiece.shape);

        const oSuccess = this.tryRotate(
            board,
            oPiece,
            collisionSystem,
            true
        );

        console.log('O rotation successfully:', oSuccess);
        console.log('O positon:', oPiece.x, oPiece.y);
        console.log('O rotation:', oPiece.rotation);
        console.log(
            'O shape unchanged:',
            JSON.stringify(oPiece.shape) === oOriginalShape
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