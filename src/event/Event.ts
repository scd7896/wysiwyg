class EventObject {
  private listeners: Record<string, Array<Function>>;

  constructor() {
    this.listeners = {};
  }

  on(type: string, listener: Function) {
    if (this.listeners[type]) {
      if (!this.listeners[type].find((it) => it === listener)) {
        this.listeners[type].push(listener);
      }
    } else {
      this.listeners[type] = [listener];
    }
  }

  emit(type: string, ...args: any[]) {
    setTimeout(() => {
      if (this.listeners[type]) {
        this.listeners[type].map((listener) => listener(...args));
      }
    }, 1);
  }

  removeListener(type: string, listener: Function) {
    if (this.listeners[type]) {
      this.listeners[type] = this.listeners[type].filter((it) => it !== listener);
    }
  }
}

export default EventObject;
