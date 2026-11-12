/**
 * InputSystem
 *
 * Translates keyboard input into game controller actions.
 */

import { GameController } from '../core/game-controller';

export class InputSystem {

    private pressedKeys = new Set<string>();

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
}