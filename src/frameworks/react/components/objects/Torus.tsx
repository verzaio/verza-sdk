import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type TorusProps = ComponentObjectProps<'torus'>;

export const Torus = forwardRef<ObjectManager, TorusProps>((props, ref) => {
  useObjectCreator('torus', props, ref);

  return null;
});

Torus.displayName = 'Torus';
