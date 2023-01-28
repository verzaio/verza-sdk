import {ENGINE_EVENTS} from 'engine/definitions/constants/engine.constants';
import {ScriptEventMap} from 'engine/definitions/types/events.types';
import ChatManager from './chat.manager';
import CommandsManager from './commands/commands.manager';
import ControllerManager from './controller.manager';
import EventsManager from './events.manager';
import MessengerManager from './messenger.manager';
import UIManager from './ui.manager';

const isValidEnv = (): boolean => {
  // ignore if not present
  if (typeof window === 'undefined') {
    return false;
  }

  // local not allowed
  if (window.self === window.top || !window.top) {
    console.debug(
      'Script cannot initiate from the same page, make sure the script is included on the server.',
    );
    return false;
  }

  return true;
};

class EngineManager {
  ui: UIManager;

  chat: ChatManager;

  commands: CommandsManager;

  messenger = new MessengerManager<ScriptEventMap>('sender');

  events = new EventsManager<ScriptEventMap>();

  controller = new ControllerManager({
    connected: false,
  });

  /* accessors */
  get connected() {
    return this.controller.data.connected;
  }

  constructor() {
    this.ui = new UIManager(this);

    this.chat = new ChatManager(this);

    this.commands = new CommandsManager(this);
  }

  connect() {
    if (!isValidEnv()) return;

    // destroy
    this.destroy();

    // binds
    this._bind();
    this.ui.bind();

    // events
    this.messenger.events.on('onConnected', this._onConnected);

    // connect it
    this.messenger.connect(window.top!);
  }

  private _onConnected = () => {
    this.controller.set('connected', true);
  };

  private _bind() {
    // forward events
    ENGINE_EVENTS.forEach(eventName => {
      this.messenger.events.on(eventName, (event: MessageEvent) => {
        this.events.emit(eventName, ...event.data);
      });
    });
  }

  destroy() {
    if (!this.connected) return;

    this.messenger.events.off('onConnected', this._onConnected);

    // destroy
    this.messenger.destroy();

    // remove all events
    this.controller.events.removeAllListeners();

    this.controller.set('connected', false);
  }
}

export default EngineManager;
