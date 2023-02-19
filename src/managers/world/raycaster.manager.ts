import {Vector2} from 'three';

import EngineManager from '../engine.manager';

class RaycasterManager {
  private _engine: EngineManager;

  private _cursor = new Vector2();

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  raycastFromCursor(x: number, y: number) {
    this._cursor.set(x, y);
  }
}

export default RaycasterManager;
