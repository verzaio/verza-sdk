import {AnimationInfo} from '..';

import EngineManager from './engine.manager';

class AnimationsManager {
  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  async addAnimations(url: string): Promise<AnimationInfo[]> {
    const {
      data: [anims],
    } = await this._messenger.emitAsync('addAnimations', [url]);

    return anims;
  }

  async getAnimation(animId: string): Promise<AnimationInfo> {
    const {
      data: [anim],
    } = await this._messenger.emitAsync('getAnimation', [animId]);

    return anim;
  }

  async getAnimations(): Promise<AnimationInfo[]> {
    const {
      data: [anims],
    } = await this._messenger.emitAsync('getAnimations', []);

    return anims;
  }

  removeAnimation(animId: string) {
    this._messenger.emit('removeAnimation', [animId]);
  }
}

export default AnimationsManager;
