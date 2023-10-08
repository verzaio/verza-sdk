import {INTERFACE_CHAT} from 'engine/definitions/constants/ui.constants';

import {createControllerManager} from './controller.manager';
import EngineManager from './engine.manager';

class InputManager {
  private _engine: EngineManager;

  private _activeInput = false;

  /* controller */
  controller = createControllerManager({
    cursorLock: false,
  });

  private get _ui() {
    return this._engine.ui;
  }

  get cursorLock() {
    return this.controller.cursorLock;
  }

  get isActiveInput() {
    return (
      this._activeInput ||
      this._ui.hasInterface(INTERFACE_CHAT) ||
      this._isFocusElement()
    );
  }

  get activeInput() {
    return this.isActiveInput
      ? (document.activeElement as HTMLInputElement)
      : null;
  }

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  private _isFocusElement() {
    const isElementFocused =
      ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '') &&
      (document.activeElement as HTMLInputElement).selectionStart !== null;

    return isElementFocused;
  }

  bind() {
    this._messenger.events.on('onInputFocus', ({data: [status]}) => {
      this._activeInput = status;
    });

    this._messenger.events.on('onCursorLock', ({data: [status]}) => {
      this.controller.cursorLock = status;
    });

    this._messenger.events.on('onCursorLock', ({data: [status]}) => {
      this.controller.cursorLock = status;
    });
  }

  destroy() {
    //
  }
}

export default InputManager;
