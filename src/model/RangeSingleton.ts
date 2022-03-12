import { setStyle } from "../utils/element";

class RangeSingleton {
  selection: Selection;
  type: string;
  range: Range;
  parent: HTMLElement;

  private static instance: RangeSingleton;
  private constructor(parent?: HTMLElement) {
    this.parent = parent;
    document.addEventListener("selectionchange", () => {
      this.selection = document.getSelection();
      this.type = this.selection.type;
      this.range = this.selection.getRangeAt(0);
    });
  }

  static getInstance(parent?: HTMLElement) {
    if (this.instance) return this.instance;
    this.instance = new this(parent);
    return this.instance;
  }

  fontSet(styles: Record<string, string>) {
    if (this.type === "Range") {
      this.rangeEventListener(styles);
    }
    if (this.type === "Caret") {
      this.caretEventListener(styles);
    }
  }

  private insertNodeAndFoucs(node: HTMLElement) {
    this.range.insertNode(node);
    this.parent.focus();
    const newRange = document.createRange();
    newRange.selectNode(node);
    const newSelection = window.getSelection();
    newSelection.removeAllRanges();
    newSelection.addRange(newRange);
  }

  private caretEventListener(styles: Record<string, string>) {
    const span = document.createElement("span");
    setStyle(span, styles);
    span.innerHTML = "&nbsp;";
    RangeSingleton.getInstance().insertNodeAndFoucs(span);
  }

  private rangeEventListener(styles: Record<string, string>) {
    const documents = this.range.extractContents();
    this.range.insertNode(this.changeText(documents, styles));
  }

  private changeText(node: any, style: Record<string, string>) {
    if (node.nodeName === "#text") {
      const span = document.createElement("span");
      setStyle(span, style);
      span.textContent = node.textContent;
      return span;
    }

    if (node.nodeName === "SPAN") {
      setStyle(node, style);
    }

    node.childNodes.forEach((child: any) => node.replaceChild(this.changeText(child, style), child));

    return node;
  }
}

export default RangeSingleton;
