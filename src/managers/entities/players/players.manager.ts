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
import PlayersHandlerManager from './players-handler.manager';

class PlayersManager extends EntitiesManager<PlayerManager> {
  private _binded = false;

  private _handler: PlayersHandlerManager;

  constructor(engine: EngineManager) {
    super(EntityType.player, engine);

    this._handler = new PlayersHandlerManager(this);
  }

  create(id: number, data?: PlayerDataProps, isDetached = true) {
    return this._create(id, data, isDetached);
  }

  load() {
    if (this._binded) return;
    this._binded = true;

    this._handler.bind();
  }

  handlePacket(playerId: number, packet: PlayerPacketDto) {
    //console.log('packet', packet);

    const player = this.get(playerId);
    if (!player) return;

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
    if (packet.f !== undefined) {
      player.surfing = packet.f;
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

    // emit on update
    player.events.emit('onUpdate');
  }

  private _updateStateAnimIndex(player: PlayerManager, stateAnimIndex: number) {
    player.data.stateAnimIndex = stateAnimIndex;
  }

  private _updateState(player: PlayerManager, newState: PlayerState) {
    player.data.state = newState;
  }

  unload() {
    if (!this._binded) return;
    this._binded = false;

    this._handler.unbind();
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

  async setNametagsDistance(distance: number) {
    await this.engine.api.emitActionAsync('setPlayersNametagDistance', [
      distance,
    ]);
  }

  async setStreamerDistance(distance: number) {
    await this.engine.api.emitActionAsync('setPlayersStreamerDistance', [
      distance,
    ]);
  }
}

export default PlayersManager;
