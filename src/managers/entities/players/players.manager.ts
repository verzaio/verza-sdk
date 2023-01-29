import {EntityType} from 'engine/definitions/enums/entities.enums';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import PlayerManager from './player/player.manager';

class PlayersManager extends EntitiesManager<PlayerManager> {
  private _binded = false;

  private get _messenger() {
    return this.engine.messenger;
  }

  constructor(engine: EngineManager) {
    super(EntityType.player, engine);
  }

  bind() {
    if (this._binded) return;

    this._binded = true;

    this._messenger.events.on('onPlayerSetName', ({data: [playerId, name]}) => {
      this.engine.entities.player.get(playerId).data.name = name;
    });

    this._messenger.events.on(
      'onPlayerCreate',
      ({data: [playerId, name, streamed]}) => {
        const player = this.engine.entities.player.create(playerId, {
          name,
        });

        // stream
        if (streamed) {
          this.engine.entities.player.streamIn(player);
        }
      },
    );

    this._messenger.events.on('onPlayerDestroy', ({data: [playerId]}) => {
      this.engine.entities.player.destroy(
        this.engine.entities.player.get(playerId),
      );
    });

    this._messenger.events.on('onPlayerStreamIn', ({data: [playerId]}) => {
      this.engine.entities.player.streamIn(
        this.engine.entities.player.get(playerId),
      );
    });

    this._messenger.events.on('onPlayerStreamOut', ({data: [playerId]}) => {
      this.engine.entities.player.streamOut(
        this.engine.entities.player.get(playerId),
      );
    });
  }

  isMe(playerId1: number, playerId2: number) {
    return playerId1 === playerId2;
  }

  unload() {
    this._binded = false;
  }
}

export default PlayersManager;
