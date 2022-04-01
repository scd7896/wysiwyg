import { ImageResizerStore } from "../model";
import { setStyle } from "../utils/dom";

export default class ImageResizer {
  private wrapper: HTMLDivElement;
  constructor(parent: Element) {
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
      this.wrapper.appendChild(point);
    });

    parent.appendChild(this.wrapper);
    this.render();
    ImageResizerStore.subscribe(this);
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
}
