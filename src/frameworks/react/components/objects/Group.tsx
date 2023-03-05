import React, {
  createContext,
  forwardRef,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {CreateObjectProps} from 'engine/definitions/local/types/objects.types';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {useObjects} from '../../hooks/useObjects';

const ParentContext = createContext<ObjectManager>(null!);

type GroupProps = CreateObjectProps<'group'> & {
  id?: string;

  children?: ReactNode;
};

export const Group = forwardRef<ObjectManager, GroupProps>(
  ({children, ...props}, ref) => {
    const objects = useObjects();
    const {setObject, objectProps, object} = useObjectCreator();

    useEffect(() => {
      const object = objects.create('group', {
        c: [],

        ...props,

        ...objectProps(props.id),
      });

      setObject(object, ref);
    }, [setObject, objectProps, objects, props]);

    if (!object || object.destroyed) return null;

    return (
      <ParentContext.Provider value={object}>{children}</ParentContext.Provider>
    );
  },
);

Group.displayName = 'Group';

export const useParent = () => {
  return useContext(ParentContext);
};

type ObjectProps = Pick<CreateObjectProps, 'id' | 'parentId'>;

export const useObjectCreator = () => {
  const objects = useObjects();
  const parent = useParent();
  const parentIdRef = useRef(parent?.id);
  parentIdRef.current = parent?.id;

  const [object, setObjectState] = useState<ObjectManager>(null!);
  const objectRef = useRef(object);
  objectRef.current = object;

  const objectIdRef = useRef(object?.id);
  objectIdRef.current = object?.id;

  const objectProps = useCallback((id?: string): ObjectProps => {
    return {
      id: objectIdRef.current ?? id,
      parentId: parentIdRef.current,
    };
  }, []);

  const destroyObject = useCallback(() => {
    objects.destroy(objectRef.current);
    objectRef.current = null!;
  }, []);

  const setObject = useCallback((object: ObjectManager, ref?: any) => {
    if (ref) {
      ref.current = object;
    }

    if (objectRef.current && object?.id !== objectRef.current.id) {
      destroyObject();
    }

    objectIdRef.current = object?.id;
    objectRef.current = object;
    setObjectState(object);
  }, []);

  // destroy manager
  useEffect(() => {
    return () => {
      if (objectRef.current) {
        destroyObject();
        setObject(null!);
      }
    };
  }, []);

  return {setObject, objectProps, object, parent};
};
