import {PointerEvent, ScriptEventMap} from 'engine/types';

export type ObjectEventMap = {
  onPointerMove: (event: PointerEvent) => void;

  onPointerDown: (event: PointerEvent) => void;

  onPointerUp: (event: PointerEvent) => void;

  onPointerEnter: (event: PointerEvent) => void;

  onPointerLeave: (event: PointerEvent) => void;
};

export type EngineScriptEventMap = Omit<ScriptEventMap, `${string}Raw` | 'OR'>;
