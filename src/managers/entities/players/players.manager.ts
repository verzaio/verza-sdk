import {PLAYER_STATE_PACKET_INDEX} from 'engine/definitions/constants/players.constants';
import {EntityType} from 'engine/definitions/enums/entities.enums';
import {EntityPacketAction} from 'engine/definitions/enums/networks.enums';
import {PlayerState} from 'engine/definitions/types/players.types';
import {
  QuaternionArray,
  Vector3Array,
} from 'engine/definitions/types/world.types';
import {PlayerPacketDto, PlayerPacketUpdateDto} from 'types/Dto';

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

  load() {
    if (this._binded) return;

    this._binded = true;

    // player updates only on client
    if (!this.engine.isServer && this.engine.syncPlayerUpdates) {
      this._messenger.events.on(
        'onPlayerUpdate',
        ({data: [playerId, packet]}) => {
          this.handlePacket(playerId, packet);
        },
      );
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
    this._binded = false;
  }

  handlePacket(
    playerId: number,
    packet: PlayerPacketDto | PlayerPacketUpdateDto,
  ) {
    //console.log('packet', packet);

    const player = this.get(playerId);
    if (!player?.handle) return;

    // state
    if (packet.s !== undefined) {
      this._updateState(player, PLAYER_STATE_PACKET_INDEX[packet.s]);
    }

    // state animation
    if (packet.n !== undefined) {
      this._updateStateAnimIndex(player, packet.n);
    }

    // character
    if ('c' in packet) {
      player.data.character = packet.c;
    }

    // dimension
    if ('d' in packet) {
      player.dimension = packet.d ?? 0;
    }

    // position
    if (packet.p) {
      player.location.position.set(...(packet.p as Vector3Array));
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
}

export default PlayersManager;
