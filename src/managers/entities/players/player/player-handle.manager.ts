import {Vector3} from 'three';

import {PlayerState} from 'engine/definitions/types/players.types';

import EntityHandleManager from '../../entity/entity-handle.manager';
import PlayerAnimationsManager from './player-animations.manager';
import type PlayerManager from './player.manager';

class PlayerHandleManager extends EntityHandleManager<PlayerManager> {
  /* public props */
  state: PlayerState = 'idle';

  velocity: Vector3 = new Vector3();

  animations: PlayerAnimationsManager;

  surfing = 0;

  onGround = false;

  private get _player() {
    return this.manager;
  }

  constructor(player: PlayerManager) {
    super(player);

    this.animations = new PlayerAnimationsManager(this._player);
  }
}

export default PlayerHandleManager;
