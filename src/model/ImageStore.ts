import { BaseStore } from "./BaseStore";

type TMode = "file" | "url";

class ImageState {
  mode: TMode;

  constructor() {
    this.mode = "file";
  }
}

class ImageStore extends BaseStore<ImageState> {
  constructor() {
    super(new ImageState());
  }

  setMode(mode: TMode) {
    this.setState({
      mode,
    });
  }
}

export default new ImageStore();
