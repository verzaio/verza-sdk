import path from 'path';
import {PluginOption, createLogger} from 'vite';

import {CLIENT_DIR, SERVER_DIR, WATCH_EXTENSIONS} from './constants';
import {generateProvidersConfig} from './providers.config';
import {generateEntryObject} from './vite-misc.config';

export const webServerMiddlewarePlugin = (
  baseDir: string,
  baseUrl: string,
): PluginOption => {
  const logger = createLogger(undefined, {
    prefix: '[webserver]',
  });

  return {
    name: 'webserver-handler',
    configureServer({middlewares, ssrLoadModule}) {
      middlewares.use(async (req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const serverEntriesObject = generateEntryObject(SERVER_DIR, baseDir);

        const url = new URL(req.url!, baseUrl);
        const {pathname} = url;

        if (!pathname.startsWith('/server')) {
          next();
          return;
        }

        const resolvedPath = pathname.replace('/server/', '');

        if (!serverEntriesObject[resolvedPath]) {
          next();
          return;
        }

        const importUrl = path.resolve(
          baseDir,
          serverEntriesObject[resolvedPath],
        );

        let module: Record<string, any>;

        try {
          module = await ssrLoadModule(importUrl);
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({error: 'Error loading module'}));
          return;
        }

        // cors
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');

        try {
          const engine = await module.default();

          let body = '';

          logger.info(`${req.method} ${req.url}`, {
            timestamp: true,
          });

          req.on('data', chunk => {
            body += chunk.toString();
          });

          req.on('end', async () => {
            try {
              const response = await engine.api.handleWebServer(body);

              if (response.error) {
                res.statusCode = 500;
                res.end(JSON.stringify(response, null, 2));
                return;
              }

              res.statusCode = 200;
              res.end(JSON.stringify(response, null, 2));
            } catch (e) {
              console.error(e);
              res.statusCode = 500;
              res.end(JSON.stringify({error: 'Error handling request'}));
            }
          });

          return;
        } catch (e) {
          console.error(e);
          res.statusCode = 500;
          res.end(JSON.stringify({error: 'Error processing request'}));
        }
      });
    },
  };
};

export const urlAliasesMiddlewarePlugin = (
  baseDir: string,
  baseUrl: string,
): PluginOption => {
  return {
    name: 'script-url-aliases',
    configureServer({middlewares}) {
      middlewares.use((req, _, next) => {
        if (!req.url) {
          next();
          return;
        }

        // TODO: Cache entries
        const urlAliases = createUrlAliases(baseDir);

        const {pathname} = new URL(req.url!, baseUrl);

        if (urlAliases[pathname]) {
          req.url = req.url.replace(pathname, urlAliases[pathname]);
        }

        next();
      });
    },
  };
};

export const scriptHotReloadPlugin = (): PluginOption => {
  const scriptNames = WATCH_EXTENSIONS.map(ext => `script.${ext}`).join('|');
  const scriptRegex = new RegExp(`/${scriptNames}$`);

  return {
    name: 'script-hot-reload',
    transform(code: string, id: string) {
      if (!id.match(scriptRegex)) return code;

      // ignore if already modified
      if (!code.includes('initEngine(') && !code.includes('initReactEngine(')) {
        return;
      }

      let modifiedCode = code;
      let scriptCode = SCRIPT_HOT_RELOAD;

      if (code.includes('initEngine(')) {
        modifiedCode = code.replace(/initEngine\(/g, '__init_engine(');
        scriptCode = scriptCode.replace(/INIT_ENGINE/g, 'initEngine');
      } else {
        modifiedCode = code.replace(/initReactEngine\(/g, '__init_engine(');
        scriptCode = scriptCode.replace(/INIT_ENGINE/g, 'initReactEngine');
      }

      modifiedCode = `${modifiedCode}\n${scriptCode}`;

      return modifiedCode;
    },
  };
};

export const generateConfigFilesPlugin = (
  baseDir: string,
  entriesObject: Record<string, string>,
  serveConfig: Record<string, any>,
  version: number,
): PluginOption => {
  return {
    name: 'generate-config-files',
    writeBundle() {
      generateProvidersConfig(baseDir, entriesObject, serveConfig, version);
    },
  };
};

const createUrlAliases = (baseDir: string) => {
  const entryObject = generateEntryObject(CLIENT_DIR, baseDir);

  return Object.fromEntries(
    Object.entries(entryObject).map(([key, value]) => [
      `/${key}`,
      `${(value as string).substring(1)}`,
    ]),
  );
};

const SCRIPT_HOT_RELOAD = `
let __last_engine = null;

async function __init_engine(params) {
  const result = await INIT_ENGINE(params);

  __last_engine = Array.isArray(result) ? result[1] : result;

  return result;
};

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    __last_engine?.destroy();
  });

  import.meta.hot.accept(newModule => {
    if (!__last_engine) {
      console.warn('No engine found, cannot hot reload');
      return;
    }

    newModule?.default(__last_engine?.id);
  });
}
`;
