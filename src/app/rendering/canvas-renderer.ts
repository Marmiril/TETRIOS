import { BOARD_COLUMNS, BOARD_ROWS, CELL_SIZE,LINE_CLEAR_DELAY } from "../config/constants";
import { Board } from "../models/board";
import { GameSession } from "../models/game-session";
import { Piece } from "../models/piece";

export class CanvasRenderer { 
    
    constructor (private readonly context: CanvasRenderingContext2D) {}

    public drawBackGround(): void {
        this.context.fillStyle = '#000000';
        this.context.fillRect(
            0,
            0,
            this.context.canvas.width,
            this.context.canvas.height
        );
    }

    public drawGrid(): void {
        this.context.strokeStyle = '#333333';
        for (let row = 0; row < BOARD_ROWS; row++) {
            for (let col = 0; col < BOARD_COLUMNS; col++) {
                this.context.strokeRect(
                    col * CELL_SIZE,
                    row * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }

    public drawBoard(board: Board): void {
        const grid = board.getGrid();
        for (let row = 0; row < grid.length; row++) {
            for (let col = 0; col < grid[row].length; col++) {
                const color = grid[row][col];

                if (color === null) { continue; }

                this.context.fillStyle = color;

                this.context.fillRect(
                    col * CELL_SIZE,
                    row * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }

    public drawPiece(piece: Piece): void{
        this.context.fillStyle = piece.color;
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col] === 0) { continue; }

                this.context.fillRect(
                    (piece.x + col) * CELL_SIZE,
                    (piece.y + row) * CELL_SIZE,
                    CELL_SIZE,
                    CELL_SIZE
                );
            }
        }
    }

    public render(session: GameSession): void {
        this.drawBackGround();
        this.drawGrid();
        this.drawBoard(session.board);

        for (const piece of session.activePieces) { this.drawPiece(piece); }

        this.drawClearingRows(session);
    }

    public renderNextPiece(piece: Piece | null): void {
        const { canvas } = this.context;

        this.context.clearRect(0, 0, canvas.width, canvas.height);
        
        if (!piece) { return; }
        
        const cellSize = 24;
        const shape = piece.shape;

        const offsetX = (canvas.width - shape[0].length * cellSize) / 2;
        const offsetY = (canvas.height - shape.length * cellSize) / 2;

        this.context.fillStyle = piece.color;

        // Render occupied cells using preview coordinates instead of board coordintes.
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] === 0) { continue; }
                
                this.context.fillRect(
                    offsetX + col * cellSize,
                    offsetY + row * cellSize,
                    cellSize,
                    cellSize
                )
            }
        }
    }

    // Renders the line clear animation based on its progress.
    public drawClearingRows(session: GameSession): void {
        if (session.lineClearDeadline === null) { return; }
        
        const remaining = session.lineClearDeadline - Date.now();

        const progress = Math.min(1, Math.max(0, 
            1 - remaining / LINE_CLEAR_DELAY
        ));

        this.context.fillStyle = '#FFFFFF';

        for (const row of session.clearingRows) {
            this.context.fillRect(
                0,
                row * CELL_SIZE,
                BOARD_COLUMNS * CELL_SIZE,
                CELL_SIZE
            );
        }
    }


}