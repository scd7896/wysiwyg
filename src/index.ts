import { WriteBoard, Menu, Resizer } from "./components";
import EventObject from "./event/Event";
import { FontColorStore, ImageResizerStore, RangeSingleton } from "./model";
import HistoryStore from "./model/HistoryStore";
import { IEditorOptions } from "./types";
import { findResizeNodeByParentNode, setStyle } from "./utils/dom";

export class WYSIWYG {
  root: HTMLElement;
  event: EventObject;
  range: RangeSingleton
  history: HistoryStore;
  imageResizeStore: ImageResizerStore;
  fontColorStore: FontColorStore;
  options?: IEditorOptions;

  constructor(target: HTMLElement | string, options?: IEditorOptions) {
    const element = typeof target === "string" ? document.querySelector(target) : (target as HTMLElement);
    this.event = new EventObject(element as HTMLElement);
    this.range = new RangeSingleton(element as HTMLElement);
    this.history = new HistoryStore();
    this.imageResizeStore = new ImageResizerStore();
    this.fontColorStore = new FontColorStore();
    
    this.options = options

    setStyle(element as HTMLElement, {
      "box-sizing": "border-box",
      position: "relative",
    });
    this.root = element as HTMLElement;
    this.render();
  }

  private render() {
    new Menu(this.root, this.options, this);
    new WriteBoard(this.root, this.options, this);
    new Resizer(this.root, this);
    
    this.root.addEventListener("click", this.clickEventListener);
  }

  private clickEventListener = (e: any) => {
    const node = findResizeNodeByParentNode(e.target);
    if (node) {
      this.imageResizeStore.setSelectedNode(node);
    } else {
      this.imageResizeStore.setInitlization();
    }
  };

  insertNode(element: HTMLElement) {
    this.range.insertNodeAndFoucs(element);
  }

  setRangeStyle(style: Record<string, string>) {
    this.range.setStyle(style);
  }

  undo() {
    const result = this.history.undo();
    if (result) {
      const board = this.root.querySelector(".board");
      board.innerHTML = result.join("");
    }
  }

  redo() {
    const result = this.history.redo();
    if (result) {
      const board = this.root.querySelector(".board");
      board.innerHTML = result.join("");
    }
  }

  get undoHistory() {
    return this.history.undoHistory;
  }

  get redoHistory() {
    return this.history.redoHistory;
  }
}
