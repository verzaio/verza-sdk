import {UserConfig, defineConfig, mergeConfig} from 'vite';

import {
  DEFAULT_PORT,
  IS_CLOUDFLARE_PAGES,
  IS_DEV,
  IS_SERVER,
  IS_VERCEL,
  OUTPUT_DIR,
} from './constants';
import {resolveBaseUrl} from './providers.config';
import {generateRollupOptions} from './utils.config';
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

  // default output dir
  let outputDir: string = OUTPUT_DIR;

  // select output dir
  if (IS_SERVER) {
    console.log('IS_CLOUDFLARE_PAGES', IS_CLOUDFLARE_PAGES);
    if (IS_CLOUDFLARE_PAGES) {
      outputDir = 'functions';
    } else if (IS_VERCEL) {
      outputDir = `${OUTPUT_DIR}/api`;
    } else {
      outputDir = 'api';
    }
  }

  return mergeConfig(
    {
      plugins: [
        IS_DEV && __dev__webServerMiddlewarePlugin(baseDir, baseUrl),
        IS_DEV && __dev__cssUrlPrefixPlugin(baseUrl),
        IS_DEV && __dev__urlAliasesMiddlewarePlugin(baseDir, baseUrl),
        IS_DEV && __dev__scriptHotReloadPlugin(),
        !IS_DEV &&
          generateConfigFilesPlugin(baseDir, baseUrl, outputDir, VERSION),
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
