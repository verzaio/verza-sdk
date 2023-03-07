import {ScriptMessengerMethods} from 'engine/definitions/types/messenger.types';

import {EngineManager} from '../..';

class MethodsHandlerManager {
  private _engine: EngineManager;

  private _eventsList = new Map<string, keyof ScriptMessengerMethods>();

  constructor(engine: EngineManager) {
    this._engine = engine;

    // add as a list
    Object.keys(this.methods).forEach(name => {
      const parts = name.split('_');

      this._eventsList.set(parts[0], name as keyof ScriptMessengerMethods);
    });
  }

  get(eventName: string): [keyof ScriptMessengerMethods, () => void] | null {
    const methodName = `${
      eventName.split('_')[0]
    }Raw` as keyof ScriptMessengerMethods;

    if (!this._eventsList.has(methodName)) {
      return null;
    }

    return [
      methodName,
      this.methods[this._eventsList.get(methodName)!] as () => void,
    ];
  }

  methods: Partial<ScriptMessengerMethods> = {
    onObjectStreamInRaw: async ({data: [objectId]}) => {
      const object = await this._engine.objects.resolveObject(objectId);

      this._engine.events.emit('onObjectStreamIn', object);
    },

    onObjectStreamOutRaw: async ({data: [objectId]}) => {
      const object = await this._engine.objects.resolveObject(objectId);

      this._engine.events.emit('onObjectStreamOut', object);
    },
  };
}

export default MethodsHandlerManager;
