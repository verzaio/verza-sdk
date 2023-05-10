// rollup.config.js
import commonjs from '@rollup/plugin-commonjs';
import {nodeResolve} from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

import pkg from './package.json' assert {type: 'json'};

const external = [...Object.keys(pkg.dependencies ?? {}), 'react'];

const plugins = [typescript(), nodeResolve(), commonjs()];

const builds = [
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
