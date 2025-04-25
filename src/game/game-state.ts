export default class GameState {
  time: number;
  grid: {
    cells: number[];
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

  constructor({ gridSize, mineCount }: { gridSize: number; mineCount: number }) {
    this.time = 0;
    this.grid = {
      cells: this.createGrid(gridSize),
      size: gridSize,
    };
    this.flags = {
      placed: 0,
      locations: new Set(),
    };
    this.mines = {
      count: mineCount,
      flagged: 0,
      locations: new Set(),
    };
    this.setMineLocations(this.grid.size, this.mines.count);
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  private createGrid(size: number): number[] {
    const grid: number[] = [];

    let index = 0;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        grid.push(index);
        index++;
      }
    }
    return grid;
  }

  private setMineLocations(gridSize: number, mineCount: number) {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
      if (!this.mines.locations.has(randomIndex)) {
        this.mines.locations.add(randomIndex);
        minesPlaced++;
      }
    }
  }

  startGame(safeCellIndex: number) {
    //* set mine locations based on safeCellIndex
    //* set surrounding cells for each cell
    //* set surrounding mines for each cell
  }

  private uncoverGridItem(gridIndex: number | null) {
    if (gridIndex === null) return;

    const htmlItem = document.querySelector(`[data-index="${gridIndex}"]`) as HTMLDivElement;

    if (!htmlItem) {
      console.error("Could not find grid item with index: ", gridIndex);
      return;
    }

    if (htmlItem.dataset.revealed === "true" || htmlItem.dataset.hasFlag === "true") return;

    htmlItem.dataset.revealed = "true";
    htmlItem.classList.add("revealed");

    const { surroundingCells, surroundingMines } = this.getSurroundingCells(gridIndex, this.grid.size);

    const mineCountEl = htmlItem.querySelector(".mine-count");
    if (!mineCountEl) {
      console.error("Could not find mine-count element");
      return;
    }

    if (surroundingMines.size === 0) {
      surroundingCells.forEach((i) => this.uncoverGridItem(i));
    } else {
      mineCountEl.textContent = surroundingMines.size.toString();
    }
  }

  private getSurroundingCells(index: number, gridSize: number) {
    const onTop = index < gridSize;
    const onBottom = index + gridSize + 1 > gridSize * gridSize;
    const onLeft = index === 0 || index % gridSize === 0;
    const onRight = (index + 1) % gridSize === 0;

    //* in clock-wise order starting with top-center
    const surroundingCells = new Set([
      !onTop ? index - gridSize : null,
      !onTop && !onRight ? index - (gridSize - 1) : null,
      !onRight ? index + 1 : null,
      !onBottom && !onRight ? index + gridSize + 1 : null,
      !onBottom ? index + gridSize : null,
      !onBottom && !onLeft ? index + (gridSize - 1) : null,
      !onLeft ? index - 1 : null,
      !onTop && !onLeft ? index - (gridSize + 1) : null,
    ]);

    return {
      surroundingCells,
      surroundingMines: surroundingCells.intersection(this.mines.locations),
    };
  }

  public handleLeftClick(e: Event) {
    const clickedItem = e.target as HTMLElement;

    const gridItem = (clickedItem.closest(".grid-item") as HTMLDivElement) || null;

    if (!gridItem) {
      console.error("Can't find grid item");
      return;
    }

    const index = Number(gridItem.dataset.index);

    if (this.flags.locations.has(index)) return;

    if (this.mines.locations.has(index)) {
      console.log("BOOM!!! 💣");
      return;
    }

    this.uncoverGridItem(index);
  }

  public handleRightClick(e: Event) {
    e.preventDefault();

    //? Add question mark capabilities
    const gridElement = e.target as HTMLDivElement;
    const index = Number(gridElement.dataset.index);
    const hasFlag = this.flags.locations.has(index);
    const maxFlagsPlaced = this.flags.placed >= this.mines.count;

    if (hasFlag) {
      this.flags.locations.delete(index);
      this.flags.placed--;

      gridElement.removeAttribute("data-has-flag");
      return;
    }

    if (maxFlagsPlaced) {
      alert("No flags remaining");
      return;
    }

    this.flags.locations.add(index);
    this.flags.placed++;
    gridElement.dataset.hasFlag = "true";
  }
}
