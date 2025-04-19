import type { Grid, GridItem } from "./types";

export class GameState {
  grid: Grid;
  gridSize: number;
  time: number;
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
    this.grid = createGrid(gridSize);
    this.gridSize = gridSize;
    this.time = 0;
    this.flags = {
      placed: 0,
      locations: new Set(),
    };
    this.mines = {
      count: mineCount,
      flagged: 0,
      locations: new Set(),
    };
  }
}

export function createGrid(size: number): Grid {
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
  return grid;
}
