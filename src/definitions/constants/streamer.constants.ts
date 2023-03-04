import {EntityDrawDistanceType} from '../types/entities.types';

export const STREAMER_ENABLE_DUMMY = false;

export const STREAMER_CHUNK_SIZE = 256;

export const STREAMER_LOW_DRAW_DISTANCE = 16;

export const STREAMER_CHUNK_DRAW_DISTANCES: Record<
  EntityDrawDistanceType,
  number
> = {
  low: 1,
  mid: 4,
  high: 16,
};

export const DEFAULT_ENTITY_DRAW_DISTANCE: EntityDrawDistanceType = 'high';

export const STREAMER_CHUNK_FETCH_RETRY_MS = 2000;

export const STREAMER_CHECK_INTERVAL_MS = 250;
