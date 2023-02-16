import { Euler, Quaternion, Vector3 } from 'three';
import type { ObjectDto, ObjectMetadataDto } from '../../generated/dtos.types';
import { EntityDrawDistance, EntityCollision } from './entities.types';
import { QuaternionArray, Vector3Array } from './world.types';
export type ObjectType = ObjectDto['t'];
export type CreateObjectProps<T extends ObjectType = ObjectType> = {
    id?: string;
    parentId?: string;
    position?: Vector3 | Vector3Array;
    rotation?: Quaternion | Euler | QuaternionArray | Vector3Array;
    drawDistance?: EntityDrawDistance;
    collision?: EntityCollision;
    scale?: number;
    shadows?: boolean;
    data?: ObjectMetadataDto[T];
};
export type CreateObjectPropsWithObjects<T extends ObjectType = ObjectType> = CreateObjectProps<T> & {
    group?: ObjectMetadataDto['group'];
    model?: ObjectMetadataDto['model'];
    box?: ObjectMetadataDto['box'];
    line?: ObjectMetadataDto['line'];
    gltf?: ObjectMetadataDto['gltf'];
};
