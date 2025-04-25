export default function renderGrid(
  gridArr: number[],
  handleLeftClick: (e: Event) => void,
  handleRightClick: (e: Event) => void
) {
  const gridEl = document.getElementById("grid");
  if (!gridEl) throw new Error("Could not find grid element");

  gridArr.forEach((cell) => {
    gridEl.append(createCellElement(cell, handleLeftClick, handleRightClick));
  });
}

function createCellElement(index: number, handleLeftClick: (e: Event) => void, handleRightClick: (e: Event) => void) {
  const newCell = document.createElement("div");
  newCell.className = "grid-item";
  const indexEl = document.createElement("div");
  const mineCountEl = document.createElement("div");

  indexEl.textContent = index.toString();

  indexEl.classList.add("index");
  mineCountEl.classList.add("mine-count");

  newCell.append(indexEl);
  newCell.append(mineCountEl);

  newCell.addEventListener("click", handleLeftClick);
  newCell.addEventListener("contextmenu", handleRightClick);
  newCell.dataset.index = index.toString();
  return newCell;
}
