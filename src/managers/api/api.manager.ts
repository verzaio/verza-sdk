import EngineManager from '../engine.manager';
import {
  decryptMessage,
  encryptMessage,
  hexToBase64Key,
} from 'engine/utils/encryption.utils';
import {ServerDto} from 'engine/generated/dtos.types';
import WebsocketServerManager from './servers/websocket-server';
import WebServerManager from './servers/web-server';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';

const DEFAULT_ENV_ACCESS_TOKEN_NAME = 'VERZA_ACCESS_TOKEN';

const PROD_ENDPOINT = 'https://api.verza.io';

const DEV_ENDPOINT = 'https://dev-api.verza.io';

class ApiManager {
  private _engine: EngineManager;

  server: ServerDto = null!;

  endpoint: string = PROD_ENDPOINT;

  websocketServer: WebsocketServerManager = null!;

  webServer: WebServerManager = null!;

  webServerEndpoint: string = null!;

  accessToken: string = null!;

  private _accessTokenBase64: string = null!;

  get isWebServerAvailable() {
    return this.isClient && !!this.webServerEndpoint;
  }

  get isWebServer() {
    return this.isServer && !this.websocketServer;
  }

  get isWebsocketServer() {
    return this.isServer && !!this.websocketServer;
  }

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

    this.webServer = new WebServerManager(engine);
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
    return this.webServer.handle(rawData);
  }

  async emitAction<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
  ) {
    // client
    if (this.isClient) {
      this._engine.messenger.emit(eventName, args);
      return;
    }

    // server
    this.emitActionToServer(eventName, args);
  }

  async emitActionToServer<A extends keyof ScriptEventMap>(
    eventName: A,
    args?: Parameters<ScriptEventMap[A]>,
  ) {
    // check if web or websocket server
    if (this.webServer) {
      this.webServer.emitAction(eventName, args);
    } else {
      this.websocketServer.emitAction(eventName, args);
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
