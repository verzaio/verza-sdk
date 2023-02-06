import {CommandParam, useCommand, useEngine} from '@verza/sdk';

import {useEffect} from 'react';
import CameraTest from './CameraTest';
import InterfaceTest from './InterfaceTest';
import ObjectsTest from './ObjectsTest';
import PlayersTest from './PlayersTest';
import ServerTest from './ServerTest';
import WebsocketsServer from './WebsocketsServer';

const Testing = () => {
  const engine = useEngine();

  useEffect(() => {
    engine.ui.setSize({
      height: '700px',
      width: '150px',
      top: '5vw',
      right: '10vh',
    });
    engine.ui.show();
  }, [engine]);

  // test cmd
  useCommand('test', [
    new CommandParam('abc', 'number').withDisplay('My age'),
    new CommandParam('abc2', 'string').withDisplay('The message'),
  ])
    .withDesc('Test command')
    .onExecution((_, {abc, abc2}) => {
      console.log('Executing test!!', abc, abc2);
    });

  useCommand('qwerty')
    .withDesc('Qwerty command')
    .onExecution(() => {
      console.log('Executing abc!!');
    });

  return (
    <>
      <WebsocketsServer />

      <ServerTest />

      <PlayersTest />

      <CameraTest />

      <ObjectsTest />

      <InterfaceTest />
    </>
  );
};

export default Testing;
