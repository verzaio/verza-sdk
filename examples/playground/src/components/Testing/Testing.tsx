import {Command, CommandParam, useCommand, useEngine} from '@verza/sdk';

import {useEffect} from 'react';
import InterfaceTest from './InterfaceTest';
import PlayersTest from './PlayersTest';

const Testing = () => {
  const engine = useEngine();

  useEffect(() => {
    engine.ui.setSize({
      height: '400px',
      width: '150px',
      top: '10vw',
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
    .onExecution(({abc, abc2}) => {
      console.log('Executing test!!', abc, abc2);
    });

  useCommand('abc')
    .withDesc('Abc command')
    .onExecution(() => {
      console.log('Executing abc!!');
    });

  return (
    <>
      <PlayersTest />

      <InterfaceTest />
    </>
  );
};

export default Testing;
