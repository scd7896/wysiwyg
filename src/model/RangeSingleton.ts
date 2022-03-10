class RangeSingleton {
  selection: Selection;
  range: Range;
  private static instance: RangeSingleton;
  private constructor(parent?: Element) {
    parent.addEventListener("selectionchange", () => {
      this.selection = document.getSelection();
      this.range = this.selection.getRangeAt(0);
    });
  }

  static getIndex(parent?: Element) {
    if (this.instance) return this.instance;
    this.instance = new this(parent);
    return this.instance;
  }
}

export default RangeSingleton;
