import { MenuStore as menuStore } from "../../model";
import { IComponent } from "../../model/BaseStore";
import { MenuState } from "../../model/MenuStore";
import * as menuFunction from "./menuFunction";
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
    const menuFunctionList = menuFunction as any;
    const keys = Object.keys(menuFunction) as Array<keyof MenuState>;
    if (this.chlidren) {
      this.chlidren.map((child) => child.update && child.update());
    } else {
      this.chlidren = keys.map((key) => new menuFunctionList[key](menu));
    }

    this.parent.appendChild(menu);
  }
}
