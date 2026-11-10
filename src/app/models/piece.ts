import { TetrominoType, Rotation } from '../config/enum';
import { DEFAULT_SPEED_MULTIPLIER } from '../config/constants';

export class Piece {
    public type: TetrominoType;
    public shape: number[][];
    public color: string;
    public x: number;
    public y: number;
    public rotation: Rotation;
    public speedMultiplier: number;

    constructor(
        type: TetrominoType,
        shape: number[][],
        color: string,
        x: number,
        y: number,
        rotation: Rotation.DEG_0,
        speedMultiplier: number = DEFAULT_SPEED_MULTIPLIER
    ) {
        this.type = type;
        this.shape = shape;
        this.color = color;
        this.x = x;
        this.y = y;
        this.rotation = rotation;
        this.speedMultiplier = speedMultiplier;
    }
}