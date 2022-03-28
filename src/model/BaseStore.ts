export interface IComponent {
  render(): void;
  update?: (param?: any) => void;
}

export class BaseStore<T> {
  private listeners: IComponent[];
  static timer: number;
  public state: T;
  static activeListeners: IComponent[];

  constructor(defaultState: T) {
    this.listeners = [];
    this.state = defaultState;
    BaseStore.activeListeners = [];
  }

  setState(nextState: Partial<T>) {
    this.state = {
      ...this.state,
      ...nextState,
    };
    this.listeners.map((listener) => {
      if (BaseStore.activeListeners.find((activeListener) => activeListener === listener)) {
        return;
      }
      BaseStore.activeListeners.push(listener);
    });
    if (BaseStore.timer) {
      clearTimeout(BaseStore.timer);
      BaseStore.timer = 0;
    }
    BaseStore.timer = setTimeout(() => {
      BaseStore.activeListeners.map((listener) => listener.update());
    }, 1);
  }

  subscribe(listener: IComponent) {
    const prevListeners = this.listeners.filter((prevListener) => prevListener !== listener);
    this.listeners = [...prevListeners, listener];
  }

  unSubscribe(listener: IComponent) {
    this.listeners = this.listeners.filter((prevListener) => prevListener !== listener);
  }
}
