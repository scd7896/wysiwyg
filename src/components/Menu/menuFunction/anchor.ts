import { IRootStores } from "../../..";
import { link } from "../../../icons";
import { IEditorOptions } from "../../../types";
import Button from "../../Button";
import Input from "../../Input";
import SubModal from "../../SubModal/SubModal";

export default class Anchor {
  private modal: SubModal;
  private wrapper: HTMLElement;
  private inputForm: HTMLDivElement;
  private button: HTMLButtonElement;
  private root: IRootStores;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    this.wrapper = document.createElement("div");
    this.root = root;
    this.inputForm = document.createElement("div");
    this.button = new Button("menu").button;
    this.button.innerHTML = link;
    this.modal = new SubModal(this.wrapper, this.inputForm, this.root);

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
    const { button } = new Button();
    button.textContent = "Insert";
    button.addEventListener("click", () => {
      const instance = this.root.range;
      const atag = document.createElement("a");
      atag.href = urlInput.value;
      if (instance.type !== "Range") atag.textContent = textInput.value;

      instance.setStyle({}, atag);

      urlInput.value = "";
      textInput.value = "";
      this.modal.closeModal();
    });

    this.inputForm.appendChild(urlInput.wrapper);
    this.inputForm.appendChild(textInput.wrapper);
    this.inputForm.appendChild(button);
  }
}
