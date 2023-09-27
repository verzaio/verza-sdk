// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json' assert {type: 'json'};

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
  'vite',
  'react',
  'react-dom',
  'react-dom/client',
];

const sharedPlugins = [typescript(), commonjs()];

const plugins = [nodeResolve(), ...sharedPlugins];

const browserPlugins = [
  nodeResolve({
    browser: true,
    preferBuiltins: false,
  }),
  ...sharedPlugins,
];

const builds = [
  // Core
  {
    input: {
      index: './src/index.ts',
      client: './src/client.ts',
    },
    plugins: browserPlugins,
    output: [
      {
        format: 'es',
        dir: 'dist',
        entryFileNames: '[name].es.js',
        chunkFileNames: '[name]-[hash].shared.es.js',
      },
    ],
  },
  {
    input: {
      index: './src/index.ts',
      client: './src/client.ts',
    },
    plugins,
    external,
    output: [
      {
        format: 'esm',
        dir: 'dist',
        entryFileNames: '[name].esm.js',
        chunkFileNames: '[name]-[hash].shared.esm.js',
      },
    ],
  },

  // Utils
  {
    input: './src/utils.ts',
    plugins: browserPlugins,
    output: [
      {
        format: 'es',
        file: 'dist/utils.es.js',
      },
    ],
  },
  {
    input: './src/utils.ts',
    plugins,
    external,
    output: [
      {
        format: 'esm',
        file: 'dist/utils.esm.js',
      },
    ],
  },

  // React
  {
    input: {
      'framework-react': './src/framework-react.ts',
      'framework-react-client': './src/framework-react-client.ts',
    },
    plugins,
    external,
    output: [
      {
        format: 'esm',
        dir: 'dist',
        entryFileNames: '[name].esm.js',
        chunkFileNames: '[name]-[hash].shared.esm.js',
      },
    ],
  },

  // Config
  {
    input: './src/config.ts',
    plugins: [...plugins],
    external,
    output: [
      {
        format: 'esm',
        dir: 'dist',
        entryFileNames: '[name].esm.js',
      },
    ],
  },
];

export default () => builds;
