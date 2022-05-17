import EventObject from "../event/Event";
import {
  findSpanStyleRemove,
  hasContains,
  setStyle,
  setRangeContainerStyle,
  getParentStyleValues,
  setRangeContainerNode,
  findNodeNameRemove,
} from "../utils/dom";
import { BaseStore } from "./BaseStore";

class RangeState {
  textDecorationValues: string[];
  constructor() {
    this.textDecorationValues = [];
  }
}
class RangeStore extends BaseStore<RangeState> {
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

  nextRange: Range;

  event: EventObject;

  constructor(parent?: HTMLElement, event?: EventObject) {
    super(new RangeState());
    this.parent = parent;
    this.event = event;
    this.rangeNodes = [];

    document.addEventListener("selectionchange", (e) => {
      const board = this.parent.querySelector(".board");
      const selection = document.getSelection();
      const range = selection.getRangeAt(0);
      if (!hasContains(board, range.startContainer) || !hasContains(board, range.endContainer)) return;

      this.selection = selection;
      this.range = range;
      this.type = this.selection.type;
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

  setStyle(styles: Record<string, string>, element?: HTMLElement) {
    this.loadTmp();

    if (this.type === "Range") {
      this.setRangeNode();
      this.nextRange = document.createRange();
      this.rangeEventListener(styles, element);
      const newSelection = window.getSelection();
      newSelection.removeAllRanges();
      newSelection.addRange(this.nextRange);
    }
    if (this.type === "Caret") {
      if (element) this.insertNodeAndFoucs(element);
      else this.caretEventListener(styles);
    }
    this.initializeTmp();
    const board = this.parent.querySelector(".board");
    const childStringArray: string[] = [];
    board.childNodes.forEach((child: HTMLElement) => childStringArray.push(child.outerHTML));
    this.event.emit("history:setNextChild", childStringArray);
    this.event.emit("text:change", board.innerHTML);
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

  saveTmp() {
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

  insertNodeAndFoucs(node: HTMLElement) {
    const board = this.parent.querySelector(".board");
    if (!this.range) return;
    if (hasContains(board, this.range.startContainer) && hasContains(board, this.range.endContainer)) {
      this.range.insertNode(node);
      this.changeFocusNode(node);
      const childStringArray: string[] = [];
      board.childNodes.forEach((child: HTMLElement) => childStringArray.push(child.outerHTML));
      this.event.emit("history:setNextChild", childStringArray);
      this.event.emit("text:change", board.innerHTML);
    }
  }

  changeFocusNode(node: Node) {
    this.parent.focus();
    const newRange = document.createRange();
    newRange.selectNode(node);
    const newSelection = window.getSelection();
    newSelection.removeAllRanges();
    newSelection.addRange(newRange);
  }

  private loadTmp() {
    this.selection = this.tmpFocusSelection || this.selection;
    this.range = this.tmpFocusRange || this.range;
    this.type = this.tmpFocusType || this.type;
    this.rangeNodes = this.tmpRangeNodes || this.rangeNodes;
    this.focusNode = this.tmpFocusNode || this.focusNode;
    this.anchorNode = this.tmpAnchorNode || this.anchorNode;
  }

  private caretEventListener(styles: Record<string, string>) {
    const span = document.createElement("span");
    setStyle(span, styles);
    span.innerHTML = "&nbsp;";
    this.insertNodeAndFoucs(span);
  }

  private oneNodeChange(styles: Record<string, string>, element?: HTMLElement) {
    const targetNode = this.focusNode;
    const fragmentNode = document.createDocumentFragment();
    let node: HTMLElement = undefined;
    if (element) {
      node = element.cloneNode(true) as HTMLElement;
      setStyle(node, styles);
    } else {
      const span = document.createElement("span");
      setStyle(span, styles);
      node = span;
    }
    const text = targetNode.textContent;
    const firstText = document.createTextNode(text.slice(0, this.range.startOffset));
    node.textContent = text.slice(this.range.startOffset, this.range.endOffset);
    const thirdText = document.createTextNode(text.slice(this.range.endOffset));

    fragmentNode.appendChild(firstText);
    fragmentNode.appendChild(node);
    fragmentNode.appendChild(thirdText);

    if (targetNode.nodeName === "#text") {
      targetNode.parentElement.replaceChild(fragmentNode, targetNode);
    } else {
      targetNode.replaceChild(fragmentNode, targetNode);
    }
  }

  private rangeEventListener(styles: Record<string, string>, forSetElement?: HTMLElement) {
    if (this.anchorNode !== this.focusNode) {
      this.rangeNodes.map((node: HTMLElement, index, array) => {
        if (index === 0 || index === array.length - 1) {
          const spanNode = forSetElement
            ? setRangeContainerNode(this.range, node, index === 0, forSetElement.cloneNode(true) as HTMLElement)
            : setRangeContainerStyle(this.range, node, styles, index === 0);
          if (index === 0) this.nextRange.setStart(spanNode, 0);
          else this.nextRange.setEnd(spanNode, 1);
        } else {
          if (forSetElement) {
            const cloneNode = forSetElement.cloneNode(true) as HTMLElement;
            cloneNode.innerHTML = node.innerHTML;
            if (node.nodeName !== "#text") node.replaceChildren(cloneNode);
            cloneNode.childNodes.forEach((child) => {
              if (child.nodeName !== "#text") {
                findNodeNameRemove(child as HTMLElement, cloneNode.nodeName);
              }
            });
          } else {
            setStyle(node, styles);
            node.childNodes.forEach((child) => {
              if (child.nodeName !== "#text") {
                findSpanStyleRemove(child as HTMLSpanElement, styles);
              }
            });
          }
        }
      });
    } else {
      this.oneNodeChange(styles, forSetElement);
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

export default RangeStore;
