import type { Grid } from "./types";

export class GameState {
  time: number;
  grid: {
    items: Grid;
    size: number;
  };
  flags: {
    placed: number;
    locations: Set<number>;
  };
  mines: {
    count: number;
    flagged: number;
    locations: Set<number>;
  };

  constructor({
    gridSize,
    mineCount,
  }: {
    gridSize: number;
    mineCount: number;
  }) {
    this.time = 0;
    this.flags = {
      placed: 0,
      locations: new Set(),
    };
    this.mines = {
      count: mineCount,
      flagged: 0,
      locations: this.setMineLocations(gridSize, mineCount),
    };
    this.grid = {
      items: this.createGrid(gridSize),
      size: gridSize,
    };
  }

  private createGrid(size: number): Grid {
    const grid: GridItem[] = [];

    let index = 0;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        grid.push(new GridItem(index, this));
        index++;
      }
    }
    return grid;
  }

  private setMineLocations(gridSize: number, mineCount: number) {
    let minesPlaced = 0;
    const mineLocations = new Set<number>();
    while (minesPlaced < mineCount) {
      const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
      if (!mineLocations.has(randomIndex)) {
        mineLocations.add(randomIndex);
        minesPlaced++;
      }
    }
    return mineLocations;
  }
}

class GridItem {
  index: number;
  hasMine: boolean;
  hasFlag: boolean;
  // isRevealed: boolean;
  // surroundingMines: number;

  constructor(index: number, state: GameState) {
    this.index = index;
    this.hasMine = state.mines.locations.has(index);
    this.hasFlag = state.flags.locations.has(index);
    // this.isRevealed =
  }
}
