import { WYSIWYG } from "../..";
import { IComponent } from "../../model/BaseStore";
import { IEditorOptions } from "../../types";
import { setStyle } from "../../utils/dom";

export default class WriteBoard implements IComponent {
  private board: HTMLElement;
  private hiddenTextArea: HTMLTextAreaElement;
  private parent: Element;
  private root: WYSIWYG

  constructor(parent: Element, options: IEditorOptions, root: WYSIWYG) {
    this.parent = parent;
    this.root = root;
    this.render();
    this.board.innerHTML = options.defaultValue;
  }

  private textAreaSetting() {
    this.hiddenTextArea.style.display = "none";
  }

  private boardSetting() {
    setStyle(this.board, {
      width: "100%",
      padding: "12px",
      "box-sizing": "border-box",
    });
    this.board.contentEditable = "true";
    this.board.classList.add("board");
    this.board.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "z" || e.key === "Z") {
          e.preventDefault();

          if (e.shiftKey) {
            const child = this.root.history.redo();
            if (child) {
              this.board.innerHTML = child.join("");
            }
          } else {
            const child = this.root.history.undo();
            if (child) {
              this.board.innerHTML = child.join("");
            }
          }
        }
        return;
      }

      const result: string[] = [];
      this.board.childNodes.forEach((child: HTMLElement) => {
        result.push(child.outerHTML);
      });
      this.root.history.setNextChild(result, true);
      this.hiddenTextArea.value = this.board.innerHTML;
      if (
        this.board.childNodes.length === 0 ||
        (this.board.childNodes.length <= 1 && this.board.childNodes.item(0).nodeName === "BR")
      ) {
        this.createDummyDiv();
      }
    });
    this.createDummyDiv();
  }

  private createDummyDiv() {
    const dummyDiv = document.createElement("div");
    const dummyBr = document.createElement("br");
    dummyDiv.appendChild(dummyBr);
    if (this.board.childNodes.length === 0) {
      this.board.appendChild(dummyDiv);
    } else {
      this.board.replaceChild(dummyDiv, this.board.childNodes.item(0));
    }
  }

  getValue() {
    return this.hiddenTextArea.value;
  }

  render() {
    const board = document.createElement("div");
    this.parent.appendChild(board);
    this.board = board;
    this.board.style.setProperty("min-height", "150px");
    this.board.style.border = "1px solid #aeaeae";

    const textArea = document.createElement("textarea");
    this.hiddenTextArea = textArea;
    this.parent.appendChild(this.hiddenTextArea);

    this.textAreaSetting();
    this.boardSetting();
  }
}
