import { setStyle } from "../utils/dom";

class Input {
  private name: string;
  private wrapper: HTMLElement;
  private input: HTMLInputElement;

  constructor(name: string) {
    this.name = name;
  }

  render() {
    if (this.wrapper) return this.wrapper;
    const wrapper = document.createElement("div");
    const title = document.createElement("span");
    title.textContent = `${this.name}: `;
    const input = document.createElement("input");
    setStyle(input, { "margin-left": "4px" });

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
