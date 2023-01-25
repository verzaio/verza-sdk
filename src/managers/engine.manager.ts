import {ScriptEventMap} from 'engine/definitions/types/events.types';
import ControllerManager from './controller.manager';
import MessengerManager from './messenger.manager';
import UIManager from './ui.manager';

class EngineManager {
  ui: UIManager;

  messenger = new MessengerManager<ScriptEventMap>('sender');

  controller = new ControllerManager({
    connected: false,
  });

  /* accessors */
  get connected() {
    return this.controller.data.connected;
  }

  constructor() {
    this.ui = new UIManager(this);
  }

  private _onConnected = () => {
    this.controller.set('connected', true);
  };

  connect() {
    // ignore if not present
    if (typeof window === 'undefined') return;

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

    // destroy messenger
    this.messenger.destroy();

    // remove all events
    this.controller.events.removeAllListeners();

    this.controller.set('connected', false);
  }
}

export default EngineManager;
