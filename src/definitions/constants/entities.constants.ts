import ObjectHandleManager from 'engine/managers/entities/objects/object/object-handle.manager';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import ObjectsManager from 'engine/managers/entities/objects/objects.manager';
import PlayerHandleManager from 'engine/managers/entities/players/player/player-handle.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';
import PlayersManager from 'engine/managers/entities/players/players.manager';
import Object from 'engine/world/entities/Object/Object';
import Player from 'engine/world/entities/Player/Player';

import {EntitiesRenders} from '../types/entities.types';

export const ENTITIES_RENDERS: EntitiesRenders = {
  player: {
    Render: Player!,
    EntitiesManager: PlayersManager,
    EntityManager: PlayerManager,
    EntityHandle: PlayerHandleManager,
  },

  object: {
    Render: Object!,
    EntitiesManager: ObjectsManager,
    EntityManager: ObjectManager,
    EntityHandle: ObjectHandleManager,
  },
};