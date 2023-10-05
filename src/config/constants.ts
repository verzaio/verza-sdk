export const IS_DEV = process.env.NODE_ENV === 'development';

export const DEFAULT_PORT = 8085;

export const WATCH_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx'];

export const CLIENT_DIR = 'client';

export const SERVER_DIR = 'server';

export const OUTPUT_DIR = 'dist';

export const IS_SERVER = process.argv.some(arg => arg === 'server');

export const IS_VERCEL = !!process.env.VERCEL;

export const IS_CLOUDFLARE_PAGES = !!process.env.CF_PAGES;

export const EXTERNAL_MODULES = [
  /^@verza\/sdk$/,
  /^@verza\/sdk\/utils$/,
  /^three$/,
  /^three\/examples\/.*$/,
];

const miniMinify = (code: string) => {
  return code.trim().split('\n').join('').split('  ').join('');
};

export const HOT_RELOAD_SCRIPT = `
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

export const IMPORT_STYLES_SCRIPT = miniMinify(`
;(() => {
  const url = '__STYLES_URL__';

  if (document.querySelector(\`link[href="\${url}"]\`)) return;

  const styles = document.createElement('link');
  styles.rel = 'stylesheet';
  styles.href = url;
  styles.id = styles.href;

  document.head.appendChild(styles);
})();
`);

export const CLOUDFLARE_FUNCTION_SCRIPT = `
import script from '__PATH__';

export async function onRequestPost({waitUntil, request}) {
  const engine = await script();

  const body = await request.text();

  const result = await engine.api.handleWebServer(body);

  // wait for all pending requests to finish
  waitUntil(Promise.all(engine.api.webServer.pendingRequests));

  return new Response(JSON.stringify(result), {
    status: result?.error ? 500 : 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
`.trim();

export const VERCEL_FUNCTION_SCRIPT = `
import script from '__PATH__';

export const config = {
  runtime: 'edge',
};

export default async function handler(request, context) {
  const engine = await script();

  const body = await request.text();

  const result = await engine.api.handleWebServer(body);

  // wait for all pending requests to finish
  context.waitUntil(Promise.all(engine.api.webServer.pendingRequests));

  return new Response(JSON.stringify(result), {
    status: result?.error ? 500 : 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
`.trim();

/* export const VERCEL_FUNCTION_SCRIPT = `
import script from '__PATH__';

export default async function handler(request, response) {
  const engine = await script();

  const result = await engine.api.handleWebServer(request.body);

  await Promise.all(engine.api.webServer.pendingRequests);

  response.setHeader('Access-Control-Allow-Origin', '*');

  return response.status(result?.error ? 500 : 200).json(result)
}
`.trim(); */
