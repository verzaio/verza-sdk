import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type CircleProps = ComponentObjectProps<'circle'>;

export const Circle = forwardRef<ObjectManager, CircleProps>((props, ref) => {
  return <ObjectRender type="circle" props={props} objectRef={ref} />;
});

Circle.displayName = 'Circle';
