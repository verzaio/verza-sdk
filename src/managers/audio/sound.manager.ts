import {Vector3} from 'three';

import {SoundLoop, SoundOptions} from 'engine/definitions/types/audio.types';
import {Vector3Array} from 'engine/definitions/types/world.types';
import {uuid} from 'engine/utils/misc.utils';
import {toVector3Array} from 'engine/utils/vectors.utils';

import {EngineManager} from '../engine.manager';

class SoundManager {
  private _engine: EngineManager;

  id: string;

  name: string;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager, name: string, withId?: string) {
    this._engine = engine;

    this.id = withId ?? uuid();

    this.name = name;
  }

  play() {
    this._messenger.emit('playSound', [this.id]);
    return this;
  }

  pause() {
    this._messenger.emit('pauseSound', [this.id]);
    return this;
  }

  resume() {
    this._messenger.emit('resumeSound', [this.id]);
    return this;
  }

  stop() {
    this._messenger.emit('stopSound', [this.id]);
    return this;
  }

  setVolume(volume: number) {
    this.setOptions({volume});
    return this;
  }

  setPlaybackRate(playbackRate: number) {
    this.setOptions({playbackRate});
    return this;
  }

  setLoop(loop: SoundLoop) {
    this.setOptions({loop});
    return this;
  }

  setLoopStart(loopStart: number) {
    this.setOptions({loopStart});
    return this;
  }

  setLoopEnd(loopEnd: number) {
    this.setOptions({loopEnd});
    return this;
  }

  setPosition(position: Vector3Array | Vector3) {
    this.setOptions({position});
    return this;
  }

  setMinDistance(minDistance: number) {
    this.setOptions({minDistance});
    return this;
  }

  setMaxDistance(maxDistance: number) {
    this.setOptions({maxDistance});
    return this;
  }

  setRolloffFactor(rolloffFactor: number) {
    this.setOptions({rolloffFactor});
    return this;
  }

  setOptions(options: SoundOptions) {
    if (options.position) {
      options.position = toVector3Array(options.position);
    }

    this._messenger.emit('setSoundOptions', [this.id, options]);
  }

  destroy() {
    this._messenger.emit('destroySound', [this.id]);
  }
}

export default SoundManager;
