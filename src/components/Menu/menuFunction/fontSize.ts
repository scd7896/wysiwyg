import { RangeSingleton, FontSizeStore } from "../../../model";
import { IComponent } from "../../../model/BaseStore";
import { setStyle } from "../../../utils/dom";
import SubModal from "../../SubModal/SubModal";

export default class FontSize implements IComponent {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private inputWrapper: HTMLDivElement;
  private button: HTMLButtonElement;
  private menuOpenButton: HTMLButtonElement;
  private modal: SubModal;

  constructor(parent: HTMLElement) {
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
    const menuOpenButton = document.createElement("button");

    button.textContent = `${FontSizeStore.state.fontSize}px`;
    menuOpenButton.textContent = "setting";

    this.wrapper = wrapper;
    this.button = button;
    this.menuOpenButton = menuOpenButton;
    this.inputWrapper = document.createElement("div");
    this.modal = new SubModal(this.wrapper, this.inputWrapper);
    this.fontSizeInputSetting();
    this.wrapperSetting();
    this.buttonSetting();
    this.menuOpenButtonSetting();

    wrapper.appendChild(button);
    wrapper.appendChild(menuOpenButton);
    this.parent.appendChild(wrapper);
  }

  private wrapperSetting() {
    this.wrapper.style.setProperty("position", "relative");
  }

  private buttonSetting() {
    setStyle(this.button, { border: "1px solid #aaa", padding: "8px 14px", "background-color": "white" });

    this.button.addEventListener("click", () => {
      RangeSingleton.getInstance().setStyle({
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
      this.modal.toggleModal();
    });
  }

  private fontSizeInputSetting() {
    const input = document.createElement("input");
    input.type = "number";
    input.name = "inputValue";
    input.defaultValue = FontSizeStore.state.fontSize.toString();
    const button = document.createElement("button");
    button.type = "submit";
    button.addEventListener("click", () => {
      if (!isNaN(Number(input.value))) {
        FontSizeStore.setStyleSize(Number(input.value));
      }
      this.modal.closeModal();
    });
    button.textContent = "submit";
    this.inputWrapper.appendChild(input);
    this.inputWrapper.appendChild(button);
  }
}
