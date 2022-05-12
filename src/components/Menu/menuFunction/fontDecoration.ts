import { IRootStores } from "../../..";
import { IEditorOptions } from "../../../types";
import { findElementByType, removeStyles, setStyle } from "../../../utils/dom";
import Button from "../../Button";

export default class FontDecoration {
  private wrapper: HTMLDivElement;
  private buttons: HTMLButtonElement[];
  root: IRootStores;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    const wrapper = document.createElement("div");
    this.wrapper = wrapper;
    this.root = root;
    const buttons = ["underline", "line-through", "overline"].map((line) => this.menuButtonRender(line));
    this.buttons = buttons.map((button) => wrapper.appendChild(button));

    parent.appendChild(this.wrapper);

    this.root.fontColorStore.subscribe(this);
    this.root.range.subscribe(this);

    this.render();
  }

  render() {
    setStyle(this.wrapper, {
      position: "relative",
    });
    this.renderButtons();

    this.wrapper.addEventListener("click", (e: any) => {
      const target = findElementByType(e.target, "line");
      if (target) {
        const lineStyle = target.dataset.value;
        const textDecorationValues = this.root.range.state.textDecorationValues;
        if (textDecorationValues?.find((styleValue) => lineStyle === styleValue)) {
          removeStyles(this.root.range.anchorNode, "text-decoration-line", lineStyle);
        } else {
          this.root.range.setStyle({
            "text-decoration-line": lineStyle,
          });
        }
      }
    });
  }

  update() {
    this.buttons.map((button) => setStyle(button, { color: this.root.fontColorStore.state.color }));
    const textDecorationValues = this.root.range.state.textDecorationValues;
    this.renderButtons(textDecorationValues);
  }

  renderButtons(textDecorationValues?: string[]) {
    this.buttons.map((button) => {
      const lineStyle = button.dataset.value;
      if (textDecorationValues?.find((styleValue) => lineStyle === styleValue)) {
        setStyle(button, {
          background: "#00ffff",
        });
      } else {
        setStyle(button, {
          background: "#efefef",
        });
      }
    });
  }
  private menuButtonRender(line: string) {
    const button = new Button("menu").button;
    button.textContent = "A";
    button.dataset.type = "line";
    button.dataset.value = line;
    setStyle(button, {
      "text-decoration-line": line,
    });
    return button;
  }
}
