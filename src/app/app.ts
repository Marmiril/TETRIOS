
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RotationSystem } from './logic/rotation-system';

@Component({
    imports: [RouterOutlet],
    selector: 'app-root',
    styleUrl: './app.css',
    templateUrl: './app.html',
})
export class App implements OnInit {

    ngOnInit(): void {
        const rotationSystem = new RotationSystem();
        rotationSystem.testRotation();
    }

}
