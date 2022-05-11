import { BaseStore } from "./BaseStore";

class FontColorState {
  color: string;

  constructor() {
    this.color = "#000000";
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

export default FontColorStore;
