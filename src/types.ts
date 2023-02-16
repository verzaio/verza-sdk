import EntitiesManager from 'engine/managers/entities/entities.manager';
import EntityHandleManager from 'engine/managers/entities/entity/entity-handle.manager';
import EntityStreamManager from 'engine/managers/entities/entity/entity-stream.manager';
import EntityManager from 'engine/managers/entities/entity/entity.manager';
import ObjectHandleManager from 'engine/managers/entities/objects/object/object-handle.manager';
import ObjectManger from 'engine/managers/entities/objects/object/object.manager';
import ObjectsManager from 'engine/managers/entities/objects/objects.manager';
import PlayerAnimationsManager from 'engine/managers/entities/players/player/player-animations.manager';
import PlayerCameraManager from 'engine/managers/entities/players/player/player-camera.manager';
import PlayerHandleManager from 'engine/managers/entities/players/player/player-handle.manager';
import PlayerMessengerManager from 'engine/managers/entities/players/player/player-messenger.manager';
import PlayerVoicechatManager from 'engine/managers/entities/players/player/player-voicechat.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';
import PlayersManager from 'engine/managers/entities/players/players.manager';

export type {
  EntitiesManager,
  EntityHandleManager,
  EntityStreamManager,
  EntityManager,
};

export type {ObjectsManager, ObjectManger, ObjectHandleManager};

export type {
  PlayersManager,
  PlayerManager,
  PlayerHandleManager,
  PlayerVoicechatManager,
  PlayerCameraManager,
  PlayerMessengerManager,
  PlayerAnimationsManager,
};
