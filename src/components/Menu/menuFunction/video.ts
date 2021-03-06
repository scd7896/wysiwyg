import { IRootStores } from "../../../wysiwyg";
import VideoStore, { TVideoInsertMode } from "../../../model/VideoStore";
import { IEditorOptions, IVideoOptions } from "../../../types";
import { findElementByType, setStyle } from "../../../utils/dom";
import { getHostName, queryParse } from "../../../utils/string";
import Input from "../../Input";
import Button from "../../Button";
import SubModal from "../../SubModal/SubModal";
import { video } from "../../../icons";

class Video {
  private wrapper: HTMLElement;
  private parent: HTMLElement;
  private modal: SubModal;
  private button: HTMLButtonElement;
  private form: HTMLDivElement;

  private input: HTMLInputElement;
  private options: IVideoOptions;
  private store: VideoStore;
  private root: IRootStores;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    this.root = root;
    this.options = options?.video;
    this.wrapper = document.createElement("div");
    this.parent = parent;
    this.form = document.createElement("div");
    this.modal = new SubModal(this.wrapper, this.form, root);
    this.button = new Button("menu").button;
    this.wrapper.appendChild(this.button);
    this.parent.appendChild(this.wrapper);
    this.store = new VideoStore();
    this.store.subscribe(this);
    this.render();
  }

  update() {
    this.formContentsRender();
  }

  render() {
    setStyle(this.wrapper, { position: "relative" });
    this.button.innerHTML = video;
    this.button.addEventListener("click", () => {
      this.modal.toggleModal();
    });
    this.formContentsRender();
  }

  private formContentsRender() {
    this.form.innerHTML = "";
    this.renderHeaderContents();
    switch (this.store.state.mode) {
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
    this.root.range.insertNodeAndFoucs(wrapper);
    this.modal.closeModal();
  }

  private embeddedYoutube(contents: string) {
    const board = this.parent.parentElement.querySelector(".board");
    const wrapper = document.createElement("div");
    const frameWrapper = document.createElement("div");
    wrapper.dataset.nodeName = "IFRAME";
    setStyle(wrapper, {
      width: `100%`,
      height: `0`,
      "padding-bottom": "56.25%",
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
      "z-index": "100",
    });
    setStyle(frameWrapper, {
      width: "100%",
      height: "100%",
      position: "absolute",
      left: "0",
      top: "0",
    });
    setStyle(iframe, {
      width: `100%`,
      height: `100%`,
      display: "block",
    });
    frameWrapper.appendChild(iframe);
    wrapper.appendChild(clickedDummy);
    wrapper.appendChild(frameWrapper);
    this.root.range.insertNodeAndFoucs(wrapper);
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
    const input = new Input("url");

    section.appendChild(input.wrapper);
    this.input = input.input;
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
        this.store.setMode(type as TVideoInsertMode);
      }
    });
    this.form.appendChild(header);
  }

  private renderFooterContents() {
    const footer = document.createElement("div");
    const submitButton = new Button();
    submitButton.textContent = "insert";

    footer.appendChild(submitButton.button);
    submitButton.button.addEventListener("click", async () => {
      switch (this.store.state.mode) {
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
