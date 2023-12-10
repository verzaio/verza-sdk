#!/usr/bin/env node

import {spawn} from 'cross-spawn';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const args = ['vite', ...process.argv.slice(2)];

//

if (!args.includes('--config')) {
  const configPaths = [
    path.join(process.cwd(), 'verza.config.js'),
    path.join(process.cwd(), 'verza.config.ts'),
  ];

  let configPath = configPaths.find(configPath => fs.existsSync(configPath));

  args.push('--config');

  if (!configPath) {
    configPath = path.resolve(
      path.dirname(fileURLToPath(import.meta.url)),
      '..',
      'files/verza.config.js',
    );
  }

  console.log('\x1b[36m%s\x1b[0m', `Using config file: ${configPath}`);

  args.push(configPath);
}

// FINISH ™
spawn('npx', args, {
  cwd: process.cwd(),
  stdio: 'inherit',
  shell: true,
});

if (args[0] === 'build') {
  args.push('--mode');
  args.push('server');

  spawn('npx', args, {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true,
  });
}
