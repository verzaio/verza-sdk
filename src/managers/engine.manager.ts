import {z} from 'zod';

import {ENTITIES_RENDERS} from 'engine/definitions/constants/entities.constants';
import {STREAMER_CHUNK_SIZE} from 'engine/definitions/constants/streamer.constants';
import {LocalEngineEvents} from 'engine/definitions/local/constants/engine.constants';
import {EngineParams} from 'engine/definitions/local/types/engine.types';
import {EventKey} from 'engine/definitions/types/events.types';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';
import {isValidEnv} from 'engine/utils/misc.utils';

import ApiManager from './api/api.manager';
import CameraManager from './camera.manager';
import ChatManager from './chat.manager';
import CommandsManager from './commands/commands.manager';
import ControllerManager from './controller.manager';
import ObjectsManager from './entities/objects/objects.manager';
import PlayersManager from './entities/players/players.manager';
import StreamerManager from './entities/streamer/streamer.manager';
import EventsManager from './events.manager';
import MessengerManager from './messenger.manager';
import NetworkManager from './network.manager';
import UIManager from './ui.manager';
import WorldManager from './world/world.manager';

export class EngineManager {
  z = z;

  network: NetworkManager;

  api: ApiManager;

  ui: UIManager = null!;

  chat: ChatManager;

  commands: CommandsManager;

  camera: CameraManager = null!;

  streamer: StreamerManager = null!;

  world: WorldManager;

  messenger = new MessengerManager<ScriptEventMap>('sender');

  eventsManager: Map<EventKey, EventsManager> = new Map();

  events = new EngineEvents(this);

  params: EngineParams = {};

  controller = new ControllerManager({
    connected: false,

    synced: false,

    playerId: null! as number,
  });

  entities: {
    [key in keyof typeof ENTITIES_RENDERS]: InstanceType<
      (typeof ENTITIES_RENDERS)[key]['EntitiesManager']
    >;
  } = {
    player: new PlayersManager(this),

    object: new ObjectsManager(this),
  };

  destroyed = false;

  private _binded = false;

  get name() {
    return (
      this.params.name ??
      this.messenger.id.substring(0, this.messenger.id.indexOf('-'))
    );
  }

  get syncPlayers() {
    return this.params.syncPlayers ?? true;
  }

  get syncPlayerUpdatesPriority() {
    return this.params.syncPlayerUpdatesPriority ?? false;
  }

  get syncPlayerUpdates() {
    return this.params.syncPlayerUpdates ?? true;
  }

  get syncPlayerControls() {
    return this.params.syncPlayerControls ?? true;
  }

  get syncCameraPosition() {
    return this.params.syncCameraPosition ?? false;
  }

  get synced() {
    return this.controller.data.synced;
  }

  get connected() {
    return this.controller.data.connected;
  }

  get localPlayerId() {
    return this.controller.data.playerId;
  }

  set localPlayerId(playerId: number) {
    this.controller.set('playerId', playerId);
  }

  get localPlayer() {
    return this.entities.player.get(this.localPlayerId);
  }

  get players() {
    return this.entities.player;
  }

  get objects() {
    return this.entities.object;
  }

  get isServer() {
    return this.api.isServer;
  }

  get isClient() {
    return this.api.isClient;
  }

  get chunkSize() {
    return this.network.server?.world?.chunk_size ?? STREAMER_CHUNK_SIZE;
  }

  constructor(params?: EngineParams) {
    this.params = params ?? {};

    // register all events
    this.messenger.events.registerEvents = true;

    this.api = new ApiManager(this);

    this.network = new NetworkManager(this);

    this.world = new WorldManager(this);

    // only for client
    if (this.isClient) {
      this.ui = new UIManager(this);
      this.camera = new CameraManager(this);
    }

    // only for server
    if (this.isServer) {
      this.streamer = new StreamerManager(this);
    }

    this.chat = new ChatManager(this);

    this.commands = new CommandsManager(this);

    // set renders
    Object.entries(ENTITIES_RENDERS).forEach(([key, value]) => {
      this.entities[key as keyof typeof ENTITIES_RENDERS].Handler =
        value.EntityHandle;
      this.entities[key as keyof typeof ENTITIES_RENDERS].Manager =
        value.EntityManager;
    });
  }

