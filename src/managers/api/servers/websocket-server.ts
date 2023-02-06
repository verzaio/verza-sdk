import {io, Socket} from 'socket.io-client';
import msgpackParser from 'socket.io-msgpack-parser';

import {
  ServerDto,
  ScriptSyncPacketDto,
  ScriptActionPacketDto,
  ScriptActionPacketSendDto,
} from 'engine/generated/dtos.types';
import {PacketEvent, PacketId} from 'engine/definitions/enums/networks.enums';
import EngineManager from 'engine/managers/engine.manager';
import SyncManager from './sync.manager';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';

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

      cache: 'no-cache',

      keepalive: true,

      referrerPolicy: 'no-referrer',

      credentials: 'omit',

      headers: {
        Authorization: `Bearer ${this._accessToken}`,
      },
    });

    // if error, output it
    if (response.status < 200 || response.status > 299) {
      try {
        console.error(
          'Verza API',
          JSON.stringify(await response.json(), null, 2),
        );
      } catch (e) {
        console.error('Verza API Error ', await response.text());
        throw e;
      }
    }

    return (await response.json()).data as ServerDto;
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
      console.info(`%c[VerzaServer] Connected!`, 'color: #5b75ff');

      if (!this.socket.active) {
        return;
      }

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
  ) {
    this.socket.emit(PacketEvent.ScriptAction, {
      e: eventName,
      d: args as any,
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
          dto.d ? (dto.d as any) : [],
        );
        break;
      }
    }
  };
}

export default WebsocketServerManager;
