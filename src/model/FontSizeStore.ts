import { BaseStore } from "./BaseStore";

export class FontSizeState {
  fontSize: number;

  constructor() {
    this.fontSize = 10;
  }
}
class FontSizeStore extends BaseStore<FontSizeState> {
  constructor() {
    super(new FontSizeState());
  }

  setStyleSize(fontSize: number) {
    this.setState({
      fontSize,
    });
  }
}

export default FontSizeStore;
