import { WYSIWYG } from "../../..";
import EventSingleton from "../../../event/Event";
import { RangeSingleton } from "../../../model";
import { findParentByNodeName } from "../../../utils/dom";

class List {
  root?: WYSIWYG;
  constructor(parent: HTMLElement, options?: any, root?: WYSIWYG) {
    const button = document.createElement("button");
    this.root = root;
    button.textContent = "list";
    button.addEventListener("click", () => this.insertUList());
    parent.appendChild(button);
    setTimeout(() => {
      const board: HTMLDivElement = parent.parentElement.querySelector(".board");
      this.root.event.on("tabkey", () => {
        this.tabulList();
      });

      board.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          this.root.event.emit("tabkey");
        }
      });
    }, 11);
  }

  tabulList() {
    if (this.root.range.type === "Range") return;
    const parentLi = findParentByNodeName(this.root.range.anchorNode as HTMLElement, "LI");
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.textContent = " ";
    ul.appendChild(li);
    if (parentLi) {
      li.innerHTML = parentLi.innerHTML;
      parentLi.parentElement.replaceChild(ul, parentLi);
      this.root.range.changeFocusNode(li);
    }
  }

  insertUList() {
    if (this.root.range.type === "Range") return;
    const parentLi = findParentByNodeName(this.root.range.anchorNode as HTMLElement, "LI");
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.textContent = " ";
    ul.appendChild(li);
    if (parentLi) {
      li.innerHTML = parentLi.innerHTML;
      parentLi.parentElement.replaceChild(ul, parentLi);
      this.root.range.changeFocusNode(li);
    } else {
      this.root.range.insertNodeAndFoucs(ul);
    }
  }
}

export default List;
