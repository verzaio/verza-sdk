import {CommandParam, useCommand, useEngine} from '@verza/sdk';

import {useEffect} from 'react';
import CameraTest from './CameraTest';
import InterfaceTest from './InterfaceTest';
import ObjectsTest from './ObjectsTest';
import PlayersTest from './PlayersTest';
import WebServerTest from './WebServerTest';
import WebsocketsServerTest from './WebsocketsServerTest';

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
    .on((_, {abc, abc2}) => {
      console.log('Executing test!!', abc, abc2);
    });

  useCommand('qwerty')
    .withDesc('Qwerty command')
    .on(() => {
      console.log('Executing abc!!');
    });

  useCommand('a1');
  useCommand('a2');

  return (
    <>
      <WebsocketsServerTest />

      <WebServerTest />

      <PlayersTest />

      <CameraTest />

      <ObjectsTest />

      <InterfaceTest />
    </>
  );
};

export default Testing;
