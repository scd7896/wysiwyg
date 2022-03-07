import { BaseStore } from "./BaseStore";

export class MenuState {
	
	constructor() {
		
	}
}



class MenuStore extends BaseStore<MenuState> {
	constructor() {
		super(new MenuState());
	}
}

export default new MenuStore();