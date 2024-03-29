import {z} from 'zod';

import {ENTITIES_RENDERS} from 'engine/definitions/constants/entities.constants';
import {STREAMER_CHUNK_SIZE} from 'engine/definitions/constants/streamer.constants';
import {LocalEngineEvents} from 'engine/definitions/local/constants/engine.constants';
import {EngineParams} from 'engine/definitions/local/types/engine.types';
import {EngineScriptEventMap} from 'engine/definitions/local/types/events.types';
import {EventKey} from 'engine/definitions/types/events.types';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';
import AudioManager from 'engine/managers/audio/audio.manager';
import InputManager from 'engine/managers/input.manager';
import StorageManager from 'engine/managers/storage/storage.manager';
import {uuid} from 'engine/utils/misc.utils';

import AnimationsManager from './animations.manager';
import ApiManager from './api/api.manager';
import AssetsManager from './assets.manager';
import CameraManager from './camera.manager';
import ChatManager from './chat.manager';
import ClothesManager from './clothes.manager';
import CommandsManager from './commands/commands.manager';
import {createControllerManager} from './controller.manager';
import EffectsManager from './effects/effects.manager';
import EntityEventsManager from './entities/entity/entity-events.manager';
import ObjectsManager from './entities/objects/objects.manager';
import PlayersManager from './entities/players/players.manager';
import StreamerManager from './entities/streamer/streamer.manager';
import EventsManager from './events.manager';
import MessengerManager from './messenger/messenger.manager';
import MethodsHandlerManager, {
  MethodsHandler,
} from './messenger/methods-handler.manager';
import NetworkManager from './network.manager';
import UIManager from './ui.manager';
import UtilsManager from './utils.manager';
import WorldManager from './world/world.manager';

export class EngineManager {
  z = z;

  domElement: HTMLElement = null!;

  network: NetworkManager;

  api: ApiManager;

  storage: StorageManager;

  input: InputManager = null!;

  ui: UIManager = null!;

  audio: AudioManager = null!;

  chat: ChatManager;

  utils: UtilsManager;

  commands: CommandsManager;

  camera: CameraManager = null!;

  streamer: StreamerManager = null!;

  world: WorldManager;

  clothes: ClothesManager = null!;

  animations: AnimationsManager = null!;

  effects: EffectsManager = null!;

  assets: AssetsManager = null!;

  methodsHandler: MethodsHandlerManager;

  messenger: MessengerManager<ScriptEventMap>;

  eventsManager: Map<EventKey, EventsManager | EntityEventsManager> = new Map();

  events = new EngineEvents(this);

  params: EngineParams = {};

