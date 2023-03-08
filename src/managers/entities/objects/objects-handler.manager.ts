import {POINTER_EVENTS_RELATION} from 'engine/definitions/local/constants/ui.types';
import {ObjectEventMap} from 'engine/definitions/local/types/events.types';
import {ObjectManager, ObjectsManager, PointerEvent} from 'engine/index';
import MessengerEmitterManager from 'engine/managers/messenger/messenger-emitter.manager';

import EntityEventsManager from '../entity/entity-events.manager';

class ObjectsHandlerManager {
  private _objects: ObjectsManager;

  private _messenger: MessengerEmitterManager;

  private get _engine() {
    return this._objects.engine;
  }

  private _tracker: SubscriberTracker<ObjectManager['events']>;

  constructor(_objects: ObjectsManager, messenger: MessengerEmitterManager) {
    this._objects = _objects;

    this._messenger = messenger;

    this._tracker = new SubscriberTracker();
  }

  bind() {
    this._messenger.events.on('destroyObject', ({data: [objectId]}) => {
      this._objects.destroy(this._objects.get(objectId), false);
    });

    this._messenger.events.on('destroyObjectClient', ({data: [objectId]}) => {
      this._objects.destroy(this._objects.get(objectId));
    });

    this._messenger.events.on('syncObject', ({data: [objectId, props]}) => {
      const objectProps = Object.values(props)[0];
      const object = this._objects.get(objectId);

      if (object && objectProps) {
        this._objects.update(object, objectProps);
      }
    });

    // watch events
    this._objects.eventsToWatch = new Set([
      'onPointerMove',
      'onPointerEnter',
      'onPointerLeave',

      'onPointerDown',
      'onPointerUp',
    ]);

    this._objects.watcher.on('onPointerMove', (object, subscribed) =>
      this._onPointerOverEvent('onPointerMove', object, subscribed),
    );
    this._objects.watcher.on('onPointerEnter', (object, subscribed) =>
      this._onPointerOverEvent('onPointerEnter', object, subscribed),
    );
    this._objects.watcher.on('onPointerLeave', (object, subscribed) =>
      this._onPointerOverEvent('onPointerLeave', object, subscribed),
    );

    this._objects.watcher.on('onPointerDown', (object, subscribed) =>
      this._onPointerEvent('onPointerDown', object, subscribed),
    );
    this._objects.watcher.on('onPointerUp', (object, subscribed) =>
      this._onPointerEvent('onPointerUp', object, subscribed),
    );
  }

  unbind() {
    // remove all events
    this._objects.events.removeAllListeners();
    this._objects.watcher.removeAllListeners();
  }

  private _onPointerEventHandle = async (event: PointerEvent) => {
    const result = await this._engine.world.raycaster.raycastScreenPoint(
      event.x,
      event.y,
      {
        entityTypes: ['object'],
      },
    );

    if (!result.object) return;

    const ids = this._tracker.get(POINTER_EVENTS_RELATION[event.type]);

    if (!ids?.has(result.object.entity.id)) return;

    result.object.entity.events.emit(
      POINTER_EVENTS_RELATION[event.type],
      event,
    );
  };

  private _pointerTimeoutIdOver: ReturnType<typeof setTimeout> = null!;
  private _lastPointerEventOver: PointerEvent = null!;

  private _enteredObjects = new Set<string>();

  private _onPointerEventHandleOver = async (event: PointerEvent) => {
    const raycast = async () => {
      const eventInfo = this._lastPointerEventOver;

      const result = await this._engine.world.raycaster.raycastScreenPoint(
        eventInfo.x,
        eventInfo.y,
        {
          entityTypes: ['object'],
        },
      );

      const ids = this._tracker.get('onPointerMove');

      const object = result.object?.entity;

      if (!object || !ids?.has(object.id)) {
        this._enteredObjects.forEach(objectId => {
          this._objects.get(objectId)?.events.emit('onPointerLeave', {
            ...eventInfo,
            type: 'pointerleave',
          });
        });

        this._enteredObjects.clear();
        return;
      }

      this._enteredObjects.forEach(objectId => {
        if (objectId === object.id) return;

        this._objects.get(objectId)?.events.emit('onPointerLeave', {
          ...eventInfo,
          type: 'pointerleave',
        });
        this._enteredObjects.delete(objectId);
      });

      if (!this._enteredObjects.has(object.id)) {
        this._enteredObjects.add(object.id);

        object.events.emit('onPointerEnter', {
          ...eventInfo,
          type: 'pointerenter',
        });
      }

      object.events.emit('onPointerMove', {
        ...eventInfo,
        type: 'pointermove',
      });
    };

    this._lastPointerEventOver = event;

    if (this._pointerTimeoutIdOver) {
      return;
    }

    this._pointerTimeoutIdOver = setTimeout(async () => {
      this._pointerTimeoutIdOver = null!;
      await raycast();
    }, 100);
  };

  private _onPointerOverEvent = (
    eventName: keyof ObjectEventMap,
    object: ObjectManager,
    subscribed: boolean,
  ) => {
    this._tracker.track(
      object.events,
      'onPointerMove',
      object.id,
      subscribed,
      () => {
        this._engine.events.on('onPointerMove', this._onPointerEventHandleOver);
      },
      () => {
        this._engine.events.off(
          'onPointerMove',
          this._onPointerEventHandleOver,
        );

        // clear entered objects
        this._enteredObjects.clear();
      },
      !!object.events.listenerCount(eventName),
    );
  };

  private _onPointerEvent = (
    eventName: keyof ObjectEventMap,
    object: ObjectManager,
    subscribed: boolean,
  ) => {
    this._tracker.track(
      object.events,
      eventName,
      object.id,
      subscribed,
      () => {
        this._engine.events.on(eventName, this._onPointerEventHandle);
      },
      () => {
        this._engine.events.off(eventName, this._onPointerEventHandle);
      },
    );
  };
}

class SubscriberTracker<
  T extends EntityEventsManager,
  Events extends Parameters<T['on']>[0] = Parameters<T['on']>[0],
> {
  private _ids = new Map<Events, Set<string | number>>();

  get(name: Events) {
    return this._ids.get(name);
  }

  track(
    events: T,
    eventName: Events,
    id: string | number,
    status: boolean,
    onAdd?: () => void,
    onRemove?: () => void,
    hasEvents?: boolean,
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
      hasEvents = hasEvents ?? !!events.listenerCount(eventName);

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

export default ObjectsHandlerManager;
