import {StorageModeType} from 'engine/definitions/types/storage.types';

import {EngineManager} from '../engine.manager';
import MessengerEmitterManager from '../messenger/messenger-emitter.manager';

class BaseStoreManager<T = any> {
  private readonly _engine: EngineManager;

  readonly mode: StorageModeType;

  readonly name: string;

  readonly scope: string;

  readonly messenger: MessengerEmitterManager;

  constructor(
    engine: EngineManager,
    mode: StorageModeType,
    name: string,
    scope: string,
  ) {
    this._engine = engine;
    this.name = name;
    this.scope = scope;
    this.mode = mode;

    this.messenger = new MessengerEmitterManager(this._engine);
  }

  async get<D = T>(key: string): Promise<D> {
    const {
      data: [result],
    } = await this.messenger.emitAsync('getStoreValue', [
      this.mode,
      this.name,
      this.scope,
      key,
    ]);

    return result as D;
  }

  async delete(key: string) {
    await this.messenger.emitAsync('deleteStoreValue', [
      this.mode,
      this.name,
      this.scope,
      key,
    ]);
  }
}

export default BaseStoreManager;
