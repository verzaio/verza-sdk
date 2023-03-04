import {EventListenersMap} from 'engine/managers/events.manager';

import {ScriptEventMap} from './scripts.types';

export type MessengerMessage<T = any> = MessageEvent<T>;

export type MessengerManagerEventsMap<T extends EventListenersMap> = {
  [key in keyof T]: (message: MessengerMessage<Parameters<T[key]>>) => void;
};

export type MessengerValidators<T extends EventListenersMap> = Partial<{
  [key in keyof T]: {
    callback?: (
      message: MessengerMessage<Parameters<T[key]>>,
    ) => unknown | Promise<unknown>;
    parser?: {
      parse: (params: unknown) => any;
    };
  };
}>;

export type ScriptMessengerMethods = {
  [key in keyof ScriptEventMap]: (
    message: MessengerMessage<Parameters<ScriptEventMap[key]>>,
  ) =>
    | Promise<ReturnType<ScriptEventMap[key]>>
    | ReturnType<ScriptEventMap[key]>;
};
