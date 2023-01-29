import useStreamedEntity from './useStreamedEntity';

const useStreamedObject = (objectId: string) => {
  return useStreamedEntity(objectId, 'object');
};

export default useStreamedObject;
