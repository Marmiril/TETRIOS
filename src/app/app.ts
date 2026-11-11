
import { Component, OnInit } from '@angular/core';

import { RotationSystem } from './logic/rotation-system';
import { GameController } from './core/game-controller';

@Component({
    imports: [],
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
})
export class App implements OnInit {

    ngOnInit(): void {
        // const rotationSystem = new RotationSystem();
        const controller = new GameController();
        controller.startGame();
       // rotationSystem.testRotation();
       
       const session = controller.getSession();

       console.log('Game state: ', session.state);
       console.log('Active pieces: ', session.activePieces);
    }

}
