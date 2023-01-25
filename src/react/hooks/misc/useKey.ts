import {useEngine} from 'engine/react/EngineProvider';
import {useEffect} from 'react';

const useKey = (key: string, callback: (event: KeyboardEvent) => void) => {
  const engine = useEngine();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      //if (!engine.player?.canControl) return;
      //if (engine.ui.isActiveInput) return;

      if (event.code === key) {
        callback(event);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [key, engine, callback]);
};

export default useKey;
