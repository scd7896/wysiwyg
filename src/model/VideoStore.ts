import { BaseStore } from "./BaseStore";

type TVideoInsertMode = "file" | "url" | "embedCode";

class VideoState {
  mode: TVideoInsertMode;
  constructor() {
    this.mode = "url";
  }
}

class VideoStore extends BaseStore<VideoState> {
  constructor() {
    super(new VideoState());
  }

  setMode(mode: TVideoInsertMode) {
    this.setState({
      mode,
    });
  }
}

export default new VideoStore();