  connectServer() {
    this._setup();

    this.api.connectWs();
  }

  connectClient() {
    // validate env (only client)
    if (this.isClient && !isValidEnv()) {
      return;
    }

    this._setup();

    // sync player id
    this.messenger.events.on('setPlayerId', ({data: [playerId]}) => {
      this.localPlayerId = playerId;
    });

    // connect it
    this.messenger.connect(window.top!);
  }

  private _setup() {
    // destroy
    this.destroy();

    // mark as not destroyed
    this.destroyed = false;

    // mark as binded
    this._binded = true;

    // binds
    if (this.syncPlayers) {
      this.entities.player.load();
    }

    // events
    this.messenger.events.on('onConnect', () => {
      this.controller.set('connected', true);
    });

    this.messenger.events.on('onDisconnect', () => {
      this.controller.set('connected', false);
    });

    // events
    this.messenger.events.on('onSynced', () => {
      this.controller.set('synced', true);
    });

    // binds
    this.network.bind();
    this.api.bind(); // always after network
    this.ui?.bind();
    this.camera?.bind();
    this.streamer?.bind();
    this.world.bind();
  }

  destroy() {
    if (!this._binded) return;

    this.destroyed = true;

    this.controller.set('connected', false);

    this.controller.set('synced', false);

    // destroy
    this.api.destroy();
    this.messenger.destroy();
    this.commands.destroy();
    this.ui?.destroy();
    this.entities.player.unload();
    this.entities.object.unload();

    // remove all events
    this.events.removeAllListeners();
    this.controller.events.removeAllListeners();

    this._binded = false;
  }

  /* server */
  restartServer(reason?: string | null) {
    this.api.emitAction('restartServer', [reason ?? null]);
  }

  setForwardMessages(status: boolean) {
    this.api.emitAction('setForwardMessages', [status]);
  }
}

export class EngineEvents<
  T extends ScriptEventMap = ScriptEventMap,
> extends EventsManager<T> {
  private _engine: EngineManager;

  private _bindedEvents = new Map<keyof T, (...args: any[]) => void>();

  constructor(engine: EngineManager) {
    super();

    this._engine = engine;
  }

  on<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    // ignore local events
    if (!LocalEngineEvents.includes(eventName as keyof ScriptEventMap)) {
      this._bind(eventName);
    }

    return super.on(eventName, listener);
  }

  off<A extends keyof T>(eventName: A, listener: T[A]): void {
    super.off(eventName, listener);

    this._unbind(eventName);
  }

  once<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    console.debug('[EngineEvents] events.once not available');
    return listener;
  }

  removeAllListeners() {
    super.removeAllListeners();

    // remove all binds
    [...this._bindedEvents.keys()].forEach(event => this._unbind(event));
  }

  private _bind<A extends keyof T>(eventName: A) {
    if (this._bindedEvents.has(eventName)) return;

    this._bindedEvents.set(
      eventName,
      this._engine.messenger.events.on(
        eventName as any,
        (event: MessageEvent) => {
          this.emit(eventName, ...(event?.data ?? []));
        },
      ),
    );
  }

  private _unbind<A extends keyof T>(eventName: A): void {
    if (
      this._bindedEvents.has(eventName) &&
      this.getEmitter().listenerCount(eventName as string) === 0
    ) {
      this._engine.messenger.events.off(
        eventName as any,
        this._bindedEvents.get(eventName) as any,
      );

      this._bindedEvents.delete(eventName);
    }
  }
}

export default EngineManager;
