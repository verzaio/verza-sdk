import { MessengerManagerEventsMap, MessengerValidators } from '../definitions/types/messenger.types';
import EventsManager, { EventListenersMap } from './events.manager';
type MessengerType = 'sender' | 'receiver';
type Merge<A, B> = A extends void ? B : A & B;
type MessengerManagerMap = {
    onConnect: () => void;
    onDisconnect: () => void;
    onLoad: () => void;
    register: (event: string) => void;
    unregister: (event: string) => void;
};
declare class MessengerManager<Events extends EventListenersMap = EventListenersMap> {
    id: string;
    type: MessengerType;
    channel: MessageChannel;
    port: MessagePort;
    validators: MessengerValidators<Events>;
    events: MessengerEvents<Merge<MessengerManagerMap, MessengerManagerEventsMap<Events>>>;
    connected: boolean;
    constructor(type: MessengerType, id?: string);
    setValidators(validators: MessengerValidators<Events>): void;
    connect(windowToConnect: Window): void;
    accept(port: MessagePort): void;
    private _disconnectPort;
    disconnect(): void;
    private _bindHandshakeListener;
    private _unbindHandshakeListener;
    private _onHandshake;
    private _onConnected;
    private _onMessage;
    canEmit<A extends keyof Events>(eventName: A): boolean;
    emitLocal<A extends keyof Events>(eventName: A, args?: Parameters<Events[A]>): Promise<void>;
    emit<A extends keyof Events>(eventName: A, args?: Parameters<Events[A]>, transfer?: Array<Transferable | OffscreenCanvas>): void;
    destroy(): void;
}
declare class MessengerEvents<T extends EventListenersMap = EventListenersMap> extends EventsManager<T> {
    registerEvents: boolean;
    registeredEvents: Set<keyof T>;
    private _messenger;
    constructor(messenger: MessengerManager);
    on<A extends keyof T>(eventName: A, listener: T[A]): T[A];
    off<A extends keyof T>(eventName: A, listener: T[A]): void;
    once<A extends keyof T>(eventName: A, listener: T[A]): T[A];
    removeAllListeners(): void;
    private _register;
    private _unregister;
    emitRegisteredEvents(): void;
}
export default MessengerManager;
