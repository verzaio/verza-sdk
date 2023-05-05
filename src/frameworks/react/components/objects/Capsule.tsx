import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type CapsuleProps = ComponentObjectProps<'capsule'>;

export const Capsule = forwardRef<ObjectManager, CapsuleProps>((props, ref) => {
  useObjectCreator('capsule', props, ref);

  return null;
});

Capsule.displayName = 'Capsule';
