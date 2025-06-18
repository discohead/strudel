#!/usr/bin/env node
/*
Playwright Runner - Alternative to Puppeteer for headless audio
Supports multiple browsers: Chromium, Firefox, WebKit
*/

import { chromium } from 'playwright';
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
  headless: true, // Set to false to see the browser
  browser: 'chromium' // Options: 'chromium', 'firefox', 'webkit'
};

// Browser and page management
let browser = null;
let context = null;
let page = null;

// HTML content for the page
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Headless Strudel - Playwright</title>
  <script type="module">
    import { initStrudel } from 'https://unpkg.com/@strudel/web@latest';
    
    // Initialize Strudel
    await initStrudel({
      defaultOutput: 'webaudio',
      getTime: () => window.audioContext?.currentTime || 0,
      prebake: () => {
        // Load default samples
        return samples('github:tidalcycles/dirt-samples');
      }
    });
    
    // Global state
    window.currentPattern = null;
    window.isPlaying = false;
    
    // Evaluate pattern
    window.evalPattern = async (code) => {
      try {
        // Stop current pattern if playing
        if (window.isPlaying) {
          hush();
          window.isPlaying = false;
        }
        
        // Evaluate the code
        const result = await evaluate(code);
        window.currentPattern = result;
        
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
    
    console.log('Headless Strudel Ready (Playwright)');
  </script>
</head>
<body>
  <h1>Headless Strudel - Playwright</h1>
  <p>Running with ${config.browser}</p>
</body>
</html>
`;

// Initialize browser
const initBrowser = async () => {
  console.log(chalk.blue(`🌐 Starting ${config.browser} browser...`));
  
  // Launch browser
  browser = await chromium.launch({
    headless: config.headless,
    args: ['--autoplay-policy=no-user-gesture-required']
  });
  
  // Create context with permissions
  context = await browser.newContext({
    permissions: ['microphone']
  });
  
  // Create page
  page = await context.newPage();
  
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
  
  // Set content
  await page.setContent(htmlContent);
  
  // Wait for Strudel to initialize
  await page.waitForFunction(() => window.evalPattern !== undefined, { timeout: 10000 });
  
  console.log(chalk.green('✓ Browser initialized with Web Audio support'));
};

// Evaluate pattern in browser
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
    saveState({ code, status: 'error', error: error.message, timestamp: Date.now() });
    return false;
  }
};

// Play pattern
const play = async () => {
  if (!page) {
    console.error(chalk.red('Browser not initialized'));
    return;
  }
  
  const result = await page.evaluate(() => window.playPattern());
  
  if (result.success) {
    console.log(chalk.green('▶ Playing pattern'));
  } else {
    console.error(chalk.red('✗ Play error:'), result.error);
  }
};

// Stop pattern
const stop = async () => {
  if (!page) {
    console.error(chalk.red('Browser not initialized'));
    return;
  }
  
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
    
    // Auto-play if evaluation was successful
    if (success) {
      await play();
    }
  });
};

// Main initialization
const main = async () => {
  console.log(chalk.bold.green(`
╔═══════════════════════════════════════╗
║   Headless Strudel + Playwright       ║
╚═══════════════════════════════════════╝
`));
  
  // Initialize browser
  await initBrowser();
  
  // Create default pattern if needed
  if (!existsSync(config.patternFile)) {
    const defaultPattern = `// Headless Strudel Pattern
s("bd sd bd sd")`;
    writeFileSync(config.patternFile, defaultPattern);
  }
  
  // Start watching
  watchPatternFile();
  
  // Load previous state
  const state = loadState();
  if (state && state.code) {
    console.log(chalk.blue('📂 Loading previous pattern...'));
    await evalPattern(state.code);
  }
  
  console.log(chalk.green(`
Ready! 
- Edit ${chalk.bold('current-pattern.js')} to hear audio
- Browser: ${chalk.bold(config.browser)}
- Headless: ${chalk.bold(config.headless ? 'Yes' : 'No')}
`));
};

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log(chalk.red('\n👋 Shutting down...'));
  
  if (page) {
    await stop();
  }
  
  if (context) {
    await context.close();
  }
  
  if (browser) {
    await browser.close();
  }
  
  process.exit();
});

// Run
main().catch(console.error);