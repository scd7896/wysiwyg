import { IComponent } from "../../model/BaseStore";

export default class WriteBoard implements IComponent {
	private board: HTMLElement;
	private hiddenTextArea: HTMLTextAreaElement;
	private parent: Element;

	constructor(parent: Element) {
		this.parent = parent;
		this.render();
	}
	
	private textAreaSetting() {
		this.hiddenTextArea.style.display = "none";
	}

	private boardSetting() {
		this.board.style.width = "100%";
		this.board.contentEditable = "true"
		this.board.addEventListener("keydown", (e: any) => this.hiddenTextArea.value = this.board.innerHTML);
	}

	getValue() {
		return this.hiddenTextArea.value;
	}

	render() {
		const board = document.createElement("div");
		this.parent.appendChild(board);
		this.board = board;
		this.board.style.setProperty("min-height", "150px");
		this.board.style.border = "1px solid #aeaeae";

		const textArea = document.createElement("textarea");
		this.hiddenTextArea = textArea;
		this.parent.appendChild(this.hiddenTextArea);

		this.textAreaSetting()
		this.boardSetting();
	}
}