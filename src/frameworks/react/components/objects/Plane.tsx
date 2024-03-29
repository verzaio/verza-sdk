import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type PlaneProps = ComponentObjectProps<'plane'>;

export const Plane = forwardRef<ObjectManager, PlaneProps>((props, ref) => {
  return <ObjectRender type="plane" {...props} objectRef={ref} />;
});

Plane.displayName = 'Plane';
