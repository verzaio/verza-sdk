import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type CylinderProps = ComponentObjectProps<'cylinder'>;

export const Cylinder = forwardRef<ObjectManager, CylinderProps>(
  (props, ref) => {
    return <ObjectRender type="cylinder" {...props} objectRef={ref} />;
  },
);

Cylinder.displayName = 'Cylinder';
