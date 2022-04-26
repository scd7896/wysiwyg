class EventSingleton {
  private static instance: EventSingleton;
  parent: HTMLElement;

  private constructor(parent?: HTMLElement) {
    if (parent) this.parent = parent;
  }

  static getInstance(parent?: HTMLElement) {
    if (this.instance) return this.instance;
    this.instance = new this(parent);
    return this.instance;
  }

  on(type: string, listener: any) {
    this.parent.addEventListener(type, listener);
  }

  emit(type: string) {
    const event = new Event(type);

    this.parent.dispatchEvent(event);
  }
}

export default EventSingleton;
