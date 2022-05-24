import EventObject from "../../../event/Event";
import TableSelectorStore from "../../../model/TableSelectorStore";
import TableStore from "../../../model/TableStore";
import { IEditorOptions } from "../../../types";
import { findElementByType, setStyle } from "../../../utils/dom";
import { IRootStores } from "../../../wysiwyg";
import SubModal from "../../SubModal/SubModal";

export default class Table {
  private wrapper: HTMLElement;
  private contentWrapper: HTMLDivElement;
  private modal: SubModal;
  private root: IRootStores;
  private tableSelector: TableSelector;
  private store: TableStore;

  constructor(parent: HTMLElement, options?: IEditorOptions, root?: IRootStores) {
    const board = parent.querySelector(".board");
    this.store = new TableStore(board as HTMLDivElement, root.event);
    this.wrapper = document.createElement("div");
    const button = document.createElement("button");
    button.textContent = "table";
    button.addEventListener("click", () => {
      this.modal.openModal();
    });
    this.wrapper.appendChild(button);
    this.contentWrapper = document.createElement("div");
    this.modal = new SubModal(this.wrapper, this.contentWrapper, root);
    this.modal.onClose = this.onModalClose.bind(this);
    this.root = root;
    parent.appendChild(this.wrapper);
    this.render();
  }

  render() {
    setStyle(this.wrapper, {
      position: "relative",
    });
    this.tableSelector = new TableSelector(this.root?.event);
    this.tableSelector.onClick = () => this.modal.closeModal();
    this.contentWrapper.appendChild(this.tableSelector.render());
  }

  onModalClose() {
    this.tableSelector.initalize();
  }
}

class TableSelector {
  event?: EventObject;
  store: TableSelectorStore;
  onClick?: () => void;
  private wrapper: HTMLDivElement;
  private body: HTMLDivElement;
  private footer: HTMLDivElement;

  constructor(event?: EventObject) {
    this.store = new TableSelectorStore();
    this.event = event;

    this.store.subscribe(this);
    this.render();
  }

  render() {
    const wrapper = document.createElement("div");
    this.wrapper = wrapper;

    const body = document.createElement("div");
    this.body = body;

    const footer = document.createElement("div");
    this.footer = footer;

    body.addEventListener("mousedown", () => {
      this.event?.emit("table:create", this.store.state.row, this.store.state.col);
      this.store.initalize();
      if (this.onClick) this.onClick();
    });

    wrapper.addEventListener("mouseover", (e) => {
      this.onMouseMoveHandler(e);
    });

    this.wrapper.appendChild(this.body);
    this.wrapper.appendChild(this.footer);
    this.tableSizeSelectorRender();
    return wrapper;
  }

  update() {
    this.tableSizeSelectorRender();
  }

  private tableSizeSelectorRender() {
    this.body.innerHTML = "";
    const maxRow = this.store.state.row + 1;

    for (let row = 1; row <= maxRow; row++) {
      const rowSelector = new TableRowRenderer(row, this.store.state.col, row === maxRow);
      this.body.appendChild(rowSelector.render());
    }

    this.footer.innerText = `${this.store.state.row} X ${this.store.state.col}`;
  }

  private onMouseMoveHandler(e: MouseEvent) {
    const target = findElementByType(e.target as HTMLElement, "tableElement");
    if (target) {
      const row = Number(target.dataset.row);
      const col = Number(target.dataset.col);
      this.store.setRowCol(row, col);
    }
  }

  initalize() {
    this.store.initalize();
  }
}

class TableRowRenderer {
  currentRow: number;
  selectedCol: number;
  isLast: boolean;
  constructor(currentRow: number, selectedCol: number, isLast: boolean) {
    this.currentRow = currentRow;
    this.selectedCol = selectedCol;
    this.isLast = isLast;
  }

  render() {
    const wrapper = document.createElement("div");
    setStyle(wrapper, {
      display: "flex",
      "justify-content": "space-between",
      "flex-wrap": "no-wrap",
    });
    for (let i = 1; i <= 10; i++) {
      const element = document.createElement("div");
      setStyle(element, {
        width: "16px",
        height: "16px",
        ...this.getSelectorStyle(i),
      });
      element.dataset.type = "tableElement";
      element.dataset.row = this.currentRow.toString();
      element.dataset.col = i.toString();
      wrapper.appendChild(element);
    }

    return wrapper;
  }

  getSelectorStyle(currentColumn: number) {
    const nonSelectedStyle = {
      background: "white",
      border: "1px solid #efefef",
    };

    const selectedStyle = {
      background: "#1890ef",
      border: "1px solid blue",
    };

    if (this.isLast || currentColumn > this.selectedCol) return nonSelectedStyle;
    return selectedStyle;
  }
}
