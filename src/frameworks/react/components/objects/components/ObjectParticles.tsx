import {useEffect, useRef} from 'react';

import equal from 'fast-deep-equal';

import {ParticleOptions} from 'engine/definitions/types/effects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

type ObjectParticlesProps = {
  object: ObjectManager;
  particles: ParticleOptions | boolean;
};

export const ObjectParticles = ({object, particles}: ObjectParticlesProps) => {
  const lastParticles = useRef<ObjectParticlesProps['particles']>(null!);

  // handle
  useEffect(() => {
    if (equal(lastParticles.current, particles)) return;

    lastParticles.current =
      typeof particles === 'boolean' ? particles : {...particles};

    const options = typeof particles === 'boolean' ? {} : particles;

    object.setParticles(options);
  }, [object, particles]);

  // unload
  useEffect(() => {
    return () => {
      lastParticles.current = null!;
      object.removeParticles();
    };
  }, [object]);

  return null;
};
