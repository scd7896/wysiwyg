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

      if (this.selection.type === "Range") {
        this.setRangeNode();
      }

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

  fontSet(styles: Record<string, string>) {
    this.loadTmp();
    if (this.tmpFocusType === "Range") {
      this.setRangeNode();
    }

    if (this.type === "Range") {
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
          changeNodesForFirstOrLast(childNode, index);
        });
      } else {
        setStyle(node, styles);
        const spanChilds: HTMLSpanElement[] = [];
        node.childNodes.forEach((child) => {
          if (child.nodeName === "SPAN") spanChilds.push(child as HTMLSpanElement);
        });
        spanChilds.map((span) => findSpanStyleRemove(span, styles));
      }
    };
    if (this.anchorNode !== this.focusNode) {
      this.rangeNodes.map((node, index) => {
        elementNodeStyleChange(node as HTMLDivElement, index);
      });
    } else {
      this.oneTextNodeStyleChange(styles);
    }
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
}

export default RangeSingleton;
