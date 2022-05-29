import EventObject from "../event/Event";
import { BaseStore } from "./BaseStore";

class WriteBoardFunctionStoreState {
  selectedNode?: HTMLElement;
  nodeName?: string;
  constructor() {
    this.selectedNode = undefined;
    this.nodeName = undefined;
  }
}

class WriteBoardFunctionStore extends BaseStore<WriteBoardFunctionStoreState> {
  constructor(event: EventObject) {
    super(new WriteBoardFunctionStoreState());
    event.on("writeBoardFunction:setSelectedNode", this.setSelectedNode.bind(this));
    event.on("writeBoardFunction:setInitlization", this.setInitlization.bind(this));
  }

  setSelectedNode(node: HTMLElement, nodeName: string) {
    this.setState({
      selectedNode: node,
      nodeName,
    });
  }

  setInitlization() {
    this.setState({
      selectedNode: undefined,
      nodeName: undefined,
    });
  }
}

export default WriteBoardFunctionStore;
