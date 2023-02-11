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
  children?: ReactNode;
  props?: CreateObjectProps<'group'>;
};

export const Group = forwardRef<ObjectManager, GroupProps>((props, ref) => {
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
      ...props.props,
    });

    setReactRef(ref, object);

    setObject(object);

    return () => {
      objects.destroy(object);
    };
  }, [objects, props, parent]);

  if (!object) return null;

  return (
    <ParentContext.Provider value={object}>
      {props.children}
    </ParentContext.Provider>
  );
});

Group.displayName = 'Group';

export const useParent = () => {
  return useContext(ParentContext);
};
