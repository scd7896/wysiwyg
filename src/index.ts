import { WriteBoard, Menu, ImageResizer } from "./components";
import EventSingleton from "./event/EventSingleton";
import { ImageResizerStore, RangeSingleton } from "./model";
import { findImageByParentNode, setStyle } from "./utils/dom";

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
    new ImageResizer(element);
    element.addEventListener("click", this.clickEventListener);
  }

  private clickEventListener = (e: any) => {
    const img = findImageByParentNode(e.target);
    if (img) {
      ImageResizerStore.setSelectedImage(img as HTMLImageElement);
    } else {
      ImageResizerStore.setInitlization();
    }
  };
}
