import { WriteBoard, Menu, Resizer } from "./components";
import EventSingleton from "./event/EventSingleton";
import { ImageResizerStore, RangeSingleton } from "./model";
import HistoryStore from "./model/HistoryStore";
import { findResizeNodeByParentNode, setStyle } from "./utils/dom";

export class WYSIWYG {
  constructor(target: HTMLElement | string, options?: any) {
    const element = typeof target === "string" ? document.querySelector(target) : (target as HTMLElement);
    EventSingleton.getInstance(element as HTMLElement);
    RangeSingleton.getInstance(element as HTMLElement);
    setStyle(element as HTMLElement, {
      "box-sizing": "border-box",
      position: "relative",
    });
    new Menu(element, options);
    new WriteBoard(element);
    new Resizer(element);
    element.addEventListener("click", this.clickEventListener);
  }

  private clickEventListener = (e: any) => {
    const node = findResizeNodeByParentNode(e.target);
    if (node) {
      ImageResizerStore.setSelectedNode(node);
    } else {
      ImageResizerStore.setInitlization();
    }
  };

  insertNode(element: HTMLElement) {
    RangeSingleton.getInstance().insertNodeAndFoucs(element);
  }

  setRangeStyle(style: Record<string, string>) {
    RangeSingleton.getInstance().setStyle(style);
  }

  undo() {
    return HistoryStore.undo();
  }

  redo() {
    return HistoryStore.redo();
  }

  get undoHistory() {
    return HistoryStore.undoHistory;
  }

  get redoHistory() {
    return HistoryStore.redoHistory;
  }
}
