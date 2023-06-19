import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type OctahedronProps = ComponentObjectProps<'octahedron'>;

export const Octahedron = forwardRef<ObjectManager, OctahedronProps>(
  (props, ref) => {
    return <ObjectRender type="octahedron" props={props} objectRef={ref} />;
  },
);

Octahedron.displayName = 'Octahedron';
