import { setStyle } from "../utils/dom";

class Button {
  button: HTMLButtonElement;
  constructor() {
    this.button = document.createElement("button");
    this.render();
  }

  render() {
    setStyle(this.button, {
      background: "none",
      border: "none",
      color: "#0098f7",
      "font-size": "18px",
      cursor: "pointer",
    });
    return this.button;
  }

  set textContent(text: string) {
    this.button.textContent = text;
  }
}

export default Button;
