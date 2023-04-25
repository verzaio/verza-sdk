import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type CylinderProps = ComponentObjectProps<'cylinder'>;

export const Cylinder = forwardRef<ObjectManager, CylinderProps>(
  (props, ref) => {
    useObjectCreator('cylinder', props, ref);

    return null;
  },
);

Cylinder.displayName = 'Cylinder';
