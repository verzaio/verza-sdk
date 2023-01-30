import {useObjects} from '@verza/sdk';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {useEffect, useRef} from 'react';
import {object} from 'zod';

const ObjectsTest = () => {
  const objects = useObjects();
  const objectRef = useRef<ObjectManager>(null!);

  const destroy = () => {
    if (objectRef.current) {
      objects.destroy(objectRef.current);
      objectRef.current = null!;
    }
  };

  const createBox = () => {
    objectRef.current = objects.createBox(
      {
        w: 2,
        h: 2,
        d: 3,
        c: 'red',
      },
      {
        position: [1, 2, 10],
        physics: 'fixed',
      },
    );
  };

  const setPosition = () => {
    if (!objectRef.current) return;

    objectRef.current.setPosition(
      objectRef.current.location.translateZ(2).position,
    );
  };

  const setRotation = () => {
    if (!objectRef.current) return;

    objectRef.current.setRotation(
      objectRef.current.location.rotateZ(Math.PI / 6).quaternion,
    );
  };

  const createGltf = () => {
    objectRef.current = objects.createGltf(
      'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box%20With%20Spaces/glTF/Box%20With%20Spaces.gltf',
      {
        position: [1, 2, 10],
        physics: 'fixed',
      },
    );
  };

  useEffect(() => {
    return () => {
      destroy();
    };
  }, [objects]);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
      <button
        onClick={() => {
          destroy();
          createBox();
        }}>
        objects.createBox
      </button>

      <button
        onClick={() => {
          destroy();
          createGltf();
        }}>
        objects.createGltf
      </button>

      <button
        onClick={() => {
          setPosition();
        }}>
        object.setPosition
      </button>

      <button
        onClick={() => {
          setRotation();
        }}>
        object.setRotation
      </button>

      <button onClick={() => destroy()}>objects.destroy</button>
    </div>
  );
};

export default ObjectsTest;
