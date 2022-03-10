import { WriteBoard, Menu } from "./components";
import { RangeSingleton } from "./model";

export class WYSIWYG {
  constructor(target: HTMLElement | string, options?: any) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    RangeSingleton.getIndex(element);
    new Menu(element);
    new WriteBoard(element);
  }
}
