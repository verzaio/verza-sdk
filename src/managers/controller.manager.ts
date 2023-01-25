import EventsManager from './events.manager';

type DataBase = {
  [name: string]: unknown;
};

type ControllerEventMap<T extends DataBase> = {
  [key in keyof T]: (value: T[key], name: keyof T) => void;
};

class ControllerManager<Data extends DataBase = DataBase> {
  data: Data;

  events = new EventsManager<ControllerEventMap<Data>>();

  constructor(data: Data) {
    this.data = data;
  }

  set<T extends keyof Data>(name: T, value: Data[T]) {
    this.data[name] = value;

    (this.events.emit as any)(name, value, name);

    return value;
  }

  get<T extends keyof Data>(name: T): Data[T] {
    return this.data[name];
  }
}

export default ControllerManager;
