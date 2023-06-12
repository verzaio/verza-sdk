import {useCallback, useEffect, useRef, useState} from 'react';

import equal from 'fast-deep-equal';

import {ObjectEventMapList} from 'engine/definitions/local/types/events.types';
import {ComponentObjectProps} from 'engine/definitions/local/types/objects.types';
import {SoundOptions} from 'engine/definitions/types/audio.types';
import {ObjectType} from 'engine/definitions/types/objects/objects.types';
import {ProximityAction} from 'engine/definitions/types/world.types';
import {useEngine} from 'engine/framework-react';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';

import useObjectParent from './useObjectParent';

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
  'proximityAction',
  'soundName',
  'soundOptions',
]);

const useObjectCreator = <T extends ObjectType = ObjectType>(
  type: T,
  props: ComponentObjectProps<T>,
  ref: any,
) => {
  const {objects} = useEngine();
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

  const lastSound = useRef<[string, SoundOptions] | null>(null);

  const lastProximityAction = useRef<
    Omit<ProximityAction, 'id' | 'objectId'> | null | boolean
  >(null);

  // sound
  useEffect(() => {
    if (!props.soundName || !object) return;

    if (equal(lastSound.current, [props.soundName, props.soundOptions])) return;

    lastSound.current = [props.soundName, {...props.soundOptions}];

    object.setSound(props.soundName, props.soundOptions);
  }, [object, props.soundName, props.soundOptions]);

  // proximity action
  useEffect(() => {
    if (!props.proximityAction || !object) return;

    if (equal(lastProximityAction.current, props.proximityAction)) return;

    lastProximityAction.current =
      typeof props.proximityAction === 'boolean'
        ? props.proximityAction
        : {...props.proximityAction};

    const proximityAciton =
      typeof props.proximityAction === 'boolean' ? {} : props.proximityAction;

    object.setProximityAction(proximityAciton);
  }, [object, props.proximityAction]);

  // remove proximity action and sound
  useEffect(() => {
    if (!object) return;

    return () => {
      if (lastProximityAction.current) {
        object.removeProximityAction();
      }

      if (lastSound.current) {
        object.removeSound();
      }
    };
  }, [object]);

  return {object};
};

export default useObjectCreator;
