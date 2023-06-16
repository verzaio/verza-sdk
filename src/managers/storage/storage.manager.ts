import {DEFAULT_STORAGE_SCOPE} from 'engine/definitions/constants/storage.constants';
import MemoryStoreManager from 'engine/managers/storage/memory-store.manager';
import PersistentStoreManager from 'engine/managers/storage/persistent-store.manager';

import {EngineManager} from '../engine.manager';

class StorageManager {
  private _engine: EngineManager;

  private _stores: Map<
    string,
    PersistentStoreManager<any> | MemoryStoreManager<any>
  > = new Map();

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  getPersistentStore<T = any>(
    name: string,
    scope = DEFAULT_STORAGE_SCOPE,
  ): PersistentStoreManager<T> {
    const key = `persistent:${scope.toLowerCase()}:${name.toLowerCase()}`;

    if (this._stores.has(key)) {
      return this._stores.get(key) as PersistentStoreManager<T>;
    }

    const store = new PersistentStoreManager<T>(this._engine, name, scope);

    this._stores.set(key, store);

    return store;
  }

  getMemoryStore<T = any>(
    name: string,
    scope = DEFAULT_STORAGE_SCOPE,
  ): MemoryStoreManager<T> {
    const key = `memory:${scope.toLowerCase()}:${name.toLowerCase()}`;

    if (this._stores.has(key)) {
      return this._stores.get(key) as MemoryStoreManager<T>;
    }

    const store = new MemoryStoreManager<T>(this._engine, name, scope);

    this._stores.set(key, store);

    return store;
  }
}

export default StorageManager;
