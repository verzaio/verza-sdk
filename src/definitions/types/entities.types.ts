import type {ComponentType} from 'react';

import type {PlayerDataProps} from 'engine/definitions/types/players.types';
import type {
  Vector3Array,
  QuaternionArray,
} from 'engine/definitions/types/world.types';
import type {ObjectDataDto} from 'engine/generated/dtos.types';
import EngineManager from 'engine/managers/engine.manager';
import EntitiesManager from 'engine/managers/entities/entities.manager';
import EntityHandleManager from 'engine/managers/entities/entity/entity-handle.manager';
import EntityManager from 'engine/managers/entities/entity/entity.manager';
import ObjectHandleManager from 'engine/managers/entities/objects/object/object-handle.manager';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import ObjectsManager from 'engine/managers/entities/objects/objects.manager';
import PlayerHandleManager from 'engine/managers/entities/players/player/player-handle.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';
import PlayersManager from 'engine/managers/entities/players/players.manager';

import type {EntityType} from '../enums/entities.enums';
import {ObjectDataProps} from './objects/objects.types';

export type EntityDrawDistance = Required<ObjectDataDto>['dd'];

export type EntityCollision = Required<ObjectDataDto>['c'];

export type CreateEntityProps = {
  remote?: boolean; // permanent

  p?: Vector3Array; // position

  r?: QuaternionArray | Vector3Array; // rotation

  d?: number; // dimension

  dd?: EntityDrawDistance; // draw distance
};

export type EntityItem<
  Data extends CreateEntityProps = CreateEntityProps,
  ID = string | number,
> = {
  id: ID;

  type: keyof typeof EntityType;

  data: Data;
};

/* definition */
export type EntityDefinition<
  T extends EntityManager,
  H extends EntityHandleManager<any>,
  M extends EntitiesManager,
> = {
  EntitiesManager: {new (engine: EngineManager): M};

  EntityRender: ComponentType<{id: T['id']}>;

  EntityManager: {new (manager: T['entity'], engine: EngineManager): T};

  EntityHandle: {new (manager: T): H};
};

export type EntitiesRenders = {
  player: EntityDefinition<PlayerManager, PlayerHandleManager, PlayersManager>;
  object: EntityDefinition<ObjectManager, ObjectHandleManager, ObjectsManager>;
};

export type PickEntity<K extends keyof EntitiesRenders> = EntitiesRenders[K];

export type MergeEntityEvents<A, B> = A extends void ? B : A & B;

/* entities */
export type PlayerEntity = EntityItem<PlayerDataProps, number>;

export type ObjectEntity = EntityItem<ObjectDataProps, string>;
