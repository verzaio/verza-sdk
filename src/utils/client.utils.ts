import {EngineParams} from 'engine/definitions/local/types/engine.types';
import EngineManager from 'engine/managers/engine.manager';
import {initViteClient} from 'engine/utils/vite.utils';

export const initEngine = async (
  params: EngineParams | string = {},
  isWebSocket = false,
): Promise<EngineManager> => {
  if (typeof params === 'string') {
    params = {id: params};
  }

  if (
    typeof process !== 'undefined' &&
    process.env.VERZA_MODE === 'websocket'
  ) {
    isWebSocket = true;
  }

  await initViteClient();

  if (typeof window !== 'undefined' && !params.id) {
    displayWarnMessage();
    throw new Error(`Script ID is required for Client Scripts (${params.id})`);
  }

  if (typeof window === 'undefined' && !isWebSocket) {
    return new EngineManager(params as EngineParams);
  }

  return new Promise((resolve, reject) => {
    try {
      const engine = new EngineManager(params as EngineParams);

      engine.events.on('onSynced', async () => resolve(engine));

      engine.events.on('onDisconnect', () => engine.destroy());

      if (typeof window === 'undefined') {
        engine.connectServer();
      } else {
        engine.connectClient();
      }

      return engine;
    } catch (error) {
      reject(error);
    }
  });
};

const DEFAULT_MESSAGE =
  "Client Script cannot initiate, make sure the script is added/connected to the Server's settings";

export const displayWarnMessage = (msg = DEFAULT_MESSAGE) => {
  const el = document.createElement('div');
  const h4 = document.createElement('h4');

  el.append(h4);

  el.style.position = 'absolute';
  el.style.left = '0px';
  el.style.top = '0px';
  el.style.width = '100%';
  el.style.display = 'flex';
  el.style.margin = '0 auto';
  el.style.padding = '30px';

  h4.innerText = msg;

  document.body.appendChild(el);
  console.debug(msg);
};
