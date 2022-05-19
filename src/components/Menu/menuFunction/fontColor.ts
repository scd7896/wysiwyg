import { IRootStores } from "../../../wysiwyg";
import { IEditorOptions } from "../../../types";
import { setStyle } from "../../../utils/dom";
import Button from "../../Button";
import SubModal from "../../SubModal/SubModal";

export default class FontColor {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private openButton: HTMLButtonElement;
  private colorPicker: HTMLInputElement;
  private backgroundPicker: HTMLInputElement;
  private root: IRootStores;
  private modal: SubModal;
  private contentsWrapper: HTMLDivElement;
  private applyButton: HTMLButtonElement;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    this.parent = parent;
    this.root = root;

    const wrapper = document.createElement("div");
    this.wrapper = wrapper;
    this.openButton = new Button("menu").button;
    this.openButton.innerHTML = "🔽";
    this.applyButton = new Button("menu").button;
    this.applyButton.innerHTML = "A";

    this.contentsWrapper = document.createElement("div");

    this.modal = new SubModal(this.wrapper, this.contentsWrapper, root);

    const input = document.createElement("input");
    input.type = "color";
    this.colorPicker = input;

    const backgroundInput = document.createElement("input");
    backgroundInput.type = "color";
    this.backgroundPicker = backgroundInput;

    this.wrapper.appendChild(this.applyButton);
    this.wrapper.appendChild(this.openButton);
    this.wrapper.appendChild(this.colorPicker);

    this.parent.appendChild(wrapper);
    this.render();

    this.root.fontColorStore.subscribe(this);
  }

  render() {
    setStyle(this.colorPicker, {
      display: "none",
    });

    setStyle(this.wrapper, {
      display: "flex",
      position: "relative",
      border: "1px solid black",
      margin: "4px",
    });

    setStyle(this.applyButton, {
      "font-size": "24px",
      "font-weight": "500",
      color: this.root.fontColorStore.state.color,
      background: this.root.fontColorStore.state.background,
      "border-right": "1px solid black",
    });

    this.applyButton.addEventListener("click", () => {
      this.root.range.setStyle({
        color: this.root.fontColorStore.state.color,
        background: this.root.fontColorStore.state.background,
      });
    });

    this.colorPicker.addEventListener("change", (e: any) => {
      this.root.fontColorStore.setColor(e.target.value);
    });
    this.backgroundPicker.addEventListener("change", (e: any) => {
      this.root.fontColorStore.setBackgroundColor(e.target.value);
    });

    this.openButton.addEventListener("click", () => {
      this.modal.toggleModal();
    });

    this.renderContents();
  }

  update() {
    setStyle(this.applyButton, {
      color: this.root.fontColorStore.state.color,
      background: this.root.fontColorStore.state.background,
    });
  }

  private renderContents() {
    setStyle(this.contentsWrapper, {
      display: "flex",
    });

    this.contentsWrapper.appendChild(this.renderColorSelectContents("Text"));
    this.contentsWrapper.appendChild(this.renderColorSelectContents("Background"));
  }

  private renderColorSelectContents(type: "Background" | "Text") {
    const wrapper = document.createElement("div");
    setStyle(wrapper, {
      width: "160px",
      padding: "12px",
      "box-sizing": "border-box",
    });
    const text = document.createElement("div");
    text.textContent = `${type} Color`;
    const button = new Button().button;
    button.textContent = "Select";

    button.addEventListener("click", () => {
      if (type === "Text") {
        this.colorPicker.click();
      }

      if (type === "Background") {
        this.backgroundPicker.click();
      }
    });
    wrapper.appendChild(text);
    wrapper.appendChild(button);
    return wrapper;
  }
}
