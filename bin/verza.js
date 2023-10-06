#!/usr/bin/env node

import {spawn} from 'child_process';
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

//

if (!args.includes('--config')) {
  let configPath = path.join(process.cwd(), 'verza.config.js');

  if (!fs.existsSync(configPath)) {
    configPath = path.join(process.cwd(), 'verza.config.ts');

    if (!fs.existsSync(configPath)) {
      // how to remove file:
      configPath = path.join(
        new URL(import.meta.url).pathname,
        '../..',
        'files/verza.config.js',
      );
    }

    args.push('--config');
    args.push(configPath);
  }
}

// FINISH ™
spawn('./node_modules/.bin/vite', args, {
  cwd: process.cwd(),
  stdio: 'inherit',
});

if (args[0] === 'build') {
  args.push('--mode');
  args.push('server');

  spawn('./node_modules/.bin/vite', args, {
    cwd: process.cwd(),
    stdio: 'inherit',
  });
}
