export function handleLeftClick(e: Event) {
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

export function handleRightClick(e: Event) {
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
