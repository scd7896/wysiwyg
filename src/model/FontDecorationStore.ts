import { BaseStore } from "./BaseStore";

class FontDecorationState {
  isMenuOpen: boolean;

  constructor() {
    this.isMenuOpen = false;
  }
}

class FontDecorationStore extends BaseStore<FontDecorationState> {
  constructor() {
    super(new FontDecorationState());
  }

  openMenu() {
    this.setState({
      isMenuOpen: true,
    });
  }

  closeMenu() {
    this.setState({
      isMenuOpen: false,
    });
  }
}

export default new FontDecorationStore();
