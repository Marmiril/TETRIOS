
/* Board dimensions */
export const BOARD_COLUMNS = 10;
export const BOARD_ROWS = 20;
export const CELL_SIZE = 30;

/* Game configuration */
export const DEFAULT_DIFFICULTY = 1;
export const BASE_FALL_INTERVAL = 1000; // Milliseconds

/* Piece configuration */
export const DEFAULT_SPEED_MULTIPLIER = 1;

// Tetromino colors
export const PIECE_COLORS: string[] = [
    '#00FFFF', // Cyan
    '#FFFF00', // Yellow
    '#AA00FF', // Purple
    '#00FF00', // Green
    '#FF0000', // Red
    '#0000FF', // Blue
    '#FF8800'  // Orange
]

// Keyboard movement configuration
export const HORIZONTAL_DAS = 170; // DAS (Delayed Auto Shift): tiempo de espera desde el desplazamiento inicial hasta que comienza la repetición automática.
export const HORIZONTAL_ARR = 50; // ARR (Auto Repeat Rate): intervalo entre desplazamientos sucesivos una vez transcurrido el DAS.

export const SOFT_DROP_DAS = 100;
export const SOFT_DROP_ARR = 30

export const LOCK_DELAY = 500;
export const MAX_LOCK_RESETS = 15;