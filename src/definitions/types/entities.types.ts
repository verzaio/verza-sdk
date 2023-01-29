import type {ComponentType} from 'react';

import type {PlayerDataProps} from 'engine/definitions/types/players.types';
import type {
  VectorArray,
  QuaternionArray,
  WorldPositionRotation,
} from 'engine/definitions/types/world.types';
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

import type {BasicObjectDto, ObjectMetadataDto} from 'types/Dto';

import type {EntityType} from '../enums/entities.enums';

export type EntityDrawDistance = Required<ObjectMetadataDto>['d'];

export type CreateEntityProps = {
  position?: VectorArray;

  rotation?: QuaternionArray;

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

/* definition */
export type EntityDefinition<
  T extends EntityManager,
  H extends EntityHandleManager<any>,
  M extends EntitiesManager,
> = {
  Render: ComponentType<{id: T['id']}>;

  EntitiesManager: {new (engine: EngineManager): M};

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

export type ObjectEntity = EntityItem<BasicObjectDto, string>;