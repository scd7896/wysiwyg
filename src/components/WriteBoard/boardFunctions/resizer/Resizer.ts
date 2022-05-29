import { findElementByType, setStyle } from "../../../../utils/dom";
import { WriteBoardFunctionStore } from "../../../../model";

export default abstract class Resizer {
  protected wrapper: HTMLDivElement;
  protected startPosition: "left" | "right";
  protected startYPosition: "top" | "bottom";
  protected currentXPoint: number;
  protected currentYPoint: number;
  protected targetNode: HTMLElement;
  protected store: WriteBoardFunctionStore;

  abstract resizing(x: number, y: number): void;
  abstract getVisibleCheck(): boolean;

  constructor(parent: Element, store: WriteBoardFunctionStore) {
    this.wrapper = document.createElement("div");
    this.store = store;
    this.targetNode = undefined;
    [
      { top: "0%", left: "0%" },
      { top: "100%", left: "0%" },
      { top: "0%", left: "100%" },
      { top: "100%", left: "100%" },
    ].map((position) => {
      const point = document.createElement("div");
      setStyle(point, {
        ...position,
        width: "16px",
        height: "16px",
        "background-color": "black",
        position: "absolute",
        transform: "translate(-50%, -50%)",
        "border-radius": "100%",
        "z-index": "1000",
      });
      point.dataset.type = "point";
      point.dataset.value = position.left === "100%" ? "right" : "left";
      point.dataset.yValue = position.top === "100%" ? "bottom" : "top";
      this.wrapper.appendChild(point);
    });

    parent.appendChild(this.wrapper);
    this.render();
    this.store.subscribe(this);
    this.wrapper.addEventListener("mousedown", this.mouseDownEventListener);
    parent.addEventListener("mousemove", this.mouseMoveEventListener);
    parent.addEventListener("mouseup", this.mouseUpEventListener);
    parent.addEventListener("mouseleave", this.mouseUpEventListener);
  }

  update() {
    const targetNode = this.store.state.selectedNode;
    if (targetNode && this.getVisibleCheck()) {
      const clientRects = targetNode.getClientRects().item(0);
      setStyle(this.wrapper, {
        top: targetNode.offsetTop - 2 + "px",
        left: targetNode.offsetLeft - 2 + "px",
        display: "block",
        width: clientRects.width + 8 + "px",
        height: clientRects.height + 8 + "px",
      });
    } else {
      setStyle(this.wrapper, {
        display: "none",
        width: "0px",
        height: "0px",
      });
    }
  }

  render() {
    setStyle(this.wrapper, {
      position: "absolute",
      display: "none",
      border: "1px solid blue",
      "z-index": "10",
    });
  }

  mouseDownEventListener = (event: MouseEvent) => {
    const pointElement = findElementByType(event.target as HTMLElement, "point");
    this.targetNode = this.store.state.selectedNode;

    if (!pointElement || !this.targetNode) return;

    event.preventDefault();
    this.startPosition = pointElement.dataset.value as "right" | "left";
    this.startYPosition = pointElement.dataset.yValue as "bottom" | "top";
    this.currentXPoint = event.x;
    this.currentYPoint = event.y;
  };

  mouseMoveEventListener = (event: MouseEvent) => {
    if (!this.startPosition) return;
    if (this.targetNode) {
      event.preventDefault();
      console.log(this.targetNode, "move");
      this.resizing(event.x, event.y);
      this.update();
    }
    this.currentXPoint = event.x;
    this.currentYPoint = event.y;
  };

  calculatePercent(diffPx: number, prev?: number) {
    const targetNode = this.store.state.selectedNode;
    const percent = prev || targetNode.style.getPropertyValue("width").split("%")[0];
    if (diffPx > 0) {
      return Number(percent) + 0.1;
    }

    if (diffPx < 0) {
      return Number(percent) - 0.1;
    }

    return Number(percent);
  }

  calculateNextYPx(diffPx: number) {
    const targetNode = this.store.state.selectedNode;
    const targetNodeHeight = targetNode.clientHeight + diffPx;

    return targetNodeHeight;
  }

  mouseUpEventListener = (event: MouseEvent) => {
    this.startPosition = undefined;
    this.currentXPoint = undefined;
    this.targetNode = undefined;
    this.currentYPoint = undefined;
    this.startYPosition = undefined;
  };
}
