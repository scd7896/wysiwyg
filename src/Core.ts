interface ICore {
  setStyle: (style: Record<string, string>) => void;
  undo: () => void;
  redo: () => void;
  getValue: () => string;
  insertNode: (node: HTMLElement) => void;
}

class Core implements ICore {
  private wrapper: HTMLElement;
  constructor(boardWrapper: HTMLElement | string) {
    if (typeof boardWrapper === "string") {
      const wrapper = document.querySelector(boardWrapper) as HTMLElement;
      this.wrapper = wrapper;
    } else {
      this.wrapper = boardWrapper;
    }
    this.wrapper.contentEditable = "true";
    const mutationObserver = new MutationObserver((arg) => {
      console.log(arg);
    });
    const config = { attributes: true, childList: true, subtree: true };

    mutationObserver.observe(this.wrapper, config);
  }

  insertNode: (node: HTMLElement) => {};

  getValue() {
    return this.wrapper.innerHTML;
  }

  setStyle: (style: Record<string, string>) => {};

  undo: () => {};

  redo: () => {};
}

export default Core;
