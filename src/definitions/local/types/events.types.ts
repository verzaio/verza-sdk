import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {ObjectManager, ScriptEventMap} from 'engine/types';

export type ObjectEventMap = {
  onChunkIndexChange: (
    object: ObjectManager,
    prevChunkIndex: ChunkIndex,
  ) => void;
};

export type EngineScriptEventMap = Omit<ScriptEventMap, `${string}Raw` | 'OR'>;
