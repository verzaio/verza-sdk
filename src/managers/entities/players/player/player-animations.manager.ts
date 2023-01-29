import {
  ANIMATIONS,
  ANIMATIONS_INDEX,
} from 'engine/definitions/constants/animations.constants';

import PlayerManager from './player.manager';

class PlayerAnimationsManager {
  /* public props */
  stateAnimIndex = 0;

  get stateAnim(): keyof typeof ANIMATIONS | null {
    return ANIMATIONS_INDEX[this.stateAnimIndex] ?? null;
  }

  private _player: PlayerManager;

  constructor(player: PlayerManager, initAnim?: number) {
    this._player = player;

    this.stateAnimIndex = initAnim ?? ANIMATIONS.none;
  }
}

export default PlayerAnimationsManager;
