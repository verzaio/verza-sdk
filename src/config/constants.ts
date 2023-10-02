export const IS_DEV = process.env.NODE_ENV === 'development';

export const DEFAULT_PORT = 8085;

export const WATCH_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx'];

export const DIST_DIR = 'dist';

export const CLIENT_DIR = 'client';

export const SERVER_DIR = 'server';

export const IS_SERVER = process.argv.some(arg => arg === 'server');

export const IS_VERCEL = !!process.env.VERCEL;

export const IS_CLOUDFLARE_PAGES = !!process.env.CF_PAGES;

export const IS_NETLIFY = !!process.env.NETLIFY;

export const EXTERNAL_MODULES = [
  /^@verza\/sdk$/,
  /^@verza\/sdk\/utils$/,
  /^three$/,
  /^three\/examples\/.*$/,
];

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

export const IMPORT_STYLES_SCRIPT = `
const styles = document.createElement('link');
styles.rel = 'stylesheet';
styles.href = '__STYLES_URL__';
document.head.appendChild(styles);
`;
