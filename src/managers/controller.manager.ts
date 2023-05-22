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

    Object.keys(data).forEach(name => {
      Object.defineProperty(this, name, {
        get() {
          return this.data[name];
        },

        set(value: unknown) {
          this.data[name] = value;

          this.events.emit(name, value);
        },
      });
    });
  }
}

export const createControllerManager = <Data extends DataBase = DataBase>(
  data: Data,
) => {
  return new ControllerManager<Data>(data) as ControllerManager<Data> & Data;
};

export default ControllerManager;
