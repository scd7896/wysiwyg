import { MenuStore as menuStore } from "../../model";
import { IComponent } from "../../model/BaseStore";
import { MenuState } from "../../model/MenuStore";
import * as menuFunction from "./menuFunction";
import { css } from "@emotion/css";
import { IEditorOptions } from "../../types";

const menuClass = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: sticky;
  top: 0;
  left: 0;
  background: white;
  border-bottom: 1px solid black;
  z-index: 999;
`;
export default class Menu implements IComponent {
  private parent: Element;
  private options: IEditorOptions;

  constructor(parent: Element, options?: IEditorOptions) {
    this.parent = parent;
    this.options = options;
    this.render();
    menuStore.subscribe(this);
  }

  render() {
    const menu = document.createElement("div");
    menu.classList.add(menuClass);
    const menuFunctionList = menuFunction as any;
    const keys = Object.keys(menuFunction) as Array<keyof MenuState>;
    keys.map((key) => new menuFunctionList[key](menu, this.options));
    this.parent.appendChild(menu);
  }
}
