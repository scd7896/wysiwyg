import { BaseStore } from "./BaseStore";

class TableSelectorState {
  row?: number;
  col?: number;
  constructor(row?: number, col?: number) {
    (this.row = row), (this.col = col);
  }
}

export default class TableSelectorStore extends BaseStore<TableSelectorState> {
  constructor() {
    super(new TableSelectorState(1, 1));
  }

  initalize() {
    this.setState({
      row: 1,
      col: 1,
    });
  }

  setRowCol(row: number, col: number) {
    this.setState({
      row,
      col,
    });
  }
}
