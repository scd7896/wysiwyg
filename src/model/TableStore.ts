import EventObject from "../event/Event";

export default class TableStore {
  event: EventObject;
  constructor(event: EventObject) {
    this.event = event;

    this.event.on("table:create", this.create.bind(this));
  }

  create(row: number, col: number) {}
}
