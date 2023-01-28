import {ScriptEventMap} from '../../types/events.types';

export type EngineEventMap = Pick<
  ScriptEventMap,
  | 'onChat'
  | 'onCommand'
  | 'onCommandNotFound'
  | 'onCursorLock'
  | 'onAddInterface'
  | 'onRemoveInterface'
  | 'onKey'
>;
