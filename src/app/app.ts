
import { Component, OnInit, HostListener, ElementRef, viewChild, AfterViewInit } from '@angular/core';
import { GameController } from './core/game-controller';
import { InputSystem } from './input/input-system';
import { CanvasRenderer } from './rendering/canvas-renderer';


@Component({
    imports: [],
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
})
export class App implements OnInit, AfterViewInit {

    private inputSystem!: InputSystem;
    private controller!: GameController;
    private renderer!: CanvasRenderer;
    private animationFrameId: number | null = null;
    
    private readonly gameCanvas= viewChild.required<ElementRef<HTMLCanvasElement>>('gameCanvas');
    /*
    viewChild.required(): busca el elemento identificado mediante #gameCanvas en la plantilla y establece que debe existir.
    ElementRef: proporciona acceso al elemento HTML real.
    HTMLCanvasElement: especifica que ese elemento es un Canvas.
    private readonly: restringe el acceso a la propiedad y evita reasignarla.
    */

    ngOnInit(): void {
        this.controller = new GameController();
        this.controller.startGame();
        this.inputSystem = new InputSystem(this.controller);

        const session = this.controller.getSession();

        console.log('Game state: ', session.state);
        console.log('Active pieces: ', session.activePieces);
    }

    ngAfterViewInit(): void {
        const canvas = this.gameCanvas().nativeElement; // Obtiene la referencia que proporciona Angular. // .nativeElement accede al elemento <canvas> real.
        const context = canvas.getContext('2d'); // Solicita el contexto gráfico bidimensional.

        if (!context) { throw new Error('Unable to initialize Canvas 2D context!.'); }

        this.renderer = new CanvasRenderer(context); // Creamos el objeto encargado de dibujar y le entregamos el contexto gráfico.
        this.renderer.drawBackGround();
        this.renderer.drawGrid();

        const session = this.controller.getSession();
        const piece = session.activePieces[0];

        if (piece) { this.renderer.drawPiece(piece); }

    }

    @HostListener('window:keyup', ['$event'])
    public onKeyUp(event: KeyboardEvent): void{
        this.inputSystem.handleKeyUp(event);
    }

    @HostListener('window:keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {
        this.inputSystem.handleKeyDown(event);
    }

    @HostListener('window:blur')
    public onWindowBlur(): void { 
        this.inputSystem.reset();
        this.controller.pauseGame();
    }

    private renderLoop(): void {
        this.renderer.render(this.controller.getSession());

        this.animationFrameId = requestAnimationFrame(() => {
            this.renderLoop();
        });
    }

}
