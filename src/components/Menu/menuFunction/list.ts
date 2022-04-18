import { RangeSingleton } from "../../../model";
import { findParentByNodeName } from "../../../utils/dom";

class List {
  constructor(parent: HTMLElement) {
    const button = document.createElement("button");
    button.textContent = "list";
    button.addEventListener("click", () => this.insertUList());
    parent.appendChild(button);
  }

  insertUList() {
    if (RangeSingleton.getInstance().type === "Range") return;
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.textContent = " ";
    ul.appendChild(li);
    const parentLi = findParentByNodeName(RangeSingleton.getInstance().anchorNode as HTMLElement, "LI");
    if (parentLi) {
      parentLi.parentElement.replaceChild(ul, parentLi);
    } else {
      RangeSingleton.getInstance().insertNodeAndFoucs(ul);
    }
  }
}

export default List;
