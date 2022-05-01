import { BaseStore } from "./BaseStore";

class ImageResizeState {
  selectedNode?: HTMLElement;
  constructor() {
    this.selectedNode = undefined;
  }
}

class ImageResizerStore extends BaseStore<ImageResizeState> {
  constructor() {
    super(new ImageResizeState());
  }

  setSelectedNode(node: HTMLElement) {
    this.setState({
      selectedNode: node,
    });
  }

  setInitlization() {
    this.setState({
      selectedNode: undefined,
    });
  }
}

export default new ImageResizerStore();
