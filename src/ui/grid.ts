import type { Grid, Cell } from "../types";
import { handleLeftClick, handleRightClick } from "./click-handlers";

export function renderGrid(gridArr: Grid) {
  const gridEl = document.getElementById("grid");
  if (!gridEl) throw new Error("Could not find grid element");

  gridArr.forEach((item) => {
    gridEl.append(createCellElement(item));
  });
}

function createCellElement(cell: Cell) {
  const newItem = document.createElement("div");
  newItem.className = "grid-item";
  const indexEl = document.createElement("div");
  const mineCountEl = document.createElement("div");

  indexEl.textContent = cell.index.toString();

  indexEl.classList.add("index");
  mineCountEl.classList.add("mine-count");

  newItem.append(indexEl);
  newItem.append(mineCountEl);

  newItem.addEventListener("click", handleLeftClick);
  newItem.addEventListener("contextmenu", handleRightClick);
  newItem.dataset.index = cell.index.toString();
  return newItem;
}
