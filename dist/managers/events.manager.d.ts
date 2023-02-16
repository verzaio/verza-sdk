/// <reference types="node" />
import { EventEmitter } from 'events';
type EventListener = (...args: any[]) => void;
export type EventListenersMap = {
    [name: string]: EventListener;
};
declare class EventsManager<T extends EventListenersMap = EventListenersMap> {
    private _eventEmitter;
    constructor();
    getEmitter(): EventEmitter;
    on<A extends keyof T>(eventName: A, listener: T[A]): T[A];
    off<A extends keyof T>(eventName: A, listener: T[A]): void;
    once<A extends keyof T>(eventName: A, listener: T[A]): T[A];
    listenerCount<A extends keyof T>(eventName: A): number;
    emit<A extends keyof T>(eventName: A, ...args: Parameters<T[A]>): boolean;
    removeAllListeners(): void;
}
export default EventsManager;
