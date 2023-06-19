import {INTERFACE_CHAT} from 'engine/definitions/constants/ui.constants';
import {
  InputEvent,
  FileTransfer,
  KeyEventType,
  PointerEventType,
  DragEventType,
  DragEvent as DragEventBase,
} from 'engine/definitions/types/input.types';

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

    this._messenger.events.on('onCursorLock', ({data: [status]}) => {
      this.controller.cursorLock = status;
    });

    this._messenger.events.on('onCursorLock', ({data: [status]}) => {
      this.controller.cursorLock = status;
    });
  }

  private _onDragEvent = (event: DragEvent) => {
    event.preventDefault();

    this._emitDragEvent({
      type: event.type as DragEventType,

      x: event.clientX,

      y: event.clientY,

      button: event.button,

      buttons: event.buttons,

      source: this._engine.id,
    });
  };

  private _onDragDrop = async (event: DragEvent) => {
    event.preventDefault();

    const fileList = event.dataTransfer?.files;
    if (!fileList?.length) return;

    const files: FileTransfer[] = [];

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList.item(i);

      if (!file) continue;

      const buffer = await file.arrayBuffer();

      files.push({
        name: file.name,
        type: file.type,
        size: file.size,
        buffer,
      });
    }

    this._emitDragDrop(
      {
        type: event.type as DragEventType,

        x: event.clientX,

        y: event.clientY,

        button: event.button,

        buttons: event.buttons,
      },
      files,
    );
  };

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

        source: this._engine.id,

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

  private _emitDragEvent(event: DragEventBase) {
    this._messenger.emit('onDragEvent', [event]);
  }

  private _emitDragDrop(event: DragEventBase, files: FileTransfer[]) {
    this._messenger.emit(
      'onDrop',
      [event, files],
      files.map(e => e.buffer),
    );
  }

  private _extractBaseEventProps(
    event: KeyboardEvent | PointerEvent,
  ): Required<InputEvent> {
    return {
      altKey: event.altKey,

      ctrlKey: event.ctrlKey,

      metaKey: event.metaKey,

      shiftKey: event.shiftKey,

      activeInput: this.isActiveInput,
    };
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

export default InputManager;
