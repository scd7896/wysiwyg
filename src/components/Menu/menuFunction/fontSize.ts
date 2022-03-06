import { IComponent } from "../../../model/BaseStore";
import MenuStore, { MenuState } from "../../../model/MenuStore";

export default class FontSize implements IComponent {
	private parent: Element;
	private wrapper: Element;

	constructor(parent: Element) {
		this.parent = parent;
		this.render();
	}

	update() {

	}

	render(){
		const button = document.createElement("button");
		button.textContent = `${MenuStore.state.fontSize}px`
		this.wrapper = button;
		this.parent.appendChild(button);
	}
}