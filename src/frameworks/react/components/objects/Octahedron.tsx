import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type OctahedronProps = ComponentObjectProps<'octahedron'>;

export const Octahedron = forwardRef<ObjectManager, OctahedronProps>(
  (props, ref) => {
    useObjectCreator('octahedron', props, ref);

    return null;
  },
);

Octahedron.displayName = 'Octahedron';
