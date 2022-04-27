import { onSubmit } from "web-form-helper";
import VideoStore from "../../../model/VideoStore";
import { setStyle } from "../../../utils/dom";
import SubModal from "../../SubModal/SubModal";

class Video {
  private wrapper: HTMLElement;
  private parent: HTMLElement;
  private modal: SubModal;
  private button: HTMLButtonElement;
  private form: HTMLFormElement;

  constructor(parent: HTMLElement, options?: any) {
    this.wrapper = document.createElement("div");
    this.parent = parent;
    this.form = document.createElement("form");
    this.modal = new SubModal(this.wrapper, this.form);
    this.button = document.createElement("button");
    this.wrapper.appendChild(this.button);
    this.parent.appendChild(this.wrapper);
    this.render();
    VideoStore.subscribe(this);
  }

  update() {
    this.form.innerHTML = "";
    switch (VideoStore.state.mode) {
      case "embedCode":
        break;
      case "file":
        break;
      case "url":
        this.renderUrlFormContents();
        break;
    }
  }

  render() {
    setStyle(this.wrapper, { position: "relative" });
    this.button.textContent = "video";
    this.button.addEventListener("click", () => {
      this.modal.toggleModal();
    });

    this.form.addEventListener(
      "submit",
      onSubmit((arg) => {}),
    );
  }

  private renderUrlFormContents() {
    this.renderFooterContents();
  }

  private renderFooterContents() {
    const footer = document.createElement("div");
    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    setStyle(submitButton, {
      background: "none",
      border: "none",
      color: "#0098f7",
      "font-size": "18px",
      cursor: "pointer",
    });
    footer.appendChild(submitButton);
    this.form.appendChild(footer);
  }
}

export default Video;
