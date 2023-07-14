import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {ObjectEventMapList} from 'engine/definitions/local/types/events.types';
import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {useEngine} from 'engine/framework-react';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import {ObjectHelper} from './ObjectHelper';
import {ObjectParticles} from './ObjectParticles';
import {ObjectProximityAction} from './ObjectProximityAction';
import {ObjectSound} from './ObjectSound';

export const ObjectContext = createContext<ObjectManager>(null!);

const EVENT_KEYS: Set<keyof ObjectEventMapList> = new Set([
  'onPointerMove',
  'onPointerDown',
  'onPointerUp',
  'onPointerEnter',
  'onPointerLeave',

  'onProximityActionTriggered',
  'onSoundEnd',

  'onEnterSensor',
  'onLeaveSensor',
]);

const EXCLUDED_PROPS: Set<keyof ComponentObjectProps> = new Set([
  'soundName',
  'soundOptions',
  'proximityAction',
  'particles',
  'helper',
]);

type ObjectRenderProps<T extends ObjectType = ObjectType> = {
  type: T;
  props: ComponentObjectProps<T>;
  objectRef: any;
  children?: ReactNode;
};

const ObjectRender = <T extends ObjectType = ObjectType>({
  children,
  type,
  props,
  objectRef: ref,
}: ObjectRenderProps<T>) => {
  const {objects} = useEngine();

  const parent = useContext(ObjectContext);
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

    EXCLUDED_PROPS.forEach(name => {
      if (objectProps[name]) {
        delete objectProps[name];
      }
    });

    const object = objects.create(type, objectProps);

    setObject(object, ref);

    events.forEach((event, name) => object.events.on(name, event));

    return () => {
      events.forEach((event, name) => object.events.off(name, event));
    };
  }, [setObject, objects, props, type, ref]);

  if (!object || object?.destroyed) return null;

  return (
    <>
      {children && (
        <ObjectContext.Provider value={object}>
          {children}
        </ObjectContext.Provider>
      )}

      {/* object options */}
      {props.proximityAction && (
        <ObjectProximityAction
          object={object}
          proximityAction={props.proximityAction}
        />
      )}

      {!!props.soundName && (
        <ObjectSound
          object={object}
          soundName={props.soundName}
          soundOptions={props.soundOptions}
        />
      )}

      {!!props.particles && (
        <ObjectParticles object={object} particles={props.particles} />
      )}

      {props.helper && <ObjectHelper object={object} />}
    </>
  );
};

export default ObjectRender;
