import { BaseStore } from "./BaseStore";

class AnchorState {
  constructor() {}
}

class AnchorStore extends BaseStore<AnchorState> {
  constructor() {
    super(new AnchorState());
  }
}

export default new AnchorStore();
