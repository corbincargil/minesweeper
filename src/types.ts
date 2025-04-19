interface Position {
  x: number;
  y: number;
}

export interface Cell {
  //   position: Position;
  //   hasFlag: boolean;
  //   hasMine: boolean;
  index: number;
}

export type Grid = Cell[];

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
