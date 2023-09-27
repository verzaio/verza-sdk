import {EngineParams} from 'engine/definitions/local/types/engine.types';
import EngineManager from 'engine/managers/engine.manager';

const DEFAULT_MESSAGE =
  "Client Script cannot initiate, make sure the script is added/connected to the Server's settings";

export const displayClientMessage = (msg = DEFAULT_MESSAGE) => {
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

export const createEngineManager = (
  importUrl: string,
  params: EngineParams = {},
): Promise<EngineManager> => {
  if (typeof window !== 'undefined') {
    params.id = resolveScriptId(importUrl);
  }

  return new Promise((resolve, reject) => {
    try {
      const engine = new EngineManager(params);

      engine.events.on('onSynced', () => resolve(engine));

      engine.events.on('onDisconnect', () => {
        engine.destroy();
      });

      engine.connectClient();

      return engine;
    } catch (error) {
      reject(error);
    }
  });
};

const resolveScriptId = (url: string) => {
  // lookup by exact url
  let scriptId = document.querySelector(
    `script[data-script-url="${url}"],script[src="${url}"]`,
  )?.id;

  // lookup by url prefix
  if (!scriptId) {
    const queryUrl = url.substring(0, url.lastIndexOf('-'));

    scriptId = document.querySelector(
      `script[data-script-url^="${queryUrl}"],script[src^="${queryUrl}"]`,
    )?.id;
  }

  if (!scriptId) {
    displayClientMessage();

    throw new Error(`Script with url ${url} not found`);
  }

  return scriptId;
};
