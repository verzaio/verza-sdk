import { EventListenersMap } from '../../managers/events.manager';
export type MessengerMessage<T = any> = MessageEvent<T>;
export type MessengerManagerEventsMap<T extends EventListenersMap> = {
    [key in keyof T]: (message: MessengerMessage<Parameters<T[key]>>) => void;
};
export type MessengerValidators<T extends EventListenersMap> = Partial<{
    [key in keyof T]: {
        callback?: (message: MessengerMessage<Parameters<T[key]>>) => void;
        parser?: {
            parse: (params: unknown) => any;
        };
    };
}>;
