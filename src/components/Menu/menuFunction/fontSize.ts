import { IComponent } from "../../../model/BaseStore";
import FontSizeStore from "../../../model/FontSizeStore";

export default class FontSize implements IComponent {
  private parent: Element;
  private wrapper: HTMLDivElement;
  private button: HTMLButtonElement;

  constructor(parent: Element) {
    this.parent = parent;
    this.render();
    FontSizeStore.subscribe(this);
  }

  update() {
    this.button.textContent = `${FontSizeStore.state.fontSize}px`;
  }

  render() {
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    button.textContent = `${FontSizeStore.state.fontSize}px`;
    this.wrapper = wrapper;
    this.button = button;

    this.wrapperSetting();
    this.buttonSetting();
    wrapper.appendChild(button);
    this.parent.appendChild(wrapper);
  }

  private wrapperSetting() {
    this.wrapper.style.setProperty("display", "relative");
  }

  private buttonSetting() {
    this.button.style.setProperty("border", "none");
    this.button.style.setProperty("background-color", "blue");
    this.button.addEventListener("click", () => {});
  }

  private fontSizeInput() {}
}
