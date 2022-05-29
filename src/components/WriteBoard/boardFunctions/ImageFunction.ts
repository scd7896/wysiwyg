import { WriteBoardFunctionStore } from "../../../model";
import Resizer from "./resizer/Resizer";

class ImageFunction extends Resizer {
  constructor(parent: HTMLElement, store: WriteBoardFunctionStore) {
    super(parent, store);
  }

  getVisibleCheck(): boolean {
    return this.store.state.nodeName === "IMG";
  }
  resizing(x: number, y: number): void {
    if (this.store.state.nodeName !== "IMG") return;
    const targetNode = this.store.state.selectedNode;
    const width = targetNode.style.getPropertyValue("width");
    const prevPercent = width ? Number(width.split("%")[0]) : 100;
    let nextPercent = 0;
    if (this.startPosition === "left") {
      nextPercent = this.calculatePercent(this.currentXPoint - x, prevPercent);
    } else {
      nextPercent = this.calculatePercent(x - this.currentXPoint, prevPercent);
    }

    if (nextPercent > 100) nextPercent = 100;
    if (nextPercent < 3) nextPercent = 3;

    this.targetNode.style.setProperty("width", `${nextPercent}%`);
  }
}

export default ImageFunction;
