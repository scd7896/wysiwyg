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
  tmpRangeNodes: Node[];

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
        if (!flag) this.rangeNodes.push(child);
        flag = !flag;
      }

      if (hasContains(child, this.selection.focusNode)) {
        if (!flag) this.rangeNodes.push(child);
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
    this.rangeNodes = this.tmpRangeNodes || this.rangeNodes;

    if (this.type === "Range") {
      this.rangeEventListener(styles);
    }
    if (this.type === "Caret") {
      this.caretEventListener(styles);
    }

    this.tmpFocusSelection = undefined;
    this.tmpFocusRange = undefined;
    this.tmpFocusType = undefined;
    this.tmpRangeNodes = undefined;
  }

  tmpSave() {
    this.tmpFocusSelection = this.selection;
    this.tmpFocusRange = this.range;
    this.tmpFocusType = this.type;
    this.tmpRangeNodes = this.rangeNodes;
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

  private oneLineElementChange(styles: Record<string, string>) {
    const targetNode = this.rangeNodes[0];

    if (this.selection.anchorNode === this.selection.focusNode) {
      const span = document.createElement("span");
      const fragmentNode = document.createDocumentFragment();
      setStyle(span, styles);
      const text = this.selection.anchorNode.textContent;
      const firstText = document.createTextNode(text.slice(0, this.range.startOffset));
      span.textContent = text.slice(this.range.startOffset, this.range.endOffset);
      const thirdText = document.createTextNode(text.slice(this.range.endOffset));

      fragmentNode.appendChild(firstText);
      fragmentNode.appendChild(span);
      fragmentNode.appendChild(thirdText);
      if (targetNode.nodeName === "#text") {
        targetNode.parentElement.replaceChild(fragmentNode, targetNode);
      } else {
        targetNode.replaceChild(fragmentNode, this.selection.anchorNode);
      }
    }
  }

  private rangeEventListener(styles: Record<string, string>) {
    const elementNodeStyleChange = (node: Node) => {
      // console.dir(node);
    };
    console.log(this.rangeNodes, this.selection, this.range);
    if (this.rangeNodes.length > 1) {
      // this.rangeNodes.map((node, index) => {
      //   if (node.nodeName === "#text") {
      //   } else {
      //     elementNodeStyleChange(node);
      //   }
      // });
    } else {
      this.oneLineElementChange(styles);
    }
  }
}

export default RangeSingleton;
