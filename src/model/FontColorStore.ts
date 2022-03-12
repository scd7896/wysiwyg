import { BaseStore } from "./BaseStore";

class FontColorState {
  color: string;

  constructor() {
    this.color = "";
  }
}

class FontColorStore extends BaseStore<FontColorState> {
  constructor() {
    super(new FontColorState());
  }

  setColor(color: string) {
    this.setState({
      color,
    });
  }
}

export default new FontColorStore();
