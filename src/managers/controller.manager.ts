import EventsManager from './events.manager';

type DataBase = {
  [name: string]: unknown;
};

type ControllerEventMap<T extends DataBase> = {
  [key in keyof T]: (value: T[key]) => void;
};

class ControllerManager<Data extends DataBase = DataBase> {
  data: Data;

  events = new EventsManager<ControllerEventMap<Data>>();

  constructor(data: Data) {
    this.data = data;
  }

  set<T extends keyof Data, V extends Data[T]>(name: T, value: V) {
    this.data[name] = value;

    // too recursive, TS give me a break
    (this.events.emit as any)(name, value);

    return value;
  }

  get<T extends keyof Data>(name: T): Data[T] {
    return this.data[name];
  }
}

export default ControllerManager;
