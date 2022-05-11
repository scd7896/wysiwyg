import { IRootStores } from "../../..";
import { IEditorOptions } from "../../../types";
import { setStyle } from "../../../utils/dom";

export default class FontColor {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private applyButton: HTMLButtonElement;
  private settingButton: HTMLButtonElement;
  private colorPicker: HTMLInputElement;
  private root: IRootStores;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    this.parent = parent;
    this.root = root;

    const wrapper = document.createElement("div");
    this.wrapper = wrapper;
    const applyButton = document.createElement("button");
    this.applyButton = applyButton;
    const settingButton = document.createElement("button");
    this.settingButton = settingButton;

    const input = document.createElement("input");
    input.type = "color";
    this.colorPicker = input;

    this.wrapper.appendChild(applyButton);
    this.wrapper.appendChild(settingButton);
    this.wrapper.appendChild(this.colorPicker);
    this.parent.appendChild(wrapper);

    this.render();
    this.root.fontColorStore.subscribe(this);
  }

  render() {
    setStyle(this.applyButton, {
      width: "40px",
      height: "40px",
      background: this.root.fontColorStore.state.color,
    });

    setStyle(this.colorPicker, {
      display: "none",
    });

    setStyle(this.wrapper, {
      display: "flex",
      "flex-direction": "column",
    });

    this.settingButton.textContent = "pick";
    this.settingButton.addEventListener("click", () => {
      this.colorPicker.click();
    });
    this.colorPicker.addEventListener("change", (e: any) => {
      this.root.fontColorStore.setColor(e.target.value);
    });
    this.applyButton.addEventListener("click", () => {
      this.root.range.setStyle({
        color: this.root.fontColorStore.state.color,
      });
    });
  }

  update() {
    setStyle(this.applyButton, {
      background: this.root.fontColorStore.state.color,
    });
  }
}
