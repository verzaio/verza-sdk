import * as glob from 'glob';
import path from 'path';
import {RollupOptions} from 'rollup';

import {
  CLIENT_DIR,
  EXTERNAL_MODULES,
  IS_DEV,
  IS_SERVER,
  IS_VERCEL,
  SERVER_DIR,
  WATCH_EXTENSIONS,
} from './constants';

export const generateClientVersionedScripts = (
  baseDir: string,
  version: number,
) => {
  const scriptsObject = generateScriptsObject(CLIENT_DIR, baseDir);

  if (IS_DEV) {
    return scriptsObject;
  }

  return Object.fromEntries(
    Object.entries(scriptsObject).map(([key, value]) => [
      `${key}-${version}`,
      value,
    ]),
  );
};

export const generateScriptsObject = (
  path: typeof CLIENT_DIR | typeof SERVER_DIR,
  baseDir: string,
) => {
  const entryFiles = glob.sync(
    `./src/${path}/**/script.+(${WATCH_EXTENSIONS.join('|')})`,
    {
      cwd: baseDir,
    },
  );

  return entryFiles.reduce<Record<string, string>>((acc, filePath: string) => {
    const offset = filePath.startsWith('./') ? 3 : 2;
    let entryName = filePath.split('/').slice(offset, -1).join('/');

    if (!entryName) {
      const parts = filePath.split('/').slice(offset).join('/').split('.');
      parts.pop();
      entryName = parts.join('.');
    }

    acc[entryName] = filePath.startsWith('./') ? filePath : `./${filePath}`;
    return acc;
  }, {});
};

export const generateServerlessScripts = (baseDir: string) => {
  const scriptsObject = generateScriptsObject(SERVER_DIR, baseDir);

  return scriptsObject;
};

export const generateRollupOptions = (
  baseDir: string,
  version: number,
): RollupOptions => {
  const options: RollupOptions = {
    preserveEntrySignatures: 'exports-only',
  };

  if (!IS_SERVER) {
    options.external = EXTERNAL_MODULES;
  }

  let allScripts = {
    ...(IS_SERVER && generateServerlessScripts(baseDir)),

    ...(!IS_SERVER && generateClientVersionedScripts(baseDir, version)),
  };

  if (IS_SERVER) {
    if (IS_VERCEL) {
      options.output = Object.keys(allScripts).map(key => {
        let dirName = path.dirname(key);

        if (dirName === '.') {
          dirName = key;
        }

        return {
          format: 'esm',
          entryFileNames: `server/${dirName}.func/[name].js`,
          chunkFileNames: `server/${dirName}.func/chunks/[name]-[hash].js`,
          assetFileNames: `server/${dirName}.func/assets/[name]-[hash].[ext]`,
        };
      });
    } else {
      allScripts = Object.fromEntries(
        Object.entries(allScripts).map(([key, value]) => [
          `_server/${key}`,
          value,
        ]),
      );

      options.output = {
        format: 'esm',
        entryFileNames: `[name].js`,
        chunkFileNames: `_server/chunks/[name]-[hash].js`,
        assetFileNames: `_server/assets/[name]-[hash].[ext]`,
      };
    }
  } else {
    options.output = {
      format: 'esm',
      entryFileNames: `[name].js`,
      chunkFileNames: `chunks/[name]-[hash].js`,
      assetFileNames: `assets/[name]-[hash].[ext]`,
    };
  }

  if (Object.keys(allScripts).length) {
    options.input = allScripts;
  }

  return options;
};
