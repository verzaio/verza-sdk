import {
  INTERFACE_CHAT,
  INTERFACE_OPTIONS,
} from 'engine/definitions/constants/ui.constants';
import {
  IndicatorId,
  IndicatorTitle,
  KeyEventType,
  PointerEventType,
  SizeProps,
  ToolbarElement,
  UIEventBase,
} from 'engine/definitions/types/ui.types';

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
    return (
      this.hasInterface(INTERFACE_CHAT) ||
      ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '')
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

  setSize(props: SizeProps) {
    this._messenger.emit('setSize', [props]);
  }

  show() {
    this.visible = true;
    this._messenger.emit('show');
  }

  hide() {
    this.visible = false;
    this._messenger.emit('hide');
  }

  bind() {
    document.body.addEventListener('pointermove', this._onPointerEvent);
    document.body.addEventListener('pointerdown', this._onPointerEvent);
    document.body.addEventListener('pointerup', this._onPointerEvent);

    document.body.addEventListener('keydown', this._onKeyEvent);
    document.body.addEventListener('keyup', this._onKeyEvent);

    document.addEventListener('keyup', this._onEscapeKey);

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
      {
        type: event.type as PointerEventType,

        pointerType: event.pointerType,

        x: event.clientX,

        y: event.clientY,

        button: event.button,

        buttons: event.buttons,

        ...this._extractBaseEventProps(event),
      },
    ]);
  };

  private _onKeyEvent = (event: KeyboardEvent) => {
    this._messenger.emit('onKeyEvent', [
      {
        type: event.type as KeyEventType,

        code: event.code,

        key: event.key,

        ...this._extractBaseEventProps(event),
      },
    ]);
  };

  private _extractBaseEventProps(
    event: KeyboardEvent | PointerEvent,
  ): Required<UIEventBase> {
    return {
      altKey: event.altKey,

      ctrlKey: event.ctrlKey,

      metaKey: event.metaKey,

      shiftKey: event.shiftKey,

      activeInput: this.isActiveInput,
    };
  }

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

  showIndicator(id: IndicatorId, title?: IndicatorTitle) {
    this._messenger.emit('showIndicator', [id, title]);
  }

  hideIndicator(id: IndicatorId) {
    this._messenger.emit('hideIndicator', [id]);
  }

  addToolbar(toolbar: ToolbarElement) {
    this._messenger.emit('addToolbar', [toolbar]);
    return toolbar.id;
  }

  removeToolbar(toolbarId: string) {
    this._messenger.emit('removeToolbar', [toolbarId]);
  }

  destroy() {
    document.body.removeEventListener('pointermove', this._onPointerEvent);
    document.body.removeEventListener('pointerdown', this._onPointerEvent);
    document.body.removeEventListener('pointerup', this._onPointerEvent);

    document.body.removeEventListener('keydown', this._onKeyEvent);
    document.body.removeEventListener('keyup', this._onKeyEvent);

    document.removeEventListener('keyup', this._onEscapeKey);
  }
}

export default UIManager;
