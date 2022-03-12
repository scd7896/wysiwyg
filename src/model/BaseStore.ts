export interface IComponent {
  render(): void;
  update?: (param?: any) => void;
}

export class BaseStore<T> {
  private listeners: IComponent[];
  private timer: number;
  public state: T;

  constructor(defaultState: T) {
    this.listeners = [];
    this.state = defaultState;
  }

  setState(nextState: Partial<T>) {
    this.state = {
      ...this.state,
      ...nextState,
    };
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = 0;
    }
    this.timer = setTimeout(() => {
      this.listeners.map((listener) => listener.update());
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
