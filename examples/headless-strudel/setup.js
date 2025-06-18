#!/usr/bin/env node
/*
Setup script for headless Strudel
Ensures all dependencies are properly installed
*/

import { execSync } from 'child_process';
import chalk from 'chalk';

console.log(chalk.bold.blue(`
╔═══════════════════════════════════════╗
║   Headless Strudel Setup              ║
╚═══════════════════════════════════════╝
`));

console.log(chalk.blue('📦 Installing Chrome for Puppeteer...'));

try {
  execSync('npx puppeteer browsers install chrome', { 
    stdio: 'inherit',
    cwd: process.cwd()
  });
  console.log(chalk.green('✓ Chrome installed successfully'));
} catch (error) {
  console.error(chalk.red('✗ Failed to install Chrome'));
  console.error(error.message);
  process.exit(1);
}

console.log(chalk.green(`
✨ Setup complete! 

You can now run:
  - ${chalk.bold('pnpm run audio')} for Web Audio output
  - ${chalk.bold('pnpm run pattern')} for OSC output
`));