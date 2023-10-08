import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type BoxProps = ComponentObjectProps<'box'>;

export const Box = forwardRef<ObjectManager, BoxProps>((props, ref) => {
  return <ObjectRender type="box" {...props} objectRef={ref} />;
});

Box.displayName = 'Box';
