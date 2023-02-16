import EntityManager from './entity.manager';
declare class EntityHandleManager<T extends EntityManager> {
    manager: T;
    get id(): T['id'];
    get events(): T['events'];
    constructor(manager: T);
}
export default EntityHandleManager;
