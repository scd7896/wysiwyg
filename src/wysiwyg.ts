import { WriteBoard, Menu } from "./components";
import BoardFunction from "./components/WriteBoard/boardFunctions";
import EventObject from "./event/Event";
import { FontColorStore, RangeSingleton } from "./model";
import HistoryStore from "./model/HistoryStore";
import { IEditorOptions } from "./types";
import { findIsWriteBoardFunction, setStyle } from "./utils/dom";

export interface IRootStores {
  event: EventObject;
  range: RangeSingleton;
  history: HistoryStore;
  fontColorStore: FontColorStore;
}

export class WYSIWYG {
  private root: HTMLElement;
  private options?: IEditorOptions;
  private stores: IRootStores;
  private event: EventObject;
  board: HTMLElement;

  constructor(target: HTMLElement | string, options?: IEditorOptions) {
    const element = typeof target === "string" ? document.querySelector(target) : (target as HTMLElement);
    if (!element) throw new Error("element is Not Defined");
    const event = new EventObject();
    this.event = event;
    this.stores = {
      event,
      history: new HistoryStore(event),
      range: new RangeSingleton(element as HTMLElement, event),
      fontColorStore: new FontColorStore(),
    };

    this.options = options;

    setStyle(element as HTMLElement, {
      "box-sizing": "border-box",
      position: "relative",
    });
    this.root = element as HTMLElement;
    this.render();
  }

  private render() {
    new Menu(this.root, this.options, this.stores);
    const writeBoard = new WriteBoard(this.root, this.options, this.event);
    new BoardFunction(this.root, this.event);
    this.board = writeBoard.board;
  }

  insertNode(element: HTMLElement) {
    this.stores.range.insertNodeAndFoucs(element);
  }

  setRangeStyle(style: Record<string, string>) {
    this.stores.range.setStyle(style);
  }

  undo() {
    const result = this.stores.history.undo();
    if (result) {
      const board = this.root.querySelector(".board");
      board.innerHTML = result.join("");
    }
  }

  redo() {
    const result = this.stores.history.redo();
    if (result) {
      const board = this.root.querySelector(".board");
      board.innerHTML = result.join("");
    }
  }

  on(type: string, listener: Function) {
    this.event.on(type, listener);
  }

  emit(type: string, ...value: any[]) {
    this.event.emit(type, ...value);
  }

  removeListener(type: string, listener: Function) {
    this.event.removeListener(type, listener);
  }

  get undoHistory() {
    return this.stores.history.undoHistory;
  }

  get redoHistory() {
    return this.stores.history.redoHistory;
  }
}
