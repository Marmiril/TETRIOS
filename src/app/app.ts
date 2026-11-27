
import { Component, OnInit, HostListener, ElementRef, viewChild, AfterViewInit, signal } from '@angular/core';
import { GameController } from './core/game-controller';
import { InputSystem } from './input/input-system';
import { CanvasRenderer } from './rendering/canvas-renderer';
import { AppState } from './config/enum';
import { ScoreRepository } from './repository/score-repository';
import { ScoreRecord } from './models/score-records';


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
    private nextPieceRenderer!: CanvasRenderer;
    private animationFrameId: number | null = null;

    // Reference to the initial menu button for keyboard navigation.
    private readonly startGameButton = viewChild.required<ElementRef<HTMLButtonElement>>('startGameButton');
    
    private readonly gameCanvas = viewChild.required<ElementRef<HTMLCanvasElement>>('gameCanvas');
    private readonly nextPieceCanvas  = viewChild.required<ElementRef<HTMLCanvasElement>>('nextPieceCanvas');
    private readonly scoreRepository = new ScoreRepository();
    
    // Indicates whether the completed game qualifies for the ranking
    protected readonly hasHighScore = signal(false);
    protected readonly score = signal(0);
    protected readonly level = signal(1);
    protected readonly lines = signal(0);
    protected readonly pieces = signal(0);
    protected readonly gameState = signal<AppState>(AppState.MAIN_MENU)
    protected readonly playerInitials = signal('');
    protected readonly records = signal<ScoreRecord[]>([]);
    protected readonly activePieceColor = signal<string>('#00C8FF');
    /*
    viewChild.required(): busca el elemento identificado mediante #gameCanvas en la plantilla y establece que debe existir.
    ElementRef: proporciona acceso al elemento HTML real.
    HTMLCanvasElement: especifica que ese elemento es un Canvas.
    private readonly: restringe el acceso a la propiedad y evita reasignarla.
    */

    ngOnInit(): void {
        this.controller = new GameController(
            (score:  number)   => this.score    .set (score), 
            (level:  number)   => this.level    .set (level),
            (lines:  number)   => this.lines    .set (lines),            
            (pieces: number)   => {
                this.pieces.set(pieces);
                // Update the board lighting with the active piece color
                const activePiece = this.controller.getSession().activePieces[0];
                if (activePiece) { this.activePieceColor.set(activePiece.color)};
            },
            (state:  AppState) => this.handleStateChanged(state),
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
         
        // Set the initial keyboard focus on the main menu.
        this.startGameButton().nativeElement.focus();

        // Initialize an independent rendering context for the next-piece preview
        const nextCanvas = this.nextPieceCanvas().nativeElement;
        const nextContext = nextCanvas.getContext('2d');
        if (!nextContext) { throw new Error('Unable to initialize next-piece Canvas 2D context.')};

        this.nextPieceRenderer = new CanvasRenderer(nextContext);

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
        const session = this.controller.getSession();

        // Render th board and the upcoming piece using sepsarate camvas contexts.
        this.renderer.render(session);
        this.nextPieceRenderer.renderNextPiece(session.nextPiece);

        // Schedule a single rendering cycle for the next animation frame
        this.animationFrameId = requestAnimationFrame(() => {
            this.renderLoop();
        });
    }

    protected get isPaused(): boolean { return this.gameState() === AppState.PAUSED; }

    protected get isMainMenu(): boolean { return this.gameState() === AppState.MAIN_MENU; }

    protected get isGameOver(): boolean { return this.gameState() === AppState.GAME_OVER; }

    protected get isVictory(): boolean { return this.gameState() === AppState.VICTORY; }

    protected get isRecords(): boolean { return this.gameState() === AppState.RECORDS; }

    protected returnToMainMenu(): void { this.controller.returnToMainMenu(); }

    protected startGame(): void { this.controller.startGame(); }

    protected resumeGame(): void { this.controller.resumeGame(); }

    protected openRecords(): void {
        // Retrieve the latest ranking before openin the records screen
        this.records.set(this.scoreRepository.getRecords());
        this.controller.openRecords(); }

    protected restartGame(): void {
        this.inputSystem.reset();
        this.controller.startGame();
    }

    protected endGame(): void {
        this.inputSystem.reset();
        this.controller.endGame();
    }

    protected handleStateChanged(state: AppState): void {
        this.gameState.set(state);

        // Only completed games qualify for the ranking
        if (state === AppState.GAME_OVER || state === AppState.VICTORY) {
            const session = this.controller.getSession();
            // Clear the initials for each compelted 
            this.playerInitials.set('AAA');
            this.hasHighScore.set(this.scoreRepository.isHighScore(session.score));
        } else {
            this.hasHighScore.set(false);
        }

    }

    protected saveRecord(): void {
        if (!this.hasHighScore()) { return; }

        const initials = this.playerInitials();
        const session = this.controller.getSession();

        // Validate player initials
        if (!/^[A-Z]{3}$/.test(initials)) { return; }

        // Ensure that the game has finished
        if (
            session.state !== AppState.GAME_OVER &&
            session.state !== AppState.VICTORY            
        ) { 
            return;
        }

        const record: ScoreRecord = {
            initials: initials,
            score: session.score,
            level: session.level,
            lines: session.lines,
            pieces: session.piecesSpawned,
            result: session.state
        };

        if (this.scoreRepository.addRecord(record)) {
           // this.scoreRepository.savePlayerInitials(initials);
            this.returnToMainMenu();
        }
    }

    public changeInitial(index: number, direction: -1 | 1): void {
        const initials = this.playerInitials().split('');
        const currentLetter = initials[index].charCodeAt(0) - 65;
        const nextLetter = (currentLetter + direction + 26) % 26;
        initials[index] = String.fromCharCode(nextLetter + 65);
        this.playerInitials.set(initials.join(''));
    }

}
