import React, {forwardRef, ReactNode} from 'react';

import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import ObjectRender from './components/ObjectRender';

export type GroupProps = ComponentObjectProps<'group'> & {
  id?: string;

  children?: ReactNode;
};

export const Group = forwardRef<ObjectManager, GroupProps>(
  ({children, ...props}, ref) => {
    return (
      <ObjectRender type="group" props={props} objectRef={ref}>
        {children}
      </ObjectRender>
    );
  },
);

Group.displayName = 'Group';
