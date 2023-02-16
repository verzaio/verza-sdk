import type { ComponentType } from 'react';
import type { PlayerDataProps } from '../../definitions/types/players.types';
import type { Vector3Array, QuaternionArray, WorldPositionRotation } from '../../definitions/types/world.types';
import type { ObjectDto, ObjectMetadataDto } from '../../generated/dtos.types';
import EngineManager from '../../managers/engine.manager';
import EntitiesManager from '../../managers/entities/entities.manager';
import EntityHandleManager from '../../managers/entities/entity/entity-handle.manager';
import EntityManager from '../../managers/entities/entity/entity.manager';
import ObjectHandleManager from '../../managers/entities/objects/object/object-handle.manager';
import ObjectManager from '../../managers/entities/objects/object/object.manager';
import ObjectsManager from '../../managers/entities/objects/objects.manager';
import PlayerHandleManager from '../../managers/entities/players/player/player-handle.manager';
import PlayerManager from '../../managers/entities/players/player/player.manager';
import PlayersManager from '../../managers/entities/players/players.manager';
import type { EntityType } from '../enums/entities.enums';
export type EntityDrawDistance = Required<ObjectMetadataDto>['d'];
export type EntityCollision = Required<ObjectMetadataDto>['p'];
export type CreateEntityProps = {
    remote?: boolean;
    dimension?: number;
    position?: Vector3Array;
    rotation?: QuaternionArray | Vector3Array;
    drawDistance?: EntityDrawDistance;
    p?: {
        p: WorldPositionRotation;
    };
    m?: {
        d?: EntityDrawDistance;
    };
};
export type EntityItem<Data = unknown, ID = string | number> = {
    id: ID;
    type: keyof typeof EntityType;
    data: CreateEntityProps & Data;
};
export type EntityDefinition<T extends EntityManager, H extends EntityHandleManager<any>, M extends EntitiesManager> = {
    EntitiesManager: {
        new (engine: EngineManager): M;
    };
    EntityRender: ComponentType<{
        id: T['id'];
    }>;
    EntityManager: {
        new (manager: T['entity'], engine: EngineManager): T;
    };
    EntityHandle: {
        new (manager: T): H;
    };
};
export type EntitiesRenders = {
    player: EntityDefinition<PlayerManager, PlayerHandleManager, PlayersManager>;
    object: EntityDefinition<ObjectManager, ObjectHandleManager, ObjectsManager>;
};
export type PickEntity<K extends keyof EntitiesRenders> = EntitiesRenders[K];
export type MergeEntityEvents<A, B> = A extends void ? B : A & B;
export type PlayerEntity = EntityItem<PlayerDataProps, number>;
export type ObjectEntity = EntityItem<ObjectDto & {
    parent_id?: string;
}, string>;
