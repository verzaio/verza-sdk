import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {ProximityActionEvent} from 'engine/definitions/types/world.types';
import {
  IntersectsResult,
  ObjectManager,
  PointerEvent,
  ScriptEventMap,
} from 'engine/types';

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
};

export type ObjectEventMapList<T extends ObjectType = ObjectType> = Partial<
  ObjectEventMap<T>
>;

export type EngineScriptEventMap = Omit<ScriptEventMap, `${string}Raw` | 'OR'>;
