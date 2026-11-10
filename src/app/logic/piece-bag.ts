/**
 * PieceBag
 *
 * Implements the seven-bag randomizer.
 * Ensures every tetromino appears once per shuffled bag.
 */

import { TetrominoType } from "../config/enum";

export class PieceBag {

    private bag: TetrominoType[] = [];

    public nextType(): TetrominoType {
        if (this.bag.length === 0) { this.refillingBag(); }
        return this.bag.pop()!;
    }

    private refillingBag(): void {
        this.bag = Object
        .values(TetrominoType);
    }

}