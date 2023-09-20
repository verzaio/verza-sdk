import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type DodecahedronProps = ComponentObjectProps<'dodecahedron'>;

export const Dodecahedron = forwardRef<ObjectManager, DodecahedronProps>(
  (props, ref) => {
    return <ObjectRender type="dodecahedron" {...props} objectRef={ref} />;
  },
);

Dodecahedron.displayName = 'Dodecahedron';
