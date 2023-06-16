import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type ModelProps = ComponentObjectProps<'model'>;

export const Model = forwardRef<ObjectManager, ModelProps>((props, ref) => {
  return <ObjectRender type="model" props={props} objectRef={ref} />;
});

Model.displayName = 'Model';