  controller = createControllerManager({
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

  private _localId = uuid();

  get id() {
    return this.messenger.id ?? this._localId;
  }

  get name() {
    return (
      this.params.name ??
      this.messenger.id.substring(0, this.messenger.id.indexOf('-'))
    );
  }

  get syncPlayers() {
    return this.params.syncPlayers ?? true;
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
    return this.controller.synced;
  }

  get localPlayerId() {
    return this.controller.playerId;
  }

  set localPlayerId(playerId: number) {
    this.controller.playerId = playerId;
  }

  get localPlayer() {
    return this.entities.player.get(this.localPlayerId);
  }

  get players() {
    return this.entities.player as PlayersManager;
  }

  get objects() {
    return this.entities.object as ObjectsManager;
  }

  get isServer() {
    return this.api.isServer;
  }

  get isClient() {
    return this.api.isClient;
  }

  get isBrowser() {
    return typeof window !== 'undefined';
  }

  get chunkSize() {
    return this.network.server?.world?.chunk_size ?? STREAMER_CHUNK_SIZE;
  }

  constructor(params: EngineParams = {}) {
    this.params = params;

    this.messenger = new MessengerManager<ScriptEventMap>(
      'sender',
      params.id ?? this._localId,
    );

    // register all events
    this.messenger.events.registerEvents = true;

    this.api = new ApiManager(this);

    this.network = new NetworkManager(this);

    this.storage = new StorageManager(this);

    this.world = new WorldManager(this);

    this.methodsHandler = new MethodsHandlerManager(this);

    this.utils = new UtilsManager();

    // only for client
    if (this.isClient && this.isBrowser) {
      this.input = new InputManager(this);
      this.ui = new UIManager(this);
      this.audio = new AudioManager(this);
      this.camera = new CameraManager(this);
      this.assets = new AssetsManager(this);
      this.effects = new EffectsManager(this);
      this.animations = new AnimationsManager(this);
      this.clothes = new ClothesManager(this);
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

    if (this.isClient && this.isBrowser) {
      this._watchFrames();
    }
  }

  connectServer() {
    this._setup();

    if (!this.api.isWebServerAvailable) {
      this.api.connectWs();
    }
  }

  connectClient() {
    // validate env (only client)
    if (this.isClient && !this.isBrowser) {
      return;
    }

    if (typeof window === 'undefined') {
      throw new Error('Client scripts cannot be run on the server');
    }

    // set dom element
    this.domElement = document.getElementById(this.id)!;

    this._setup();

    // sync player id
    this.messenger.events.on('setPlayerId', ({data: [playerId]}) => {
      this.localPlayerId = playerId;
    });

    // connect it
    this.messenger.connect(window);
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
    this.messenger.events.on('onSynced', () => {
      this.controller.synced = true;
    });

    // events
    this.messenger.events.on('onDisconnect', () => {
      this.destroy();
    });

    // binds
    this.network.bind();
    this.api.bind(); // always after network
    this.input?.bind();
    this.ui?.bind();
    this.camera?.bind();
    this.streamer?.bind();
    this.world.bind();

    if (this.objects.entitiesMap.size) {
      this.objects.bind();
    }
  }

  destroy() {
    if (!this._binded) return;

    this.destroyed = true;

    this.events.emit('onDestroy');

    this.controller.synced = false;

    // destroy
    this.api.destroy();
    this.messenger.destroy();
    this.commands.destroy();
    this.input?.destroy();
    this.ui?.destroy();
    this.players.unload();
    this.objects.unload();
    this.utils.destroy();

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

  /* misc */
  requestResourcesCheck(freeze: boolean) {
    return this.messenger.emit('requestResourcesCheck', [freeze]);
  }

  areResourcesReady() {
    return this.messenger.emitAsync('areResourcesReady');
  }

  /* render */
  private _watchFrames() {
    let lastFrameTime = performance.now();

    const check = () => {
      requestAnimationFrame(delta => {
        if (this.destroyed) return;

        this.events.emit('onFrame', delta - lastFrameTime);

        lastFrameTime = delta;

        check();
      });
    };

    check();
  }
}

export class EngineEvents<
  T extends EngineScriptEventMap = EngineScriptEventMap,
> extends EventsManager<T> {
  private _engine: EngineManager;

  private _bindedEvents = new Map<keyof T, (...args: any[]) => void>();

  private _bindedHandler = new Map<keyof T, MethodsHandler>();

  constructor(engine: EngineManager) {
    super();

    this._engine = engine;
  }

  on<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    // bind handler
    const handler = this._engine.methodsHandler.get(eventName as string);
    if (handler) {
      this._bindHandler(handler[0] as A, handler[1]);
    } else {
      // ignore local events
      if (!LocalEngineEvents.includes(eventName as keyof ScriptEventMap)) {
        this._bind(eventName);
      }
    }

    return super.on(eventName, listener);
  }

  off<A extends keyof T>(eventName: A, listener: T[A]): void {
    super.off(eventName, listener);

    // bind handler
    const method = this._engine.methodsHandler.get(eventName as string);
    if (method?.[1]?.load) {
      this._unbindHandler(method[0] as A);
    } else {
      this._unbind(eventName);
    }
  }

  once<A extends keyof T>(_: A, listener: T[A]): T[A] {
    console.debug('[EngineEvents] events.once is not available');
    return listener;
  }

  removeAllListeners() {
    super.removeAllListeners();

    // remove all binds
    [...this._bindedEvents.keys()].forEach(event => this._unbind(event));
  }

  private _bind<A extends keyof T>(
    eventName: A,
    callback?: (event?: MessageEvent) => void,
  ) {
    if (this._bindedEvents.has(eventName)) return;

    this._bindedEvents.set(
      eventName,
      this._engine.messenger.events.on(
        eventName as keyof ScriptEventMap,
        (event: MessageEvent) => {
          if (callback) {
            callback(event);
          } else {
            this.emit(eventName, ...(event?.data ?? []));
          }
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
        eventName as keyof ScriptEventMap,
        this._bindedEvents.get(eventName) as any,
      );

      this._bindedEvents.delete(eventName);
    }
  }

  private _bindHandler<A extends keyof T>(
    eventName: A,
    handler: MethodsHandler,
  ) {
    // is local
    if (handler.load) {
      if (this._bindedHandler.has(eventName)) return;

      handler.load((eventName as string).split('_')[1]);

      this._bindedHandler.set(eventName, handler);
    } else {
      this._bind(eventName, handler.listener as () => void);
    }
  }

  private _unbindHandler<A extends keyof T>(eventName: A) {
    if (
      this._bindedHandler.has(eventName) &&
      this.getEmitter().listenerCount(eventName as string) === 0
    ) {
      this._bindedHandler
        .get(eventName)
        ?.unload?.((eventName as string).split('_')[1]);

      this._bindedHandler.delete(eventName);
    }
  }
}

export default EngineManager;
