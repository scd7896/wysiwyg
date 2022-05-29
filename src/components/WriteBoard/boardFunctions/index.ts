import EventObject from "../../../event/Event";
import { WriteBoardFunctionStore } from "../../../model";
import { findIsWriteBoardFunction } from "../../../utils/dom";
import ImageFunction from "./ImageFunction";
import VideoFunction from "./VideoFunction";

class BoardFunction {
  private board: HTMLElement;
  constructor(parent: HTMLElement, event: EventObject) {
    this.board = parent.querySelector(".board") as HTMLElement;
    const store = new WriteBoardFunctionStore(event);
    new VideoFunction(parent, store);
    new ImageFunction(parent, store);
    event.on("board:click", (e: MouseEvent) => {
      const { node, nodeName } = findIsWriteBoardFunction(e.target as HTMLElement);
      if (node) {
        switch (nodeName) {
          case "IMG": {
            event.emit("writeBoardFunction:setSelectedNode", node, nodeName);
          }
          case "IFRAME": {
            event.emit("writeBoardFunction:setSelectedNode", node, nodeName);
          }
        }
      } else {
        event.emit("writeBoardFunction:setInitlization");
      }
    });
  }
}

export default BoardFunction;
