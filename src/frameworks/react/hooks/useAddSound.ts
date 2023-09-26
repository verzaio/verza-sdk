import {useEffect} from 'react';

import {SoundItem} from 'engine/definitions/types/audio.types';
import {useEngine} from 'engine/frameworks/react/hooks/useEngine';

const useAddSound = (item: SoundItem) => {
  const {audio} = useEngine();

  useEffect(() => {
    audio.addSound({
      name: item.name,
      url: item.url,
    });
  }, [audio, item.name, item.url]);
};

export {useAddSound};
