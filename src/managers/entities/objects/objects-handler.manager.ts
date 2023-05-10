import {ObjectEventMap} from 'engine/definitions/local/types/events.types';
import {
  POINTER_EVENTS_RELATION,
  UIPointerEvents,
} from 'engine/definitions/local/types/ui.types';
import {PointerEvent} from 'engine/definitions/types/ui.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import ObjectsManager from 'engine/managers/entities/objects/objects.manager';
import SubscriberTracker from 'engine/managers/entities/utils/SubscriberTracker';
import MessengerEmitterManager from 'engine/managers/messenger/messenger-emitter.manager';

const findObject = async (
  object: ObjectManager,
  ids?: Set<string | number>,
): Promise<ObjectManager | null> => {
  if (!object || !ids) return null;

  if (ids.has(object.id)) {
    return object;
  }

  return findObject((await object.resolveParent())!, ids);
};

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

    if (this._engine.isClient) {
      // watch events
      this._objects.eventsToWatch = new Set([
        'onTransitionStart',
        'onTransitionEnd',

        'onPointerMove',
        'onPointerEnter',
        'onPointerLeave',

        'onPointerDown',
        'onPointerUp',
      ]);

      this._objects.watcher.on('onTransitionStart', (object, subscribed) => {
        this._tracker.track(
          !!object.events.listenerCount('onTransitionStart'),
          'onTransitionStart',
          object.id,
          subscribed,
          () => object.bindOnTransitionStart(),
          () => object.unbindOnTransitionStart(),
        );
      });

      this._objects.watcher.on('onTransitionEnd', (object, subscribed) => {
        this._tracker.track(
          !!object.events.listenerCount('onTransitionStart'),
          'onTransitionEnd',
          object.id,
          subscribed,
          () => object.bindOnTransitionEnd(),
          () => object.unbindOnTransitionEnd(),
        );
      });

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
      null,
      {
        filterEntityTypes: ['object'],
      },
    );

    const tempObject = result.object?.entity;

    if (!tempObject) return;

    const ids = this._tracker.get(POINTER_EVENTS_RELATION[event.type]);

    if (!ids) return;

    const object = await findObject(tempObject, ids);

    if (!object) return;

    object.events.emit(POINTER_EVENTS_RELATION[event.type], {
      ...event,

      object: object,
      intersects: result,
    });
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
        null,
        {
          filterEntityTypes: ['object'],
        },
      );

      const tempObject = result.object?.entity;

      const object = !tempObject
        ? tempObject
        : await findObject(tempObject, this._tracker.get('onPointerMove'));

      if (!object) {
        this._enteredObjects.forEach(objectId => {
          this._objects.get(objectId)?.events.emit('onPointerLeave', {
            ...eventInfo,

            type: 'pointerleave',
            object: this._objects.get(objectId)!,
            intersects: result,
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
          object,
          intersects: result,
        });
        this._enteredObjects.delete(objectId);
      });

      if (!this._enteredObjects.has(object.id)) {
        this._enteredObjects.add(object.id);

        object.events.emit('onPointerEnter', {
          ...eventInfo,

          type: 'pointerenter',
          object,
          intersects: result,
        });
      }

      object.events.emit('onPointerMove', {
        ...eventInfo,

        type: 'pointermove',
        object,
        intersects: result,
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
      !!object.events.listenerCount(eventName), // we checks for any related events count
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
    );
  };

  private _onPointerEvent = (
    eventName: UIPointerEvents,
    object: ObjectManager,
    subscribed: boolean,
  ) => {
    this._tracker.track(
      !!object.events.listenerCount(eventName),
      eventName,
      object.id,
      subscribed,
      () => this._engine.events.on(eventName, this._onPointerEventHandle),
      () => this._engine.events.off(eventName, this._onPointerEventHandle),
    );
  };
}

export default ObjectsHandlerManager;
