import { IComponent } from "../../../model/BaseStore";
import FontSizeStore from "../../../model/FontSizeStore";

export default class FontSize implements IComponent {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private inputWrapper: HTMLDivElement;
  private button: HTMLButtonElement;
  private menuOpenButton: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.render();
    FontSizeStore.subscribe(this);
  }

  update() {
    this.button.textContent = `${FontSizeStore.state.fontSize}px`;
    if (FontSizeStore.state.isInputOpen) {
      this.inputWrapper.style.setProperty("display", "block");
    } else {
      this.inputWrapper.style.setProperty("display", "none");
    }
  }

  render() {
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    const menuOpenButton = document.createElement("button");
    const inputWrapper = document.createElement("div");

    button.textContent = `${FontSizeStore.state.fontSize}px`;
    menuOpenButton.textContent = "setting";

    this.wrapper = wrapper;
    this.button = button;
    this.menuOpenButton = menuOpenButton;
    this.inputWrapper = inputWrapper;

    this.wrapperSetting();
    this.buttonSetting();
    this.menuOpenButtonSetting();

    wrapper.appendChild(button);
    wrapper.appendChild(menuOpenButton);
    wrapper.appendChild(inputWrapper);
    this.parent.appendChild(wrapper);
  }

  private wrapperSetting() {
    this.wrapper.style.setProperty("display", "relative");
  }

  private fontSpanCreating() {
    const span = document.createElement("span");
    span.style.setProperty("font-size", `${FontSizeStore.state.fontSize + 20}px`);

    return span;
  }

  private buttonSetting() {
    this.button.style.setProperty("border", "1px solid #aaa");
    this.button.style.setProperty("padding", "8px 14px");
    this.button.style.setProperty("background-color", "white");
    this.button.addEventListener("click", () => {
      const selection = window.getSelection();

      if (selection.type === "Range") {
      }
      if (selection.type === "Caret") {
        const span = this.fontSpanCreating();
        span.innerHTML = "&nbsp;";

        const range = selection.getRangeAt(0);
        range.insertNode(span);
        this.parent.focus();
        const newRange = document.createRange();
        newRange.selectNode(span);
        const newSelection = window.getSelection();
        newSelection.removeAllRanges();
        newSelection.addRange(newRange);
      }
    });
  }

  private menuOpenButtonSetting() {
    this.menuOpenButton.style.setProperty("border", "1px solid #aaa");
    this.menuOpenButton.style.setProperty("border-left", "none");
    this.menuOpenButton.style.setProperty("padding", "8px 2px");
    this.menuOpenButton.style.setProperty("background-color", "white");

    this.menuOpenButton.addEventListener("click", () => {
      FontSizeStore.state.isInputOpen ? FontSizeStore.closeInput() : FontSizeStore.openInput();
    });
  }

  private fontSizeInput() {}
}
