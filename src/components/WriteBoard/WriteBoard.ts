import { IComponent } from "../../model/BaseStore";
import { IEditorOptions } from "../../types";
import { setStyle } from "../../utils/dom";
import EventObject from "../../event/Event";

export default class WriteBoard implements IComponent {
  board: HTMLElement;
  private hiddenTextArea: HTMLTextAreaElement;
  private parent: Element;
  private event: EventObject;

  constructor(parent: Element, options: IEditorOptions, event: EventObject) {
    this.parent = parent;
    this.event = event;
    this.render();
    this.board.innerHTML = options?.defaultValue || "";
    this.event.on("board:setHTML", this.setHTML.bind(this));
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

  private setHTML(nextHTML: string, isHistoryPush?: boolean) {
    this.board.innerHTML = nextHTML;
    this.afterBoardChange(isHistoryPush);
  }

  private textAreaSetting() {
    this.hiddenTextArea.style.display = "none";
  }

  private boardSetting() {
    setStyle(this.board, {
      width: "100%",
      padding: "24px",
      "box-sizing": "border-box",
    });
    this.board.contentEditable = "true";
    this.board.classList.add("board");
    this.createDummyDiv();

    this.board.addEventListener("click", (e) => {
      this.event.emit("board:click", e);
    });
    this.board.addEventListener("keydown", (e: KeyboardEvent) => {
      this.event.emit("board:key", e);
      if (e.ctrlKey || e.metaKey) return;

      this.afterBoardChange(true);
    });
  }

  private afterBoardChange(isHistoryPush?: boolean) {
    this.hiddenTextArea.value = this.board.innerHTML;

    const result: string[] = [];
    this.board.childNodes.forEach((child: HTMLElement) => {
      result.push(child.outerHTML);
    });
    if (isHistoryPush) this.event.emit("history:setNextChild", result, true);

    if (
      this.board.childNodes.length === 0 ||
      (this.board.childNodes.length <= 1 && this.board.childNodes.item(0).nodeName === "BR")
    ) {
      this.createDummyDiv();
    }
    setTimeout(() => {
      this.event.emit("text:change", this.board.innerHTML);
    }, 10);
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
}
