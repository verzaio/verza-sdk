import {INTERFACE_OPTIONS} from 'engine/definitions/constants/ui.constants';
import {SizeProps} from 'engine/definitions/types/scripts.types';
import ControllerManager from './controller.manager';

import EngineManager from './engine.manager';

class UIManager {
  visible = false;

  private _engine: EngineManager;

  /* controller */
  controller = new ControllerManager({
    interfaces: new Set<string>(),

    cursorLock: false,
  });

  /* getters */
  get interfaces() {
    return this.controller.get('interfaces');
  }

  get cursorLock() {
    return this.controller.get('cursorLock');
  }

  get isActiveInput() {
    return document.activeElement?.tagName === 'INPUT';
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

  bind() {
    document.addEventListener('keyup', this._onEscapeKey);

    this._messenger.events.on('onAddInterface', ({data: [tag]}) => {
      this.interfaces.add(tag);
      this.controller.set('interfaces', new Set(this.interfaces));
    });

    this._messenger.events.on('onRemoveInterface', ({data: [tag]}) => {
      this.interfaces.delete(tag);
      this.controller.set('interfaces', new Set(this.interfaces));
    });

    this._messenger.events.on('onCursorLock', ({data: [status]}) => {
      this.controller.set('cursorLock', status);
    });
  }

  private _onEscapeKey = (event: KeyboardEvent) => {
    if (event.code !== 'Escape') return;

    this._messenger.emit('onEscapeKey');
  };

  /* interfaces */
  addInterface(tag: string) {
    this._messenger.emit('onAddInterface', [tag]);
  }

  removeInterface(tag: string) {
    this._messenger.emit('onRemoveInterface', [tag]);
  }

  hasInterface(tag: string) {
    return this.interfaces.has(tag);
  }

  isOptionsMenu() {
    return this.hasInterface(INTERFACE_OPTIONS);
  }

  setSize(props: SizeProps) {
    this._messenger.emit('onSetSize', [props]);
  }

  show() {
    this.visible = true;

    this._messenger.emit('onShow');
  }

  hide() {
    this.visible = false;

    this._messenger.emit('onHide');
  }

  destroy() {
    document.removeEventListener('keyup', this._onEscapeKey);
  }
}

export default UIManager;
