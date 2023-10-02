import * as glob from 'glob';
import {RollupOptions} from 'rollup';

import {
  CLIENT_DIR,
  EXTERNAL_MODULES,
  IS_DEV,
  IS_SERVER,
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

  return Object.fromEntries(
    Object.entries(scriptsObject).map(([key, value]) => [
      `_server/${key}`,
      value,
    ]),
  );
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

  if (IS_SERVER) {
    options.output = {
      format: 'esm',
      entryFileNames: `[name].js`,
      chunkFileNames: `_server/chunks/[name]-${version}.js`,
      assetFileNames: `_server/assets/[name]-${version}.[ext]`,
    };
  } else {
    options.output = {
      format: 'esm',
      entryFileNames: `[name].js`,
      chunkFileNames: `chunks/[name]-${version}.js`,
      assetFileNames: `assets/[name]-${version}.[ext]`,
    };
  }

  const allScripts = {
    ...(IS_SERVER && generateServerlessScripts(baseDir)),

    ...(!IS_SERVER && generateClientVersionedScripts(baseDir, version)),
  };

  if (Object.keys(allScripts).length) {
    options.input = allScripts;
  }

  return options;
};
