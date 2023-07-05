import {Vector3} from 'three';

import {ParticlesOptions} from 'engine/definitions/types/effects.types';
import {Vector3Array} from 'engine/definitions/types/world.types';

import EngineManager from '../engine.manager';
import ObjectManager from '../entities/objects/object/object.manager';
import PlayerManager from '../entities/players/player/player.manager';
import ParticlesManager from './particles.manager';

class EffectsManager {
  private _engine: EngineManager;

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  createParticles(
    options: ParticlesOptions = {},
    withId?: string,
  ): ParticlesManager {
    return new ParticlesManager(this._engine, options, withId);
  }

  createPlayerParticles(
    player: number | PlayerManager,
    options: ParticlesOptions = {},
    withId?: string,
  ) {
    return new ParticlesManager(
      this._engine,
      options,
      withId,
      typeof player === 'number' ? player : player.id,
    );
  }

  createObjectParticles(
    object: string | ObjectManager,
    options: ParticlesOptions = {},
    withId?: string,
  ) {
    return new ParticlesManager(
      this._engine,
      options,
      withId,
      undefined,
      typeof object === 'string' ? object : object.id,
    );
  }

  playParticles(options: ParticlesOptions = {}, withId?: string) {
    return this.createParticles(
      {
        ...options,

        autoplay: true,
        autoDestroy: true,
      },
      withId,
    );
  }

  playParticlesAtPosition(
    soundName: string,
    position: Vector3Array | Vector3,
    options: ParticlesOptions = {},
    withId?: string,
  ) {
    return this.playParticles(
      {
        ...options,

        position: position,
      },
      withId,
    );
  }
}

export default EffectsManager;
