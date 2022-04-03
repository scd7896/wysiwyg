import { MenuStore as menuStore } from "../../model";
import { IComponent } from "../../model/BaseStore";
import { MenuState } from "../../model/MenuStore";
import * as menuFunction from "./menuFunction";
import { css } from "@emotion/css";

const menuClass = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  div + div {
    margin-left: 8px;
  }
`;
export default class Menu implements IComponent {
  private parent: Element;
  private options: any;

  constructor(parent: Element, options?: any) {
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
