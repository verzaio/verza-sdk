// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json' assert {type: 'json'};

const external = [
  ...Object.keys(pkg.dependencies ?? {}),
  ...Object.keys(pkg.devDependencies ?? {}),
  ...Object.keys(pkg.peerDependencies ?? {}),
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
      utils: './src/utils.ts',
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
      'framework-react': './src/framework-react.ts',
      'framework-react-client': './src/framework-react-client.ts',
      utils: './src/utils.ts',
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
