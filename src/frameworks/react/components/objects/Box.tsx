import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type BoxProps = ComponentObjectProps<'box'>;

export const Box = forwardRef<ObjectManager, BoxProps>((props, ref) => {
  useObjectCreator('box', props, ref);

  return null;
});

Box.displayName = 'Box';
