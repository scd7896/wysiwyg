import { setStyle } from "../utils/dom";

class Input {
  wrapper: HTMLElement;
  input: HTMLInputElement;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.render();
  }

  render() {
    if (this.wrapper) return this.wrapper;
    const wrapper = document.createElement("div");
    setStyle(wrapper, {
      padding: "8px 0",
    });
    const title = document.createElement("span");
    setStyle(title, {
      display: "block",
      "margin-bottom": "4px",
      "font-size": "24px",
    });
    title.textContent = `${this.name}: `;
    const input = document.createElement("input");
    setStyle(input, { width: "260px", height: "46px" });

    wrapper.appendChild(title);
    wrapper.appendChild(input);

    this.input = input;
    this.wrapper = wrapper;
    return this.wrapper;
  }

  set value(value: string) {
    this.input.value = value;
  }

  get value() {
    return this.input.value;
  }
}

export default Input;
