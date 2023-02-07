import PlayerManager from '../players/player/player.manager';
import EntityManager from './entity.manager';

class EntityStreamManager {
  entity: EntityManager;

  streamedPlayers: Set<PlayerManager> = new Set();

  constructor(entity: EntityManager) {
    this.entity = entity;
  }

  async sync(player: PlayerManager, action: boolean) {
    console.debug(`syncing ${player.id} ${action}`);

    // add
    if (action) {
      // check if already added
      if (this.streamedPlayers.has(player)) return;

      this.streamedPlayers.add(player);

      // if player entity
      if (this.entity.type === 'player') {
        player.streamer.streamedPlayers.add(this.entity as PlayerManager);
      }
      return;
    }

    // check if already removed
    if (!this.streamedPlayers.has(player)) return;

    // remove
    this.streamedPlayers.delete(player);

    // if player entity
    if (this.entity.type === 'player') {
      player.streamer.streamedPlayers.delete(this.entity as PlayerManager);
    }
  }
}

export default EntityStreamManager;
