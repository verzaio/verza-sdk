import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type LineProps = ComponentObjectProps<'line'>;

export const Line = forwardRef<ObjectManager, LineProps>((props, ref) => {
  return <ObjectRender type="line" props={props} objectRef={ref} />;
});

Line.displayName = 'Line';

export default Line;
