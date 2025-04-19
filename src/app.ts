import { GameState } from "./game";
import type { Grid, GridItem } from "./types";

// todo: Refactor code into different folders/files
// todo: Make first click always safe
// todo: Add a way to win
// todo: Handle losing/clicking a mine
// todo: Timer logic
// todo: Dynamic flag count
// todo:

function renderGrid(gridArr: Grid) {
  const gridEl = document.getElementById("grid");
  if (!gridEl) throw new Error("Could not find grid element");

  gridArr.forEach((item) => {
    gridEl.append(createGridElement(item));
  });
}

function createGridElement(gridItem: GridItem) {
  const newItem = document.createElement("div");
  newItem.className = "grid-item";
  //   newItem.textContent = `${gridItem.position.x} , ${gridItem.position.y} `;
  const indexEl = document.createElement("div");
  const mineCountEl = document.createElement("div");

  indexEl.textContent = gridItem.index.toString();

  indexEl.classList.add("index");
  mineCountEl.classList.add("mine-count");

  newItem.append(indexEl);
  newItem.append(mineCountEl);

  newItem.addEventListener("click", handleLeftClick);
  newItem.addEventListener("contextmenu", handleRightClick);
  newItem.dataset.index = gridItem.index.toString();
  if (state.mines.locations.has(gridItem.index)) {
    newItem.classList.add("has-mine"); //todo: remove after testing
  }
  return newItem;
}

function handleLeftClick(e: Event) {
  const clickedItem = e.target as HTMLElement;

  const gridItem =
    (clickedItem.closest(".grid-item") as HTMLDivElement) || null;

  if (!gridItem) {
    console.error("Can't find grid item");
    return;
  }

  const index = Number(gridItem.dataset.index);

  if (state.flags.locations.has(index)) return;

  if (state.mines.locations.has(index)) {
    console.log("BOOM!!! 💣");
    return;
  }

  uncoverGridItems(index);
}

function handleRightClick(e: Event) {
  e.preventDefault();

  //? Add question mark capabilities
  const gridElement = e.target as HTMLDivElement;
  const index = Number(gridElement.dataset.index);
  //   const gridItem = grid[index];
  const hasFlag = state.flags.locations.has(index);
  const maxFlagsPlaced = state.flags.placed >= state.mines.count;

  if (hasFlag) {
    state.flags.locations.delete(index);
    state.flags.placed--;

    gridElement.removeAttribute("data-has-flag");
    return;
  }

  if (maxFlagsPlaced) {
    alert("No flags remaining");
    return;
  }

  state.flags.locations.add(index);
  state.flags.placed++;
  gridElement.dataset.hasFlag = "true";
}

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
  const onBottom = index + state.grid.size + 1 > state.grid.items.length;
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

renderGrid(state.grid.items);
