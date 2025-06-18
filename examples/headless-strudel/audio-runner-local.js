#!/usr/bin/env node
/*
Audio Runner Local - Uses local Strudel build
Requires running the main Strudel dev server first
*/

import puppeteer from 'puppeteer';
import { watch } from 'chokidar';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
import fetch from 'node-fetch';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const config = {
  patternFile: resolve(__dirname, 'current-pattern.js'),
  stateFile: resolve(__dirname, '.pattern-state.json'),
  replUrl: 'http://localhost:3000', // Main Strudel REPL
  headless: true,
};

// Check if REPL is running
const checkReplRunning = async () => {
  try {
    const response = await fetch(config.replUrl);
    return response.ok;
  } catch (error) {
    return false;
  }
};

// Browser and page management
let browser = null;
let page = null;

// Initialize Puppeteer
const initBrowser = async () => {
  console.log(chalk.blue('🌐 Starting headless browser...'));
  
  const launchOptions = {
    headless: config.headless ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-zygote',
      // Enhanced audio configuration
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
      '--autoplay-policy=no-user-gesture-required',
      // Additional audio optimizations
      '--disable-features=AudioServiceOutOfProcess',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding',
      '--disable-backgrounding-occluded-windows',
    ],
    // Explicitly exclude mute-audio from default args
    ignoreDefaultArgs: ['--mute-audio'],
  };
  
  try {
    browser = await puppeteer.launch(launchOptions);
  } catch (error) {
    console.error(chalk.red('✗ Failed to launch browser'));
    throw error;
  }
  
  page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error' && !text.includes('Failed to load resource')) {
      console.error(chalk.red('Browser:'), text);
    } else if (type === 'log') {
      console.log(chalk.gray('Browser:'), text);
    }
  });
  
  // Navigate to the main REPL
  console.log(chalk.blue(`📡 Connecting to Strudel REPL at ${config.replUrl}`));
  await page.goto(config.replUrl);
  
  // Wait for REPL to be ready
  try {
    await page.waitForSelector('.cm-editor', { timeout: 30000 });
    console.log(chalk.green('✓ REPL editor loaded'));
    
    // Wait a bit more for full initialization
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Click play button to initialize audio
    const playButton = await page.$('#play');
    if (playButton) {
      await playButton.click();
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(chalk.green('✓ Audio context initialized'));
    }
    
  } catch (error) {
    console.error(chalk.red('✗ Failed to initialize REPL'));
    throw error;
  }
  
  console.log(chalk.green('✓ Browser connected to Strudel REPL'));
};

// Evaluate pattern in REPL
const evalPattern = async (code) => {
  if (!page) {
    console.error(chalk.red('Browser not initialized'));
    return false;
  }
  
  try {
    // Clear the editor and set new code
    await page.evaluate((code) => {
      const editor = document.querySelector('.cm-editor').CodeMirror;
      if (editor) {
        editor.dispatch({
          changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: code
          }
        });
        return true;
      }
      return false;
    }, code);
    
    // Click play button
    await page.click('#play');
    
    console.log(chalk.green('✓ Pattern evaluated'));
    saveState({ code, status: 'loaded', timestamp: Date.now() });
    return true;
    
  } catch (error) {
    console.error(chalk.red('✗ Evaluation error:'), error.message);
    saveState({ code, status: 'error', error: error.message, timestamp: Date.now() });
    return false;
  }
};

// Stop pattern
const stop = async () => {
  if (!page) return;
  
  try {
    await page.click('#stop');
    console.log(chalk.red('■ Stopped pattern'));
  } catch (error) {
    console.error(chalk.red('✗ Stop error:'), error.message);
  }
};

// Save/load state
const saveState = (state) => {
  writeFileSync(config.stateFile, JSON.stringify(state, null, 2));
};

// Watch pattern file
const watchPatternFile = () => {
  console.log(chalk.blue(`👁  Watching ${config.patternFile}`));
  
  const watcher = watch(config.patternFile, {
    persistent: true,
    ignoreInitial: false
  });
  
  watcher.on('change', async (path) => {
    console.log(chalk.blue(`\n📝 Pattern file changed`));
    
    const code = readFileSync(config.patternFile, 'utf8');
    await evalPattern(code);
  });
};

// Command interface
const watchCommandFile = () => {
  const commandFile = resolve(__dirname, '.commands');
  
  const watcher = watch(commandFile, {
    persistent: true,
    ignoreInitial: true
  });
  
  watcher.on('change', async (path) => {
    const command = readFileSync(commandFile, 'utf8').trim();
    
    switch (command) {
      case 'stop':
        await stop();
        break;
    }
    
    writeFileSync(commandFile, '');
  });
};

// Main initialization
const main = async () => {
  console.log(chalk.bold.green(`
╔═══════════════════════════════════════╗
║   Headless Strudel (Local REPL)       ║
╚═══════════════════════════════════════╝
`));
  
  // Check if REPL is running
  const isRunning = await checkReplRunning();
  if (!isRunning) {
    console.error(chalk.red(`
✗ Strudel REPL is not running at ${config.replUrl}

Please start the REPL first:
  cd ../.. && pnpm dev

Then run this script again.
`));
    process.exit(1);
  }
  
  console.log(chalk.green(`✓ Found Strudel REPL at ${config.replUrl}`));
  
  // Initialize browser
  await initBrowser();
  
  // Create default pattern if needed
  if (!existsSync(config.patternFile)) {
    const defaultPattern = `// Headless pattern
stack(
  s("bd*4"),
  s("hh*8").gain(0.5)
)`;
    writeFileSync(config.patternFile, defaultPattern);
  }
  
  // Start watching
  watchPatternFile();
  watchCommandFile();
  
  console.log(chalk.green(`
Ready! 
- Edit ${chalk.bold('current-pattern.js')} to change the pattern
- Pattern auto-plays on save
- Audio plays through the main REPL at ${config.replUrl}
`));
};

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log(chalk.red('\n👋 Shutting down...'));
  
  if (page) {
    await stop();
    await page.close();
  }
  
  if (browser) {
    await browser.close();
  }
  
  process.exit();
});

// Run
main().catch(console.error);