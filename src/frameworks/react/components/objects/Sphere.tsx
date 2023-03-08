import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type SphereProps = ComponentObjectProps<'sphere'>;

export const Sphere = forwardRef<ObjectManager, SphereProps>((props, ref) => {
  useObjectCreator('sphere', props, ref);

  return null;
});

Sphere.displayName = 'Box';
