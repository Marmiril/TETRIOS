
import { Component, OnInit, HostListener, ElementRef, viewChild, AfterViewInit, signal } from '@angular/core';
import { GameController } from './core/game-controller';
import { InputSystem } from './input/input-system';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { AppState } from './config/enum';


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

    protected readonly score = signal(0);
    protected readonly level = signal(1);
    protected readonly lines = signal(0);
    /*
    viewChild.required(): busca el elemento identificado mediante #gameCanvas en la plantilla y establece que debe existir.
    ElementRef: proporciona acceso al elemento HTML real.
    HTMLCanvasElement: especifica que ese elemento es un Canvas.
    private readonly: restringe el acceso a la propiedad y evita reasignarla.
    */

    ngOnInit(): void {
        this.controller = new GameController(
            (score: number) => this.score.set(score), 
            (level: number) => this.level.set(level),
            (lines: number) => this.lines.set(lines)
        );
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
        this.renderLoop();    
    }

    ngOnDestroy(): void {
        if (this.animationFrameId !== null) { 
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
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

    //////////////////////////////////////////////////////////////////

    private renderLoop(): void {
        this.renderer.render(this.controller.getSession());
        this.animationFrameId = requestAnimationFrame(() => {
            this.renderLoop();
        });
    }


    protected get isPaused(): boolean {
        return this.controller.getSession().state === AppState.PAUSED;
    }

    protected get isMainMenu(): boolean {
        return this.controller.getSession().state === AppState.MAIN_MENU;
    }

    protected get isGameOver(): boolean{
        return this.controller.getSession().state === AppState.GAME_OVER;
    }

/*
    protected get score(): number {
        return this.controller.getSession().score;
    }
*/    
    protected returnToMainMenu(): void {
        this.controller.returnToMainMenu();
    }

    protected startGame(): void {
        this.controller.startGame();
    }

    protected resumeGame(): void {
        this.controller.resumeGame();
    }

    protected restartGame(): void {
        this.inputSystem.reset();
        this.controller.startGame();
    }

    protected endGame(): void {
        this.inputSystem.reset();
        this.controller.endGame();
    }

}
