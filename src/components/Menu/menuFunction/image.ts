import { ImageStore, RangeSingleton } from "../../../model";
import { IComponent } from "../../../model/BaseStore";
import { findByTypeElement, setStyle } from "../../../utils/dom";

export default class Image implements IComponent {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private toggleButton: HTMLButtonElement;
  private imageForm: HTMLFormElement;
  private headerNav: HTMLDivElement;
  private footerNav: HTMLDivElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.wrapper = document.createElement("div");
    this.toggleButton = document.createElement("button");
    this.imageForm = document.createElement("form");
    this.headerNav = document.createElement("div");
    ["file", "url"].map((type) => {
      const button = document.createElement("button");
      button.textContent = type;
      this.headerNav.appendChild(button);
      button.type = "button";
      button.dataset.type = "type";
      button.dataset.value = type;
    });

    this.footerNav = document.createElement("div");
    const submitButton = document.createElement("button");
    submitButton.textContent = "insert";
    submitButton.type = "submit";
    this.footerNav.appendChild(submitButton);

    this.imageForm.appendChild(this.headerNav);
    this.imageForm.appendChild(this.footerNav);

    this.wrapper.appendChild(this.toggleButton);
    this.wrapper.appendChild(this.imageForm);

    this.parent.appendChild(this.wrapper);
    this.render();
    ImageStore.subscribe(this);
  }

  update() {
    if (ImageStore.state.isMenuOpen) {
      setStyle(this.imageForm, {
        display: "block",
      });
      RangeSingleton.getInstance().tmpSave();
    } else {
      setStyle(this.imageForm, {
        display: "none",
      });
      RangeSingleton.getInstance().initializeTmp();
    }
    this.renderHeaderNav();
    this.renderFooterNav();
  }

  render() {
    setStyle(this.wrapper, {
      position: "relative",
    });

    setStyle(this.imageForm, {
      display: "none",
      position: "absolute",
      left: "0",
      top: "100%",
      padding: "12px",
      width: "350px",
      "border-radius": "8px",
      "box-shadow": "4px 4px 4px rgba(0,0,0,0.5)",
      "background-color": "#fff",
    });

    this.renderHeaderNav();
    this.renderFooterNav();

    this.toggleButton.textContent = "image";
    this.toggleButton.addEventListener("click", () => {
      ImageStore.toggleMenu();
    });

    this.headerNav.addEventListener("click", (e) => {
      const target = findByTypeElement(e.target as HTMLElement, "type");
      if (target) {
        ImageStore.setMode(target.dataset.value as any);
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

      if (ImageStore.state.mode === button.dataset.value) {
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

    setStyle(submitButton, {
      background: "none",
      border: "none",
      color: "#0098f7",
      "font-size": "18px",
      cursor: "pointer",
    });

    if (ImageStore.state.mode === "file") {
      setStyle(submitButton, {
        display: "none",
      });
    } else {
      setStyle(submitButton, {
        display: "block",
      });
    }
  }
}
