import fs from 'fs';
import path from 'path';

import {
  CLIENT_DIR,
  CLOUDFLARE_FUNCTION_SCRIPT,
  IS_CLOUDFLARE_PAGES,
  IS_SERVER,
  IS_VERCEL,
  OUTPUT_DIR,
  SERVER_DIR,
  VERCEL_FUNCTION_SCRIPT,
} from './constants';
import {generateScriptsObject} from './utils.config';

const CLOUDFLARE_ROUTES_CONFIG = {
  version: 1,
  include: ['/*'],
  exclude: ['/_server/*'],
};

const VERCEL_ROUTES_CONFIG = {
  rewrites: [
    {
      source: '/server/:path*',
      destination: '/api/server/:path*',
    },
  ],
};

export const generateProvidersConfig = (
  baseDir: string,
  outputDir: string,
  version: number,
) => {
  const serveConfig = fs.existsSync(`${baseDir}/serve.json`)
    ? JSON.parse(fs.readFileSync(`${baseDir}/serve.json`, 'utf-8'))
    : {};

  const clientScripts = generateScriptsObject(CLIENT_DIR, baseDir);

  if (IS_CLOUDFLARE_PAGES) {
    generateCloudflareConfig(
      baseDir,
      outputDir,
      clientScripts,
      serveConfig,
      version,
    );
  } else {
    generateVercelConfig(
      baseDir,
      outputDir,
      clientScripts,
      serveConfig,
      version,
    );
  }
};

const generateCloudflareConfig = (
  baseDir: string,
  outputDir: string,
  clientScripts: Record<string, string>,
  serveConfig: Record<string, any>,
  version: number,
) => {
  if (!IS_SERVER) {
    // redirects
    let redirects = Object.keys(clientScripts)
      .map(key => `/${key} /${key}-${version}.js 302`)
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

    fs.writeFileSync(`${baseDir}/${OUTPUT_DIR}/_headers`, headers);
    fs.writeFileSync(`${baseDir}/${OUTPUT_DIR}/_redirects`, redirects);
  }

  /////////////////////////

  if (IS_SERVER) {
    fs.writeFileSync(
      `${baseDir}/${OUTPUT_DIR}/_routes.json`,
      JSON.stringify(CLOUDFLARE_ROUTES_CONFIG, null, 2),
    );

    //

    const serverScripts = generateScriptsObject(SERVER_DIR, baseDir);

    Object.keys(serverScripts).map(async scriptKey => {
      const targetPath = `${baseDir}/${outputDir}/_server/${scriptKey}.js`;
      const scriptPath = `${baseDir}/${outputDir}/server/${scriptKey}.js`;

      let relativePath = path.relative(path.dirname(scriptPath), targetPath);

      if (relativePath[0] !== '.') {
        relativePath = `./${relativePath}`;
      }

      const script = CLOUDFLARE_FUNCTION_SCRIPT.replace(
        '__PATH__',
        relativePath,
      );

      ensureDirExists(scriptPath);
      fs.writeFileSync(scriptPath, script);
    });
  }
};

const generateVercelConfig = (
  baseDir: string,
  outputDir: string,
  clientScripts: Record<string, string>,
  serveConfig: Record<string, any>,
  version: number,
) => {
  if (!IS_SERVER) {
    const vercelConfig: Record<string, any> = {};

    // redirects
    vercelConfig.redirects = Object.keys(clientScripts).map(key => ({
      source: `/${key}`,
      destination: `/${key}-${version}.js`,
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

    vercelConfig.rewrites = vercelConfig.rewrites
      ? [...vercelConfig.rewrites, ...VERCEL_ROUTES_CONFIG.rewrites]
      : VERCEL_ROUTES_CONFIG.rewrites;

    //

    if (IS_VERCEL) {
      // vercel.json
      fs.writeFileSync(
        `${baseDir}/${OUTPUT_DIR}/vercel.json`,
        JSON.stringify(vercelConfig, null, 2),
      );
    } else {
      // serve.json
      fs.writeFileSync(
        `${baseDir}/${OUTPUT_DIR}/serve.json`,
        JSON.stringify(vercelConfig, null, 2),
      );
    }
  }

  /////////////////////////

  if (IS_SERVER) {
    const serverScripts = generateScriptsObject(SERVER_DIR, baseDir);

    Object.keys(serverScripts).map(async scriptKey => {
      const targetPath = `${baseDir}/${outputDir}/_server/${scriptKey}.js`;
      const scriptPath = `${baseDir}/${outputDir}/server/${scriptKey}.js`;

      let relativePath = path.relative(path.dirname(scriptPath), targetPath);

      if (relativePath[0] !== '.') {
        relativePath = `./${relativePath}`;
      }

      const script = VERCEL_FUNCTION_SCRIPT.replace('__PATH__', relativePath);

      ensureDirExists(scriptPath);
      fs.writeFileSync(scriptPath, script);
    });
  }
};

export const resolveBaseUrl = (devPort: number) => {
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

const ensureDirExists = (dir: string) => {
  const dirPath = path.dirname(dir);
  fs.mkdirSync(dirPath, {recursive: true});
};
