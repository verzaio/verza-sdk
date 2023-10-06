import fs from 'fs';
import path from 'path';
import {UserConfig} from 'vite';

import {defineBaseViteConfig} from './vite-base.config';
import {defineReactViteConfig} from './vite-react.config';

export const defineViteConfig = (config: Partial<UserConfig> = {}) => {
  const packageJson = fs.readFileSync(
    path.resolve(process.cwd(), 'package.json'),
    'utf-8',
  );

  const isReact = packageJson.includes('react');
  if (isReact) {
    return defineReactViteConfig(config);
  }

  return defineBaseViteConfig(config);
};
