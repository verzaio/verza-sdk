import react from '@vitejs/plugin-react';
import {UserConfig, mergeConfig} from 'vite';

import {defineBaseViteConfig} from './vite-base.config';

export const defineReactViteConfig = (config: Partial<UserConfig> = {}) => {
  return defineBaseViteConfig(
    mergeConfig(
      {
        plugins: react(),
      },
      config,
    ),
  );
};
