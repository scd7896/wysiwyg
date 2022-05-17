import { IRootStores } from "../../..";
import { list } from "../../../icons";

import { findParentByNodeName } from "../../../utils/dom";
import Button from "../../Button";

class List {
  root?: IRootStores;
  constructor(parent: HTMLElement, options?: any, root?: IRootStores) {
    const button = new Button("menu").button;
    this.root = root;

    button.innerHTML = list;
    button.addEventListener("click", () => this.insertUList());
    parent.appendChild(button);
    setTimeout(() => {
      const board: HTMLDivElement = parent.parentElement.querySelector(".board");

      board.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          this.tabulList();
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
