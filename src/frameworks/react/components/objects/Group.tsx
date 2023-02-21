import React, {
  createContext,
  forwardRef,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

import {CreateObjectProps} from 'engine/definitions/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';
import {setReactRef} from '../../utils/misc';

const ParentContext = createContext<ObjectManager>(null!);

type GroupProps = {
  id?: string;

  children?: ReactNode;

  position?: CreateObjectProps<'group'>['position'];

  rotation?: CreateObjectProps<'group'>['rotation'];
};

export const Group = forwardRef<ObjectManager, GroupProps>(
  ({children, id, position, rotation}, ref) => {
    const objects = useObjects();
    const [object, setObject] = useState<ObjectManager>(null!);
    const parent = useParent();

    useEffect(() => {
      if (parent?.destroyed === true) {
        setObject(null!);
        return;
      }

      const object = objects.createGroup([], {
        parentId: parent?.id,

        id,
        position,
        rotation,
      });

      setReactRef(ref, object);

      setObject(object);

      return () => {
        objects.destroy(object);
      };
    }, [objects, id, position, rotation, parent]);

    if (!object) return null;

    return (
      <ParentContext.Provider value={object}>{children}</ParentContext.Provider>
    );
  },
);

Group.displayName = 'Group';

export const useParent = () => {
  return useContext(ParentContext);
};
