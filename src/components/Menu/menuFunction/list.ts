import EventSingleton from "../../../event/EventSingleton";
import { RangeSingleton } from "../../../model";
import { findParentByNodeName } from "../../../utils/dom";

class List {
  constructor(parent: HTMLElement) {
    const button = document.createElement("button");
    button.textContent = "list";
    button.addEventListener("click", () => this.insertUList());
    parent.appendChild(button);
    setTimeout(() => {
      const board: HTMLDivElement = parent.parentElement.querySelector(".board");
      EventSingleton.getInstance().on("tabkey", () => {
        this.tabulList();
      });

      board.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
          e.preventDefault();
          EventSingleton.getInstance().emit("tabkey");
        }
      });
    }, 11);
  }

  tabulList() {
    if (RangeSingleton.getInstance().type === "Range") return;
    const parentLi = findParentByNodeName(RangeSingleton.getInstance().anchorNode as HTMLElement, "LI");
    if (parentLi) {
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      li.textContent = " ";
      ul.appendChild(li);
      li.innerHTML = parentLi.innerHTML;
      parentLi.parentElement.replaceChild(ul, parentLi);
      RangeSingleton.getInstance().changeFocusNode(li);
    }
  }

  insertUList() {
    if (RangeSingleton.getInstance().type === "Range") return;
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.textContent = " ";
    ul.appendChild(li);
    const parentLi = findParentByNodeName(RangeSingleton.getInstance().anchorNode as HTMLElement, "LI");
    if (parentLi) {
      li.innerHTML = parentLi.innerHTML;
      parentLi.parentElement.replaceChild(ul, parentLi);
      RangeSingleton.getInstance().changeFocusNode(li);
    } else {
      RangeSingleton.getInstance().insertNodeAndFoucs(ul);
    }
  }
}

export default List;
