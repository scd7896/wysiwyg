import { FontColorStore, FontDecorationStore, RangeSingleton } from "../../../model";
import { findByTypeElement, hasContains, hasStyles, setStyle } from "../../../utils/dom";

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

    this.wrapper.addEventListener("click", (e: any) => {
      const target = findByTypeElement(e.target, "line");
      if (target) {
        const lineStyle = target.dataset.value;

        RangeSingleton.getInstance().fontSet({
          "text-decoration-line": lineStyle,
        });
      }
    });
  }

  update() {
    this.buttons.map((button) => setStyle(button, { color: FontColorStore.state.color }));
    if (RangeSingleton.getInstance().type === "Caret") {
      const anchorNode = RangeSingleton.getInstance().anchorNode;

      hasStyles("text-decoration-line", anchorNode);
    }
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
