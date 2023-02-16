import { Euler, Quaternion, Vector3 } from 'three';
import { ObjectEntity } from '../../../../definitions/types/entities.types';
import { QuaternionArray, Vector3Array } from '../../../../definitions/types/world.types';
import EngineManager from '../../../../managers/engine.manager';
import EntityManager from '../../entity/entity.manager';
import ObjectHandleManager from './object-handle.manager';
declare class ObjectManager extends EntityManager<ObjectEntity, ObjectHandleManager> {
    parent: ObjectManager | null;
    children: Set<ObjectManager>;
    get objectType(): "group" | "model" | "gltf" | "box" | "line";
    get location(): import("three").Object3D<import("three").Event>;
    get position(): Vector3;
    get rotation(): Quaternion;
    private get _messenger();
    private get _parentId();
    constructor(entity: ObjectEntity, engine: EngineManager);
    setPosition(position: Vector3 | Vector3Array): void;
    setRotation(rotation: Quaternion | Euler | QuaternionArray | Vector3Array): void;
    detachFromParent(): void;
    private _attachToParent;
    private _checkForChildren;
}
export default ObjectManager;
