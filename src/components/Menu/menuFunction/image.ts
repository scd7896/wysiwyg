import { WYSIWYG } from "../../..";
import { ImageStore, RangeSingleton } from "../../../model";
import { IComponent } from "../../../model/BaseStore";
import { IEditorOptions, IImageOptions } from "../../../types";
import { findElementByType, setStyle } from "../../../utils/dom";
import SubModal from "../../SubModal/SubModal";

export default class Image implements IComponent {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private toggleButton: HTMLButtonElement;
  private imageForm: HTMLDivElement;
  private headerNav: HTMLDivElement;
  private footerNav: HTMLDivElement;
  private formBody: HTMLDivElement;
  private urlInput: HTMLInputElement;
  private imageOptions?: IImageOptions;
  private modal: SubModal;
  private store: ImageStore;
  private root: WYSIWYG

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: WYSIWYG) {
    this.imageOptions = options?.image;
    this.parent = parent;
    this.root = root;
    this.wrapper = document.createElement("div");
    this.toggleButton = document.createElement("button");
    this.imageForm = document.createElement("div");
    this.headerNav = document.createElement("div");
    ["file", "url"].map((type) => {
      const button = document.createElement("button");
      button.textContent = type;
      this.headerNav.appendChild(button);
      button.type = "button";
      button.dataset.type = "type";
      button.dataset.value = type;
    });

    this.formBody = document.createElement("div");
    this.store = new ImageStore();

    this.footerNav = document.createElement("div");
    const submitButton = document.createElement("button");
    submitButton.textContent = "insert";
    submitButton.type = "submit";
    this.footerNav.appendChild(submitButton);
    this.imageForm.appendChild(this.headerNav);
    this.imageForm.appendChild(this.formBody);
    this.imageForm.appendChild(this.footerNav);

    this.wrapper.appendChild(this.toggleButton);
    this.modal = new SubModal(this.wrapper, this.imageForm, root);

    this.parent.appendChild(this.wrapper);
    
    this.render();
    this.store.subscribe(this)
  }

  update() {
    this.renderHeaderNav();
    this.renderFormBody();
    this.renderFooterNav();
  }

  render() {
    setStyle(this.wrapper, {
      position: "relative",
    });

    this.renderHeaderNav();
    this.renderFormBody();
    this.renderFooterNav();

    this.toggleButton.textContent = "image";
    this.toggleButton.addEventListener("click", () => {
      this.modal.toggleModal();
    });

    this.headerNav.addEventListener("click", (e) => {
      const target = findElementByType(e.target as HTMLElement, "type");
      if (target) {
        this.store.setMode(target.dataset.value as any);
      }
    });
  }

  renderHeaderNav() {
    setStyle(this.headerNav, {
      display: "flex",
    });

    this.headerNav.childNodes.forEach((button: HTMLButtonElement) => {
      setStyle(button, {
        width: "40px",
        border: "none",
        "font-size": "24px",
        cursor: "pointer",
      });

      if (this.store.state.mode === button.dataset.value) {
        setStyle(button, {
          "background-color": "#0098f7",
        });
      } else {
        setStyle(button, {
          "background-color": "#aaa",
        });
      }
    });
  }

  renderFooterNav() {
    setStyle(this.footerNav, {
      display: "flex",
      "justify-content": "flex-end",
    });
    const submitButton = this.footerNav.childNodes.item(0) as HTMLButtonElement;
    submitButton.addEventListener("click", () => {
      this.urlInput?.value && this.insertImage(this.urlInput.value);
      this.modal.closeModal();
    });

    setStyle(submitButton, {
      background: "none",
      border: "none",
      color: "#0098f7",
      "font-size": "18px",
      cursor: "pointer",
    });

    if (this.store.state.mode === "file") {
      setStyle(submitButton, {
        display: "none",
      });
    } else {
      setStyle(submitButton, {
        display: "block",
      });
    }
  }

  renderFormBody() {
    const fragment = document.createDocumentFragment();
    this.formBody.innerHTML = "";
    let input = document.createElement("input");
    if (this.store.state.mode === "file") {
      input.type = "file";
      input.name = "file";
      this.urlInput = undefined;
      input.addEventListener("change", async (e: any) => {
        let url = "";
        if (this.imageOptions?.onUploadSingle) {
          url = await this.imageOptions.onUploadSingle(e.target.files[0]);
        } else {
          url = URL.createObjectURL(e.target.files[0]);
        }
        this.insertImage(url);
        this.modal.closeModal();
      });
    } else {
      this.urlInput = input;
      input.type = "text";
      input.name = "url";
    }
    fragment.appendChild(input);
    this.formBody.appendChild(fragment);
  }

  insertImage = (url: string) => {
    this.root.range.insertImage(url);
    this.modal.closeModal();
  };
}
