export default class WriteBoard {
	private board: HTMLElement;
	private hiddenTextArea: HTMLTextAreaElement;

	constructor(parent: Element) {
		const board = document.createElement("div");
		parent.appendChild(board);
		this.board = board;

		const textArea = document.createElement("textarea");
		this.hiddenTextArea = textArea;
		parent.appendChild(this.hiddenTextArea);

		this.textAreaSetting()
		this.boardSetting();
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
}