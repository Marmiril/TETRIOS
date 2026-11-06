# TETRIOS

**Angular | TypeScript | HTML5 | CSS3 | Canvas 2D**

Español

Descripción

TETRIS es un proyecto de desarrollo web inspirado en el clásico videojuego de puzles, construido utilizando HTML5, CSS3 y JavaScript puro.

El objetivo es desarrollar un juego completo, modular y escalable, aplicando principios de programación orientada a objetos, separación de responsabilidades y gestión de estados.

El proyecto está destinado a formar parte de un portfolio personal y servirá para profundizar en el desarrollo de videojuegos para navegador.

*** Características previstas*** 

- Juego clásico de Tetris.
- Menú principal y navegación entre pantallas.
- Sistema de pausa, reanudación y reinicio.
- Siete niveles de dificultad.
- Sistema de puntuación y eliminación de líneas.
- Tabla de récords con almacenamiento local.
- Visualización de próximas piezas.
- Sistema de reserva de piezas (hold).
- Efectos visuales y sonoros.
- Interfaz adaptable a diferentes resoluciones.
- Nueva modalidad con varias piezas cayendo simultáneamente (futura actualización).

*** Tecnologías ***

- Angular: arquitectura de componentes, servicios y gestión de la interfaz.
- TypeScript: lógica del juego, modelos, interfaces, enumeraciones y gestión de estados.
- HTML5: estructura de la interfaz.
- CSS3: diseño visual, animaciones y adaptación a diferentes pantallas.
- Canvas 2D API: representación gráfica del tablero y las piezas.
- LocalStorage: almacenamiento de récords y preferencias.

*** Arquitectura ***

El proyecto utilizará una arquitectura modular basada en Angular, separando la interfaz del motor de juego:
- Components: menús, tablero, HUD y pantallas.
- Services: coordinación de partidas, dificultades y récords.
- Models: representación del tablero, piezas y estado de la partida.
- Game Engine: movimientos, colisiones, rotaciones, gravedad y puntuación.
- Config: constantes, enumeraciones y parámetros de configuración.
- Esta organización permitirá ampliar las funcionalidades sin modificar innecesariamente los componentes existentes.

*** Plan de desarrollo ***

- Configuración inicial y estructura del proyecto.
- Definición de estados, enumeraciones y modelos.
- Creación y representación del tablero.
- Implementación de piezas, movimientos, rotaciones y colisiones.
- Desarrollo del bucle principal y la gravedad.
- Eliminación de líneas y sistema de puntuación.
- Configuración de dificultades.
- Desarrollo de menús e interfaz.
- Implementación de récords y persistencia.
- Pruebas, optimización y publicación.
- Desarrollo de la modalidad de piezas simultáneas.

*** Estado del proyecto ***

En desarrollo — Fase inicial.

Actualmente se está preparando la estructura y arquitectura del proyecto. Las funcionalidades descritas forman parte de la planificación y se implementarán progresivamente.

**English**

*** Description ***

TETRIS is a web development project inspired by the classic puzzle video game, built using HTML5, CSS3, and vanilla JavaScript.
The goal is to create a complete, modular, and scalable game while applying object-oriented programming principles, separation of concerns, and state management.
The project is intended for a personal portfolio and will serve as an opportunity to improve browser-based game development skills.

*** Planned Features ***

- Classic Tetris gameplay.
- Main menu and screen navigation.
- Pause, resume, and restart functionality.
- Seven difficulty levels.
- Scoring and line-clearing system.
- High-score leaderboard with local storage.
- Next-piece preview.
- Piece hold system.
- Visual and sound effects.
- Responsive interface.
- Additional game mode featuring multiple pieces falling simultaneously (future update).

*** Technologies ***

- Angular: component architecture, services, and user interface management.
- TypeScript: game logic, models, interfaces, enumerations, and state management.
- HTML5: user interface structure.
- CSS3: visual design, animations, and responsive layouts.
- Canvas 2D API: graphical rendering of the board and pieces.
- LocalStorage: persistent high scores and preferences.

*** Architecture ***

The project will use a modular Angular architecture, separating the user interface from the game engine:
- Components: menus, game board, HUD, and screens.
- Services: game session coordination, difficulty management, and high scores.
- Models: board, pieces, and game state representation.
- Game Engine: movement, collisions, rotations, gravity, and scoring.
- Config: constants, enumerations, and configuration parameters.

This structure is designed to support future extensions while minimizing unnecessary changes to existing components.

*** Development Roadmap ***

- Initial project setup and directory structure.
- Definition of states, enumerations, and models.
- Board creation and rendering.
- Piece movement, rotation, and collision detection.
- Main game loop and gravity implementation.
- Line clearing and scoring system.
- Difficulty configuration.
- Menus and user interface.
- High-score management and persistence.
- Testing, optimization, and release.
- Development of the simultaneous falling pieces mode.

*** Project Status ***

In development — Initial stage.

The project structure and architecture are currently being prepared. All described features are planned and will be implemented progressively.

Author / Autor

Ángel Plata Benítez

Portfolio: angelplata.com

GitHub: Marmiril
