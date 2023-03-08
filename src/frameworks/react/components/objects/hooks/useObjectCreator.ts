import {useCallback, useEffect, useRef, useState} from 'react';

import {
  ObjectEventMap,
  ObjectEventMapList,
} from 'engine/definitions/local/types/events.types';
import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {useObjects} from 'engine/frameworks/react/hooks/useObjects';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectParent from './useObjectParent';

const EVENT_KEYS: (keyof ObjectEventMap)[] = [
  'onPointerMove',
  'onPointerDown',
  'onPointerUp',
  'onPointerEnter',
  'onPointerLeave',
];

const useObjectCreator = <T extends ObjectType = ObjectType>(
  type: T,
  props: ComponentObjectProps<T>,
  ref: any,
) => {
  const objects = useObjects();
  const parent = useObjectParent();
  const parentIdRef = useRef(parent?.id);
  parentIdRef.current = parent?.id;

  const [object, setObjectState] = useState<ObjectManager>(null!);
  const objectRef = useRef(object);
  objectRef.current = object;

  const objectIdRef = useRef(object?.id);
  objectIdRef.current = object?.id;

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

  // handle creation
  useEffect(() => {
    const events = new Map<keyof ObjectEventMapList, () => void>();

    const objectProps = {
      ...props,

      id: objectIdRef.current ?? props.id,
      parentId: parentIdRef.current,
    };

    EVENT_KEYS.forEach(name => {
      if (objectProps[name]) {
        events.set(name, objectProps[name] as () => void);
        delete objectProps[name];
      }
    });

    const object = objects.create(type, objectProps);

    setObject(object, ref);

    events.forEach((event, name) => {
      object.events.on(name, event);
    });

    return () => {
      events.forEach((event, name) => {
        object.events.off(name, event);
      });
    };
  }, [setObject, objects, props, type, ref]);

  // hook events
  useEffect(() => {
    if (!object) return;
  }, [object]);

  return {object};
};

export default useObjectCreator;
