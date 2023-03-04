import {ChunkIndex, ChunkInfo} from '../definitions/types/chunks.types';

export const calcChunkIndex = (
  x: number,
  y: number,
  z: number,
  dimension: number,
  chunkSize: number,
): ChunkIndex => {
  const chunk_x = Math.floor(x / chunkSize);
  const chunk_y = Math.floor(y / chunkSize);
  const chunk_z = Math.floor(z / chunkSize);

  return `${chunk_x}_${chunk_y}_${chunk_z}_${dimension}`;
};

export const parseChunkIndex = (chunkIndex: ChunkIndex): ChunkInfo => {
  const [x, y, z, dimension] = chunkIndex.split('_');

  return {
    index: chunkIndex,
    x: +x,
    y: +y,
    z: +z,
    dimension: +dimension,
  };
};

export const getChunkInfo = (
  x: number,
  y: number,
  z: number,
  dimension: number,
  chunkSize: number,
): ChunkInfo => {
  const chunk_x = Math.floor(x / chunkSize);
  const chunk_y = Math.floor(y / chunkSize);
  const chunk_z = Math.floor(z / chunkSize);

  return {
    index: `${chunk_x}_${chunk_y}_${chunk_z}_${dimension}`,
    x: chunk_x,
    y: chunk_y,
    z: chunk_z,
    dimension,
  };
};

export const isValidChunk = (chunkIndex: string) => {
  const parts = chunkIndex
    .split('_')
    ?.filter(e => !isNaN(+e))
    .map(e => parseInt(e));

  return parts.length === 4;
};
