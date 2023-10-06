#!/usr/bin/env node

import {spawn} from 'child_process';

// TODO ™

const args = process.argv.slice(2);

spawn('./node_modules/.bin/vite', args, {
  stdio: 'inherit',
});
