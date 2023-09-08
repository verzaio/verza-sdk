import {v4} from 'uuid';

import {
  ProximityActionEvent,
  ProximityActionOptions,
} from 'engine/definitions/types/world.types';
import {toVector3Array} from 'engine/utils/vectors.utils';

import EngineManager from '../engine.manager';

class ProximityActionManager {
  id: string;

  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  private _subscriptions: Set<(event: ProximityActionEvent) => void> =
    new Set();

  constructor(
    engine: EngineManager,
    options: ProximityActionOptions,
    withId?: string,
    objectId?: string,
    playerId?: number,
  ) {
    this._engine = engine;

    this.id = withId ?? v4();

    if (options.position) {
      options.position = toVector3Array(options.position);
    }

    if (playerId) {
      this._messenger.emit('createPlayerProximityAction', [
        this.id,
        playerId,
        {
          ...options,
        },
      ]);
    } else if (objectId) {
      this._messenger.emit('createObjectProximityAction', [
        this.id,
        objectId,
        {
          ...options,
        },
      ]);
    } else {
      this._messenger.emit('createProximityAction', [this.id, options]);
    }
  }

  on(
    callback: (event: ProximityActionEvent) => void,
  ): (event: ProximityActionEvent) => void {
    this._engine.events.on(
      `onProximityActionTriggeredRaw_${this.id}`,
      callback,
    );

    this._subscriptions.add(callback);

    return callback;
  }

  off(callback: (event: ProximityActionEvent) => void) {
    this._engine.events.off(
      `onProximityActionTriggeredRaw_${this.id}`,
      callback,
    );

    this._subscriptions.delete(callback);
  }

  destroy() {
    this._subscriptions.forEach(callback => this.off(callback));

    this._messenger.emit('deleteProximityAction', [this.id]);
  }
}

export default ProximityActionManager;
