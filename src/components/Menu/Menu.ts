import { MenuStore as menuStore } from "../../model";
import { IComponent } from "../../model/BaseStore";
import { MenuState } from "../../model/MenuStore";
import * as menuFunction from "./menuFunction";
import { css } from "@emotion/css";

const menuClass = css`
  background-color: black;
  div + div {
    margin-left: 8px;
  }
`;
export default class Menu implements IComponent {
  private parent: Element;
  private chlidren: IComponent[];

  constructor(parent: Element) {
    this.parent = parent;
    this.render();
    menuStore.subscribe(this);
  }

  render() {
    const menu = document.createElement("div");
    menu.classList.add(menuClass);
    const menuFunctionList = menuFunction as any;
    const keys = Object.keys(menuFunction) as Array<keyof MenuState>;
    console.log(keys);
    this.chlidren = keys.map((key) => new menuFunctionList[key](menu));
    this.parent.appendChild(menu);
  }
}
