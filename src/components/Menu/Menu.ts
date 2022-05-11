import { IComponent } from "../../model/BaseStore";
import * as menuFunction from "./menuFunction";
import { css } from "@emotion/css";
import { IEditorOptions } from "../../types";
import { WYSIWYG } from "../..";

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
  private root: WYSIWYG

  constructor(parent: Element, options?: IEditorOptions, root?: WYSIWYG) {
    this.parent = parent;
    this.options = options;
    this.root = root;
    this.render();
  }

  render() {
    const menu = document.createElement("div");
    menu.classList.add(menuClass);
    const menuFunctionList = menuFunction as any;
    const keys = Object.keys(menuFunction) as Array<string>;
    keys.map((key) => new menuFunctionList[key](menu, this.options, this.root));
    this.parent.appendChild(menu);
  }
}
