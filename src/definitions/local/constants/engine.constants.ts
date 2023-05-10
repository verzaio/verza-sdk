import {ScriptEventMap} from '../../types/scripts.types';

export const DRACO_URL =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.5/';

export const LocalEngineEvents: (keyof ScriptEventMap)[] = [
  /* chat */
  'onCommand',

  /* objects */
  'onObjectStreamIn',
  'onObjectStreamOut',
  'onObjectEdit',
  'onEntitySelected',
];
