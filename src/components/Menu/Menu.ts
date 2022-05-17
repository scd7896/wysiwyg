import { IComponent } from "../../model/BaseStore";
import * as menuFunction from "./menuFunction";
import { IEditorOptions } from "../../types";
import { IRootStores } from "../..";
import { setStyle } from "../../utils/dom";

export default class Menu implements IComponent {
  private parent: Element;
  private options: IEditorOptions;
  private root: IRootStores;

  constructor(parent: Element, options?: IEditorOptions, root?: IRootStores) {
    this.parent = parent;
    this.options = options;
    this.root = root;
    this.render();
  }

  render() {
    const menu = document.createElement("div");
    setStyle(menu, {
      display: "flex",
      "flex-wrap": "wrap",
      "align-items": "center",
      position: "sticky",
      top: "0",
      left: "0",
      background: "white",
      "border-bottom": "1px solid black",
      "z-index": "999",
    });

    const menuFunctionList = menuFunction as any;
    if (this.options.menus) {
      this.options.menus.map((key) => new menuFunctionList[key](menu, this.options, this.root));
    } else {
      const keys = Object.keys(menuFunction) as Array<string>;
      keys.map((key) => new menuFunctionList[key](menu, this.options, this.root));
    }
    this.parent.appendChild(menu);
  }
}
