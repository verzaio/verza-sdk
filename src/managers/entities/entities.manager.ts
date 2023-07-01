import type {EntityType} from '../../definitions/enums/entities.enums';
import EngineManager from '../engine.manager';
import EventsManager from '../events.manager';
import EntityEventsManager from './entity/entity-events.manager';
import EntityStreamManager from './entity/entity-stream.manager';
import EntityManager from './entity/entity.manager';

type WatcherEventMap<
  Events extends string | number | symbol,
  E extends EntityManager,
> = {
  [name in Events]: (entity: E, subscribed: boolean) => void;
};

class EntitiesManager<
  T extends EntityManager = EntityManager,
  EventsMap extends Parameters<T['events']['on']>[0] = Parameters<
    T['events']['on']
  >[0],
> {
  public type: keyof typeof EntityType;

  public entities: T[] = [];

  public entitiesMap: Map<string | number, T> = new Map();

  public streamed: Map<string | number, T> = new Map();

  watcher = new EventsManager<WatcherEventMap<EventsMap, T>>();

  eventsToWatch = new Set<EventsMap>();

  //this.engine.entities[this.type]

  engine: EngineManager;

  events: T['events'];

  Handler: any = null!;

  Manager: any = null!;

  useStreamer = false;

  constructor(type: keyof typeof EntityType, engine: EngineManager) {
    this.type = type;

    this.engine = engine;

    this.events = (this.engine.eventsManager.get(this.type) ??
      new EventsManager()) as EntityEventsManager;

    // set events
    this.engine.eventsManager.set(this.type, this.events as EventsManager);
  }

  is(id: string | number) {
    return this.entitiesMap.has(id);
  }

  get(id: string | number) {
    return this.entitiesMap.get(id)!;
  }

  protected _create(
    id: string | number,
    data?: T['data'],
    isDetached?: boolean,
  ) {
    let entity: T = null!;

    entity = this.get(id);

    if (entity) {
      console.warn(`entity (${this.type}) already created id:${id}`);
      return entity;
    }

    const newEntity: T['entity'] = {
      id,

      type: this.type,

      data: data ?? {},
    };

    entity = new this.Manager(newEntity, this.engine) as T;

    if (isDetached) {
      return entity;
    }

    // create events
    entity.events = (this.engine.eventsManager.get(
      `${entity.type}.${entity.id}`,
    ) ?? new EntityEventsManager(entity)) as EntityEventsManager;

    // set events
    this.engine.eventsManager.set(`${entity.type}.${entity.id}`, entity.events);

    // init players streamer
    if (this.useStreamer) {
      entity.streamer = new EntityStreamManager(entity);
    }

    // set maps
    this.entitiesMap.set(id, entity as T);
    this.entities.push(entity as T);

    this.events.emit('onCreate', entity);

    return entity;
  }

  destroy(entity: T) {
    if (!this.is(entity?.id)) {
      return;
    }

    entity.destroyed = true;

    // cleanup events
    if (this.events) {
      // remove all listeners
      entity.events.removeAllListeners();

      // remove events
      this.engine.eventsManager.delete(`${entity.type}.${entity.id}`);
    }

    this.entitiesMap.delete(entity.id);
    this.entities.splice(this.entities.indexOf(entity), 1);

    this.events.emit('onDestroy', entity);
  }

  streamIn(entity: T, data?: T['data']) {
    if (entity?.handle) {
      return;
    }

    if (data) {
      Object.assign(entity.data, data);
    }

    // create handle
    entity.handle = new this.Handler(entity);

    entity.streamed = true;
    this.streamed.set(entity.id, entity);

    // emit events
    this.events.emit('onStreamIn', entity);
    entity.events.emit('onStreamIn', entity);
  }

  streamOut(entity: T) {
    if (!entity?.handle) return;

    // remove handle
    entity.handle = null!;

    entity.streamed = false;
    this.streamed.delete(entity.id);

    // emit events
    this.events.emit('onStreamOut', entity);
    entity.events.emit('onStreamOut', entity);
  }

  /* manipulation methods */
  get map() {
    return this.entities.map;
  }

  get some() {
    return this.entities.some;
  }

  get filter() {
    return this.entities.filter;
  }

  get find() {
    return this.entities.find;
  }

  get forEach() {
    return this.entitiesMap.forEach;
  }
}

export default EntitiesManager;
