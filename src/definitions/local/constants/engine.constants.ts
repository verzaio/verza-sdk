import {ScriptEventMap} from '../../types/events.types';

export const ENGINE_EVENTS: (keyof ScriptEventMap)[] = [
  'onChat',
  'onCommand',
  'onCommandNotFound',
  'onCursorLock',
  'onAddInterface',
  'onRemoveInterface',
  'onKey',
];
