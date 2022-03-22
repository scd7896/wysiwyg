import {
  findSpanStyleRemove,
  hasContains,
  setStyle,
  setStyleEndContainer,
  setStyleFullText,
  setRangeContainerStyle,
} from "../utils/dom";
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
  tmpFocusNode: Node;
  tmpAnchorNode: Node;

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
      if (this.selection.type === "Range") {
        this.setRangeNode();
      }
      console.log(this.rangeNodes, this.selection, this.range);

      this.setState({});
    });
  }

  private setRangeNode() {
    let flag = false;
    const board = this.parent.querySelector(".board");
    this.rangeNodes = [];

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
    this.focusNode = this.tmpFocusNode || this.focusNode;
    this.anchorNode = this.tmpAnchorNode || this.anchorNode;
    if (this.tmpFocusType === "Range") {
      this.setRangeNode();
    }

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
    this.tmpFocusNode = undefined;
    this.tmpAnchorNode = undefined;
  }

  tmpSave() {
    this.tmpFocusSelection = this.selection;
    this.tmpFocusRange = this.range;
    this.tmpFocusType = this.type;
    this.tmpRangeNodes = this.rangeNodes;
    this.tmpFocusNode = this.focusNode;
    this.tmpAnchorNode = this.anchorNode;
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
    this.insertNodeAndFoucs(span);
  }

  private oneTextNodeStyleChange(styles: Record<string, string>) {
    const targetNode = this.focusNode;

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

  private rangeEventListener(styles: Record<string, string>) {
    let flag = false;

    const changeNodesForFirstOrLast = (node: Node, index: number) => {
      if (hasContains(node, this.range.startContainer)) {
        flag = true;
        setRangeContainerStyle(this.range, node, styles, true);
        return;
      }

      if (hasContains(node, this.range.endContainer)) {
        setRangeContainerStyle(this.range, node, styles, false);
        flag = false;
        return;
      }

      if (flag) {
        if (node.nodeName === "#text") {
          setStyleFullText(node, styles);
        } else {
          setStyle(node as HTMLSpanElement, styles);
          node.childNodes.forEach((child) => {
            if (child.nodeName !== "#text") {
              findSpanStyleRemove(child as HTMLSpanElement, styles);
            }
          });
        }
      }
    };

    const elementNodeStyleChange = (node: HTMLDivElement, index: number) => {
      if (index === 0 || index === this.rangeNodes.length - 1) {
        const childNodes: Node[] = [];
        node.childNodes.forEach((child) => {
          childNodes.push(child);
        });

        childNodes.map((childNode, index) => {
          console.dir(childNode);
          changeNodesForFirstOrLast(childNode, index);
        });
      } else {
        const span = document.createElement("span");
        setStyle(span, styles);
        node.childNodes.forEach((child) => span.appendChild(child));
        node.innerHTML = "";
        node.appendChild(span);
        const spanChilds: HTMLSpanElement[] = [];
        span.childNodes.forEach((child) => {
          if (child.nodeName === "SPAN") spanChilds.push(child as HTMLSpanElement);
        });
        spanChilds.map((span) => findSpanStyleRemove(span, styles));
      }
    };
    console.log(this.rangeNodes, this.selection, this.range);
    if (this.anchorNode !== this.focusNode) {
      this.rangeNodes.map((node, index) => {
        elementNodeStyleChange(node as HTMLDivElement, index);
      });
    } else {
      this.oneTextNodeStyleChange(styles);
    }
  }
}

export default RangeSingleton;
