#!/usr/bin/env node
/*
Headless Web - Uses @strudel/web bundle for simplicity
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
  headless: false, // Show browser to debug audio
};

// State
let browser = null;
let page = null;
let server = null;

// HTML content using CDN version (which we know works)
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Headless Strudel</title>
  <script src="https://unpkg.com/@strudel/web@latest"></script>
</head>
<body>
  <h1>Headless Strudel</h1>
  <button id="init">Initialize Audio</button>
  
  <script>
    // Initialize Strudel
    initStrudel({
      prebake: () => samples('github:tidalcycles/dirt-samples'),
    });
    
    // Global state
    window.currentPattern = null;
    window.isPlaying = false;
    
    // Initialize audio on button click
    document.getElementById('init').addEventListener('click', () => {
      console.log('Audio initialized');
    });
    
    // Evaluate pattern
    window.evalPattern = async (code) => {
      try {
        // Stop current pattern if playing
        if (window.isPlaying) {
          hush();
          window.isPlaying = false;
        }
        
        // Evaluate the code
        const pattern = await evaluate(code);
        window.currentPattern = pattern;
        
        console.log('Pattern evaluated successfully');
        return { success: true };
      } catch (error) {
        console.error('Pattern evaluation error:', error);
        return { success: false, error: error.message };
      }
    };
    
    // Play pattern
    window.playPattern = () => {
      if (!window.currentPattern) {
        return { success: false, error: 'No pattern loaded' };
      }
      
      try {
        // Check audio context state
        if (window.audioContext) {
          console.log('Audio Context State:', window.audioContext.state);
          if (window.audioContext.state === 'suspended') {
            window.audioContext.resume();
          }
        }
        
        window.currentPattern.play();
        window.isPlaying = true;
        console.log('Playing pattern');
        return { success: true };
      } catch (error) {
        console.error('Play error:', error);
        return { success: false, error: error.message };
      }
    };
    
    // Stop pattern
    window.stopPattern = () => {
      try {
        hush();
        window.isPlaying = false;
        console.log('Stopped pattern');
        return { success: true };
      } catch (error) {
        console.error('Stop error:', error);
        return { success: false, error: error.message };
      }
    };
    
    console.log('Headless Strudel Ready');
  </script>
</body>
</html>
`;

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
  console.log(chalk.blue('🌐 Starting headless browser...'));
  
  const launchOptions = {
    headless: config.headless ? 'new' : false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--autoplay-policy=no-user-gesture-required',
      '--enable-features=AudioServiceOutOfProcess',
      '--disable-features=AudioServiceSandbox',
      '--use-fake-ui-for-media-stream',
      '--use-fake-device-for-media-stream',
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
  page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.error(chalk.red('Browser:'), text);
    } else {
      console.log(chalk.gray('Browser:'), text);
    }
  });
  
  // Navigate to local server
  await page.goto(`http://localhost:${config.serverPort}/`);
  
  // Click init button to start audio
  await page.click('#init');
  
  // Wait for Strudel to initialize
  await page.waitForFunction(() => window.evalPattern !== undefined, { timeout: 10000 });
  
  // Minimize window if not headless
  if (!config.headless) {
    await page.evaluate(() => {
      window.moveTo(0, 0);
      window.resizeTo(400, 300);
    });
  }
  
  console.log(chalk.green('✓ Browser initialized'));
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
║   Headless Strudel Web Audio          ║
╚═══════════════════════════════════════╝
`));
  
  // Create default pattern if needed
  if (!existsSync(config.patternFile)) {
    const defaultPattern = `// Headless Strudel Pattern
// Edit this file to hear changes!

// Drums
stack(
  s("bd*4").gain(0.9),
  s("~ cp ~ cp").delay(0.5),
  s("hh*8").gain(0.6).pan(sine)
)

// Try uncommenting these:
// .add(note("<0 3 5 7>").s("sawtooth").lpf(1000))
// .fast(2)`;
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
✨ Ready! Real audio output via headless browser!

Edit ${chalk.bold('current-pattern.js')} to change the pattern
Pattern auto-plays on save

Commands: echo "play|stop|restart" > .commands
Headless: ${config.headless ? 'Yes' : 'No (set to false to see browser)'}
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