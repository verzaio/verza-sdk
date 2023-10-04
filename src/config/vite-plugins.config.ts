import fs from 'fs';
import path from 'path';
import {PluginOption, createLogger} from 'vite';

import {
  CLIENT_DIR,
  SERVER_DIR,
  HOT_RELOAD_SCRIPT,
  WATCH_EXTENSIONS,
  IMPORT_STYLES_SCRIPT,
  IS_SERVER,
} from './constants';
import {generateProvidersConfig} from './providers.config';
import {generateScriptsObject} from './utils.config';

export const __dev__webServerMiddlewarePlugin = (
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

        const serverEntriesObject = generateScriptsObject(SERVER_DIR, baseDir);

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

export const __dev__urlAliasesMiddlewarePlugin = (
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

export const __dev__scriptHotReloadPlugin = (): PluginOption => {
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
      let scriptCode = HOT_RELOAD_SCRIPT;

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

export const __dev__cssUrlPrefixPlugin = (baseUrl: string): PluginOption => {
  return {
    name: 'css-url-prefix',
    transform(code: string, id: string) {
      if (id.endsWith('.scss') || id.endsWith('.css')) {
        const modifiedCode = code.replace(
          /url\(['"]?(\.\/|\/)(.*?)['"]?\)/g,
          `url("${baseUrl}$1")`,
        );

        return modifiedCode;
      }

      return code;
    },
  };
};

export const generateConfigFilesPlugin = (
  baseDir: string,
  baseUrl: string,
  outputDir: string,
  version: number,
): PluginOption => {
  return {
    name: 'generate-config-files',
    enforce: 'post',
    async writeBundle() {
      generateProvidersConfig(baseDir, outputDir, version);

      if (!IS_SERVER) {
        writeStylesFile(baseDir, baseUrl, outputDir, version);
      }
    },
  };
};

const createUrlAliases = (baseDir: string) => {
  const entryObject = generateScriptsObject(CLIENT_DIR, baseDir);

  return Object.fromEntries(
    Object.entries(entryObject).map(([key, value]) => [
      `/${key}`,
      `${(value as string).substring(1)}`,
    ]),
  );
};

const writeStylesFile = (
  baseDir: string,
  baseUrl: string,
  outputDir: string,
  version: number,
) => {
  const stylesFile = `${baseDir}/${outputDir}/chunks/styles-${version}.js`;
  const stylesUrl = `${baseUrl}/assets/style-${version}.css`;

  if (!fs.existsSync(stylesFile)) return;

  fs.writeFileSync(
    stylesFile,
    IMPORT_STYLES_SCRIPT.replace('__STYLES_URL__', stylesUrl),
  );
};
