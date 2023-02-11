import {useStreamedEntity} from './useStreamedEntity';

export const useStreamedObject = (objectId: string) => {
  return useStreamedEntity(objectId, 'object');
};
