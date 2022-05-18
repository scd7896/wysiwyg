import { IRootStores } from "..";
import { findElementByType, setStyle } from "../utils/dom";

export default class ImageResizer {
  private wrapper: HTMLDivElement;
  private startPosition: "left" | "right";
  private startYPosition: "top" | "bottom";
  private currentXPoint: number;
  private currentYPoint: number;
  private board: HTMLDivElement;
  private targetNode: HTMLElement;
  private root: IRootStores;

  constructor(parent: Element, root: IRootStores) {
    this.board = parent.querySelector(".board");
    this.wrapper = document.createElement("div");
    this.root = root;
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
    this.root.imageResizeStore.subscribe(this);
    this.wrapper.addEventListener("mousedown", this.mouseDownEventListener);
    parent.addEventListener("mousemove", this.mouseMoveEventListener);
    parent.addEventListener("mouseup", this.mouseUpEventListener);
    parent.addEventListener("mouseleave", this.mouseUpEventListener);
  }

  update() {
    const targetNode = this.root.imageResizeStore.state.selectedNode;
    if (targetNode) {
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
    this.targetNode = this.root.imageResizeStore.state.selectedNode;

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
      console.log("mobe?");
      event.preventDefault();
      if (this.targetNode.nodeName === "IMG") {
        this.resizingImg(event.x);
      } else {
        this.resizingVideo(event.x, event.y);
      }

      this.update();
    }
    this.currentXPoint = event.x;
    this.currentYPoint = event.y;
  };

  private resizingVideo(x: number, y: number) {
    this.resizingImg(x);
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

  private resizingImg(x: number) {
    const targetNode = this.root.imageResizeStore.state.selectedNode;
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

  calculatePercent(diffPx: number, prev?: number) {
    const targetNode = this.root.imageResizeStore.state.selectedNode;
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
    const targetNode = this.root.imageResizeStore.state.selectedNode;
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
