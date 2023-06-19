import BaseStoreManager from 'engine/managers/storage/base-store.manager';
import {StorageFilters, StorageResult} from 'engine/types';

import {EngineManager} from '../engine.manager';

class PersistentStoreManager<T = any> extends BaseStoreManager<T> {
  constructor(engine: EngineManager, name: string, scope: string) {
    super(engine, 'persistent', name, scope);
  }

  async set(key: string, value: unknown) {
    await this.messenger.emitAsync('setStoreValue', [
      this.mode,
      this.name,
      this.scope,
      key,
      value,
      0,
    ]);
  }

  async getList<D = T>(filters: StorageFilters = {}) {
    const {
      data: [result],
    } = await this.messenger.emitAsync('getStoreDataList', [
      this.mode,
      this.name,
      this.scope,
      filters,
    ]);

    return result as StorageResult<D>;
  }
}

export default PersistentStoreManager;
