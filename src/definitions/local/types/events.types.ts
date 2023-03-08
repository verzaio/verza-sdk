import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {
  IntersectsResult,
  ObjectManager,
  PointerEvent,
  ScriptEventMap,
} from 'engine/types';

type ObjectPointerEvent<T extends ObjectType = ObjectType> = PointerEvent & {
  object: ObjectManager<T>;
  intersects: IntersectsResult;
};

export type ObjectEventMap<T extends ObjectType = ObjectType> = {
  onPointerMove: (event: ObjectPointerEvent<T>) => void;

  onPointerDown: (event: ObjectPointerEvent<T>) => void;

  onPointerUp: (event: ObjectPointerEvent<T>) => void;

  onPointerEnter: (event: ObjectPointerEvent<T>) => void;

  onPointerLeave: (event: ObjectPointerEvent<T>) => void;
};

export type ObjectEventMapList<T extends ObjectType = ObjectType> = Partial<
  ObjectEventMap<T>
>;

export type EngineScriptEventMap = Omit<ScriptEventMap, `${string}Raw` | 'OR'>;
