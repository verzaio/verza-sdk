import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type ModelProps = ComponentObjectProps<'model'>;

export const Model = forwardRef<ObjectManager, ModelProps>((props, ref) => {
  useObjectCreator('model', props, ref);

  return null;
});

Model.displayName = 'Model';
