import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type PlaneProps = ComponentObjectProps<'plane'>;

export const Plane = forwardRef<ObjectManager, PlaneProps>((props, ref) => {
  useObjectCreator('plane', props, ref);

  return null;
});

Plane.displayName = 'Plane';
