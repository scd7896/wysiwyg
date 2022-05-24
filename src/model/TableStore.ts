import EventObject from "../event/Event";
import { setStyle } from "../utils/dom";

export default class TableStore {
  private event: EventObject;
  private board: HTMLDivElement;
  constructor(board: HTMLDivElement, event: EventObject) {
    this.board = board;
    this.event = event;
    this.event.on("table:create", this.create.bind(this));
  }

  create(row: number, col: number) {
    const table = document.createElement("table");
    setStyle(table, {
      "empty-cells": "show",
      width: "100%",
    });
    const tbody = document.createElement("tbody");
    table.appendChild(tbody);
    for (let i = 1; i <= row; i++) {
      const tr = document.createElement("tr");
      for (let j = 1; j <= col; j++) {
        const td = document.createElement("td");
        const br = document.createElement("br");
        td.appendChild(br);
        tr.appendChild(td);
        setStyle(td, {
          border: "1px solid black",
          "min-width": "5px",
          "min-height": "14px",
        });
      }
      tbody.appendChild(tr);
    }

    this.event.emit("range:insertNodeAndFoucs", table);
  }
}
