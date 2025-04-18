interface Position {
  x: number;
  y: number;
}

export interface GridItem {
  //   position: Position;
  //   hasFlag: boolean;
  //   hasMine: boolean;
  index: number;
}

export type Grid = GridItem[];

export interface GameState {
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
}
