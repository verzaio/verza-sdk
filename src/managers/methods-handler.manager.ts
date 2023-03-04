import {ScriptMessengerMethods} from 'engine/definitions/types/messenger.types';

import {EngineManager} from '..';

class MethodsHandlerManager {
  private _engine: EngineManager;

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  get(eventName: string): [keyof ScriptMessengerMethods, () => void] | null {
    const methodName = `${eventName}Raw` as keyof ScriptMessengerMethods;

    if (this.methods[methodName] === undefined) {
      return null;
    }

    return [methodName, this.methods[methodName] as () => void];
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
