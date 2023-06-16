import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type SphereProps = ComponentObjectProps<'sphere'>;

export const Sphere = forwardRef<ObjectManager, SphereProps>((props, ref) => {
  return <ObjectRender type="sphere" props={props} objectRef={ref} />;
});

Sphere.displayName = 'Sphere';
