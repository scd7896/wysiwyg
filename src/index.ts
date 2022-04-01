import { WriteBoard, Menu, ImageResizer } from "./components";
import { RangeSingleton } from "./model";
import { setStyle } from "./utils/dom";

export class WYSIWYG {
  constructor(target: HTMLElement | string, options?: any) {
    const element = typeof target === "string" ? document.querySelector(target) : target;
    RangeSingleton.getInstance(element as HTMLElement);
    setStyle(element as HTMLElement, {
      "box-sizing": "border-box",
      position: "relative",
    });
    new Menu(element);
    new WriteBoard(element);
    new ImageResizer(element);
  }
}
