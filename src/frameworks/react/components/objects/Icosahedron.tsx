import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type IcosahedronProps = ComponentObjectProps<'icosahedron'>;

export const Icosahedron = forwardRef<ObjectManager, IcosahedronProps>(
  (props, ref) => {
    useObjectCreator('icosahedron', props, ref);

    return null;
  },
);

Icosahedron.displayName = 'Icosahedron';
