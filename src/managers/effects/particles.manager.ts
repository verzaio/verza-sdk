import {Vector3} from 'three';

import {v4} from 'uuid';

import {ParticleOptions} from 'engine/definitions/types/effects.types';
import {Vector3Array} from 'engine/definitions/types/world.types';
import {toVector3Array} from 'engine/utils/vectors.utils';

import EngineManager from '../engine.manager';

class ParticlesManager {
  id: string;

  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(
    engine: EngineManager,
    options: ParticleOptions,
    withId?: string,
    playerId?: number,
    objectId?: string,
  ) {
    this._engine = engine;

    this.id = withId ?? v4();

    if (playerId) {
      this._messenger.emit('createPlayerParticles', [
        this.id,
        playerId,
        options,
      ]);
    } else if (objectId) {
      this._messenger.emit('createObjectParticles', [
        this.id,
        objectId,
        options,
      ]);
    } else {
      this._messenger.emit('createParticles', [this.id, options]);
    }
  }

  private _parseOptions(options: ParticleOptions) {
    if (options.position && typeof options.position !== 'string') {
      options.position = toVector3Array(options.position);
    }

    if (options.direction && typeof options.direction !== 'string') {
      options.direction = toVector3Array(options.direction);
    }

    return options;
  }

  setPosition(position: Vector3Array | Vector3) {
    this.setOptions({position});
  }

  setOptions(options: ParticleOptions, respawn = false) {
    this._messenger.emit('setParticlesOptions', [
      this.id,
      this._parseOptions(options),
      respawn,
    ]);
  }

  play(reset = false, options: ParticleOptions = {}, respawn = false) {
    this._messenger.emit('playParticles', [
      this.id,
      reset,
      this._parseOptions(options),
      respawn,
    ]);
  }

  pause() {
    this._messenger.emit('pauseParticles', [this.id]);
  }

  stop(instant = false) {
    this._messenger.emit('stopParticles', [this.id, instant]);
  }

  resume() {
    this._messenger.emit('resumeParticles', [this.id]);
  }

  destroy() {
    this._messenger.emit('destroyParticles', [this.id]);
  }
}

export default ParticlesManager;
