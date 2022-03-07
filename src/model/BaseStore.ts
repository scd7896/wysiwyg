export interface IComponent {
	render(): void;
	update?: (param?: any) => void;
}

export class BaseStore<T> {
	private listeners: IComponent[];
	public state: T;

	constructor(defaultState: T) {
		this.listeners = [];
		this.state = defaultState;
	}

	setState(nextState: Partial<T>) {
		this.state = {
			...this.state,
			...nextState
		}

		this.listeners.map(listener => listener.update());
	}

	subscribe(listener: IComponent) {
		const prevListeners = this.listeners.filter(prevListener => prevListener !== listener);
		this.listeners = [...prevListeners, listener];
	}

	unSubscribe(listener: IComponent) {
		this.listeners = this.listeners.filter(prevListener => prevListener !== listener);
	}
}