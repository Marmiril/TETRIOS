/**
 * CollisionSystem
 *
 * Handles collision detection between game pieces and the board.
 * Validates piece positions against board boundaries and occupied cells.
 * Prevents pieces from overlapping fixed blocks or moving outside
 * the playable area.
 */

import { Board } from '../models/board';
import { Piece } from '../models/piece';

export class CollisionSystem {
    
    public canPlacePiece (
        board: Board,
        piece: Piece,
        x: number,
        y: number
    ): boolean {
        
        for (let row = 0; row < piece.shape.length; row++) {
            for(let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col] === 0) continue;
                const boardRow = y + row;
                const boardCol = x + col;

                if (!board.isEmpty(boardRow, boardCol)) { return false; }
            }
        }
        return true;
    }    
}