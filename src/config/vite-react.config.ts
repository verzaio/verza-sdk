import react from '@vitejs/plugin-react';
import {UserConfig, mergeConfig} from 'vite';

import {defineViteConfig} from './vite.config';

export const defineReactViteConfig = (config: Partial<UserConfig> = {}) => {
  return defineViteConfig(
    mergeConfig(
      {
        plugins: react(),
      },
      config,
    ),
  );
};
