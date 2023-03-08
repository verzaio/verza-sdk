import React, {forwardRef, ReactNode} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectCreator from './hooks/useObjectCreator';
import {ParentContext} from './hooks/useObjectParent';

export type GroupProps = CreateObjectProps<'group'> & {
  id?: string;

  children?: ReactNode;
};

export const Group = forwardRef<ObjectManager, GroupProps>(
  ({children, ...props}, ref) => {
    const {object} = useObjectCreator('group', props, ref);

    if (!object || object.destroyed) return null;

    return (
      <ParentContext.Provider value={object}>{children}</ParentContext.Provider>
    );
  },
);

Group.displayName = 'Group';
