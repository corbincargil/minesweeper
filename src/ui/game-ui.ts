import formatFlagCount from "../utils/format-flag-count";
import formatTime from "../utils/format-time";

export default class GameUI {
  private flagElement: HTMLElement;
  private statusIconElement: HTMLElement;
  private timeElement: HTMLElement;
  private gridElement: HTMLElement;
  constructor() {
    this.flagElement = this.getElement(".scoreboard .flag-count");
    this.statusIconElement = this.getElement(".scoreboard .status-icon");
    this.timeElement = this.getElement(".scoreboard .time");
    this.gridElement = this.getElement("#grid");
  }

  private getElement = (selector: string) => {
    const element = document.querySelector(selector);
    if (!element) throw new Error(`Could not find element using the following selector: ${selector}`);
    return element as HTMLElement;
  };

  public updateTimer(score: number) {
    this.timeElement.textContent = formatTime(score);
  }

  public updateStatus(status: "won" | "lost") {
    this.statusIconElement.textContent = status === "won" ? "🥳" : "😵";
  }

  public updateFlagCount(count: number) {
    this.flagElement.textContent = formatFlagCount(count);
  }
}
