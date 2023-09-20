import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type IcosahedronProps = ComponentObjectProps<'icosahedron'>;

export const Icosahedron = forwardRef<ObjectManager, IcosahedronProps>(
  (props, ref) => {
    return <ObjectRender type="icosahedron" {...props} objectRef={ref} />;
  },
);

Icosahedron.displayName = 'Icosahedron';
