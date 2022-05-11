class EventObject {
  private parent: HTMLElement;

  constructor(parent?: HTMLElement) {
    if (parent) this.parent = parent;
  }

  on(type: string, listener: any) {
    this.parent.addEventListener(type, listener);
  }

  emit(type: string) {
    const event = new Event(type);

    this.parent.dispatchEvent(event);
  }
}

export default EventObject;
