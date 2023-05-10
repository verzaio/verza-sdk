import EntityEventsManager from '../entity/entity-events.manager';

class SubscriberTracker<
  T extends EntityEventsManager,
  Events extends Parameters<T['on']>[0] = Parameters<T['on']>[0],
> {
  private _ids = new Map<Events, Set<string | number>>();

  get(name: Events) {
    return this._ids.get(name);
  }

  track(
    hasEvents: boolean,
    eventName: Events,
    id: string | number,
    status: boolean,
    onAdd?: () => void,
    onRemove?: () => void,
  ) {
    if (status) {
      if (!this._ids.has(eventName)) {
        onAdd?.();
      }

      this._ids.set(
        eventName,
        this._ids.get(eventName)?.add(id) ?? new Set([id]),
      );
    } else {
      if (!hasEvents) {
        const ids = this._ids.get(eventName);

        if (ids) {
          ids.delete(id);

          if (!ids.size) {
            this._ids.delete(eventName);
            onRemove?.();
          }

          return;
        }

        onRemove?.();
      }
    }
  }
}

export default SubscriberTracker;
