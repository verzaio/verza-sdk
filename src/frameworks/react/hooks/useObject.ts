import useEntity from './useEntity';

const useObject = (id: string) => {
  return useEntity(id, 'object');
};

export default useObject;
