import fs from 'fs';
import * as glob from 'glob';
import {PluginOption, UserConfig, defineConfig, mergeConfig} from 'vite';

const VERSION = Math.floor(Math.random() * 8999999 + 1000000);

const DEFAULT_PORT = 8085;

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

  const baseUrl = getBaseUrl(port);

  const isDevelopment = process.env.NODE_ENV === 'development';

  const entryObject = generateEntryObject(baseDir);

  const versionedEntryObject = isDevelopment
    ? entryObject
    : generateVersionedEntries(entryObject);

  if (!isDevelopment) {
    generateProvidersConfig(entryObject, baseDir);
  }

  process.env.VITE_BASE_URL = baseUrl;

  return mergeConfig(baseConfig, {
    plugins: [
      isDevelopment && cssUrlPrefix(baseUrl),
      isDevelopment && urlAliasesMiddleware(baseDir, baseUrl),
    ].filter(Boolean),

    build: {
      target: 'esnext',
      manifest: true,
      rollupOptions: {
        input: versionedEntryObject,
        output: {
          format: 'esm',
          entryFileNames: `[name].js`,
        },
      },
      outDir: 'dist',
      copyPublicDir: true,
      cssCodeSplit: false,
      emptyOutDir: true,
      minify: false,
    },

    server: {
      cors: true,
      origin: baseUrl,
    },

    base: baseUrl,
  });
};

const generateVersionedEntries = (entryObject: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(entryObject).map(([key, value]) => [
      `${key}-${VERSION}`,
      value,
    ]),
  );

const createUrlAliases = (baseDir: string) => {
  const entryObject = generateEntryObject(baseDir);

  return Object.fromEntries(
    Object.entries(entryObject).map(([key, value]) => [
      `/${key}`,
      `${(value as string).substring(1)}`,
    ]),
  );
};

const generateEntryObject = (baseDir: string) => {
  const entryFiles = glob.sync(`./src/scripts/**/script.tsx`, {
    cwd: baseDir,
  });

  return entryFiles.reduce<Record<string, string>>((acc, filePath: string) => {
    const offset = filePath.startsWith('./') ? 3 : 2;
    const entryName = filePath.split('/').slice(offset, -1).join('/');
    acc[entryName] = filePath.startsWith('./') ? filePath : `./${filePath}`;
    return acc;
  }, {});
};

const cssUrlPrefix = (baseUrl: string): PluginOption => {
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

const urlAliasesMiddleware = (
  baseDir: string,
  baseUrl: string,
): PluginOption => {
  return {
    name: 'script-url-aliases',
    configureServer(server) {
      server.middlewares.use((req, _, next) => {
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

const getBaseUrl = (devPort: number) => {
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

const generateProvidersConfig = (
  entryObject: Record<string, string>,
  baseDir: string,
) => {
  generateCloudflareConfig(entryObject, baseDir);
  generateVercelConfig(entryObject, baseDir);
};

const generateCloudflareConfig = (
  entryObject: Record<string, string>,
  baseDir: string,
) => {
  // redirects
  const redirects = Object.keys(entryObject)
    .map(key => `/${key} /${key}-${VERSION}.js 302`)
    .join('\n');

  fs.writeFileSync(`${baseDir}/public/_redirects`, redirects);

  // headers
  const headers = `/*\n  Access-Control-Allow-Origin: *`;

  fs.writeFileSync(`${baseDir}/public/_headers`, headers);
};

const generateVercelConfig = (
  entryObject: Record<string, string>,
  baseDir: string,
) => {
  const vercelJson: Record<string, any> = {};

  // redirects
  vercelJson.redirects = Object.keys(entryObject).map(key => ({
    source: `/${key}`,
    destination: `/${key}-${VERSION}.js`,
    statusCode: 302,
  }));

  // headers
  vercelJson.headers = [
    {
      source: '(.*)',
      headers: [
        {
          key: 'Access-Control-Allow-Origin',
          value: '*',
        },
      ],
    },
  ];

  //

  // vercel.json
  fs.writeFileSync(
    `${baseDir}/public/vercel.json`,
    JSON.stringify(vercelJson, null, 2),
  );

  // serve.json
  fs.writeFileSync(
    `${baseDir}/public/serve.json`,
    JSON.stringify(vercelJson, null, 2),
  );
};
