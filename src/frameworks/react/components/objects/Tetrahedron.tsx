import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type TetrahedronProps = ComponentObjectProps<'tetrahedron'>;

export const Tetrahedron = forwardRef<ObjectManager, TetrahedronProps>(
  (props, ref) => {
    return <ObjectRender type="tetrahedron" props={props} objectRef={ref} />;
  },
);

Tetrahedron.displayName = 'Tetrahedron';
