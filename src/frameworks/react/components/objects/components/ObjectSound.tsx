import {useEffect, useRef} from 'react';

import equal from 'fast-deep-equal';

import {SoundOptions} from 'engine/definitions/types/audio.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

type ObjectSoundProps = {
  object: ObjectManager;
  soundName: string;
  soundOptions?: SoundOptions;
};

export const ObjectSound = ({
  object,
  soundName,
  soundOptions,
}: ObjectSoundProps) => {
  const lastSound = useRef<[string, SoundOptions] | null>(null);

  // handle
  useEffect(() => {
    if (!soundName) return;

    if (equal(lastSound.current, [soundName, soundOptions])) return;

    lastSound.current = [soundName, {...soundOptions}];

    object.setSound(soundName, soundOptions);
  }, [object, soundName, soundOptions]);

  // unload
  useEffect(() => {
    return () => {
      lastSound.current = null;
      object.removeSound();
    };
  }, [object]);

  return null;
};
