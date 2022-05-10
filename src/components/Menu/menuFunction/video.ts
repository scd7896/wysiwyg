import { RangeSingleton } from "../../../model";
import VideoStore, { TVideoInsertMode } from "../../../model/VideoStore";
import { IEditorOptions, IVideoOptions } from "../../../types";
import { findElementByType, setStyle } from "../../../utils/dom";
import { getHostName, queryParse } from "../../../utils/string";
import SubModal from "../../SubModal/SubModal";

class Video {
  private wrapper: HTMLElement;
  private parent: HTMLElement;
  private modal: SubModal;
  private button: HTMLButtonElement;
  private form: HTMLDivElement;

  private input: HTMLInputElement;
  private options: IVideoOptions;

  constructor(parent: HTMLElement, options?: IEditorOptions) {
    this.options = options.video;
    this.wrapper = document.createElement("div");
    this.parent = parent;
    this.form = document.createElement("div");
    this.modal = new SubModal(this.wrapper, this.form);
    this.button = document.createElement("button");
    this.wrapper.appendChild(this.button);
    this.parent.appendChild(this.wrapper);
    this.render();
    VideoStore.subscribe(this);
  }

  update() {
    this.formContentsRender();
  }

  render() {
    setStyle(this.wrapper, { position: "relative" });
    this.button.textContent = "video";
    this.button.addEventListener("click", () => {
      this.modal.toggleModal();
    });
    this.formContentsRender();
  }

  private formContentsRender() {
    this.form.innerHTML = "";
    this.renderHeaderContents();
    switch (VideoStore.state.mode) {
      case "embedCode":
        break;
      case "file":
        this.renderFileFormContents();
        break;
      case "url":
        this.renderUrlFormContents();
        break;
    }
    this.renderFooterContents();
  }
  private embeddedVideo(url: string) {
    const board = this.parent.parentElement.querySelector(".board");
    const wrapper = document.createElement("div");
    wrapper.dataset.nodeName = "IFRAME";
    setStyle(wrapper, {
      width: `${board.clientWidth - 24}px`,
      height: `${((board.clientWidth - 24) / 16) * 9}px`,
      position: "relative",
    });
    const video = document.createElement("video");
    video.src = url;
    video.controls = true;
    setStyle(video, {
      width: `100%`,
      height: `100%`,
      display: "block",
    });

    wrapper.appendChild(video);
    RangeSingleton.getInstance().insertNodeAndFoucs(wrapper);
    this.modal.closeModal();
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
    this.modal.closeModal();
  }

  private renderFileFormContents() {
    const section = document.createElement("div");
    setStyle(section, {
      padding: "8px",
    });
    const span = document.createElement("span");
    span.textContent = "file";
    const input = document.createElement("input");
    input.name = "file";
    input.type = "file";
    setStyle(input, {
      width: "260px",
      height: "46px",
    });
    section.appendChild(span);
    section.appendChild(input);
    this.input = input;
    this.form.appendChild(section);
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
    this.input = input;
    this.form.appendChild(section);
  }

  private renderHeaderContents() {
    const header = document.createElement("div");
    const buttons = ["url", "file"].map((type) => {
      const button = document.createElement("button");
      button.textContent = type;
      button.dataset.type = "type";
      button.dataset.value = type;
      return button;
    });
    buttons.map((button) => header.appendChild(button));
    header.addEventListener("click", (e: any) => {
      const target = findElementByType(e.target, "type");
      if (target) {
        const type = target.dataset.value;
        VideoStore.setMode(type as TVideoInsertMode);
      }
    });
    this.form.appendChild(header);
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
    submitButton.addEventListener("click", async () => {
      switch (VideoStore.state.mode) {
        case "url":
          const hostName = getHostName(this.input.value);
          if (hostName === "youtu.be") {
            const contents = this.input.value.split("/").pop();
            this.embeddedYoutube(contents);
          }
          if (hostName === "www.youtube.com") {
            const contents = queryParse(this.input.value).v;
            this.embeddedYoutube(contents);
          }
        case "file":
          let url = "";
          if (this.options?.onUpload) {
            url = await this.options?.onUpload(this.input.files[0]);
          } else {
            url = URL.createObjectURL(this.input.files[0]);
          }
          this.embeddedVideo(url);
      }
    });

    this.form.appendChild(footer);
  }
}

export default Video;
