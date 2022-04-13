import { RangeSingleton } from "../../../model";

class List {
  constructor(parent: HTMLElement) {
    const button = document.createElement("button");
    button.textContent = "list";
    button.addEventListener("click", () => RangeSingleton.getInstance().insertUList());
    parent.appendChild(button);
  }
}

export default List;
