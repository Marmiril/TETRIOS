/**
 * InputSystem
 *
 * Translates keyboard input into game controller actions.
 */

import { HORIZONTAL_ARR, HORIZONTAL_DAS } from '../config/constants';
import { GameController } from '../core/game-controller';

export class InputSystem {

    private pressedKeys = new Set<string>();
    private dasTimer: ReturnType<typeof setTimeout> | null = null;
    private arrTimer: ReturnType<typeof setInterval>  | null = null;

    constructor(private controller: GameController) {}

    public handleKeyDown(event: KeyboardEvent): void {

        
        if (this.pressedKeys.has(event.code)) return;

        this.pressedKeys.add(event.code);

        switch(event.code) {
            case 'Arrowleft':
                this.controller.moveActivePiece(-1, 0);
                break;
            case 'Arrowright':
                this.controller.moveActivePiece(1, 0);
                break;
        }
    }

    // Released a pressed key.
    public handleKeyUp(event: KeyboardEvent): void {
        this.pressedKeys.delete(event.code);
    }

    private startHorizontalRepeat(deltaX: number): void {
        this.dasTimer = setTimeout(() => {
            this.arrTimer = setInterval(() => {
                this.controller.moveActivePiece(deltaX, 0);
            }, HORIZONTAL_ARR);
        }, HORIZONTAL_DAS);
    }
}