import EventObject from "../../../event/Event";
import TableSelectorStore from "../../../model/TableSelectorStore";
import { IEditorOptions } from "../../../types";
import { findElementByType } from "../../../utils/dom";
import { IRootStores } from "../../../wysiwyg";
import SubModal from "../../SubModal/SubModal";

export default class Table {
  private wrapper: HTMLElement;
  private contentWrapper: HTMLDivElement;
  private modal: SubModal;
  private root: IRootStores;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    this.wrapper = document.createElement("div");
    this.contentWrapper = document.createElement("div");
    this.modal = new SubModal(this.wrapper, this.contentWrapper, root);
    this.root = root;

    parent.appendChild(this.wrapper);
  }

  render() {
    this.contentWrapper.appendChild(new TableSelector(this.root?.event).render());
  }
}

class TableSelector {
  event?: EventObject;
  store: TableSelectorStore;
  constructor(event?: EventObject) {
    this.store = new TableSelectorStore();
    this.event = event;
  }

  render() {
    const wrapper = document.createElement("div");
    wrapper.addEventListener("mouseover", (e) => {
      this.onMouseMoveHandler(e);
    });

    wrapper.addEventListener("click", () => {
      this.event?.emit("table:create", this.store.state.row, this.store.state.col);
    });
    return wrapper;
  }

  onMouseMoveHandler(e: MouseEvent) {
    const target = findElementByType(e.target as HTMLElement, "tableElement");
  }
}

class TableRowRenderer {
  row: number;
  col: number;
  constructor(row: number, col: number) {}
}
