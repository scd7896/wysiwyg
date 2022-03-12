import { WriteBoard, Menu } from "./components";
import { RangeSingleton } from "./model";

export class WYSIWYG {
  constructor(target: HTMLElement | string, options?: any) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    RangeSingleton.getInstance(element as HTMLElement);
    new Menu(element);
    new WriteBoard(element);
  }
}
