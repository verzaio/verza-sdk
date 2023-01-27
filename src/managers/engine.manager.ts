import {ScriptEventMap} from 'engine/definitions/types/events.types';
import CommandsManager from './commands.manager';
import ControllerManager from './controller.manager';
import EventsManager from './events.manager';
import MessengerManager from './messenger.manager';
import UIManager from './ui.manager';

class EngineManager {
  ui: UIManager;

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

    this.commands = new CommandsManager(this);
  }

  private _bind() {
    const events: (keyof ScriptEventMap)[] = [
      'onChat',
      'onHide',
      'onSetSize',
      'onShow',
    ];

    // forward events
    events.forEach(eventName => {
      this.messenger.events.on(eventName, (event: any) => {
        this.events.emit(eventName, ...event.data);
      });
    });
  }

  private _onConnected = () => {
    this.controller.set('connected', true);
  };

  connect() {
    // ignore if not present
    if (typeof window === 'undefined') return;

    this._bind();

    this.messenger.events.off('onConnected', this._onConnected);
    this.messenger.events.on('onConnected', this._onConnected);

    // local not allowed
    if (window.self === window.top || !window.top) {
      console.debug(
        'Engine cannot initiate from the same page, make the script is included on the server.',
      );
      return;
    }

    // connect it
    this.messenger.connect(window.top);
  }

  destroy() {
    this.messenger.events.off('onConnected', this._onConnected);

    // destroy
    this.messenger.destroy();

    // remove all events
    this.controller.events.removeAllListeners();

    this.controller.set('connected', false);
  }
}

export default EngineManager;
