import {
  INTERFACE_CHAT,
  INTERFACE_CURSOR,
  INTERFACE_OPTIONS,
} from 'engine/definitions/constants/ui.constants';
import {
  FileTransfer,
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

  private _activeInput = false;

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
      this._activeInput ||
      this.hasInterface(INTERFACE_CHAT) ||
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

  setSize(props: SizeProps) {
    this._messenger.emit('setSize', [props as SizeProps]);
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
    document.body.addEventListener('focusin', this._onInputFocus, {
      passive: false,
    });

    document.body.addEventListener('focusout', this._onInputFocus, {
      passive: false,
    });

    document.addEventListener('pointermove', this._onPointerEvent, {
      passive: false,
    });
    document.addEventListener('pointerdown', this._onPointerEvent, {
      passive: false,
    });
    document.addEventListener('pointerup', this._onPointerEvent, {
      passive: false,
    });

    document.addEventListener('keydown', this._onKeyEvent, {
      passive: false,
    });
    document.addEventListener('keyup', this._onKeyEvent, {
      passive: false,
    });

    document.addEventListener('keyup', this._onEscapeKey, {
      passive: false,
    });

    document.addEventListener('dragenter', this._onDragEvent);
    document.addEventListener('dragleave', this._onDragEvent);
    document.addEventListener('dragover', this._onDragEvent);
    document.addEventListener('drop', this._onDragDrop);

    this._messenger.events.on('onInputFocus', ({data: [status]}) => {
      this._activeInput = status;
    });

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

    this._messenger.events.on('onCursorLock', ({data: [status]}) => {
      this.controller.set('cursorLock', status);
    });
  }

  private _onDragEvent = (event: DragEvent) => {
    event.preventDefault();

    switch (event.type) {
      case 'dragenter': {
        this._emitDragEvent('onDragEnter');
        break;
      }
      case 'dragleave': {
        this._emitDragEvent('onDragLeave');
        break;
      }
      case 'dragover': {
        this._emitDragEvent('onDragOver');
        break;
      }
    }
  };

  private _onDragDrop = async (event: DragEvent) => {
    event.preventDefault();

    const files = event.dataTransfer?.files;
    if (!files?.length) return;

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i);

      if (!file) continue;

      const buffer = await file.arrayBuffer();

      this._emitDragDrop({
        name: file.name,
        type: file.type,
        size: file.size,
        buffer,
      });
    }
  };

  private _isFocusElement() {
    return ['INPUT', 'TEXTAREA'].includes(
      document.activeElement?.tagName ?? '',
    );
  }

  private _lastFocusState = false;
  private _onInputFocus = () => {
    const focusState = this._isFocusElement();

    if (focusState !== this._lastFocusState) {
      this._lastFocusState = focusState;

      this._messenger.emit('onInputFocus', [this._lastFocusState]);
    }
  };

  private _onEscapeKey = (event: KeyboardEvent) => {
    if (event.code !== 'Escape') return;

    this._messenger.emit('onEscapeKey');
  };

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
    // ignore if active input
    if (this.activeInput) return;

    this._messenger.emit('onKeyEvent', [
      {
        type: event.type as KeyEventType,

        code: event.code,

        key: event.key,

        ...this._extractBaseEventProps(event),
      },
    ]);
  };

  private _emitDragEvent(event: 'onDragLeave' | 'onDragEnter' | 'onDragOver') {
    this._messenger.emit(event);
  }

  private _emitDragDrop(file?: FileTransfer) {
    if (!file) {
      this._messenger.emit('onDrop');
      return;
    }

    this._messenger.emit('onDrop', [file], [file.buffer]);
  }

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

  /* interfaces */
  addInterface(tag: string) {
    this.interfaces.add(tag);
    this._messenger.emit('addInterface', [tag]);
  }

  removeInterface(tag: string) {
    this.interfaces.delete(tag);
    this._messenger.emit('removeInterface', [tag]);
  }

  toggleInterface(tag: string) {
    if (this.hasInterface(tag)) {
      this.removeInterface(tag);
      return;
    }

    this.addInterface(tag);
  }

  hasInterface(tag: string) {
    return this.interfaces.has(tag);
  }

  // cursor
  toggleCursor() {
    this.toggleInterface(INTERFACE_CURSOR);
  }

  showCursor() {
    this.addInterface(INTERFACE_CURSOR);
  }

  hideCursor() {
    this.removeInterface(INTERFACE_CURSOR);
  }

  // options
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
    document.body.removeEventListener('focusin', this._onInputFocus);
    document.body.removeEventListener('focusout', this._onInputFocus);

    document.removeEventListener('pointermove', this._onPointerEvent);
    document.removeEventListener('pointerdown', this._onPointerEvent);
    document.removeEventListener('pointerup', this._onPointerEvent);

    document.removeEventListener('keydown', this._onKeyEvent);
    document.removeEventListener('keyup', this._onKeyEvent);

    document.removeEventListener('keyup', this._onEscapeKey);

    document.removeEventListener('dragenter', this._onDragEvent);
    document.removeEventListener('dragleave', this._onDragEvent);
    document.removeEventListener('dragover', this._onDragEvent);
    document.removeEventListener('drop', this._onDragDrop);
  }
}

export default UIManager;
