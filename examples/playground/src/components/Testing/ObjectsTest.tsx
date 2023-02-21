import {Box, Group, Line, useFrame, useObjects} from '@verza/sdk/react';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {useCallback, useEffect, useRef} from 'react';

// https://github.com/KhronosGroup/glTF-Sample-Models

const ObjectsTest = () => {
  const objects = useObjects();
  const objectRef = useRef<ObjectManager>(null!);

  const anotherOneRef = useRef<ObjectManager>(null!);

  const destroy = useCallback(() => {
    if (objectRef.current) {
      objects.destroy(objectRef.current);
      objectRef.current = null!;
    }
  }, [objects]);

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
        collision: 'static',
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
        collision: 'static',
      },
    );
  };

  useEffect(() => {
    return () => {
      destroy();
    };
  }, [destroy]);

  useFrame(() => {
    if (!anotherOneRef.current) return;

    /* anotherOneRef.current.location.rotateY(delta / 10);
    anotherOneRef.current.setRotation(anotherOneRef.current.rotation);

    anotherOneRef.current.location.translateX(delta / 5);
    anotherOneRef.current.setPosition(anotherOneRef.current.position); */
  });

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

      <Box
        box={{w: 2, h: 2, d: 2, c: 'green'}}
        position={[-8, 1, 20]}
        collision="static"
      />

      <Line
        points={[
          [-10, 10, 10],
          [20, 10, 20],
        ]}
        color="blue"
        position={[-8, 1, 20]}
        collision="static"
      />

      <Group id="boxesGroup" ref={objectRef} position={[0, 1, 10]}>
        <Box
          id="box1"
          box={{w: 1, h: 0.5, d: 1, c: 'violet'}}
          position={[0, 1, 0]}
          collision="static"
        />

        <Box
          id="box2"
          box={{w: 1, h: 0.5, d: 1, c: 'blue'}}
          position={[0, 0.5, 2]}
          collision="static"
        />

        <Box
          id="box3"
          box={{w: 1, h: 0.5, d: 1, c: 'green'}}
          position={[0, 0.5, 3]}
          collision="static"
        />

        <Box
          id="box4"
          box={{w: 1, h: 0.5, d: 1, c: 'yellow'}}
          position={[0, 0.5, 4]}
          collision="static"
        />

        <Box
          id="redBox"
          box={{w: 1, h: 0.5, d: 1, c: 'red'}}
          position={[1, 0.5, 2]}
          collision="static"
        />

        <Box
          id="box6"
          box={{w: 1, h: 0.5, d: 1, c: 'blue'}}
          position={[1, 0.5, 3]}
          collision="static"
        />

        <Box
          id="box7"
          box={{w: 1, h: 0.5, d: 1, c: 'green'}}
          position={[1, 0.5, 4]}
          collision="static"
        />

        {/* <Gltf
          ref={anotherOneRef}
          props={{
            position: [0, 1.01, 7],
            collision: 'static',
          }}
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box%20With%20Spaces/glTF/Box%20With%20Spaces.gltf"
        /> */}
      </Group>

      {/*  <Gltf
        props={{position: [0, 1, 10], collision: 'static'}}
        url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb"
      /> */}

      {/* <Gltf
        props={{position: [0, 1, 10], collision: 'static'}}
        url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb"
      /> */}
    </div>
  );
};

export default ObjectsTest;
