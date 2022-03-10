class RangeStore {
  selection: Selection;
  constructor() {
    document.addEventListener("selectionchange", () => {
      this.selection = document.getSelection();
    });
  }
}

export default new RangeStore();
