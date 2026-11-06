
export enum AppState {
    MAIN_MENU = 'MAIN_MENU',
    PLAYING = 'PLAYING',
    PAUSED = 'PAUSED',
    GAME_OVER = 'GAME_OVER',
    RECORDS = 'RECORDS',
    SETTINGS = 'SETTINGS'
}

export enum GameMode {
    CLASSIC = 'CLASSIC',
    MULTI_PIECE = 'MULTI_PIECE'
}

export enum GameDifficulty {
    LEVEL_1 = 1,
    LEVEL_2,
    LEVEL_3,
    LEVEL_4,
    LEVEL_5,
    LEVEL_6,
    LEVEL_7
}

export enum TetrominoType {
    I = 'I',
    O = 'O',
    T = 'T',
    S = 'S',
    Z = 'Z',
    J = 'J',
    L = 'L'
}
