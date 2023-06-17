import {ObjectType} from 'engine/definitions/types/objects/objects.types';

export const UNSUPPORTED_OBJECTS_BLOOM: Set<ObjectType> = new Set([
  'group',
  'rectarealight',
  'pointlight',
  'spotlight',
  'rectarealight',
]);

export const UNSUPPORTED_OBJECTS_SHADOWS: Set<ObjectType> = new Set([
  'group',
  'line',
  'text',
  'rectarealight',
]);

export const UNSUPPORTED_OBJECTS_COLLISIONS: Set<ObjectType> = new Set([
  'group',
  'line',
  'text',
  'rectarealight',
  'pointlight',
  'spotlight',
]);
