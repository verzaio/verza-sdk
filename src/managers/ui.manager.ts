import {
  INTERFACE_CURSOR,
  INTERFACE_OPTIONS,
  INTERFACE_PLAYERS_LIST,
  INTERFACE_SERVER,
} from 'engine/definitions/constants/ui.constants';
import {
  IndicatorId,
  IndicatorTitle,
  UISizeProps,
  ToolbarElement,
  MainToolbarItem,
  UIComponentType,
} from 'engine/definitions/types/ui.types';

import {createControllerManager} from './controller.manager';
import EngineManager from './engine.manager';

class UIManager {
  visible = false;

  private _sizeProps: UISizeProps = {
    height: '100%',
    width: '100%',
  };

  private _engine: EngineManager;

  /* controller */
  controller = createControllerManager({
    interfaces: new Set<string>(),
  });

  /* getters */
  get interfaces() {
    return this.controller.interfaces;
  }

  private get _messenger() {
    return this._engine.messenger;
  }

  constructor(engine: EngineManager) {
    this._engine = engine;
  }

  bind() {
    this._messenger.events.on('addInterface', ({data: [tag]}) => {
      this.interfaces.add(tag);
      this.controller.interfaces = new Set(this.interfaces);
    });

    this._messenger.events.on('removeInterface', ({data: [tag]}) => {
      this.interfaces.delete(tag);
      this.controller.interfaces = new Set(this.interfaces);
    });
  }

  /* base */
  show() {
    if (this.visible) return;

    this.visible = true;
    this._messenger.emit('show');
  }

  hide() {
    if (!this.visible) return;

    this.visible = false;
    this._messenger.emit('hide');
  }

  setProps(props: Partial<UISizeProps>) {
    Object.assign(this._sizeProps, props);

    this._messenger.emit('setSize', [this._sizeProps]);
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

  removeAllInterfaces() {
    this.interfaces.forEach(tag => this.removeInterface(tag));
  }

  // cursor
  isCursorShown() {
    return !!this.interfaces.size;
  }

  toggleCursor() {
    this.toggleInterface(INTERFACE_CURSOR);
  }

  showCursor() {
    this.addInterface(INTERFACE_CURSOR);
  }

  hideCursor() {
    this.removeInterface(INTERFACE_CURSOR);
  }

  async isComponentShown(component: UIComponentType) {
    const {
      data: [result],
    } = await this._messenger.emitAsync('isUIComponent', [component]);

    return result;
  }

  toggleComponent(component: UIComponentType) {
    this._messenger.emit('toggleUIComponent', [component]);
  }

  showComponent(component: UIComponentType) {
    this._messenger.emit('showUIComponent', [component]);
  }

  hideComponent(component: UIComponentType) {
    this._messenger.emit('hideUIComponent', [component]);
  }

  showIndicator(
    id: IndicatorId,
    title?: IndicatorTitle,
    subTitle?: IndicatorTitle,
  ) {
    this._messenger.emit('showIndicator', [id, title, subTitle]);
  }

  hideIndicator(id: IndicatorId) {
    this._messenger.emit('hideIndicator', [id]);
  }

  addMainToolbarItem(item: MainToolbarItem) {
    this._messenger.emit('addMainToolbarItem', [item]);
  }

  removeMainToolbarItem(itemId: string) {
    this._messenger.emit('removeMainToolbarItem', [itemId]);
  }

  addToolbar(toolbar: ToolbarElement) {
    this._messenger.emit('addToolbar', [toolbar]);
    return toolbar.id;
  }

  removeToolbar(toolbarId: string) {
    this._messenger.emit('removeToolbar', [toolbarId]);
  }

  isSystemMenu() {
    return this.isOptionsMenu() || this.isServerMenu() || this.isPlayersList();
  }

  isPlayersList() {
    return this.hasInterface(INTERFACE_PLAYERS_LIST);
  }

  isServerMenu() {
    return this.hasInterface(INTERFACE_SERVER);
  }

  isOptionsMenu() {
    return this.hasInterface(INTERFACE_OPTIONS);
  }

  openUrl(url: string) {
    this._messenger.emit('openUrl', [url]);
  }

  goToServer(serverId: string) {
    this._messenger.emit('goToServer', [serverId]);
  }

  destroy() {
    //
  }
}

export default UIManager;
