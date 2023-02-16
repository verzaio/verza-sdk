import { CreateObjectProps } from '../../../definitions/types/objects.types';
import { Vector3Array } from '../../../definitions/types/world.types';
import { ObjectBoxDto, ObjectDto } from '../../../generated/dtos.types';
import EngineManager from '../../engine.manager';
import EntitiesManager from '../entities.manager';
import ObjectManager from './object/object.manager';
declare class ObjectsManager extends EntitiesManager<ObjectManager> {
    private _binded;
    private get _messenger();
    constructor(engine: EngineManager);
    private _load;
    unload(): void;
    private _createObject;
    createGroup(children?: ObjectDto[], props?: CreateObjectProps<'group'>): ObjectManager;
    createModel(model: string, props?: CreateObjectProps<'model'>): ObjectManager;
    createBox(box: ObjectBoxDto, props?: CreateObjectProps<'box'>): ObjectManager;
    createLine(points: Vector3Array[], color?: string, props?: CreateObjectProps<'line'>): ObjectManager;
    createGltf(url: string, props?: CreateObjectProps<'gltf'>): ObjectManager;
    destroy(entity: ObjectManager, report?: boolean): void;
}
export default ObjectsManager;
