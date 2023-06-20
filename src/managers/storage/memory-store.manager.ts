import BaseStoreManager from 'engine/managers/storage/base-store.manager';

import {EngineManager} from '../engine.manager';

class MemoryStoreManager<T = any> extends BaseStoreManager<T> {
  constructor(engine: EngineManager, name: string, scope: string) {
    super(engine, 'memory', name, scope);
  }

  async set(key: string, value: unknown, ttl = 3600 * 24) {
    await this.messenger.emitAsync('setStoreValue', [
      this.mode,
      this.name,
      this.scope,
      key,
      value,
      ttl,
    ]);
  }
}

export default MemoryStoreManager;
