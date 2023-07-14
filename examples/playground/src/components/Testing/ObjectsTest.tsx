import {Box, Group, useEngine, useFrame} from '@verza/sdk/react';
import ObjectManager from 'engine/managers/entities/objects/object/object.manager';
import {useCallback, useEffect, useRef} from 'react';

// https://github.com/KhronosGroup/glTF-Sample-Models

const ObjectsTest = () => {
  const {objects} = useEngine();
  const objectRef = useRef<ObjectManager>(null!);

  const anotherOneRef = useRef<ObjectManager>(null!);

  const destroy = useCallback(() => {
    if (objectRef.current) {
      objects.destroy(objectRef.current);
      objectRef.current = null!;
    }
  }, [objects]);

  const createBox = () => {
    objectRef.current = objects.create('box', {
      width: 2,
      height: 2,
      depth: 3,
      color: 'red',

      position: [1, 2, 10],
      collision: 'static',
    });
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
    objectRef.current = objects.create('gltf', {
      u: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box%20With%20Spaces/glTF/Box%20With%20Spaces.gltf',
      position: [1, 2, 10],
      collision: 'static',
    });
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

      {/* <Box
        box={{width: 2, h: 2, d: 2, color: 'green'}}
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
      /> */}

      {/* <Group
       ref={objectRef }
        id="boxesGroup2"
        position={[5, 3, 8]}
        scale={[1.5, 1.5, 1.5]}
        rotation={[Math.PI / 4, 0, 0]}>
        <Box
          id="test1"
          box={{width: 1, h: 0.5, d: 1, color: 'violet'}}
          position={[0, 1, 1]}
          rotation={[Math.PI / 4, 0, 0]}
          collision="static"
        />

        <Box
          id="test2"
          box={{width: 1, h: 0.5, d: 1, color: 'blue'}}
          position={[0, 0.5, 2]}
          collision="static"
        />
      </Group> */}

      <Group
        id="boxesGroup"
        position={[2, 3, 10]}
        scale={[2, 2, 2]}
        rotation={[0, 0, Math.PI / 4]}>
        {/* <Group position={[2, 2, 2]} rotation={[0, 0, Math.PI / 2]}>
          <Box
            id="box1"
            box={{width: 1, h: 0.5, d: 1, color: 'violet'}}
            position={[0, 1, 0]}
            collision="static"
          />

          <Box
            id="box2"
            box={{width: 1, h: 0.5, d: 1, color: 'blue'}}
            position={[0, 0.5, 2]}
            collision="static"
          />
        </Group> */}

        <Box
          shadows
          id="box1"
          width={1}
          height={0.5}
          depth={1}
          color="violet"
          position={[0, 2, 0]}
          rotation={[Math.PI / 4, 0, 0]}
        />

        <Box
          id="box2"
          width={1}
          height={0.5}
          depth={1}
          color="blue"
          position={[2, 0.5, 2]}
          collision="static"
        />

        <Box
          id="box3"
          width={1}
          height={0.5}
          depth={1}
          color="green"
          position={[0, 0.5, 3]}
          collision="static"
        />

        <Box
          id="box4"
          width={1}
          height={0.5}
          depth={1}
          color="yellow"
          position={[0, 0.5, 4]}
          collision="static"
        />

        <Box
          id="redBox"
          width={1}
          height={0.5}
          depth={1}
          color="red"
          position={[1, 0.5, 2]}
          collision="static"
        />

        <Box
          id="box6"
          width={1}
          height={0.5}
          depth={1}
          color="blue"
          position={[1, 0.5, 3]}
          collision="static"
        />

        <Box
          id="box7"
          width={1}
          height={0.5}
          depth={1}
          color="green"
          position={[1, 0.5, 4]}
          collision="static"
        />

        {/* <Gltf
          ref={anotherOneRef}
          position={[0, 1.01, 7]}
          collision="static"
          url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Box%20With%20Spaces/glTF/Box%20With%20Spaces.gltf"
        /> */}
      </Group>

      {/*  <Gltf
        props={{position: [0, 1, 10], collision: 'static'}}
        url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Buggy/glTF-Binary/Buggy.glb"
      /> */}

      {/* <Gltf
        position={[0, 1, 10]}
        collision="static"
        url="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/CesiumMilkTruck/glTF-Binary/CesiumMilkTruck.glb"
      /> */}
    </div>
  );
};

export default ObjectsTest;
