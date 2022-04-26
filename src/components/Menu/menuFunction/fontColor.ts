import { FontColorStore, RangeSingleton } from "../../../model";
import { setStyle } from "../../../utils/dom";

export default class FontColor {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private applyButton: HTMLButtonElement;
  private settingButton: HTMLButtonElement;
  private colorPicker: HTMLInputElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;

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
    FontColorStore.subscribe(this);
  }

  render() {
    setStyle(this.applyButton, {
      width: "40px",
      height: "40px",
      background: FontColorStore.state.color,
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
      FontColorStore.setColor(e.target.value);
    });
    this.applyButton.addEventListener("click", () => {
      RangeSingleton.getInstance().setStyle({
        color: FontColorStore.state.color,
      });
    });
  }

  update() {
    setStyle(this.applyButton, {
      background: FontColorStore.state.color,
    });
  }
}
