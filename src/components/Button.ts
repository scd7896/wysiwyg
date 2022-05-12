import { setStyle } from "../utils/dom";

type TButton = "primary" | "menu";
class Button {
  button: HTMLButtonElement;
  private type: TButton;
  constructor(type?: TButton) {
    this.button = document.createElement("button");
    this.type = type || "primary";
    this.render();
  }

  render() {
    if (this.type === "primary") {
      setStyle(this.button, {
        background: "none",
        border: "none",
        color: "#0098f7",
        "font-size": "18px",
        cursor: "pointer",
      });
    }

    if (this.type === "menu") {
      setStyle(this.button, {
        background: "none",
        border: "none",
        cursor: "pointer",
      });
    }
    return this.button;
  }

  set textContent(text: string) {
    this.button.textContent = text;
  }

  set innerHTML(html: string) {
    this.button.innerHTML = html;
  }
}

export default Button;
