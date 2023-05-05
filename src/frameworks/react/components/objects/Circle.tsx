import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type CircleProps = ComponentObjectProps<'circle'>;

export const Circle = forwardRef<ObjectManager, CircleProps>((props, ref) => {
  useObjectCreator('circle', props, ref);

  return null;
});

Circle.displayName = 'Circle';
