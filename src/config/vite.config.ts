import fs from 'fs';
import {PluginOption, UserConfig, defineConfig, mergeConfig} from 'vite';

import {CLIENT_DIR, DEFAULT_PORT, DIST_DIR, IS_DEV} from './constants';
import {
  generateEntryObject,
  generateVersionedEntries,
} from './vite-misc.config';
import {
  generateConfigFilesPlugin,
  scriptHotReloadPlugin,
  urlAliasesMiddlewarePlugin,
  webServerMiddlewarePlugin,
} from './vite-plugins.config';

const VERSION = Math.floor(Math.random() * 8999999 + 1000000);

export const defineViteConfig = (config: Partial<UserConfig> = {}) => {
  const baseConfig = defineConfig(
    mergeConfig(
      {
        root: process.cwd(),

        server: {
          port: DEFAULT_PORT,
        },
      },
      config,
    ),
  );

  const baseDir = baseConfig!.root!;

  const port = baseConfig!.server!.port!;

  const baseUrl = baseConfig.base ?? resolveBaseUrl(port);

  process.env.VITE_BASE_URL = baseUrl;

  const clientEntriesObject = generateEntryObject(CLIENT_DIR, baseDir);

  /* if (!Object.keys(entriesObject).length) {
    throw new Error(
      `No scripts found, make sure you have at least one script in /src/${CLIENT_DIR}`,
    );
  } */

  const versionedEntryObject = IS_DEV
    ? clientEntriesObject
    : generateVersionedEntries(clientEntriesObject, VERSION);

  const serveConfig = fs.existsSync(`${baseDir}/serve.json`)
    ? JSON.parse(fs.readFileSync(`${baseDir}/serve.json`, 'utf-8'))
    : {};

  return mergeConfig(
    {
      plugins: [
        IS_DEV && webServerMiddlewarePlugin(baseDir, baseUrl),
        IS_DEV && cssUrlPrefixPlugin(baseUrl),
        IS_DEV && urlAliasesMiddlewarePlugin(baseDir, baseUrl),
        IS_DEV && scriptHotReloadPlugin(),
        !IS_DEV &&
          generateConfigFilesPlugin(
            baseDir,
            clientEntriesObject,
            serveConfig,
            VERSION,
          ),
      ].filter(Boolean),

      build: {
        target: 'esnext',
        manifest: true,
        rollupOptions: {
          ...(Object.keys(versionedEntryObject).length && {
            input: versionedEntryObject,
          }),

          output: {
            format: 'esm',
            entryFileNames: `[name].js`,
          },
        },
        outDir: DIST_DIR,
        cssCodeSplit: false,
        copyPublicDir: true,
        emptyOutDir: true,
        sourcemap: false,
        minify: true,
      },

      server: {
        cors: true,
        origin: baseUrl,
      },

      base: baseUrl,
    } satisfies UserConfig,
    baseConfig,
  );
};

const cssUrlPrefixPlugin = (baseUrl: string): PluginOption => {
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

const resolveBaseUrl = (devPort: number) => {
  let baseUrl = `http://localhost:${devPort}`;

  // cloudflare pages
  if (process.env.CF_PAGES_URL) {
    baseUrl = process.env.CF_PAGES_URL;
  }

  // vercel
  if (process.env.VERCEL_URL) {
    baseUrl = `https://${process.env.VERCEL_URL}`;
  }

  // netlify
  if (process.env.URL) {
    baseUrl = process.env.URL;
  }

  return baseUrl;
};
