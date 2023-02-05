import {
  NetworkSyncEvent,
  NetworkSyncEventMap,
} from 'engine/definitions/enums/networks.enums';
import EngineManager from 'engine/managers/engine.manager';
import EventsManager from 'engine/managers/events.manager';

type SyncEventMap = {
  [key in keyof NetworkSyncEventMap]: (
    ...data: NetworkSyncEventMap[key]
  ) => void;
};

class SyncManager {
  private _engine: EngineManager;

  events = new EventsManager<SyncEventMap>();

  get players() {
    return this._engine.players;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;

    this._bind();
  }

  private _bind() {
    // player set
    this.events.on(NetworkSyncEvent.PlayerSet, playerId => {
      this.players.create(playerId);
    });

    // player unset
    this.events.on(NetworkSyncEvent.PlayerUnset, playerId => {
      this.players.destroy(this.players.get(playerId));
    });

    // player update
    this.events.on(NetworkSyncEvent.PlayerUpdate, packet => {
      this.players.handlePacket(packet.i!, packet);
    });

    // entity streamer
    this.events.on(
      NetworkSyncEvent.EntityStreamer,
      (playerId, entityId, entityType, action) => {
        const player = this.players.get(playerId);

        if (!player) return;

        const entity = this._engine.entities[entityType].get(entityId);

        entity?.stream?.sync(player, action);
      },
    );

    // voicechat
    this.events.on(
      NetworkSyncEvent.PlayerVoicechat,
      (playerId1, playerId2, status) => {
        const player1 = this.players.get(playerId1);
        const player2 = this.players.get(playerId2);

        if (!player1 || !player2) return;

        if (status) {
          player1.voicechat.connect(player2);
        } else {
          player1.voicechat.disconnect(player2);
        }
      },
    );

    // ready
    this.events.on(NetworkSyncEvent.Ready, () => {
      console.debug('[VerzaServer] Server synced');
      this._engine.messenger.emitLocal('onSynced');
    });
  }
}

export default SyncManager;
