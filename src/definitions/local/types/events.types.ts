import {ChunkIndex} from 'engine/definitions/types/chunks.types';
import {ObjectManager} from 'engine/types';

export type ObjectEventMap = {
  onChunkIndexChange: (
    object: ObjectManager,
    prevChunkIndex: ChunkIndex,
  ) => void;
};
