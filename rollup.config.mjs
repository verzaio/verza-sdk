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
    input: 'src/index.ts',
    plugins: browserPlugins,
    output: [
      {
        format: 'es',
        file: 'dist/index.es.js',
      },
    ],
  },
  {
    input: 'src/index.ts',
    plugins,
    external,
    output: [
      {
        format: 'esm',
        file: 'dist/index.esm.js',
      },
    ],
  },

  // Utils
  {
    input: 'src/utils.ts',
    plugins: browserPlugins,
    output: [
      {
        format: 'es',
        file: 'dist/utils.es.js',
      },
    ],
  },
  {
    input: 'src/utils.ts',
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
    input: 'src/framework-react.ts',
    plugins,
    external,
    output: [
      {
        format: 'esm',
        dir: 'dist',
        entryFileNames: '[name].esm.js',
      },
    ],
  },

  // Client
  {
    input: 'src/client.ts',
    plugins,
    external,
    output: [
      {
        format: 'esm',
        dir: 'dist',
        entryFileNames: '[name].esm.js',
      },
    ],
  },

  // Config
  {
    input: 'src/config.ts',
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
