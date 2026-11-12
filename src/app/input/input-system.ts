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

    private activeHorizontalDirection: -1 | 1 | null = null;

    constructor(private controller: GameController) {}

    public handleKeyDown(event: KeyboardEvent): void {
        
        if (this.pressedKeys.has(event.code)) return;

        this.pressedKeys.add(event.code);

        switch(event.code) {
            case 'arrowLeft':
                this.controller.moveActivePiece(-1, 0);
                this.startHorizontalRepeat(-1);
                break;
            case 'ArrowRight':
                this.controller.moveActivePiece(1, 0);
                this.startHorizontalRepeat(1);
                break;
        }
    }

    // Released a pressed key.
    public handleKeyUp(event: KeyboardEvent): void {
        this.pressedKeys.delete(event.code);

        const releasedDirection = 
            event.code === 'arrowLeft' ? -1 :
            event.code === 'ArrowRight' ? 1 : null;

        if (releasedDirection !== this.activeHorizontalDirection) { return; }

        this.stopHorizontalRepeat();

        // if (event.code === 'arrowLeft' || event.code === 'ArrowRight') { this.stopHorizontalRepeat(); }

        if (this.pressedKeys.has('ArrowRight')) {
            this.controller.moveActivePiece(1, 0);
            this.startHorizontalRepeat(1);
        }
        else if (this.pressedKeys.has('arrowLeft')) {
            this.controller.moveActivePiece(-1, 0)    ;
            this.startHorizontalRepeat(-1);
        }        
    }

    private startHorizontalRepeat(deltaX: -1 | 1): void {
        this.stopHorizontalRepeat();
        this.activeHorizontalDirection = deltaX;

        this.dasTimer = setTimeout(() => {
            this.dasTimer = null;
            this.arrTimer = setInterval(() => {
                this.controller.moveActivePiece(deltaX, 0);
            }, HORIZONTAL_ARR);
        }, HORIZONTAL_DAS);        
    }

    private stopHorizontalRepeat(): void{
       
        if (this.dasTimer !== null) {
            clearTimeout(this.dasTimer);
            this.dasTimer = null;
        }
        if (this.arrTimer !== null) {
            clearInterval(this.arrTimer);
            this.arrTimer = null;
        }

        this.activeHorizontalDirection = null;
    }
}