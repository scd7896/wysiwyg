import { RangeSingleton, FontSizeStore } from "../../../model";
import { IComponent } from "../../../model/BaseStore";
import { hasContains, setStyle } from "../../../utils/dom";
import { onSubmit } from "web-form-helper";

export default class FontSize implements IComponent {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private inputWrapper: HTMLFormElement;
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
      window.addEventListener("click", this.inputWrapperClickListener);
    } else {
      this.inputWrapper.style.setProperty("display", "none");
      window.removeEventListener("click", this.inputWrapperClickListener);
    }
  }

  render() {
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    const menuOpenButton = document.createElement("button");
    const inputWrapper = document.createElement("form");

    button.textContent = `${FontSizeStore.state.fontSize}px`;
    menuOpenButton.textContent = "setting";

    this.wrapper = wrapper;
    this.button = button;
    this.menuOpenButton = menuOpenButton;
    this.inputWrapper = inputWrapper;

    this.fontSizeInputSetting();
    this.wrapperSetting();
    this.buttonSetting();
    this.menuOpenButtonSetting();

    wrapper.appendChild(button);
    wrapper.appendChild(menuOpenButton);
    wrapper.appendChild(inputWrapper);
    this.parent.appendChild(wrapper);
  }

  private inputWrapperClickListener = (event: any) => {
    if (FontSizeStore.state.isInputOpen && !hasContains(this.inputWrapper, event.target as HTMLElement)) {
      FontSizeStore.closeInput();
    }
  };

  private wrapperSetting() {
    this.wrapper.style.setProperty("position", "relative");
  }

  private buttonSetting() {
    setStyle(this.button, { border: "1px solid #aaa", padding: "8px 14px", "background-color": "white" });

    this.button.addEventListener("click", () => {
      RangeSingleton.getInstance().fontSet({
        "font-size": `${FontSizeStore.state.fontSize}px`,
      });
    });
  }

  private menuOpenButtonSetting() {
    setStyle(this.menuOpenButton, {
      border: "1px solid #aaa",
      "border-left": "none",
      padding: "8px 2px",
      "background-color": "white",
    });

    this.menuOpenButton.addEventListener("click", () => {
      FontSizeStore.state.isInputOpen ? FontSizeStore.closeInput() : FontSizeStore.openInput();
    });
  }

  private fontSizeInputSetting() {
    setStyle(this.inputWrapper, {
      position: "absolute",
      height: "48px",
      top: "100%",
      left: "0",
      display: "none",
      background: "white",
      padding: "8px",
      "box-shadow": "4px 4px 4px rgba(0,0,0,0.8)",
      "border-radius": "4px",
    });

    const input = document.createElement("input");
    input.type = "number";
    input.name = "inputValue";
    const button = document.createElement("button");
    button.type = "submit";
    this.inputWrapper.addEventListener(
      "submit",
      onSubmit(({ inputValue }) => {
        if (!isNaN(Number(input.value))) FontSizeStore.setFontSize(inputValue);

        FontSizeStore.closeInput();
      }),
    );
    button.textContent = "확인";
    this.inputWrapper.appendChild(input);
    this.inputWrapper.appendChild(button);
  }
}
