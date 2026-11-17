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
}