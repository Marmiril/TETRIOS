import { BOARD_COLUMNS, BOARD_ROWS, CELL_SIZE } from "../config/constants";

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
}