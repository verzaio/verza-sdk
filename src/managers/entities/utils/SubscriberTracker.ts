import EntityEventsManager from '../entity/entity-events.manager';

class SubscriberTracker<
  T extends EntityEventsManager,
  Events extends Parameters<T['on']>[0] = Parameters<T['on']>[0],
> {
  private _ids = new Map<Events, Set<string | number>>();

  private _idsGlobal = new Map<Events, Set<string | number>>();

  get(name: Events) {
    return this._ids.get(name);
  }

  getGlobal(name: Events) {
    return this._idsGlobal.get(name);
  }

  track(
    eventName: Events,
    id: string | number,
    hasEvents: boolean,
    status: boolean,
    onAdd: () => void,
    onRemove: () => void,
  ) {
    if (status) {
      const ids = this._ids.get(eventName) ?? new Set();

      if (!ids.has(id)) {
        onAdd?.();
      } else {
        ids.add(id);
      }

      this._ids.set(eventName, ids);
    } else {
      if (hasEvents) return;

      const ids = this._ids.get(eventName);

      if (ids) {
        ids.delete(id);

        if (!ids.size) {
          this._ids.delete(eventName);
        }
      }

      onRemove?.();
    }
  }

  trackGlobal(
    eventName: Events,
    id: string | number,
    hasEvents: boolean,
    status: boolean,
    onAdd?: () => void,
    onRemove?: () => void,
  ) {
    if (status) {
      if (!this._idsGlobal.has(eventName)) {
        onAdd?.();
      }

      this._idsGlobal.set(
        eventName,
        this._idsGlobal.get(eventName)?.add(id) ?? new Set([id]),
      );
    } else {
      if (hasEvents) return;

      const ids = this._idsGlobal.get(eventName);

      if (ids) {
        ids.delete(id);

        if (!ids.size) {
          this._idsGlobal.delete(eventName);
          onRemove?.();
        }

        return;
      }

      onRemove?.();
    }
  }
}

export default SubscriberTracker;
