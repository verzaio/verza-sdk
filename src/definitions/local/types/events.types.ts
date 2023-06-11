import {PointerEvent} from 'engine/definitions/types/input.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {ScriptEventMap} from 'engine/definitions/types/scripts.types';
import {ProximityActionEvent} from 'engine/definitions/types/world.types';
import {IntersectsResult} from 'engine/definitions/types/world.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import PlayerManager from 'engine/managers/entities/players/player/player.manager';

export type ObjectPointerEvent<T extends ObjectType = ObjectType> =
  PointerEvent & {
    object: ObjectManager<T>;
    intersects: IntersectsResult;
  };

export type ObjectProximityActionEvent<T extends ObjectType = ObjectType> =
  ProximityActionEvent & {
    object: ObjectManager<T>;
  };

export type ObjectEventMap<T extends ObjectType = ObjectType> = {
  onPointerMove: (event: ObjectPointerEvent<T>) => void;

  onPointerDown: (event: ObjectPointerEvent<T>) => void;

  onPointerUp: (event: ObjectPointerEvent<T>) => void;

  onPointerEnter: (event: ObjectPointerEvent<T>) => void;

  onPointerLeave: (event: ObjectPointerEvent<T>) => void;

  onTransitionEnd: (transitionId: number | string) => void;

  onTransitionStart: (transitionId: number | string) => void;

  onProximityActionTriggered: (event: ObjectProximityActionEvent<T>) => void;

  onEnterSensor: (player: PlayerManager) => void;

  onLeaveSensor: (player: PlayerManager) => void;
};

export type ObjectEventMapList<T extends ObjectType = ObjectType> = Partial<
  ObjectEventMap<T>
>;

export type EngineScriptEventMap = Omit<ScriptEventMap, `${string}Raw` | 'OR'>;
