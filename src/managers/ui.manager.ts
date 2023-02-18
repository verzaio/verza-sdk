import {INTERFACE_OPTIONS} from 'engine/definitions/constants/ui.constants';
import {
  PointerEventType,
  SizeProps,
} from 'engine/definitions/types/scripts.types';

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

    document.body.addEventListener('pointermove', this._onPointerEvent);
    document.body.addEventListener('pointerdown', this._onPointerEvent);
    document.body.addEventListener('pointerup', this._onPointerEvent);

    this._messenger.events.on('addInterface', ({data: [tag]}) => {
      this.interfaces.add(tag);
      this.controller.set('interfaces', new Set(this.interfaces));
    });

    this._messenger.events.on('removeInterface', ({data: [tag]}) => {
      this.interfaces.delete(tag);
      this.controller.set('interfaces', new Set(this.interfaces));
    });

    this._messenger.events.on('onCursorLock', ({data: [status]}) => {
      this.controller.set('cursorLock', status);
    });
  }

  private _onPointerEvent = (event: PointerEvent) => {
    // prevent `pointerdown` default action
    // allowing parent's window to handle dragging events
    if (event.type === 'pointerdown') {
      event.preventDefault();
    }

    this._messenger.emit('onPointerEvent', [
      event.clientX,
      event.clientY,
      event.type as PointerEventType,
    ]);
  };

  private _onEscapeKey = (event: KeyboardEvent) => {
    if (event.code !== 'Escape') return;

    this._messenger.emit('onEscapeKey');
  };

  /* interfaces */
  addInterface(tag: string) {
    this.interfaces.add(tag);
    this._messenger.emit('addInterface', [tag]);
  }

  toggleInterface(tag: string) {
    if (this.hasInterface(tag)) {
      this.removeInterface(tag);
      return;
    }

    this.addInterface(tag);
  }

  removeInterface(tag: string) {
    this.interfaces.delete(tag);
    this._messenger.emit('removeInterface', [tag]);
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

    document.body.removeEventListener('pointermove', this._onPointerEvent);
    document.body.removeEventListener('pointerdown', this._onPointerEvent);
    document.body.removeEventListener('pointerup', this._onPointerEvent);
  }
}

export default UIManager;
