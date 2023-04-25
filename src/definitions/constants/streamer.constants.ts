import {EntityDrawDistanceType} from '../types/entities.types';

export const STREAMER_CHUNK_SIZE = 1024;

export const STREAMER_LOW_DRAW_DISTANCE = 64;

export const STREAMER_CHUNK_DRAW_DISTANCES: Record<
  EntityDrawDistanceType,
  number
> = {
  low: 1,
  mid: 8,
  high: 16,
};

export const DEFAULT_ENTITY_DRAW_DISTANCE: EntityDrawDistanceType = 'high';

export const STREAMER_CHUNK_FETCH_RETRY_MS = 2000;

export const STREAMER_CHECK_INTERVAL_MS = 250;
