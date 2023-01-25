import {EventEmitter} from 'events';

type EventListener = (...args: any[]) => void;

export type EventListenersMap = {
  [name: string]: EventListener;
};

class EventsManager<T extends EventListenersMap = EventListenersMap> {
  private _eventEmitter = new EventEmitter();

  constructor() {
    this._eventEmitter.setMaxListeners(Infinity);
  }

  on<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    this._eventEmitter.on(eventName as string, listener as EventListener);
    return listener;
  }

  off<A extends keyof T>(eventName: A, listener: T[A]): this {
    this._eventEmitter.off(eventName as string, listener as EventListener);
    return this;
  }

  once<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    this._eventEmitter.once(eventName as string, listener as EventListener);
    return listener;
  }

  listenerCount<A extends keyof T>(eventName: A): number {
    return this._eventEmitter.listenerCount(eventName as string);
  }

  emit<A extends keyof T>(eventName: A, ...args: Parameters<T[A]>): boolean {
    try {
      return this._eventEmitter.emit(eventName as string, ...args);
    } catch (e) {
      console.error(e);
    }

    return false;
  }

  removeAllListeners() {
    this._eventEmitter.removeAllListeners();
  }
}

export default EventsManager;
