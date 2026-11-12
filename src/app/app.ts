
import { Component, OnInit } from '@angular/core';

import { RotationSystem } from './logic/rotation-system';
import { GameController } from './core/game-controller';
import { InputSystem } from './input/input-system';
import { HostListener } from '@angular/core';

@Component({
    imports: [],
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
})
export class App implements OnInit {

    private inputSystem!: InputSystem;

    ngOnInit(): void {
        // const rotationSystem = new RotationSystem();
        const controller = new GameController();
        controller.startGame();
        // rotationSystem.testRotation();
        this.inputSystem = new InputSystem(controller);


        const session = controller.getSession();

        console.log('Game state: ', session.state);
        console.log('Active pieces: ', session.activePieces);
    }

    @HostListener('window:keyup', ['event'])
    public onKeyUp(event: KeyboardEvent): void{
        this.inputSystem.handleKeyUp(event);
    }

    @HostListener('window:keydown', ['$event'])
    public onKeyDown(event: KeyboardEvent): void {
        this.inputSystem.handleKeyDown(event);
    }

}
