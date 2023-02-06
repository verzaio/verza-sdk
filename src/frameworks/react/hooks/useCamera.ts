import useEngine from './useEngine';

const useCamera = () => {
  return useEngine().player?.camera;
};

export default useCamera;
