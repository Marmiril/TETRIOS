
/**
 * WallKicks
 *
 * Defines the standard SRS wall kick tables for tetromino rotations.
 * JLSTZ pieces share one table, while the I piece has its own.
 * Each rotation transition contains five position offsets.
 * Coordinates use Canvas conventions: positive Y points downward.
 */

export type KickOffset = [number, number];

// J, L, S, T, Z tetrominoes
export const JLSTZ_WALL_KICKS: Record<string, KickOffset[]> = {

    '0>90': [
        [0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]
    ],

    '90>0': [
        [0, 0], [1, 0], [1, 1], [0, -2], [1, -2]
    ],

    '90>180': [
        [0, 0], [1, 0], [1, 1], [0, -2], [1, -2]
    ],

    '180>90': [
        [0, 0], [-1, 0], [-1, -1], [0, 2], [-1, 2]
    ],

    '180>270': [
        [0, 0], [1, 0], [1, -1], [0, 2], [1, 2]
    ],

    '270>180': [
        [0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]
    ],

    '270>0': [
        [0, 0], [-1, 0], [-1, 1], [0, -2], [-1, -2]
    ],

    '0>270': [
        [0, 0], [1, 0], [1, -1], [0, 2], [1, 2]
    ]
};

// I tetromino
export const I_WALL_KICKS: Record<string, KickOffset[]> = {

    '0>90': [
        [0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]
    ],

    '90>0': [
        [0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]
    ],

    '90>180': [
        [0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]
    ],

    '180>90': [
        [0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]
    ],

    '180>270': [
        [0, 0], [2, 0], [-1, 0], [2, -1], [-1, 2]
    ],

    '270>180': [
        [0, 0], [-2, 0], [1, 0], [-2, 1], [1, -2]
    ],

    '270>0': [
        [0, 0], [1, 0], [-2, 0], [1, 2], [-2, -1]
    ],

    '0>270': [
        [0, 0], [-1, 0], [2, 0], [-1, -2], [2, 1]
    ]
};
