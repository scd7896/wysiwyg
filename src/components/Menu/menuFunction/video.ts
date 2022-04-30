import { onSubmit } from "web-form-helper";
import { RangeSingleton } from "../../../model";
import VideoStore from "../../../model/VideoStore";
import { setStyle } from "../../../utils/dom";
import { getHostName } from "../../../utils/string";
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
      onSubmit((arg: any) => {
        switch (VideoStore.state.mode) {
          case "url":
            const hostName = getHostName(arg.url);
            console.log(hostName);
            if (hostName === "youtu.be") {
              const contents = arg.url.split("/").pop();
              this.embeddedYoutube(contents);
            }
        }
      }),
    );

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

  private embeddedYoutube(contents: string) {
    const board = this.parent.parentElement.querySelector(".board");
    const wrapper = document.createElement("div");
    wrapper.dataset.nodeName = "IFRAME";
    setStyle(wrapper, {
      width: `${board.clientWidth - 24}px`,
      height: `${((board.clientWidth - 24) / 16) * 9}px`,
      position: "relative",
    });
    const iframe = document.createElement("iframe");
    iframe.src = `https://youtube.com/embed/${contents}`;
    const clickedDummy = document.createElement("div");
    setStyle(clickedDummy, {
      width: "100%",
      height: "100%",
      position: "absolute",
      left: "0",
      top: "0",
      cursor: "pointer",
    });
    setStyle(iframe, {
      width: `100%`,
      height: `100%`,
      display: "block",
    });
    wrapper.appendChild(clickedDummy);
    wrapper.appendChild(iframe);
    RangeSingleton.getInstance().insertNodeAndFoucs(wrapper);
  }

  private renderUrlFormContents() {
    const section = document.createElement("div");
    setStyle(section, {
      padding: "8px",
    });
    const span = document.createElement("span");
    span.textContent = "url";
    const input = document.createElement("input");
    input.name = "url";
    setStyle(input, {
      width: "260px",
      height: "46px",
    });
    section.appendChild(span);
    section.appendChild(input);
    this.form.appendChild(section);
    this.renderFooterContents();
  }

  private renderFooterContents() {
    const footer = document.createElement("div");
    const submitButton = document.createElement("button");
    submitButton.textContent = "insert";
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
