
import { Component, OnInit, HostListener, ElementRef, viewChild } from '@angular/core';
import { GameController } from './core/game-controller';
import { InputSystem } from './input/input-system';


@Component({
    imports: [],
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
})
export class App implements OnInit {

    private inputSystem!: InputSystem;
    private controller!: GameController;

    private readonly gameCanvas= viewChild.required<ElementRef<HTMLCanvasElement>>('gameCanvas');

    ngOnInit(): void {
        // const rotationSystem = new RotationSystem();
        this.controller = new GameController();
        this.controller.startGame();
        // rotationSystem.testRotation();
        this.inputSystem = new InputSystem(this.controller);


        const session = this.controller.getSession();

        console.log('Game state: ', session.state);
        console.log('Active pieces: ', session.activePieces);
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

}
