import GameState from "./game/game-state";
import renderGrid from "./ui/render-grid";

// todo: Refactor code into different folders/files
// todo: Make first click always safe
// todo: Add a way to win
// todo: Handle losing/clicking a mine
// todo: Timer logic
// todo: Dynamic flag count
// todo:

//! START GAME
const GRID_SIZE = 9;
const MINE_COUNT = 10;
const state = new GameState({ gridSize: GRID_SIZE, mineCount: MINE_COUNT });

console.log(state);

renderGrid(state.grid.cells, state.handleLeftClick, state.handleRightClick);
