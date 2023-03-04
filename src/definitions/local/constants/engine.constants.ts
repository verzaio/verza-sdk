import {ScriptEventMap} from '../../types/scripts.types';

export const LocalEngineEvents: (keyof ScriptEventMap)[] = [
  /* chat */
  'onCommand',

  /* objects */
  'onObjectStreamIn',
  'onObjectStreamOut',
  'onObjectEdit',
  'onEntitySelected',
];
