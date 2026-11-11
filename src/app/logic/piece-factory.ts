/**
 * PieceFactory
 *
 * Creates tetromino pieces from their predefined shapes.
 * Places new pieces horizontally centered on the board.
 */

import { BOARD_COLUMNS, PIECE_COLORS } from "../config/constants";
import { Rotation, TetrominoType } from "../config/enum";
import { TETROMINO_SHAPES } from "../config/tetromino-shapes";
import { Piece } from "../models/piece";


export class PieceFactory {
    
    public createPiece(
        type: TetrominoType,
        color: string
    ): Piece {
        
        const shape = TETROMINO_SHAPES[type].map(row => [...row]);
        
        const x = Math.floor((BOARD_COLUMNS - shape[0].length) / 2);

        return new Piece(
            type, 
            shape,
            color,
            x,
            0,
            Rotation.DEG_0
        );
    }

    public colorPiece(): string {
        return PIECE_COLORS[Math.floor(Math.random() * PIECE_COLORS.length)];
    }
}