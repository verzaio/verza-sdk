import fs from 'fs';

import {DIST_DIR} from './constants';

export const generateProvidersConfig = (
  baseDir: string,
  entriesObject: Record<string, string>,
  serveConfig: Record<string, any>,
  version: number,
) => {
  generateCloudflareConfig(entriesObject, baseDir, serveConfig, version);
  generateVercelConfig(entriesObject, baseDir, serveConfig, version);
};

const generateCloudflareConfig = (
  entriesObject: Record<string, string>,
  baseDir: string,
  serveConfig: Record<string, any>,
  version: number,
) => {
  // redirects
  let redirects = Object.keys(entriesObject)
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
};

const generateVercelConfig = (
  entriesObject: Record<string, string>,
  baseDir: string,
  serveConfig: Record<string, any>,
  version: number,
) => {
  const vercelConfig: Record<string, any> = {};

  // redirects
  vercelConfig.redirects = Object.keys(entriesObject).map(key => ({
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
