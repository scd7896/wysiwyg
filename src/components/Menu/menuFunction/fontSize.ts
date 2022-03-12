import { RangeSingleton } from "../../../model";
import { IComponent } from "../../../model/BaseStore";
import FontSizeStore from "../../../model/FontSizeStore";
import { hasContains } from "../../../utils/dom";
import { setStyle } from "../../../utils/element";

export default class FontSize implements IComponent {
  private parent: HTMLElement;
  private wrapper: HTMLDivElement;
  private inputWrapper: HTMLDivElement;
  private button: HTMLButtonElement;
  private menuOpenButton: HTMLButtonElement;

  constructor(parent: HTMLElement) {
    this.parent = parent;
    this.render();
    FontSizeStore.subscribe(this);
  }

  update() {
    this.button.textContent = `${FontSizeStore.state.fontSize}px`;
    if (FontSizeStore.state.isInputOpen) {
      this.inputWrapper.style.setProperty("display", "block");
      window.addEventListener("click", this.inputWrapperClickListener);
    } else {
      this.inputWrapper.style.setProperty("display", "none");
      window.removeEventListener("click", this.inputWrapperClickListener);
    }
  }

  inputWrapperClickListener = (event: any) => {
    if (FontSizeStore.state.isInputOpen && !hasContains(this.inputWrapper, event.target as HTMLElement)) {
      FontSizeStore.closeInput();
    }
  };

  render() {
    const wrapper = document.createElement("div");
    const button = document.createElement("button");
    const menuOpenButton = document.createElement("button");
    const inputWrapper = document.createElement("div");

    button.textContent = `${FontSizeStore.state.fontSize}px`;
    menuOpenButton.textContent = "setting";

    this.wrapper = wrapper;
    this.button = button;
    this.menuOpenButton = menuOpenButton;
    this.inputWrapper = inputWrapper;

    this.fontSizeInput();
    this.wrapperSetting();
    this.buttonSetting();
    this.menuOpenButtonSetting();

    wrapper.appendChild(button);
    wrapper.appendChild(menuOpenButton);
    wrapper.appendChild(inputWrapper);
    this.parent.appendChild(wrapper);
  }

  private wrapperSetting() {
    this.wrapper.style.setProperty("position", "relative");
  }

  private caretEventListener() {
    const span = document.createElement("span");
    span.style.setProperty("font-size", `${FontSizeStore.state.fontSize}px`);
    span.innerHTML = "&nbsp;";
    RangeSingleton.getInstance().insertNodeAndFoucs(span);
  }

  private rangeEventListener() {
    const range = RangeSingleton.getInstance().range;
    const documents = range.extractContents();
    range.insertNode(this.findText(documents));
  }

  private findText(node: any) {
    if (node.nodeName === "#text") {
      const span = document.createElement("span");
      span.style.setProperty("font-size", `${FontSizeStore.state.fontSize}px`);
      span.textContent = node.textContent;
      return span;
    }

    node.childNodes.forEach((child: any) => node.replaceChild(this.findText(child), child));
    return node;
  }

  private rangeFontSizeSetting(node: any) {
    if (node.nodeName === "#text") {
      const span = document.createElement("span");
      setStyle(span, { "font-size": `${FontSizeStore.state.fontSize}px` });

      const cloneNode = node.cloneNode(true);
      span.appendChild(cloneNode);
      node.parentElement.replaceChild(span, node);
      return;
    }

    if (node.nodeName === "SPAN") {
      setStyle(node, { "font-size": `${FontSizeStore.state.fontSize}px` });
      return;
    }

    node.childNodes.forEach((child: any) => this.rangeFontSizeSetting(child));
  }

  private buttonSetting() {
    setStyle(this.button, { border: "1px solid #aaa", padding: "8px 14px", "background-color": "white" });

    this.button.addEventListener("click", () => {
      if (RangeSingleton.getInstance().type === "Range") {
        this.rangeEventListener();
      }
      if (RangeSingleton.getInstance().type === "Caret") {
        this.caretEventListener();
      }
    });
  }

  private menuOpenButtonSetting() {
    setStyle(this.menuOpenButton, {
      border: "1px solid #aaa",
      "border-left": "none",
      padding: "8px 2px",
      "background-color": "white",
    });

    this.menuOpenButton.addEventListener("click", () => {
      FontSizeStore.state.isInputOpen ? FontSizeStore.closeInput() : FontSizeStore.openInput();
    });
  }

  private fontSizeInput() {
    setStyle(this.inputWrapper, {
      position: "absolute",
      height: "48px",
      top: "100%",
      left: "0",
      display: "none",
      background: "white",
      padding: "8px",
      "box-shadow": "4px 4px 4px rgba(0,0,0,0.8)",
      "border-radius": "4px",
    });

    const input = document.createElement("input");
    input.type = "number";
    const button = document.createElement("button");
    button.addEventListener("click", () => {
      if (!isNaN(Number(input.value))) FontSizeStore.setFontSize(Number(input.value));

      if (RangeSingleton.getInstance().selection.type === "Range") {
        this.rangeEventListener();
      } else {
        this.caretEventListener();
      }
      FontSizeStore.closeInput();
    });
    button.textContent = "확인";
    this.inputWrapper.appendChild(input);
    this.inputWrapper.appendChild(button);
  }
}
