import {ScriptMessengerMethods} from 'engine/definitions/types/messenger.types';

import {EngineManager} from '../..';

export type HandlerCallback = (id: string) => void;

export type MethodsHandler<
  T extends keyof ScriptMessengerMethods = keyof ScriptMessengerMethods,
> = {
  listener?: ScriptMessengerMethods[T];
  load?: HandlerCallback;
  unload?: HandlerCallback;
};

type EventMap = Partial<{
  [name in keyof ScriptMessengerMethods]: MethodsHandler<name>;
}>;

class MethodsHandlerManager {
  private _engine: EngineManager;

  private _eventsList = new Map<string, keyof ScriptMessengerMethods>();

  constructor(engine: EngineManager) {
    this._engine = engine;

    // build events list
    Object.keys(this.methods).forEach(name => {
      const parts = name.split('_');

      this._eventsList.set(parts[0], name as keyof ScriptMessengerMethods);
    });
  }

  get(
    eventName: string,
  ): [keyof ScriptMessengerMethods, MethodsHandler] | null {
    const [part1, part2] = eventName.split('_');

    const methodName = `${part1}Raw` as keyof ScriptMessengerMethods;

    if (!this._eventsList.has(methodName)) {
      return null;
    }

    const localMethodName = this._eventsList.get(methodName)!;
    const methods = this.methods[localMethodName]!;

    return [
      (part2
        ? `${methodName}_${part2}`
        : methodName) as keyof ScriptMessengerMethods,
      methods,
    ];
  }

  methods: EventMap = {
    onObjectStreamInRaw: {
      listener: async ({data: [objectId]}) => {
        const object = await this._engine.objects.resolveObject(objectId);

        this._engine.events.emit('onObjectStreamIn', object);
      },
    },

    onObjectStreamOutRaw: {
      listener: async ({data: [objectId]}) => {
        const object = await this._engine.objects.resolveObject(objectId);

        this._engine.events.emit('onObjectStreamOut', object);
      },
    },
  };
}

export default MethodsHandlerManager;
