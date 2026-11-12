/**
 * InputSystem
 *
 * Translates keyboard input into game controller actions.
 */

import { HORIZONTAL_ARR, HORIZONTAL_DAS, SOFT_DROP_DAS, SOFT_DROP_ARR } from '../config/constants';
import { GameController } from '../core/game-controller';

export class InputSystem {

    private pressedKeys = new Set<string>();

    private dasTimer: ReturnType<typeof setTimeout> | null = null;
    private arrTimer: ReturnType<typeof setInterval>  | null = null;

    private softDropDasTimer: ReturnType<typeof setTimeout> | null = null;
    private softDropArrTimer: ReturnType<typeof setInterval> | null = null;

    private activeHorizontalDirection: -1 | 1 | null = null;


    constructor(private controller: GameController) {}

    public handleKeyDown(event: KeyboardEvent): void {
        
        if (this.pressedKeys.has(event.code)) return;

        this.pressedKeys.add(event.code);

        switch(event.code) {
            case 'ArrowLeft':
                this.controller.moveActivePiece(-1, 0);
                this.startHorizontalRepeat(-1);
                break;
            case 'ArrowRight':
                this.controller.moveActivePiece(1, 0);
                this.startHorizontalRepeat(1);
                break;
            case 'ArrowDown': 
                this.controller.moveActivePiece(0, 1);
                this.startSoftDropRepeat();
                break;
        }
    }

    // Released a pressed key.
    public handleKeyUp(event: KeyboardEvent): void {
        this.pressedKeys.delete(event.code);

        if (event.code === 'ArrowDown') {
            this.stopSoftDropRepeat();
            return;
        }

        const releasedDirection = 
            event.code === 'ArrowLeft' ? -1 :
            event.code === 'ArrowRight' ? 1 : null;

        if (releasedDirection !== this.activeHorizontalDirection) { return; }

        this.stopHorizontalRepeat();

        // if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') { this.stopHorizontalRepeat(); }

        if (this.pressedKeys.has('ArrowRight')) {
            this.controller.moveActivePiece(1, 0);
            this.startHorizontalRepeat(1);
        }
        else if (this.pressedKeys.has('ArrowLeft')) {
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

    private startSoftDropRepeat(): void {
        this.stopSoftDropRepeat();

        this.softDropDasTimer = setTimeout(() => {
            this.softDropDasTimer = null;

            this.softDropArrTimer = setInterval(() => {
                this.controller.moveActivePiece(0, 1);
            }, SOFT_DROP_ARR);
        }, SOFT_DROP_DAS)
    }

    private stopSoftDropRepeat(): void {
      
        if (this.softDropDasTimer !== null) {
            clearTimeout(this.softDropDasTimer);
            this.softDropDasTimer = null;
        }

        if (this.softDropArrTimer !== null) {
            clearInterval(this.softDropArrTimer);
            this.softDropArrTimer = null;
        }
    }
}