import { BaseStore } from "./BaseStore";

class FontColorState {
  color: string;
  background: string;

  constructor() {
    this.color = "#000000";
    this.background = "#ffffff";
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

  setBackgroundColor(background: string) {
    this.setState({
      background,
    });
  }
}

export default FontColorStore;
