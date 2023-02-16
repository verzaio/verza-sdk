import { Object3D } from 'three';
import { EntityDrawDistance, EntityItem, MergeEntityEvents } from '../../../definitions/types/entities.types';
import { EntityEventMap } from '../../../definitions/types/events.types';
import EngineManager from '../../engine.manager';
import EventsManager, { EventListenersMap } from '../../events.manager';
import EntityHandleManager from './entity-handle.manager';
import EntityStreamManager from './entity-stream.manager';
declare class EntityManager<T extends EntityItem = EntityItem, H extends EntityHandleManager<any> | void = void, Events extends EventListenersMap | void = void> {
    destroyed: boolean;
    entity: T;
    engine: EngineManager;
    handle: H extends EntityHandleManager<any> ? H : EntityHandleManager<this>;
    streamed: boolean;
    events: EventsManager<MergeEntityEvents<Events, EntityEventMap<this>>>;
    private _location;
    streamer: EntityStreamManager;
    get id(): T['id'];
    get type(): "object" | "player";
    get data(): T['data'];
    get location(): Object3D<import("three").Event>;
    get position(): import("three").Vector3;
    get rotation(): import("three").Quaternion;
    dimension: number;
    drawDistance: EntityDrawDistance;
    constructor(entity: T, engine: EngineManager);
    restoreData(): void;
}
export default EntityManager;
