import { WriteBoard, Menu } from "./components";

export class WYSIWYG {
	constructor(target: HTMLElement | string, options?: any) {
		const element = typeof target === "string" ? document.querySelector(target) : target;
		new Menu(element);
		new WriteBoard(element);
	}
}