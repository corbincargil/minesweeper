import GameUI from "../ui/game-ui";
import formatTime from "../utils/format-time";

export default class GameState {
  score: number;
  status: "ready" | "active" | "won" | "lost";
  private ui: GameUI;
  timer: {
    interval: any;
    running: boolean;
  };
  grid: {
    cells: Set<number>;
    revealedCells: Set<number>;
    size: number;
  };
  private flags: {
    remaining: number;
    locations: Set<number>;
  };
  private mines: {
    count: number;
    flagged: number;
    locations: Set<number>;
  };

  constructor({ gridSize, mineCount }: { gridSize: number; mineCount: number }) {
    this.score = 0;
    this.status = "ready";
    this.ui = new GameUI();
    this.timer = {
      interval: null,
      running: false,
    };
    this.grid = {
      cells: this.createGrid(gridSize),
      revealedCells: new Set(),
      size: gridSize,
    };
    this.flags = {
      remaining: mineCount,
      locations: new Set(),
    };
    this.mines = {
      count: mineCount,
      flagged: 0,
      locations: new Set(),
    };
    this.handleLeftClick = this.handleLeftClick.bind(this);
    this.handleRightClick = this.handleRightClick.bind(this);
  }

  private createGrid(size: number): Set<number> {
    const grid: Set<number> = new Set();

    let index = 0;

    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        grid.add(index);
        index++;
      }
    }
    return grid;
  }

  private setMineLocations(gridSize: number, mineCount: number, safeCellIndex: number) {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
      const randomIndex = Math.floor(Math.random() * gridSize * gridSize);
      if (!this.mines.locations.has(randomIndex) && randomIndex !== safeCellIndex) {
        this.mines.locations.add(randomIndex);

        //! remove after testing ⬇️
        const htmlItem = document.querySelector(`[data-index="${randomIndex}"]`) as HTMLDivElement;

        if (!htmlItem) {
          console.error("Could not find grid item with index: ", randomIndex);
          return;
        }
        htmlItem.classList.add("has-bomb");
        //! remove after testing ⬆️

        minesPlaced++;
      }
    }
  }

  private startTimer() {
    if (this.timer.running) return;

    this.timer.interval = setInterval(() => {
      this.score++;
      this.ui.updateTimer(this.score);
    }, 100);
    this.timer.running = true;
  }

  private stopTimer() {
    clearInterval(this.timer.interval);
    this.timer.running = false;
  }

  private startGame(safeCellIndex: number) {
    this.status = "active";
    this.startTimer();
    this.setMineLocations(this.grid.size, this.mines.count, safeCellIndex);
  }

  private gameWon() {
    this.status = "won";
    this.stopTimer();
    this.ui.updateStatus("won");
  }

  private gameLost() {
    this.status = "lost";
    this.stopTimer();
    this.ui.updateStatus("lost");
  }

  private checkWinningCondition() {
    const remainingCells = this.grid.cells.difference(this.grid.revealedCells);
    const minesLocations = this.mines.locations;
    if (remainingCells.size !== minesLocations.size) return;
    if ([...remainingCells].every((item) => minesLocations.has(item))) {
      this.gameWon();
    }
  }

  private uncoverGridItem(gridIndex: number | null) {
    if (gridIndex === null) return; //todo: update this to not be null

    const htmlItem = document.querySelector(`[data-index="${gridIndex}"]`) as HTMLDivElement;

    if (!htmlItem) {
      console.error("Could not find grid item with index: ", gridIndex);
      return;
    }

    if (htmlItem.dataset.revealed === "true" || htmlItem.dataset.hasFlag === "true") return;

    htmlItem.dataset.revealed = "true";
    htmlItem.classList.add("revealed");
    this.grid.revealedCells.add(gridIndex);

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
      mineCountEl.setAttribute("surrounding-count", surroundingMines.size.toString());
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

    if (this.status === "ready") this.startGame(index);

    if (this.status !== "active") return;

    if (this.flags.locations.has(index)) return;

    if (this.mines.locations.has(index)) {
      this.gameLost();
      return;
    }

    this.uncoverGridItem(index);
    this.checkWinningCondition();
  }

  public handleRightClick(e: Event) {
    e.preventDefault();
    if (this.status !== "active") return;

    //? Add question mark capabilities
    const gridElement = e.target as HTMLDivElement;
    const index = Number(gridElement.dataset.index);
    const hasFlag = this.flags.locations.has(index);
    const maxFlagsPlaced = this.flags.remaining <= 0;

    if (hasFlag) {
      this.flags.locations.delete(index);
      this.flags.remaining++;

      gridElement.removeAttribute("data-has-flag");
      return;
    }

    if (maxFlagsPlaced) {
      alert("No flags remaining");
      return;
    }

    this.flags.locations.add(index);
    this.flags.remaining--;
    this.ui.updateFlagCount(this.flags.remaining);
    gridElement.dataset.hasFlag = "true";
  }
}
