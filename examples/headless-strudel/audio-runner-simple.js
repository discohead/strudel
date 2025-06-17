#!/usr/bin/env node
/*
Simplified Audio Runner - Uses local Vite server for proper module loading
*/

import { spawn } from 'child_process';
import puppeteer from 'puppeteer';
import { watch } from 'chokidar';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const config = {
  patternFile: resolve(__dirname, 'current-pattern.js'),
  stateFile: resolve(__dirname, '.pattern-state.json'),
  serverPort: 5173, // Vite default
  headless: true,
};

// State
let browser = null;
let page = null;
let viteProcess = null;

// Wait for server to be ready
const waitForServer = async (url, maxAttempts = 30) => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return true;
      }
    } catch (e) {
      // Server not ready yet
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  return false;
};

// Start Vite server
const startViteServer = () => {
  return new Promise(async (resolvePromise, rejectPromise) => {
    console.log(chalk.blue('🚀 Starting Vite server...'));
    
    // Create a simple vite config if it doesn't exist
    const viteConfigPath = resolve(__dirname, 'vite.config.js');
    if (!existsSync(viteConfigPath)) {
      writeFileSync(viteConfigPath, `
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: ${config.serverPort}
  },
  optimizeDeps: {
    include: ['@strudel/core', '@strudel/mini', '@strudel/transpiler', '@strudel/webaudio', '@strudel/tonal']
  }
});
      `);
    }
    
    viteProcess = spawn('npx', ['vite', '.', '--port', config.serverPort.toString()], {
      cwd: __dirname,
      stdio: 'pipe'
    });
    
    let serverReady = false;
    
    viteProcess.stdout.on('data', (data) => {
      const output = data.toString();
      console.log(chalk.gray('Vite:'), output.trim());
      if (output.includes('ready in') && !serverReady) {
        serverReady = true;
        console.log(chalk.green('✓ Vite server ready'));
      }
    });
    
    viteProcess.stderr.on('data', (data) => {
      console.error(chalk.red('Vite error:'), data.toString());
    });
    
    viteProcess.on('error', (error) => {
      rejectPromise(error);
    });
    
    // Wait for server to actually be ready
    const serverUrl = `http://localhost:${config.serverPort}/`;
    console.log(chalk.blue(`⏳ Waiting for server at ${serverUrl}...`));
    
    const isReady = await waitForServer(serverUrl);
    if (isReady) {
      console.log(chalk.green('✓ Server is responding'));
      resolvePromise();
    } else {
      rejectPromise(new Error('Server failed to start'));
    }
  });
};

// Initialize browser
const initBrowser = async () => {
  console.log(chalk.blue('🌐 Starting headless browser...'));
  
  const launchOptions = {
    headless: config.headless ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
    ]
  };
  
  // Try to use system Chrome if available
  const possiblePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
  ];
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      console.log(chalk.green(`✓ Found Chrome at: ${path}`));
      launchOptions.executablePath = path;
      break;
    }
  }
  
  browser = await puppeteer.launch(launchOptions);
  page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.error(chalk.red('Browser:'), text);
    } else if (type === 'warning') {
      console.warn(chalk.yellow('Browser:'), text);
    } else {
      console.log(chalk.gray('Browser:'), text);
    }
  });
  
  // Navigate to local server
  await page.goto(`http://localhost:${config.serverPort}/`);
  
  // Click the init button to start audio context
  await page.click('button');
  
  // Wait for Strudel to initialize
  await page.waitForFunction(() => window.evalPattern !== undefined, { timeout: 10000 });
  
  console.log(chalk.green('✓ Browser initialized with Web Audio support'));
};

// Evaluate pattern
const evalPattern = async (code) => {
  if (!page) {
    console.error(chalk.red('Browser not initialized'));
    return false;
  }
  
  try {
    const result = await page.evaluate(async (code) => {
      return await window.evalPattern(code);
    }, code);
    
    if (result.success) {
      console.log(chalk.green('✓ Pattern loaded successfully'));
      saveState({ code, status: 'loaded', timestamp: Date.now() });
      return true;
    } else {
      console.error(chalk.red('✗ Pattern error:'), result.error);
      saveState({ code, status: 'error', error: result.error, timestamp: Date.now() });
      return false;
    }
  } catch (error) {
    console.error(chalk.red('✗ Evaluation error:'), error.message);
    return false;
  }
};

// Play pattern
const play = async () => {
  if (!page) return;
  
  const result = await page.evaluate(() => window.playPattern());
  
  if (result.success) {
    console.log(chalk.green('▶ Playing pattern'));
  } else {
    console.error(chalk.red('✗ Play error:'), result.error);
  }
};

// Stop pattern
const stop = async () => {
  if (!page) return;
  
  const result = await page.evaluate(() => window.stopPattern());
  
  if (result.success) {
    console.log(chalk.red('■ Stopped pattern'));
  } else {
    console.error(chalk.red('✗ Stop error:'), result.error);
  }
};

// Save/load state
const saveState = (state) => {
  writeFileSync(config.stateFile, JSON.stringify(state, null, 2));
};

const loadState = () => {
  if (existsSync(config.stateFile)) {
    return JSON.parse(readFileSync(config.stateFile, 'utf8'));
  }
  return null;
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
    const success = await evalPattern(code);
    
    if (success) {
      await play();
    }
  });
};

// Watch commands
const watchCommandFile = () => {
  const commandFile = resolve(__dirname, '.commands');
  
  const watcher = watch(commandFile, {
    persistent: true,
    ignoreInitial: true
  });
  
  watcher.on('change', async (path) => {
    const command = readFileSync(commandFile, 'utf8').trim();
    console.log(chalk.cyan(`\n💻 Command: ${command}`));
    
    switch (command) {
      case 'play':
        await play();
        break;
      case 'stop':
        await stop();
        break;
      case 'restart':
        await stop();
        setTimeout(() => play(), 100);
        break;
    }
    
    writeFileSync(commandFile, '');
  });
};

// Main
const main = async () => {
  console.log(chalk.bold.green(`
╔═══════════════════════════════════════╗
║   Headless Strudel (Simplified)       ║
╚═══════════════════════════════════════╝
`));
  
  // Create default pattern if needed
  if (!existsSync(config.patternFile)) {
    const defaultPattern = `// Headless Strudel Pattern
stack(
  s("bd*4"),
  s("~ hh ~ hh").delay(0.5),
  note("<c3 eb3 g3 bb3>").s("sawtooth").lpf(800)
)`;
    writeFileSync(config.patternFile, defaultPattern);
  }
  
  try {
    // Start Vite server
    await startViteServer();
    
    // Initialize browser
    await initBrowser();
    
    // Start watching
    watchPatternFile();
    watchCommandFile();
    
    // Load previous state
    const state = loadState();
    if (state && state.code) {
      console.log(chalk.blue('📂 Loading previous pattern...'));
      await evalPattern(state.code);
    }
    
    console.log(chalk.green(`
Ready! You can now hear real audio output!
- Edit ${chalk.bold('current-pattern.js')} to change the pattern
- Pattern auto-plays on successful reload
- Commands: echo "play" > .commands
`));
  } catch (error) {
    console.error(chalk.red('Failed to initialize:'), error);
    process.exit(1);
  }
};

// Cleanup
process.on('SIGINT', async () => {
  console.log(chalk.red('\n👋 Shutting down...'));
  
  if (page) await stop();
  if (browser) await browser.close();
  if (viteProcess) viteProcess.kill();
  
  process.exit();
});

// Run
main().catch(console.error);