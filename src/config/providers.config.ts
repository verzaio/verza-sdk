import fs from 'fs';

import {
  CLIENT_DIR,
  DIST_DIR,
  IS_CLOUDFLARE_PAGES,
  IS_NETLIFY,
  IS_SERVER,
  IS_VERCEL,
} from './constants';
import {generateScriptsObject} from './scripts.config';

const CLOUDFLARE_ROUTES_CONFIG = {
  version: 1,
  include: ['/*'],
  exclude: ['/_server/*'],
};

export const generateProvidersConfig = (baseDir: string, version: number) => {
  const serveConfig = fs.existsSync(`${baseDir}/serve.json`)
    ? JSON.parse(fs.readFileSync(`${baseDir}/serve.json`, 'utf-8'))
    : {};

  const clientScripts = generateScriptsObject(CLIENT_DIR, baseDir);

  if (IS_CLOUDFLARE_PAGES || IS_NETLIFY) {
    generateCloudflareConfig(baseDir, clientScripts, serveConfig, version);
  } else {
    generateVercelConfig(baseDir, clientScripts, serveConfig, version);
  }
};

const generateCloudflareConfig = (
  baseDir: string,
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

    fs.writeFileSync(`${baseDir}/${DIST_DIR}/_headers`, headers);
    fs.writeFileSync(`${baseDir}/${DIST_DIR}/_redirects`, redirects);
  }

  /////////////////////////

  if (IS_SERVER) {
    fs.writeFileSync(
      `${baseDir}/functions/_routes.json`,
      JSON.stringify(CLOUDFLARE_ROUTES_CONFIG, null, 2),
    );

    // TODO: cloudflare serverless config
  }
};

const generateVercelConfig = (
  baseDir: string,
  clientScripts: Record<string, string>,
  serveConfig: Record<string, any>,
  version: number,
) => {
  if (IS_SERVER) {
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

    if (IS_VERCEL) {
      // vercel.json
      fs.writeFileSync(
        `${baseDir}/${DIST_DIR}/vercel.json`,
        JSON.stringify(vercelConfig, null, 2),
      );
    } else {
      // serve.json
      fs.writeFileSync(
        `${baseDir}/${DIST_DIR}/serve.json`,
        JSON.stringify(vercelConfig, null, 2),
      );
    }
  }

  /////////////////////////

  if (IS_SERVER) {
    // TODO: vercel serverless config
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
