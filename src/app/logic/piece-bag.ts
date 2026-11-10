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

        this.bag = Object.values(TetrominoType);

        // Fisher-Yates shuffle
        for (let i = 0; i < this.bag.length; i++) {
            const j = Math.floor(Math.random() * (i + 1));
            
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }

        // Refills the bag with random tetrominoes, allowing duplicates.
    private refillingBagRepeat(): void {
        const types = Object.values(TetrominoType);
        this.bag = Array.from(
            { length: types.length },
            () => types[Math.floor(Math.random() * types.length)]
        );
    }


}