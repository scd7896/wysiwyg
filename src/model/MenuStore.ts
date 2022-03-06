import { BaseStore } from "./BaseStore";

export class MenuState {
	fontSize: number;
	constructor() {
		this.fontSize = 10;
	}
}



class MenuStore extends BaseStore<MenuState> {
	constructor() {
		super(new MenuState());
	}
}

export default new MenuStore();