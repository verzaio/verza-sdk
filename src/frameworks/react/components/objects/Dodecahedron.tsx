import {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';

export type DodecahedronProps = ComponentObjectProps<'dodecahedron'>;

export const Dodecahedron = forwardRef<ObjectManager, DodecahedronProps>(
  (props, ref) => {
    useObjectCreator('dodecahedron', props, ref);

    return null;
  },
);

Dodecahedron.displayName = 'Dodecahedron';
