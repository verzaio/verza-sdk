import fs from 'fs';
import * as glob from 'glob';
import {PluginOption, UserConfig, defineConfig, mergeConfig} from 'vite';

const VERSION = Math.floor(Math.random() * 8999999 + 1000000);

const IS_DEV = process.env.NODE_ENV === 'development';

const DEFAULT_PORT = IS_DEV ? 8085 : 8081;

const WATCH_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx'];

const DIST_DIR = 'dist';

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

  const entriesObject = generateEntryObject(baseDir);

  if (!Object.keys(entriesObject).length) {
    throw new Error(
      'No scripts found, make sure you have at least one script in /src/scripts',
    );
  }

  const versionedEntryObject = IS_DEV
    ? entriesObject
    : generateVersionedEntries(entriesObject);

  const serveConfig = fs.existsSync(`${baseDir}/serve.json`)
    ? JSON.parse(fs.readFileSync(`${baseDir}/serve.json`, 'utf-8'))
    : {};

  return mergeConfig(
    {
      plugins: [
        IS_DEV && cssUrlPrefixPlugin(baseUrl),
        IS_DEV && urlAliasesMiddlewarePlugin(baseDir, baseUrl),
        IS_DEV && scriptHotReloadPlugin(),
        !IS_DEV &&
          generateConfigFilesPlugin(baseDir, entriesObject, serveConfig),
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
  const entryFiles = glob.sync(
    `./src/scripts/**/script.+(${WATCH_EXTENSIONS.join('|')})`,
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

const urlAliasesMiddlewarePlugin = (
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

const scriptHotReloadPlugin = (): PluginOption => {
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

const generateConfigFilesPlugin = (
  baseDir: string,
  entriesObject: Record<string, string>,
  serveConfig: Record<string, any>,
): PluginOption => {
  return {
    name: 'generate-config-files',
    writeBundle() {
      generateProvidersConfig(baseDir, entriesObject, serveConfig);
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

const generateProvidersConfig = (
  baseDir: string,
  entriesObject: Record<string, string>,
  serveConfig: Record<string, any>,
) => {
  generateCloudflareConfig(entriesObject, baseDir, serveConfig);
  generateVercelConfig(entriesObject, baseDir, serveConfig);
};

const generateCloudflareConfig = (
  entriesObject: Record<string, string>,
  baseDir: string,
  serveConfig: Record<string, any>,
) => {
  // redirects
  let redirects = Object.keys(entriesObject)
    .map(key => `/${key} /${key}-${VERSION}.js 302`)
    .join('\n');

  // serve.json redirects
  if (serveConfig.redirects) {
    redirects = redirects.concat(
      '\n',
      serveConfig.redirects
        .map((redirect: Record<string, any>) => {
          const {source, destination, status} = redirect;
          return [source, destination, status].filter(Boolean).join(' ');
        })
        .join('\n'),
    );
  }

  // headers
  let headers = `/*\n  Access-Control-Allow-Origin: *`;

  // serve.json headers
  if (serveConfig.headers) {
    headers = headers.concat(
      '\n',
      serveConfig.headers
        .map((headerObj: Record<string, any>) => {
          const source = headerObj.source;
          return headerObj.headers
            .map(
              (header: Record<string, string>) =>
                `${source}\n  ${header.key}: ${header.value}`,
            )
            .join('\n');
        })
        .join('\n'),
    );
  }

  fs.writeFileSync(`${baseDir}/${DIST_DIR}/_headers`, headers);
  fs.writeFileSync(`${baseDir}/${DIST_DIR}/_redirects`, redirects);
};

const generateVercelConfig = (
  entriesObject: Record<string, string>,
  baseDir: string,
  serveConfig: Record<string, any>,
) => {
  const vercelConfig: Record<string, any> = {};

  // redirects
  vercelConfig.redirects = Object.keys(entriesObject).map(key => ({
    source: `/${key}`,
    destination: `/${key}-${VERSION}.js`,
    statusCode: 302,
  }));

  // headers
  vercelConfig.headers = [
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

  // merge serve.json

  const {redirects, headers, ...rest} = serveConfig;

  Object.assign(vercelConfig, rest);

  if (redirects) {
    vercelConfig.headers = [...vercelConfig.redirects, ...redirects];
  }

  if (headers) {
    vercelConfig.redirects = [...vercelConfig.headers, ...headers];
  }

  //

  // vercel.json
  fs.writeFileSync(
    `${baseDir}/${DIST_DIR}/vercel.json`,
    JSON.stringify(vercelConfig, null, 2),
  );

  // serve.json
  fs.writeFileSync(
    `${baseDir}/${DIST_DIR}/serve.json`,
    JSON.stringify(vercelConfig, null, 2),
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
