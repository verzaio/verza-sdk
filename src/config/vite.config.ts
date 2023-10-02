import {UserConfig, defineConfig, mergeConfig} from 'vite';

import {
  DEFAULT_PORT,
  DIST_DIR,
  IS_CLOUDFLARE_PAGES,
  IS_DEV,
  IS_SERVER,
} from './constants';
import {resolveBaseUrl} from './providers.config';
import {generateRollupOptions} from './scripts.config';
import {
  __dev__cssUrlPrefixPlugin,
  __dev__scriptHotReloadPlugin,
  __dev__urlAliasesMiddlewarePlugin,
  __dev__webServerMiddlewarePlugin,
  generateConfigFilesPlugin,
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

  const outputDir = IS_SERVER
    ? IS_CLOUDFLARE_PAGES
      ? `./functions`
      : './api'
    : DIST_DIR;

  return mergeConfig(
    {
      plugins: [
        IS_DEV && __dev__webServerMiddlewarePlugin(baseDir, baseUrl),
        IS_DEV && __dev__cssUrlPrefixPlugin(baseUrl),
        IS_DEV && __dev__urlAliasesMiddlewarePlugin(baseDir, baseUrl),
        IS_DEV && __dev__scriptHotReloadPlugin(),
        !IS_DEV && generateConfigFilesPlugin(baseDir, baseUrl, VERSION),
      ].filter(Boolean),

      build: {
        target: 'esnext',
        rollupOptions: generateRollupOptions(baseDir, VERSION),
        outDir: outputDir,
        manifest: true,
        cssCodeSplit: false,
        copyPublicDir: !IS_SERVER,
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
