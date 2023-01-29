import useEntity from './useEntity';

const usePlayer = (id: number) => {
  return useEntity(id, 'player');
};

export default usePlayer;
