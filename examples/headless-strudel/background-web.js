#!/usr/bin/env node
/*
Background Web - Runs browser in background with minimal window
Works around macOS headless audio limitations
*/

import puppeteer from 'puppeteer';
import { watch } from 'chokidar';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const config = {
  patternFile: resolve(__dirname, 'current-pattern.js'),
  stateFile: resolve(__dirname, '.pattern-state.json'),
  serverPort: 9877,
  windowSize: { width: 300, height: 200 }, // Small window
  windowPosition: { x: 20, y: 20 }, // Top-left corner
};

// Copy most of the code from headless-web.js...
// (Using same HTML content and server setup)

const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Strudel Background</title>
  <script src="https://unpkg.com/@strudel/web@latest"></script>
  <style>
    body { 
      background: #1a1a1a; 
      color: #fff; 
      font-family: monospace; 
      padding: 10px;
      margin: 0;
    }
    #status { 
      font-size: 12px; 
      white-space: pre; 
    }
    button {
      background: #333;
      color: #fff;
      border: 1px solid #555;
      padding: 5px 10px;
      cursor: pointer;
      margin: 5px;
    }
  </style>
</head>
<body>
  <div id="status">Strudel Background Mode</div>
  <button id="init">Init</button>
  <button onclick="window.stopPattern && window.stopPattern()">Stop</button>
  <button onclick="window.playPattern && window.playPattern()">Play</button>
  
  <script>
    // Initialize Strudel
    initStrudel({
      prebake: () => samples('github:tidalcycles/dirt-samples'),
    });
    
    // Status display
    const status = document.getElementById('status');
    const log = (msg) => {
      const time = new Date().toLocaleTimeString();
      status.textContent = time + ' - ' + msg;
      console.log(msg);
    };
    
    // Global state
    window.currentPattern = null;
    window.isPlaying = false;
    
    // Initialize audio on button click
    document.getElementById('init').addEventListener('click', () => {
      log('Audio initialized');
    });
    
    // Evaluate pattern
    window.evalPattern = async (code) => {
      try {
        if (window.isPlaying) {
          hush();
          window.isPlaying = false;
        }
        
        const pattern = await evaluate(code);
        window.currentPattern = pattern;
        
        log('Pattern loaded');
        return { success: true };
      } catch (error) {
        log('Error: ' + error.message);
        return { success: false, error: error.message };
      }
    };
    
    // Play pattern
    window.playPattern = () => {
      if (!window.currentPattern) {
        return { success: false, error: 'No pattern loaded' };
      }
      
      try {
        if (window.audioContext?.state === 'suspended') {
          window.audioContext.resume();
        }
        
        window.currentPattern.play();
        window.isPlaying = true;
        log('Playing');
        return { success: true };
      } catch (error) {
        log('Play error: ' + error.message);
        return { success: false, error: error.message };
      }
    };
    
    // Stop pattern
    window.stopPattern = () => {
      try {
        hush();
        window.isPlaying = false;
        log('Stopped');
        return { success: true };
      } catch (error) {
        log('Stop error: ' + error.message);
        return { success: false, error: error.message };
      }
    };
    
    log('Ready');
  </script>
</body>
</html>
`;

// State
let browser = null;
let page = null;
let server = null;

// Create HTTP server
const startServer = () => {
  return new Promise((resolve) => {
    server = createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(htmlContent);
    });
    
    server.listen(config.serverPort, () => {
      console.log(chalk.blue(`📡 Server running on port ${config.serverPort}`));
      resolve();
    });
  });
};

// Initialize browser
const initBrowser = async () => {
  console.log(chalk.blue('🌐 Starting browser in background mode...'));
  
  const launchOptions = {
    headless: false, // Must be false for audio
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      `--window-size=${config.windowSize.width},${config.windowSize.height}`,
      `--window-position=${config.windowPosition.x},${config.windowPosition.y}`,
      '--app=' + `http://localhost:${config.serverPort}/`, // App mode - no browser UI
    ]
  };
  
  // Try to use system Chrome
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
  
  // Get the first page
  const pages = await browser.pages();
  page = pages[0];
  
  // Enable console logging
  page.on('console', msg => {
    const text = msg.text();
    if (!text.includes('background-color')) { // Skip style logs
      console.log(chalk.gray('Browser:'), text);
    }
  });
  
  // Wait for page to load
  await page.waitForSelector('#init');
  
  // Click init button to start audio
  await page.click('#init');
  
  // Wait for Strudel to initialize
  await page.waitForFunction(() => window.evalPattern !== undefined, { timeout: 10000 });
  
  console.log(chalk.green('✓ Browser initialized in background'));
  console.log(chalk.yellow(`ℹ  Small window at top-left (${config.windowSize.width}x${config.windowSize.height})`));
};

// Other functions remain the same...
// (Copy evalPattern, play, stop, saveState, loadState, watchPatternFile, watchCommandFile from headless-web.js)

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
      console.log(chalk.green('✓ Pattern loaded'));
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
    console.log(chalk.green('▶ Playing'));
  } else {
    console.error(chalk.red('✗ Play error:'), result.error);
  }
};

// Stop pattern
const stop = async () => {
  if (!page) return;
  
  const result = await page.evaluate(() => window.stopPattern());
  
  if (result.success) {
    console.log(chalk.red('■ Stopped'));
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
    console.log(chalk.blue(`\n📝 Pattern changed`));
    
    const code = readFileSync(config.patternFile, 'utf8');
    const success = await evalPattern(code);
    
    if (success) {
      await play();
    }
  });
  
  watcher.on('add', async (path) => {
    console.log(chalk.green(`📄 Pattern created`));
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
║   Strudel Background Mode             ║
╚═══════════════════════════════════════╝
`));
  
  // Create default pattern if needed
  if (!existsSync(config.patternFile)) {
    const defaultPattern = `// Strudel Pattern
s("bd*4, ~ cp ~ cp")`;
    writeFileSync(config.patternFile, defaultPattern);
  }
  
  try {
    // Start server
    await startServer();
    
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
✨ Ready! Audio working in background mode!

The browser window is minimized to ${config.windowSize.width}x${config.windowSize.height}
You can move it or minimize it further

Edit ${chalk.bold('current-pattern.js')} to change patterns
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
  if (server) server.close();
  
  process.exit();
});

// Run
main().catch(console.error);