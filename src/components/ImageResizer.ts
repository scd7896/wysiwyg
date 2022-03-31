import { setStyle } from "../utils/dom";

export default class ImageResizer {
  private wrapper: HTMLDivElement;
  constructor(parent: Element) {
    this.wrapper = document.createElement("div");

    parent.appendChild(this.wrapper);
    this.render();
  }

  render() {
    setStyle(this.wrapper, {
      position: "absolute",
    });
  }
}
