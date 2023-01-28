import {ScriptEventMap} from 'engine/definitions/types/events.types';
import {isValidEnv} from 'engine/utils/misc';
import ChatManager from './chat.manager';
import CommandsManager from './commands/commands.manager';
import ControllerManager from './controller.manager';
import EventsManager from './events.manager';
import MessengerManager from './messenger.manager';
import UIManager from './ui.manager';

class EngineManager {
  ui: UIManager;

  chat: ChatManager;

  commands: CommandsManager;

  messenger = new MessengerManager<ScriptEventMap>('sender');

  events = new EngineEvents(this);

  controller = new ControllerManager({
    connected: false,
  });

  private _binded = false;

  /* accessors */
  get connected() {
    return this.controller.data.connected;
  }

  constructor() {
    // register all events
    this.messenger.events.registerEvents = true;

    this.ui = new UIManager(this);

    this.chat = new ChatManager(this);

    this.commands = new CommandsManager(this);
  }

  connect() {
    if (!isValidEnv()) return;

    // destroy
    this.destroy();

    // mark as binded
    this._binded = true;

    // binds
    this.ui.bind();

    // events
    this.messenger.events.on('onConnected', this._onConnected);

    // connect it
    this.messenger.connect(window.top!);
  }

  private _onConnected = () => {
    this.controller.set('connected', true);
  };

  destroy() {
    if (!this._binded) return;

    this.controller.set('connected', false);

    // destroy
    this.messenger.destroy();
    this.commands.destroy();

    // remove all events
    this.events.removeAllListeners();
    this.controller.events.removeAllListeners();

    this._binded = false;
  }
}

class EngineEvents<
  T extends ScriptEventMap = ScriptEventMap,
> extends EventsManager<T> {
  private _engine: EngineManager;

  private _bindedEvents = new Map<keyof T, (...args: any[]) => void>();

  constructor(engine: EngineManager) {
    super();

    this._engine = engine;
  }

  on<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    this._bind(eventName);

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
          this.emit(eventName, ...event.data);
        },
      ),
    );
  }

  private _unbind<A extends keyof T>(eventName: A): void {
    if (
      this._bindedEvents.has(eventName) &&
      this.getEmitter().listenerCount(eventName as any) === 0
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
