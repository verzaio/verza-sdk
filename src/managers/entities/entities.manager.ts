import {ENTITIES_RENDERS} from 'engine/definitions/constants/entities.constants';
import type {EntityType} from '../../definitions/enums/entities.enums';
import EngineManager from '../engine.manager';
import EventsManager from '../events.manager';
import EntityManager from './entity/entity.manager';

class EntitiesManager<T extends EntityManager = EntityManager> {
  public type: keyof typeof EntityType;

  public entitiesMap: Map<string | number, T> = new Map();

  public streamed: Map<string | number, T> = new Map();

  engine: EngineManager;

  events: T['events'];

  Handler: any = null!;

  Manager: any = null!;

  constructor(type: keyof typeof EntityType, engine: EngineManager) {
    this.type = type;

    this.engine = engine;

    this.events =
      this.engine.eventsManager.get(this.type) ?? new EventsManager();

    // set events
    this.engine.eventsManager.set(this.type, this.events);
  }

  is(id: string | number) {
    return this.entitiesMap.has(id);
  }

  get(id: string | number) {
    return this.entitiesMap.get(id)!;
  }

  create(id: string | number, data?: T['data']) {
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

    // create events
    entity.events =
      this.engine.eventsManager.get(`${entity.type}.${entity.id}`) ??
      new EventsManager();

    // set events
    this.engine.eventsManager.set(`${entity.type}.${entity.id}`, entity.events);

    // set maps
    this.entitiesMap.set(id, entity as T);

    this.events.emit('onCreate', entity);

    return entity;
  }

  destroy(entity: T) {
    if (!this.is(entity?.id)) {
      return;
    }

    // cleanup events
    if (this.events) {
      // remove all listeners
      entity.events.removeAllListeners();

      // remove events
      this.engine.eventsManager.delete(`${entity.type}.${entity.id}`);
    }

    this.entitiesMap.delete(entity.id);

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
}

export default EntitiesManager;