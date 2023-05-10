import {Vector3} from 'three';

import {
  ANIMATIONS,
  ANIMATIONS_INDEX,
} from 'engine/definitions/constants/animations.constants';
import {PlayerState} from 'engine/definitions/types/players.types';

import EntityHandleManager from '../../entity/entity-handle.manager';
import type PlayerManager from './player.manager';

class PlayerHandleManager extends EntityHandleManager<PlayerManager> {
  state: PlayerState = 'idle';

  velocity: Vector3 = new Vector3();

  surfing = 0;

  onGround = false;

  stateAnimIndex = 0;

  get stateAnim(): keyof typeof ANIMATIONS | null {
    return ANIMATIONS_INDEX[this.stateAnimIndex] ?? null;
  }

  constructor(player: PlayerManager) {
    super(player);

    this.stateAnimIndex = ANIMATIONS.none;
  }
}

export default PlayerHandleManager;
