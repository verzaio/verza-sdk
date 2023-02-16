import type { EntityType } from '../../definitions/enums/entities.enums';
import EngineManager from '../engine.manager';
import EntityManager from './entity/entity.manager';
declare class EntitiesManager<T extends EntityManager = EntityManager> {
    type: keyof typeof EntityType;
    entities: T[];
    entitiesMap: Map<string | number, T>;
    streamed: Map<string | number, T>;
    engine: EngineManager;
    events: T['events'];
    Handler: any;
    Manager: any;
    useStreamer: boolean;
    constructor(type: keyof typeof EntityType, engine: EngineManager);
    is(id: string | number): boolean;
    get(id: string | number): T;
    create(id: string | number, data?: T['data']): T;
    destroy(entity: T): void;
    streamIn(entity: T, data?: T['data']): void;
    streamOut(entity: T): void;
    get map(): <U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any) => U[];
    get some(): (predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any) => boolean;
    get filter(): {
        <S extends T>(predicate: (value: T, index: number, array: T[]) => value is S, thisArg?: any): S[];
        (predicate: (value: T, index: number, array: T[]) => unknown, thisArg?: any): T[];
    };
    get find(): {
        <S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S | undefined;
        (predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T | undefined;
    };
    get forEach(): (callbackfn: (value: T, key: string | number, map: Map<string | number, T>) => void, thisArg?: any) => void;
}
export default EntitiesManager;
