import {io, Socket} from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';

import {PacketEvent, PacketId} from 'engine/definitions/enums/networks.enums';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';
import {
  ServerDto,
  ScriptSyncPacketDto,
  ScriptActionPacketDto,
  ScriptActionPacketSendDto,
} from 'engine/generated/dtos.types';
import EngineManager from 'engine/managers/engine.manager';

import SyncManager from './sync.manager';

const WS_NAMESPACE = 'n';

export type PacketDto = ScriptSyncPacketDto | ScriptActionPacketDto;

class WebsocketServerManager {
  private _engine: EngineManager;

  socket: Socket = null!;

  server: ServerDto = null!;

  sync: SyncManager = null!;

  private _scriptsRoomId: string = null!;

  private get endpoint() {
    return this._engine.api.endpoint;
  }

  private get _accessToken() {
    return this._engine.api.accessToken;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;

    this.sync = new SyncManager(engine);
  }

  private async _fetchServer(): Promise<ServerDto> {
    const response = await fetch(`${this.endpoint}/network/action/server`, {
      method: 'GET',

      headers: {
        Authorization: `Bearer ${this._accessToken}`,
      },
    });

    // if error, output it
    if (response.status < 200 || response.status > 299) {
      throw await response.text();
    }

    return (await response.json()).data;
  }

  async _cleanup() {
    // mark as not synced, set via data to prevent event from firing
    this._engine.controller.data.synced = false;

    // clear entities
    this._engine.objects.entitiesMap.clear();
    this._engine.players.entitiesMap.clear();
  }

  async connect() {
    if (!this._accessToken) {
      console.debug('[api] accessToken is missing');
      return;
    }

    this.disconnect();

    this.socket = io(`${this.endpoint}/${WS_NAMESPACE}`, {
      path: '/websockets',
      withCredentials: true,
      query: {
        api_key: this._accessToken,
      },
      transports: ['websocket'],
      upgrade: false,
      parser: msgpackParser,

      autoConnect: false,
      reconnection: true,
      timeout: 5000,
    });

    const onConnect = async () => {
      console.info(
        `%c[VerzaServer] Connected to (${this.server.id} | region: ${this.server.region})`,
        'color: #5b75ff',
      );

      if (!this.socket.active) {
        return;
      }

      // emit connect
      this._engine.messenger.emitLocal('onConnect');

      this.socket.emit(PacketEvent.ScriptJoin);
    };

    const onReconnect = () => {
      console.info(`%c[VerzaServer] Reconnected!`, 'color: #5b75ff');
    };

    const onReconnectAttempt = () => {
      console.info(`%c[VerzaServer] Reconnect attempt!`, 'color: #5b75ff');
    };

    const onException = (err: unknown) => {
      console.warn(`[VerzaServer] ${WS_NAMESPACE}`, err);
    };

    const onDisconnect = () => {
      console.info(`%c[VerzaServer] Disconnected!`, 'color: #fe547e');

      // cleanup
      this._cleanup();

      // emit connect
      this._engine.messenger.emitLocal('onDisconnect');
    };

    // load server
    this.server = await this._fetchServer();

    this._scriptsRoomId = `s/${this.server.id}/s`;

    // abort if closed
    if (!this.socket) return;

    // listen for the server script's client
    this.socket.on(this._scriptsRoomId, this._handlePacket);

    this.socket.on('connect', onConnect);
    this.socket.on('reconnect_attempt', onReconnectAttempt);
    this.socket.on('reconnect', onReconnect);
    this.socket.on('exception', onException);
    this.socket.on('disconnect', onDisconnect);

    this.socket.connect();
  }

  disconnect() {
    if (!this.socket) return;

    this.socket.disconnect();
    this.socket = null!;
  }

  async emitAction<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
    playerId?: number,
  ) {
    this.socket.emit(PacketEvent.ScriptAction, {
      e: eventName,
      d: args as object,
      p: playerId,
    } satisfies ScriptActionPacketSendDto);
  }

  private _handlePacket = (packet: PacketDto) => {
    // console.log('packet', packet);

    switch (packet.t) {
      // script sync
      case PacketId.j: {
        (this.sync.events.emit as any)(
          ...(Array.isArray(packet.d) ? packet.d : []),
        );
        break;
      }

      // script action
      case PacketId.a: {
        const dto = packet as ScriptActionPacketDto;
        this._engine.api.emitLocalAction(
          dto.e as keyof ScriptEventMap,
          (dto.d ?? []) as [],
        );
        break;
      }
    }
  };
}

export default WebsocketServerManager;
