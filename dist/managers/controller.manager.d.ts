import EventsManager from './events.manager';
type DataBase = {
    [name: string]: unknown;
};
type ControllerEventMap<T extends DataBase> = {
    [key in keyof T]: (value: T[key], name: keyof T) => void;
};
declare class ControllerManager<Data extends DataBase = DataBase> {
    data: Data;
    events: EventsManager<ControllerEventMap<Data>>;
    constructor(data: Data);
    set<T extends keyof Data>(name: T, value: Data[T]): Data[T];
    get<T extends keyof Data>(name: T): Data[T];
}
export default ControllerManager;
