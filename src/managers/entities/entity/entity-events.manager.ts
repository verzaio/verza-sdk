import EventsManager, {EventListenersMap} from 'engine/managers/events.manager';

import EntityManager from './entity.manager';

class EntityEventsManager<
  T extends EventListenersMap = EventListenersMap,
> extends EventsManager<T> {
  private _entity: EntityManager;

  private get _eventsToWatch() {
    return this._entity.manager.eventsToWatch;
  }

  constructor(entity: EntityManager) {
    super();

    this._entity = entity;
  }

  on<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    super.on(eventName, listener);

    if (this._eventsToWatch.has(eventName as any)) {
      (this._entity.manager.watcher.emit as any)(eventName, this._entity, true);
    }

    return listener;
  }

  off<A extends keyof T>(eventName: A, listener: T[A]) {
    if (this._eventsToWatch.has(eventName as any)) {
      const count = this.listenerCount(eventName as string);

      super.off(eventName, listener);

      if (count !== 0) {
        (this._entity.manager.watcher.emit as any)(
          eventName,
          this._entity,
          false,
        );
      }
      return;
    }

    super.off(eventName, listener);
  }

  once<A extends keyof T>(eventName: A, listener: T[A]): T[A] {
    console.debug('[EntityEvents] events.once is not available');
    return listener;
  }

  removeAllListeners(): void {
    if (this._eventsToWatch.size) {
      const eventNames = this.getEmitter().eventNames();

      super.removeAllListeners();

      eventNames.forEach(eventName => {
        if (this._eventsToWatch.has(eventName as any)) {
          (this._entity.manager.watcher.emit as any)(
            eventName,
            this._entity,
            false,
          );
        }
      });
      return;
    }

    super.removeAllListeners();
  }
}

export default EntityEventsManager;
