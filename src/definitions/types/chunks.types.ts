export type ChunkEventsMode = 'entities' | 'map';

// x_y_z_dimension
export type ChunkIndex = `${number}_${number}_${number}_${number}`;

export type ChunkInfo = {
  index: ChunkIndex;

  x: number;

  y: number;

  z: number;

  dimension: number;
};

export type ChunkPosition = {
  x: number;

  y: number;

  z: number;

  dimension: number;

  chunkSize: number;
};