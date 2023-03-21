import {PLAYER_STATE_PACKET_INDEX} from 'engine/definitions/constants/players.constants';
import {EntityType} from 'engine/definitions/enums/entities.enums';
import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {
  PlayerDataProps,
  PlayerState,
} from 'engine/definitions/types/players.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {PlayerPacketDto} from 'engine/generated/dtos.types';

import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import PlayerManager from './player/player.manager';

class PlayersManager extends EntitiesManager<PlayerManager> {
  private _loadBinded = false;

  private get _messenger() {
    return this.engine.messenger;
  }

  constructor(engine: EngineManager) {
    super(EntityType.player, engine);
  }

  create(id: number, data?: PlayerDataProps) {
    return this._create(id, data);
  }

  load() {
    if (this._loadBinded) return;

    this._loadBinded = true;

    // client side updates
    if (this.engine.isClient) {
      // updates
      if (
        this.engine.syncPlayerUpdates ||
        this.engine.syncPlayerUpdatesPriority
      ) {
        this._messenger.events.on(
          'onPlayerUpdate',
          ({data: [playerId, packet]}) => {
            this.handlePacket(playerId, packet as PlayerPacketDto);
          },
        );
      }

      // updates (priority)
      if (this.engine.syncPlayerUpdatesPriority) {
        this._messenger.events.on('OPU', ({data: [playerId, packet]}) => {
          this.handlePacket(playerId, packet as PlayerPacketDto);
        });
      }

      // controls
      if (this.engine.syncPlayerControls) {
        this._messenger.events.on(
          'onControlChange',
          ({data: [key, newState]}) => {
            this.engine.localPlayer.controls[key] = newState;
          },
        );
      }
    }

    this._messenger.events.on('setPlayerName', ({data: [playerId, name]}) => {
      this.engine.players.get(playerId).data.name = name;
    });

    this._messenger.events.on(
      'onPlayerCreate',
      ({data: [playerId, data, streamed]}) => {
        const player = this.engine.players.create(playerId, data);

        // stream
        if (streamed) {
          this.engine.players.streamIn(player);
        }
      },
    );

    this._messenger.events.on('onPlayerDestroy', ({data: [playerId]}) => {
      this.engine.players.destroy(this.engine.players.get(playerId));
    });

    this._messenger.events.on(
      'onPlayerStreamIn',
      ({data: [playerId, data]}) => {
        this.engine.players.streamIn(this.engine.players.get(playerId), data);
      },
    );

    this._messenger.events.on('onPlayerStreamOut', ({data: [playerId]}) => {
      this.engine.players.streamOut(this.engine.players.get(playerId));
    });
  }

  unload() {
    this._loadBinded = false;

    // remove all events
    this.events.removeAllListeners();
    this.watcher.removeAllListeners();
  }

  handlePacket(playerId: number, packet: PlayerPacketDto) {
    //console.log('packet', packet);

    const player = this.get(playerId);
    if (!player?.handle) return;

    // name
    if (packet.e !== undefined) {
      player.updateName(packet.e);
    }

    // roles
    if (packet.l !== undefined) {
      player.updateRoles(packet.l);
    }

    // state
    if (packet.s !== undefined) {
      this._updateState(player, PLAYER_STATE_PACKET_INDEX[packet.s]);
    }

    // surfing
    if (packet.f !== undefined && player.handle) {
      player.handle.surfing = packet.f;
    }

    // state animation
    if (packet.n !== undefined) {
      this._updateStateAnimIndex(player, packet.n);
    }

    // character
    if (packet.c !== undefined) {
      player.data.character = packet.c;
    }

    // dimension
    if (packet.d !== undefined) {
      player.dimension = packet.d ?? 0;
      player.updateChunkIndex();
    }

    // position
    if (packet.p) {
      player.location.position.set(...(packet.p as Vector3Array));
      player.updateChunkIndex();
    }

    // rotation
    if (packet.r) {
      player.location.quaternion.set(...(packet.r as QuaternionArray));
    }

    // velocity
    if (packet.v) {
      player.velocity.set(...(packet.v as Vector3Array));
    }

    // head position
    if (packet.h) {
      player.events.emit('onHeadMove', packet.h as Vector3Array);
    }
  }

  private _updateStateAnimIndex(player: PlayerManager, stateAnimIndex: number) {
    if (!player.handle.animations) return;

    // sync state
    player.handle.animations.stateAnimIndex = stateAnimIndex;
  }

  private _updateState(player: PlayerManager, newState: PlayerState) {
    if (!player.handle) return;

    // sync state
    player.data.state = newState;
  }

  sendMessageToAll(text: string) {
    this.engine.chat.sendMessageToAll(text);
  }

  sendMessageTo(player: PlayerManager | number, text: string) {
    this.engine.chat.sendMessageTo(player, text);
  }

  forEachInChunk(
    chunkIndex: ChunkIndex,
    callback: (player: PlayerManager) => void,
  ) {
    this.engine.players.entitiesMap.forEach(player => {
      if (player.chunksIn.has(chunkIndex)) {
        callback(player);
      }
    });
  }
}

export default PlayersManager;
