import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type ConeProps = ComponentObjectProps<'cone'>;

export const Cone = forwardRef<ObjectManager, ConeProps>((props, ref) => {
  useObjectCreator('cone', props, ref);

  return null;
});

Cone.displayName = 'Cone';
