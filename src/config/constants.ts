export const IS_DEV = process.env.NODE_ENV === 'development';

export const DEFAULT_PORT = IS_DEV ? 8085 : 8081;

export const WATCH_EXTENSIONS = ['ts', 'tsx', 'js', 'jsx'];

export const DIST_DIR = 'dist';

export const CLIENT_DIR = 'client';

export const SERVER_DIR = 'server';
