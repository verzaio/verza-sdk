import {ScriptEventMap} from '../../types/scripts.types';

export const DRACO_URL =
  'https://www.gstatic.com/draco/versioned/decoders/1.5.6/';

export const LocalEngineEvents: (keyof ScriptEventMap)[] = [
  /* engine */
  'onDestroy',

  /* chat */
  'onCommand',

  /* objects */
  'onObjectStreamIn',
  'onObjectStreamOut',
  'onObjectEdit',
];
