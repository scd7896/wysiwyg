import { BaseStore } from "./BaseStore";

type TMode = "file" | "url";

class ImageState {
  isMenuOpen: boolean;
  mode: TMode;

  constructor() {
    this.isMenuOpen = false;
    this.mode = "file";
  }
}

class ImageStore extends BaseStore<ImageState> {
  constructor() {
    super(new ImageState());
  }

  toggleMenu() {
    this.setState({
      isMenuOpen: !this.state.isMenuOpen,
    });
  }

  openMenu() {
    this.setState({
      isMenuOpen: true,
    });
  }

  closeMenu() {
    console.log("closeRequest");
    this.setState({
      isMenuOpen: false,
    });
  }

  setMode(mode: TMode) {
    this.setState({
      mode,
    });
  }
}

export default new ImageStore();
