import { BaseStore } from "./BaseStore";

export class FontSizeState {
  isInputOpen: boolean;
  fontSize: number;

  constructor() {
    this.isInputOpen = false;
    this.fontSize = 10;
  }
}
class FontSizeStore extends BaseStore<FontSizeState> {
  constructor() {
    super(new FontSizeState());
  }

  openInput() {
    this.setState({
      isInputOpen: true,
    });
  }

  closeInput() {
    this.setState({
      isInputOpen: false,
    });
  }

  setStyleSize(fontSize: number) {
    this.setState({
      fontSize,
    });
  }
}

export default new FontSizeStore();
