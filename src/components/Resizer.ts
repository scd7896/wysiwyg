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
    });
  }

  mouseDownEventListener = (event: MouseEvent) => {
    const pointElement = findElementByType(event.target as HTMLElement, "point");
    this.targetNode = this.root.imageResizeStore.state.selectedNode;

    if (!pointElement || !this.targetNode) return;

    const width = this.targetNode.style.getPropertyPriority("width");
    if (!width) {
      const percent = (this.targetNode.clientWidth / this.targetNode.parentElement.clientWidth) * 100;
      this.targetNode.style.setProperty("width", `${percent}%`);
    }

    this.startPosition = pointElement.dataset.value as "right" | "left";
    this.startYPosition = pointElement.dataset.yValue as "bottom" | "top";
    this.currentXPoint = event.x;
    this.currentYPoint = event.y;
  };

  mouseMoveEventListener = (event: MouseEvent) => {
    if (!this.startPosition) return;
    if (this.targetNode) {
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
    let nextHeightPx = 0;
    if (this.startYPosition === "top") {
      nextHeightPx = this.calculateNextYPx(this.currentYPoint - y);
    } else {
      nextHeightPx = this.calculateNextYPx(y - this.currentYPoint);
    }
    if (nextHeightPx > this.board.clientHeight - 24) nextHeightPx = this.board.clientHeight - 24;

    this.targetNode.style.setProperty("height", `${nextHeightPx}px`);
  }

  private resizingImg(x: number) {
    let nextWidthPx = 0;
    if (this.startPosition === "left") {
      nextWidthPx = this.calculateNextXPx(this.currentXPoint - x);
    } else {
      nextWidthPx = this.calculateNextXPx(x - this.currentXPoint);
    }
    if (nextWidthPx > this.board.clientWidth - 24) nextWidthPx = this.board.clientWidth - 24;

    this.targetNode.style.setProperty("width", `${nextWidthPx}px`);
  }

  calculateNextXPx(diffPx: number) {
    const targetNode = this.root.imageResizeStore.state.selectedNode;
    const targetNodeWidth = targetNode.clientWidth + diffPx;

    return targetNodeWidth;
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
