import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type TextProps = ComponentObjectProps<'text'>;

export const Text = forwardRef<ObjectManager, TextProps>((props, ref) => {
  return <ObjectRender type="text" {...props} objectRef={ref} />;
});

Text.displayName = 'Text';
