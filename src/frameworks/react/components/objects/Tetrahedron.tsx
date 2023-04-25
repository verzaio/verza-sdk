import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type TetrahedronProps = ComponentObjectProps<'tetrahedron'>;

export const Tetrahedron = forwardRef<ObjectManager, TetrahedronProps>(
  (props, ref) => {
    useObjectCreator('tetrahedron', props, ref);

    return null;
  },
);

Tetrahedron.displayName = 'Tetrahedron';
