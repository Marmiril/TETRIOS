
/**
 * RotationSystem
 *
 * Handles the rotation of tetromino shapes.
 * Calculates rotated matrices without modifying the original shape.
 * Will later validate rotations against board collisions and boundaries.
 */

export class RotationSystem {
    // Rotates a shape 90 degrees clokwise
    public rotateClockwise(shape: number[][]): number [][]{
        const rows = shape.length;
        const cols = shape[0].length;

        return Array.from(
            { length: cols },
            (_, row) => Array.from(
                { length: rows },
                (_, col) => shape[row - 1 - col][row]
            )
        );
    }
}