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

    // Checks whether ta piece can move by the specified offset.
    public canMove(
        board: Board,
        piece: Piece,
        deltaX: number,
        deltaY: number
    ): boolean {
        return this.canPlacePiece(
            board,
            piece,
            piece.x + deltaX,
            piece.y + deltaY
        );
    }

    // Moves a piece if the requested position is valid.
    // Returns true if the movement was successful.
    public movePice(
        board: Board,
        piece: Piece,
        deltaX: number,
        deltaY: number
    ): boolean {

        if(!this.canMove(board, piece, deltaX, deltaY)) { return false; }
        
        piece.x += deltaX;
        piece.y += deltaY;        
        return true;
    }
}