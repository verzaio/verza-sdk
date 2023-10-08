import React, {forwardRef} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type GroupProps = ComponentObjectProps<'group'>;

export const Group = forwardRef<ObjectManager, GroupProps>((props, ref) => {
  return <ObjectRender type="group" {...props} objectRef={ref} />;
});

Group.displayName = 'Group';
