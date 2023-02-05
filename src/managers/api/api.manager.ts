import EngineManager from '../engine.manager';
import {
  decryptMessage,
  encryptMessage,
  hexToBase64Key,
} from 'engine/utils/encryption.utils';
import {ChatPacketSendDto, ServerDto} from 'types/Dto';
import {PacketEvent} from 'engine/definitions/enums/networks.enums';
import {ServerScope} from 'engine/definitions/local/types/api.types';
import WebsocketServerManager from './servers/websocket-server';
import HttpServerManager from './servers/http-server';

const DEFAULT_ENV_ACCESS_TOKEN_NAME = 'VERZA_ACCESS_TOKEN';

const PROD_ENDPOINT = 'https://api.verza.io';

const DEV_ENDPOINT = 'https://dev-api.verza.io';

class ApiManager {
  private _engine: EngineManager;

  server: ServerDto = null!;

  endpoint: string = PROD_ENDPOINT;

  websocketServer: WebsocketServerManager = null!;

  httpServer: HttpServerManager = null!;

  httpServerEndpoint: string = null!;

  accessToken: string = null!;

  private _accessTokenBase64: string = null!;

  get isServer() {
    return this.isApi;
  }

  get isClient() {
    return !this.isApi;
  }

  get isApi() {
    return !!this.accessToken;
  }

  get network() {
    return this._engine.network;
  }

  get encryptedPackets() {
    return this._engine.network.encryptedPackets;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;

    this._setEndpoint();

    this._setAccessToken();

    this.httpServer = new HttpServerManager(engine);
  }

  private _setEndpoint() {
    const {environment, apiEndpoint} = this._engine.params;

    if (apiEndpoint) {
      this.endpoint = apiEndpoint;
      return;
    }

    // set from env
    if (process.env['VERZA_API_ENDPOINT']) {
      this.endpoint = process.env['VERZA_API_ENDPOINT'];
      return;
    }

    switch (environment) {
      case 'prod': {
        this.endpoint = PROD_ENDPOINT;
        break;
      }
      case 'dev': {
        this.endpoint = DEV_ENDPOINT;
        break;
      }
    }
  }

  private _setAccessToken() {
    // get from engine params
    let accessToken = this._engine.params.accessToken;

    // check for API Key
    if (!accessToken) {
      if (
        typeof process !== 'undefined' &&
        process.env[DEFAULT_ENV_ACCESS_TOKEN_NAME]
      ) {
        accessToken = process.env[DEFAULT_ENV_ACCESS_TOKEN_NAME];
      }

      if (!accessToken) return;
    }

    // abort if using it on the client
    if (
      !this.endpoint.startsWith('http://localhost') &&
      typeof window !== 'undefined'
    ) {
      throw new Error(
        'DO NOT INCLUDE THE "ACCESS TOKEN" IN CLIENT-SIDE SCRIPTS',
      );
    }

    // set api key
    this.accessToken = accessToken;

    // set base64 key
    this._accessTokenBase64 = hexToBase64Key(this.accessToken);
  }

  encryptPacket(data: unknown) {
    return encryptMessage(data, this._accessTokenBase64);
  }

  decryptPacket(data: string) {
    return decryptMessage(data, this._accessTokenBase64);
  }

  async handle(rawData: unknown): Promise<unknown> {
    return this.httpServer.handle(rawData);
  }

  emitChat(text: string, playerId?: number, scope?: ServerScope) {
    const chatPacket: ChatPacketSendDto = {
      m: text,

      p: playerId,
    };

    // emit
    this.emitPacket(PacketEvent.Chat, chatPacket, scope);
  }

  emitPacket(event: PacketEvent, data?: unknown, scope?: ServerScope) {
    if (this.isServer) {
      if (!scope || scope === 'remote') {
        this.httpServer.emitToServerAction(event, data);
      }
    } else {
      if (!scope || scope === 'script') {
        this.httpServer.emit(event, data);
      }
    }
  }

  connectWs() {
    if (!this.websocketServer) {
      this.websocketServer = new WebsocketServerManager(this._engine);
    }

    this.websocketServer.connect();
  }

  destroy() {
    this.websocketServer?.disconnect();
  }
}

export default ApiManager;
