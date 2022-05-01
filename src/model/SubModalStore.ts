import { BaseStore } from "./BaseStore";

class SubModalState {
  isOpen: boolean;
  constructor() {
    this.isOpen = false;
  }
}

class SubModalStore extends BaseStore<SubModalState> {
  constructor() {
    super(new SubModalState());
  }

  openModal() {
    this.setState({ isOpen: true });
  }

  closeModal() {
    this.setState({ isOpen: false });
  }

  toggleModal() {
    this.setState({
      isOpen: !this.state.isOpen,
    });
  }
}

export default SubModalStore;
