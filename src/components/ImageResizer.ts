import { ImageResizerStore } from "../model";
import { findElementByType, setStyle } from "../utils/dom";

export default class ImageResizer {
  private wrapper: HTMLDivElement;
  private startPosition: "left" | "right";
  private currentXPoint: number;
  private board: HTMLDivElement;

  constructor(parent: Element) {
    this.board = parent.querySelector(".board");
    this.wrapper = document.createElement("div");
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
      this.wrapper.appendChild(point);
    });

    parent.appendChild(this.wrapper);
    this.render();
    ImageResizerStore.subscribe(this);
    this.wrapper.addEventListener("mousedown", this.mouseDownEventListener);
    parent.addEventListener("mousemove", this.mouseMoveEventListener);
    parent.addEventListener("mouseup", this.mouseUpEventListener);
    parent.addEventListener("mouseleave", this.mouseUpEventListener);
  }

  update() {
    const targetImage = ImageResizerStore.state.selectedImage;
    if (targetImage) {
      const clientRects = targetImage.getClientRects().item(0);
      setStyle(this.wrapper, {
        top: targetImage.offsetTop - 2 + "px",
        left: targetImage.offsetLeft - 2 + "px",
        display: "block",
        width: clientRects.width + 4 + "px",
        height: clientRects.height + 4 + "px",
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
    event.preventDefault();

    const pointElement = findElementByType(event.target as HTMLElement, "point");
    const targetImage = ImageResizerStore.state.selectedImage;
    if (!pointElement || !targetImage) return;

    const width = targetImage.style.getPropertyPriority("width");
    if (!width) {
      const percent = (targetImage.width / targetImage.parentElement.clientWidth) * 100;
      targetImage.style.setProperty("width", `${percent}%`);
    }

    this.startPosition = pointElement.dataset.value as "right" | "left";
    this.currentXPoint = event.x;
  };

  mouseMoveEventListener = (event: MouseEvent) => {
    event.preventDefault();
    const targetImage = ImageResizerStore.state.selectedImage;
    if (!this.startPosition) return;
    if (targetImage) {
      let calculatePercent = 0;
      if (this.startPosition === "left") {
        const nextDiff = this.calculateNextPercent(this.currentXPoint - event.x);
        calculatePercent = nextDiff;
      } else {
        const nextDiff = this.calculateNextPercent(event.x - this.currentXPoint);

        calculatePercent = nextDiff;
      }

      if (calculatePercent > this.board.clientWidth - 24) calculatePercent = this.board.clientWidth - 24;

      targetImage.style.setProperty("width", `${calculatePercent}px`);
      this.update();
    }
    this.currentXPoint = event.x;
  };

  calculateNextPercent(diffPx: number) {
    const targetImage = ImageResizerStore.state.selectedImage;
    const targetImageWidth = targetImage.width + diffPx;

    return targetImageWidth;
  }

  mouseUpEventListener = (event: MouseEvent) => {
    this.startPosition = undefined;
    this.currentXPoint = undefined;
  };
}
