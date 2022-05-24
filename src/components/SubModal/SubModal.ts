import { IRootStores } from "../../wysiwyg";
import SubModalStore from "../../model/SubModalStore";
import { hasContains, setStyle } from "../../utils/dom";

class SubModal {
  private store: SubModalStore;
  private children: HTMLElement;
  private wrapper: HTMLElement;
  private parent: HTMLElement;
  private root: IRootStores;
  public onClose: () => void;

  constructor(parent: HTMLElement, children: HTMLElement, root: IRootStores) {
    this.parent = parent;
    this.root = root;
    this.store = new SubModalStore();
    this.children = children;
    this.store.subscribe(this);
  }

  update() {
    if (this.store.state.isOpen) {
      this.root.range.saveTmp();
      this.wrapper = document.createElement("div");
      setStyle(this.wrapper, {
        position: "absolute",
        left: "0",
        top: "100%",
        padding: "12px",
        "border-radius": "8px",
        "box-shadow": "0 3px 5px -1px rgba(0,0,0,0.2),0 6px 10px 0 rgba(0,0,0,0.14),0 1px 18px 0 rgba(0,0,0,0.12)",
        "background-color": "#fff",
      });
      this.parent.appendChild(this.wrapper);
      this.wrapper.appendChild(this.children);
      document.addEventListener("click", this.clickOutSide);
    } else {
      this.root.range.initializeTmp();
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
    if (this.onClose) this.onClose();
  }

  toggleModal() {
    this.store.toggleModal();
  }

  get isOpen() {
    return this.store.state.isOpen;
  }
}

export default SubModal;
