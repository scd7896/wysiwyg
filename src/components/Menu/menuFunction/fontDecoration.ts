import { FontColorStore, FontDecorationStore, RangeSingleton } from "../../../model";
import { findElementByType, removeStyles, setStyle } from "../../../utils/dom";

export default class FontDecoration {
  private wrapper: HTMLDivElement;
  private buttons: HTMLButtonElement[];

  constructor(parent: HTMLElement) {
    const wrapper = document.createElement("div");
    this.wrapper = wrapper;
    const buttons = ["underline", "line-through", "overline"].map((line) => this.menuButtonRender(line));
    this.buttons = buttons.map((button) => wrapper.appendChild(button));

    parent.appendChild(this.wrapper);
    FontColorStore.subscribe(this);
    FontDecorationStore.subscribe(this);
    RangeSingleton.getInstance().subscribe(this);
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
        const textDecorationValues = RangeSingleton.getInstance().state.textDecorationValues;
        if (textDecorationValues?.find((styleValue) => lineStyle === styleValue)) {
          removeStyles(RangeSingleton.getInstance().anchorNode, "text-decoration-line", lineStyle);
        } else {
          RangeSingleton.getInstance().setStyle({
            "text-decoration-line": lineStyle,
          });
        }
      }
    });
  }

  update() {
    this.buttons.map((button) => setStyle(button, { color: FontColorStore.state.color }));
    const textDecorationValues = RangeSingleton.getInstance().state.textDecorationValues;
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
    const button = document.createElement("button");
    button.textContent = "A";
    button.dataset.type = "line";
    button.dataset.value = line;
    setStyle(button, {
      "text-decoration-line": line,
    });
    return button;
  }
}
