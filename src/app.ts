import type { Grid, GridItem, GameState } from "./types";

function createGrid(size: number): Grid {
  const grid: GridItem[] = [];

  let index = 0;

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      grid.push({
        // position: { x, y },
        // hasFlag: false,
        // hasMine: state.mines.locations.has(index),
        index,
      });
      index++;
    }
  }

  //   console.log("grid: ", grid);
  return grid;
}

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
  newItem.textContent = gridItem.index.toString();
  newItem.addEventListener("click", handleLeftClick);
  newItem.addEventListener("contextmenu", handleRightClick);
  newItem.dataset.index = gridItem.index.toString();
  return newItem;
}

function getInitialGameState(size: number): GameState {
  return {
    grid: createGrid(size),
    gridSize: size,
    time: 0,
    flags: {
      placed: 0,
      locations: new Set(),
    },
    mines: {
      count: 10,
      flagged: 0,
      locations: new Set(),
    },
  };
}

function setMineLocations({
  gridSize,
  mineLocations,
  mineCount,
}: {
  gridSize: number;
  mineLocations: Set<number>;
  mineCount: number;
}) {
  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
    if (!mineLocations.has(randomIndex)) {
      mineLocations.add(randomIndex);
      minesPlaced++;
    }
  }
}

function handleLeftClick(e: Event) {
  const gridItem = e.target as HTMLDivElement;
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

function uncoverGridItems(gridIndex: number) {
  const item = state.grid[gridIndex];
  //   console.log(item);
  //* get surrounding items
  getSurroundingItems(gridIndex);
  //* get count of surrounding mines
  //* if count of surrounding mines is 0, get uncover surrounding items (recursion)
}

function getSurroundingItems(index: number) {
  const onTop = index < state.gridSize;
  const onBottom = index + state.gridSize + 1 > state.grid.length;
  const onLeft = index === 0 || index % state.gridSize === 0;
  const onRight = (index + 1) % state.gridSize === 0;

  //todo use the above to get the surrounding items.
  //   const surroundingItems = new Set([
  //     !onTop ?? index - state.gridSize,
  //     (!onTop && !onLeft) ?? index - (state.gridSize + 1),
  //   ]);

  return;
}

//! START GAME
const GRID_SIZE = 9;
const state = getInitialGameState(GRID_SIZE);

setMineLocations({
  mineLocations: state.mines.locations,
  mineCount: state.mines.count,
  gridSize: GRID_SIZE,
});

renderGrid(state.grid);
