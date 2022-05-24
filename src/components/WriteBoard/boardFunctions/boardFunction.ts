import EventObject from "../../../event/Event";
import { findIsWriteBoardFunction } from "../../../utils/dom";

class BoardFunction {
  private board: HTMLElement;
  constructor(parent: Element, event: EventObject) {
    event.on("board:click", (e: MouseEvent) => {
      const node = findIsWriteBoardFunction(e.target as HTMLElement);
    });
  }
}

export default BoardFunction;
