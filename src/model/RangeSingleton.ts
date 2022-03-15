import { hasContains, setStyle } from "../utils/dom";
import { BaseStore } from "./BaseStore";

class RangeSingleton extends BaseStore<{}> {
  selection: Selection;
  type: string;
  range: Range;
  parent: HTMLElement;
  anchorNode: Node;
  focusNode: Node;
  rangeNodes: Node[];

  tmpFocusSelection: Selection;
  tmpFocusRange: Range;
  tmpFocusType: string;

  private static instance: RangeSingleton;
  private constructor(parent?: HTMLElement) {
    super({});
    this.parent = parent;
    this.rangeNodes = [];

    document.addEventListener("selectionchange", () => {
      this.selection = document.getSelection();
      this.type = this.selection.type;
      this.range = this.selection.getRangeAt(0);
      this.anchorNode = this.selection.anchorNode;
      this.focusNode = this.selection.focusNode;
      this.rangeNodes = [];
      if (this.selection.type === "Range") {
        this.setRangeNode();
      }
      console.log(this.rangeNodes);
      this.setState({});
    });
  }

  private setRangeNode() {
    let flag = false;
    const board = this.parent.querySelector(".board");
    board.childNodes.forEach((child) => {
      if (flag) {
        this.rangeNodes.push(child);
      }

      if (hasContains(child, this.selection.anchorNode)) {
        if (!flag) this.rangeNodes.push(this.selection.anchorNode);
        flag = !flag;
      }

      if (hasContains(child, this.selection.focusNode)) {
        if (!flag) this.rangeNodes.push(this.selection.focusNode);
        flag = !flag;
      }
    });
  }

  static getInstance(parent?: HTMLElement) {
    if (this.instance) return this.instance;
    this.instance = new this(parent);
    return this.instance;
  }

  fontSet(styles: Record<string, string>) {
    this.selection = this.tmpFocusSelection || this.selection;
    this.range = this.tmpFocusRange || this.range;
    this.type = this.tmpFocusType || this.type;

    if (this.type === "Range") {
      this.rangeEventListener(styles);
    }
    if (this.type === "Caret") {
      this.caretEventListener(styles);
    }

    this.tmpFocusSelection = undefined;
    this.tmpFocusRange = undefined;
    this.tmpFocusType = undefined;
  }

  tmpSave() {
    this.tmpFocusSelection = this.selection;
    this.tmpFocusRange = this.range;
    this.tmpFocusType = this.type;
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
