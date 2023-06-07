import EntityHandleManager from '../../entity/entity-handle.manager';
import type PlayerManager from './player.manager';

class PlayerHandleManager extends EntityHandleManager<PlayerManager> {
  constructor(player: PlayerManager) {
    super(player);
  }
}

export default PlayerHandleManager;
