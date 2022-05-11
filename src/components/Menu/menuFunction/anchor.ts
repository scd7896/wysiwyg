import { RangeSingleton } from "../../../model";
import Input from "../../Input";
import SubModal from "../../SubModal/SubModal";

export default class Anchor {
  private modal: SubModal;
  private wrapper: HTMLElement;
  private inputForm: HTMLDivElement;
  private button: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    this.wrapper = document.createElement("div");
    this.inputForm = document.createElement("div");
    this.button = document.createElement("button");
    this.button.textContent = "anchor";
    this.modal = new SubModal(this.wrapper, this.inputForm);

    this.wrapper.appendChild(this.button);
    parent.appendChild(this.wrapper);
    this.render();
  }

  render() {
    this.button.addEventListener("click", () => {
      this.modal.toggleModal();
    });

    this.renderForm();
  }

  update() {}

  private renderForm() {
    const urlInput = new Input("url");
    const textInput = new Input("text");
    const button = document.createElement("button");
    button.textContent = "Insert";
    button.addEventListener("click", () => {
      const instance = RangeSingleton.getInstance();
      const atag = document.createElement("a");
      atag.href = urlInput.value;
      if (instance.type !== "Range") atag.textContent = textInput.value;

      instance.setStyle({}, atag);

      urlInput.value = "";
      textInput.value = "";
      this.modal.closeModal();
    });

    this.inputForm.appendChild(urlInput.render());
    this.inputForm.appendChild(textInput.render());
    this.inputForm.appendChild(button);
  }
}
