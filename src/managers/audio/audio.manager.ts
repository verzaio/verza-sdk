import {Vector3} from 'three';

import {SoundItem, SoundOptions} from 'engine/definitions/types/audio.types';
import {Vector3Array} from 'engine/types';
import {toVector3Array} from 'engine/utils/vectors.utils';

import {EngineManager} from '../engine.manager';
import SoundManager from './sound.manager';

class AudioManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  async addSound(sound: SoundItem) {
    const {
      data: [added],
    } = await this._messenger.emitAsync('addSound', [sound]);

    return added;
  }

  removeSound(soundName: string) {
    this._messenger.emit('removeSound', [soundName]);
  }

  createSound(
    soundName: string,
    options: SoundOptions = {},
    withId?: string,
  ): SoundManager {
    const sound = new SoundManager(this._engine, soundName, withId);

    this._messenger.emit('createSound', [soundName, options, sound.id]);

    return sound;
  }

  playSound(soundName: string, options: SoundOptions = {}, withId?: string) {
    return this.createSound(
      soundName,
      {
        ...options,

        autoplay: true,
        autoDestroy: true,
      },
      withId,
    );
  }

  playSoundAtPosition(
    soundName: string,
    position: Vector3Array | Vector3,
    options: SoundOptions = {},
    withId?: string,
  ) {
    return this.playSound(
      soundName,
      {
        ...options,
        position: toVector3Array(position),
      },
      withId,
    );
  }
}

export default AudioManager;
