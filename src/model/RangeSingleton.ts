import {
  findSpanStyleRemove,
  hasContains,
  setStyle,
  setStyleFullText,
  setRangeContainerStyle,
  getParentStyleValues,
} from "../utils/dom";
import { BaseStore } from "./BaseStore";

class RangeSingletonState {
  textDecorationValues: string[];
  constructor() {
    this.textDecorationValues = [];
  }
}
class RangeSingleton extends BaseStore<RangeSingletonState> {
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
    super(new RangeSingletonState());
    this.parent = parent;
    this.rangeNodes = [];

    document.addEventListener("selectionchange", (e) => {
      this.selection = document.getSelection();
      this.type = this.selection.type;
      this.range = this.selection.getRangeAt(0);
      this.anchorNode = this.selection.anchorNode;
      this.focusNode = this.selection.focusNode;

      if (this.anchorNode === this.focusNode) {
        const values = getParentStyleValues(this.anchorNode, "text-decoration-line");
        this.setState({
          textDecorationValues: values,
        });
      }
      this.setState({});
    });
  }

  static getInstance(parent?: HTMLElement) {
    if (this.instance) return this.instance;
    this.instance = new this(parent);
    return this.instance;
  }

  insertUList() {
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.textContent = " ";
    ul.appendChild(li);
    this.insertNodeAndFoucs(ul);
  }

  fontSet(styles: Record<string, string>) {
    this.loadTmp();

    if (this.type === "Range") {
      this.setRangeNode();
      this.rangeEventListener(styles);
    }
    if (this.type === "Caret") {
      this.caretEventListener(styles);
    }
    this.initializeTmp();
  }

  insertImage(src: string) {
    this.loadTmp();
    const img = document.createElement("img");
    img.src = src;
    setStyle(img, {
      "max-width": "100%",
    });
    this.insertNodeAndFoucs(img);
    this.initializeTmp();
  }

  tmpSave() {
    this.tmpFocusSelection = this.selection;
    this.tmpFocusRange = this.range;
    this.tmpFocusType = this.type;
    this.tmpRangeNodes = this.rangeNodes;
    this.tmpFocusNode = this.focusNode;
    this.tmpAnchorNode = this.anchorNode;
  }

  initializeTmp() {
    this.tmpFocusSelection = undefined;
    this.tmpFocusRange = undefined;
    this.tmpFocusType = undefined;
    this.tmpRangeNodes = undefined;
    this.tmpFocusNode = undefined;
    this.tmpAnchorNode = undefined;
  }

  private loadTmp() {
    this.selection = this.tmpFocusSelection || this.selection;
    this.range = this.tmpFocusRange || this.range;
    this.type = this.tmpFocusType || this.type;
    this.rangeNodes = this.tmpRangeNodes || this.rangeNodes;
    this.focusNode = this.tmpFocusNode || this.focusNode;
    this.anchorNode = this.tmpAnchorNode || this.anchorNode;
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
    const elementNodeStyleChange = (node: HTMLDivElement) => {
      if (node === this.range.startContainer) {
        setRangeContainerStyle(this.range, node, styles, true);
        return;
      }
      if (node === this.range.endContainer) {
        setRangeContainerStyle(this.range, node, styles, false);
        return;
      }
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
    };
    if (this.anchorNode !== this.focusNode) {
      this.rangeNodes.map((node) => {
        elementNodeStyleChange(node as HTMLDivElement);
      });
    } else {
      this.oneTextNodeStyleChange(styles);
    }
  }

  private setRangeNode() {
    let flag = false;
    const board = this.parent.querySelector(".board");
    this.rangeNodes = [];

    const nodeDFS = (node: Node) => {
      if (this.range.startContainer === node || this.range.endContainer === node) {
        this.rangeNodes.push(node);
        flag = !flag;
        return;
      } else if (hasContains(node, this.range.endContainer)) {
        node.childNodes.forEach((child) => nodeDFS(child));
      } else if (flag) {
        this.rangeNodes.push(node);
        return;
      } else {
        node.childNodes.forEach((child) => nodeDFS(child));
      }
    };

    nodeDFS(board);
  }
}

export default RangeSingleton;
