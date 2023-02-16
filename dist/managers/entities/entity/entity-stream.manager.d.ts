import PlayerManager from '../players/player/player.manager';
import EntityManager from './entity.manager';
declare class EntityStreamManager {
    entity: EntityManager;
    streamedPlayers: Set<PlayerManager>;
    constructor(entity: EntityManager);
    sync(player: PlayerManager, action: boolean): Promise<void>;
}
export default EntityStreamManager;
