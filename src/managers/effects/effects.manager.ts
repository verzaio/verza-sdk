import {Vector3} from 'three';

import {ParticleOptions} from 'engine/definitions/types/effects.types';
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
    options: ParticleOptions = {},
    withId?: string,
  ): ParticlesManager {
    return new ParticlesManager(this._engine, options, withId);
  }

  createPlayerParticles(
    player: number | PlayerManager,
    options: ParticleOptions = {},
    withId?: string,
  ): ParticlesManager {
    return new ParticlesManager(
      this._engine,
      options,
      withId,
      typeof player === 'number' ? player : player.id,
    );
  }

  createObjectParticles(
    object: string | ObjectManager,
    options: ParticleOptions = {},
    withId?: string,
  ): ParticlesManager {
    return new ParticlesManager(
      this._engine,
      options,
      withId,
      undefined,
      typeof object === 'string' ? object : object.id,
    );
  }

  playParticles(
    options: ParticleOptions = {},
    withId?: string,
  ): ParticlesManager {
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
    position: Vector3Array | Vector3,
    options: ParticleOptions = {},
    withId?: string,
  ): ParticlesManager {
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
