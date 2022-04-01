import { BaseStore } from "./BaseStore";

class ImageResizeState {
  selectedImage?: HTMLImageElement;
  constructor() {
    this.selectedImage = undefined;
  }
}

class ImageResizerStore extends BaseStore<ImageResizeState> {
  constructor() {
    super(new ImageResizeState());
  }

  setSelectedImage(image: HTMLImageElement) {
    this.setState({
      selectedImage: image,
    });
  }

  setInitlization() {
    this.setState({
      selectedImage: undefined,
    });
  }
}

export default new ImageResizerStore();
