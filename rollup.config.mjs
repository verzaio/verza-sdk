// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json' assert {type: 'json'};

const external = [...Object.keys(pkg.dependencies ?? {}), 'react'];

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
      {
        format: 'cjs',
        file: 'dist/index.cjs.js',
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
      {
        format: 'cjs',
        file: 'dist/utils.cjs.js',
      },
    ],
  },

  // React
  {
    input: 'src/framework-react.ts',
    plugins: browserPlugins,
    output: [
      {
        format: 'es',
        file: 'dist/framework-react.es.js',
      },
    ],
  },
  {
    input: 'src/framework-react.ts',
    plugins,
    external,
    output: [
      {
        format: 'esm',
        file: 'dist/framework-react.esm.js',
      },
      {
        format: 'cjs',
        file: 'dist/framework-react.cjs.js',
      },
    ],
  },
];

export default () => builds;
