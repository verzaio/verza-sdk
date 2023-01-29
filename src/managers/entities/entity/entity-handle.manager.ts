import EntityManager from './entity.manager';

class EntityHandleManager<T extends EntityManager> {
  manager: T;

  /* getters */
  get id(): T['id'] {
    return this.manager.id;
  }

  get events(): T['events'] {
    return this.manager.events;
  }

  constructor(manager: T) {
    this.manager = manager;

    // set me as the handle!
    manager.handle = this;
  }
}

export default EntityHandleManager;
