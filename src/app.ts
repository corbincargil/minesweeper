import { GameState } from "./game";
import { renderGrid } from "./ui/grid";

// todo: Refactor code into different folders/files
// todo: Make first click always safe
// todo: Add a way to win
// todo: Handle losing/clicking a mine
// todo: Timer logic
// todo: Dynamic flag count
// todo:

function uncoverGridItems(gridIndex: number | null) {
  if (!gridIndex) return; // todo: fix type to not accept null. Need to make surroundingItems not have null values

  const htmlItem = document.querySelector(
    `[data-index="${gridIndex}"]`
  ) as HTMLDivElement;
  if (!htmlItem) {
    console.error("Could not find grid item with index: ", gridIndex);
    return;
  }
  if (htmlItem.dataset.revealed === "true") return;
  htmlItem.dataset.revealed = "true";

  //* get surrounding items
  //* get count of surrounding mines
  const { surroundingItems, surroundingMines } = getSurroundingItems(gridIndex);

  const mineCountEl = htmlItem.querySelector(".mine-count");
  if (!mineCountEl) {
    console.error("Could not find mine-count element");
    return;
  }

  //* if count of surrounding mines is 0, get uncover surrounding items (recursion)
  if (surroundingMines.size === 0) {
    surroundingItems.forEach((i) => uncoverGridItems(i));
  } else {
    mineCountEl.textContent = surroundingMines.size.toString();
  }
}

function getSurroundingItems(index: number) {
  const onTop = index < state.grid.size;
  const onBottom = index + state.grid.size + 1 > state.grid.cells.length;
  const onLeft = index === 0 || index % state.grid.size === 0;
  const onRight = (index + 1) % state.grid.size === 0;

  //* in clock-wise order starting with top-center
  const surroundingItems = new Set([
    !onTop ? index - state.grid.size : null,
    !onTop && !onRight ? index - (state.grid.size - 1) : null,
    !onRight ? index + 1 : null,
    !onBottom && !onRight ? index + state.grid.size + 1 : null,
    !onBottom ? index + state.grid.size : null,
    !onBottom && !onLeft ? index + (state.grid.size - 1) : null,
    !onLeft ? index - 1 : null,
    !onTop && !onLeft ? index - (state.grid.size + 1) : null,
  ]);

  surroundingItems.delete(null);

  const surroundingMines = surroundingItems.intersection(state.mines.locations);

  return {
    surroundingItems,
    surroundingMines,
  };
}

//! START GAME
const GRID_SIZE = 9;
const MINE_COUNT = 10;
const state = new GameState({ gridSize: GRID_SIZE, mineCount: MINE_COUNT });

renderGrid(state.grid.cells);
