import { IRootStores } from "../../../wysiwyg";
import { FontSizeStore } from "../../../model";
import { IComponent } from "../../../model/BaseStore";
import { IEditorOptions } from "../../../types";
import { setStyle } from "../../../utils/dom";
import Button from "../../Button";
import Input from "../../Input";
import SubModal from "../../SubModal/SubModal";

export default class FontSize implements IComponent {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private inputWrapper: HTMLDivElement;
  private button: HTMLButtonElement;
  private menuOpenButton: HTMLButtonElement;
  private modal: SubModal;
  private store: FontSizeStore;

  private root: IRootStores;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    this.parent = parent;
    this.root = root;
    this.store = new FontSizeStore();
    this.render();
    this.store.subscribe(this);
  }

  update() {
    this.button.textContent = `${this.store.state.fontSize}px`;
  }

  render() {
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    const menuOpenButton = document.createElement("button");

    button.textContent = `${this.store.state.fontSize}px`;
    menuOpenButton.textContent = "setting";

    this.wrapper = wrapper;
    this.button = button;
    this.menuOpenButton = menuOpenButton;
    this.inputWrapper = document.createElement("div");
    this.modal = new SubModal(this.wrapper, this.inputWrapper, this.root);
    this.fontSizeInputSetting();
    this.wrapperSetting();
    this.buttonSetting();
    this.menuOpenButtonSetting();

    wrapper.appendChild(button);
    wrapper.appendChild(menuOpenButton);
    this.parent.appendChild(wrapper);
  }

  private wrapperSetting() {
    setStyle(this.wrapper, {
      position: "relative",
      padding: "4px",
    });
  }

  private buttonSetting() {
    setStyle(this.button, { border: "1px solid #aaa", padding: "8px 14px", "background-color": "white" });

    this.button.addEventListener("click", () => {
      this.root.range.setStyle({
        "font-size": `${this.store.state.fontSize}px`,
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
    const input = new Input("size");
    input.input.defaultValue = this.store.state.fontSize.toString();
    const { button } = new Button();

    button.addEventListener("click", () => {
      if (!isNaN(Number(input.value))) {
        this.store.setStyleSize(Number(input.value));
      }
      this.modal.closeModal();
    });
    button.textContent = "OK";
    this.inputWrapper.appendChild(input.wrapper);
    this.inputWrapper.appendChild(button);
  }
}
