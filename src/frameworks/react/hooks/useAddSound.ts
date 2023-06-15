import {useEffect} from 'react';

import {SoundItem} from 'engine/definitions/types/audio.types';
import {useEngine} from 'engine/framework-react';

const useAddSound = (item: SoundItem) => {
  const {audio} = useEngine();

  useEffect(() => {
    audio.addSound({
      name: item.name,
      url: item.url,
    });
  }, [item.name, item.url]);
};

export {useAddSound};
