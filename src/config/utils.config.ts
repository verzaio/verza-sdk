import fs from 'fs';
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
  basePath: typeof CLIENT_DIR | typeof SERVER_DIR,
  baseDir: string,
) => {
  const entryFiles = glob.sync(
    `./src/${basePath}/**/script.+(${WATCH_EXTENSIONS.join('|')})`,
    {
      cwd: baseDir,
    },
  );

  const scripts = entryFiles.reduce<Record<string, string>>((acc, filePath: string) => {
     const offset = filePath.startsWith('.') ? 3 : 2;
     let entryName = filePath.split(path.sep).slice(offset, -1).join(path.sep);

    if (!entryName) {
      const parts = filePath.split(path.sep).slice(offset).join(path.sep).split('.');
      parts.pop();
      entryName = parts.join('.');
    }

    acc[entryName] = filePath.startsWith('.') ? filePath : `./${filePath}`;
    return acc;
  }, {});

  return scripts;
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

export const checkPackageVersion = async () => {
  try {
    const REGISTRY_URL = 'https://registry.npmjs.org/@verza/sdk';

    const {
      'dist-tags': {latest},
    } = await (await fetch(REGISTRY_URL)).json();

    const packageJson = JSON.parse(
      fs.readFileSync(`${process.cwd()}/package.json`, 'utf-8'),
    );

    let currentVersion = packageJson.dependencies['@verza/sdk'];
    // replace ^,~,@,*
    currentVersion = currentVersion.replace(/[\^~@*]/g, '');

    if (latest === currentVersion) return;

    console.log('\n');
    console.log(
      '\t\t\x1b[33m%s\x1b[0m',
      `A new version of Verza SDK is available: \x1b[1m\x1b[37mv${latest}\x1b[0m`,
    );
    console.log(
      '\t\t\x1b[37mUse\x1b[0m \x1b[36m%s\x1b[0m',
      `npm install @verza/sdk@latest\x1b[0m to update.`,
    );
    console.log('\n');
  } catch (e) {
    console.log('\x1b[31m%s\x1b[0m', "Can't check for updates.", e);
  }
};
