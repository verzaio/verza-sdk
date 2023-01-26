import {SizeProps} from 'engine/definitions/types/events.types';

import EngineManager from './engine.manager';

class UIManager {
  visible = false;

  private _engine: EngineManager;

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
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
}

export default UIManager;
