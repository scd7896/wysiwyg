import { WriteBoardFunctionStore } from "../../../model";
import Resizer from "./resizer/Resizer";

class VideoFunction extends Resizer {
  constructor(parent: HTMLElement, store: WriteBoardFunctionStore) {
    super(parent, store);
  }
  getVisibleCheck(): boolean {
    return this.store.state.nodeName === "IFRAME";
  }

  resizing(x: number, y: number): void {
    console.log("video", x, y);
    if (this.store.state.nodeName !== "IFRAME") return;
    this.resizeVideo(x, y);
  }

  private resizeVideo(x: number, y: number) {
    this.resizeX(x);
    let nextPaddingBottom = 0;
    this.targetNode.style.setProperty("height", "0px");
    const paddingBottom = this.targetNode.style.getPropertyValue("padding-bottom").split("%")[0];
    if (this.startYPosition === "top") {
      nextPaddingBottom = this.calculatePercent(this.currentYPoint - y, Number(paddingBottom));
    } else {
      nextPaddingBottom = this.calculatePercent(y - this.currentYPoint, Number(paddingBottom));
    }
    if (nextPaddingBottom < 5) nextPaddingBottom = 5;

    this.targetNode.style.setProperty("padding-bottom", `${nextPaddingBottom}%`);
  }

  private resizeX(x: number) {
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

export default VideoFunction;
