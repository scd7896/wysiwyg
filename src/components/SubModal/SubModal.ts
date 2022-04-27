import { RangeSingleton } from "../../model";
import SubModalStore from "../../model/SubModalStore";
import { findElementByType, hasContains, setStyle } from "../../utils/dom";

class SubModal {
  private store: SubModalStore;
  private children: HTMLElement;
  private wrapper: HTMLElement;
  private parent: HTMLElement;

  constructor(parent: HTMLElement, children: HTMLElement) {
    this.parent = parent;
    this.store = new SubModalStore();
    this.children = children;
    this.store.subscribe(this);
  }

  update() {
    if (this.store.state.isOpen) {
      RangeSingleton.getInstance().saveTmp();
      this.wrapper = document.createElement("div");
      setStyle(this.wrapper, {
        position: "absolute",
        left: "0",
        top: "100%",
        padding: "12px",
        "border-radius": "8px",
        "box-shadow": "4px 4px 4px rgba(0,0,0,0.5)",
        "background-color": "#fff",
      });
      this.parent.appendChild(this.wrapper);
      this.wrapper.appendChild(this.children);
      document.addEventListener("click", this.clickOutSide);
    } else {
      RangeSingleton.getInstance().initializeTmp();
      this.parent.removeChild(this.wrapper);
      document.removeEventListener("click", this.clickOutSide);
    }
  }

  private clickOutSide = (e: any) => {
    const target = hasContains(this.wrapper, e.target);
    if (!target) this.closeModal();
  };

  render() {}

  openModal() {
    this.store.openModal();
  }

  closeModal() {
    this.store.closeModal();
  }

  toggleModal() {
    this.store.toggleModal();
  }

  get isOpen() {
    return this.store.state.isOpen;
  }
}

export default SubModal;
