#!/usr/bin/env node
/*
Audio Runner V2 - Simplified Headless Strudel with Web Audio
Uses a more direct approach with Strudel modules
*/

import puppeteer from 'puppeteer';
import { watch } from 'chokidar';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { parse } from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuration
const config = {
  patternFile: resolve(__dirname, 'current-pattern.js'),
  stateFile: resolve(__dirname, '.pattern-state.json'),
  serverPort: 9877,
  headless: true, // Set to false to see the browser
};

// Simple HTTP server to serve our headless page
const server = createServer((req, res) => {
  const { pathname } = parse(req.url);
  
  if (pathname === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
<!DOCTYPE html>
<html>
<head>
  <title>Headless Strudel Audio Engine V2</title>
  <script type="module">
    // Load Strudel modules directly
    import { evalScope, Pattern } from 'https://unpkg.com/@strudel/core@latest';
    import { webaudioOutput, initAudioOnFirstClick, getAudioContext, registerSynthSounds } from 'https://unpkg.com/@strudel/webaudio@latest';
    import { registerSoundfonts } from 'https://unpkg.com/@strudel/soundfonts@latest';
    import { transpiler } from 'https://unpkg.com/@strudel/transpiler@latest';
    import '@strudel/mini';
    import '@strudel/tonal';
    
    // Initialize globals
    window.audioInitialized = false;
    window.currentPattern = null;
    window.isPlaying = false;
    
    // Initialize Strudel
    window.initStrudel = async () => {
      try {
        // Set up evaluation scope
        await evalScope(
          import('https://unpkg.com/@strudel/core@latest'),
          import('https://unpkg.com/@strudel/mini@latest'),
          import('https://unpkg.com/@strudel/tonal@latest'),
          import('https://unpkg.com/@strudel/webaudio@latest'),
        );
        
        // Register sounds
        await Promise.all([
          registerSynthSounds(),
          registerSoundfonts()
        ]);
        
        // Initialize audio on first click
        await initAudioOnFirstClick();
        
        // Create a click to start audio
        const button = document.createElement('button');
        button.style.display = 'none';
        document.body.appendChild(button);
        button.click();
        button.remove();
        
        window.audioInitialized = true;
        console.log('Strudel initialized successfully');
        return true;
      } catch (error) {
        console.error('Failed to initialize Strudel:', error);
        throw error;
      }
    };
    
    // Evaluate pattern
    window.evalPattern = async (code) => {
      try {
        if (!window.audioInitialized) {
          await window.initStrudel();
        }
        
        // Stop current pattern if playing
        if (window.currentPattern && window.isPlaying) {
          window.currentPattern.stop();
          window.isPlaying = false;
        }
        
        // Transpile and evaluate the code
        const transpiled = transpiler(code);
        const pattern = await evalScope(transpiled);
        
        if (!(pattern instanceof Pattern)) {
          throw new Error('Code did not return a Pattern');
        }
        
        window.currentPattern = pattern;
        console.log('Pattern evaluated successfully');
        return { success: true };
      } catch (error) {
        console.error('Pattern evaluation error:', error);
        return { success: false, error: error.message };
      }
    };
    
    // Play pattern
    window.playPattern = async () => {
      try {
        if (!window.currentPattern) {
          return { success: false, error: 'No pattern loaded' };
        }
        
        // Ensure audio is initialized
        if (!window.audioInitialized) {
          await window.initStrudel();
        }
        
        // Resume audio context if needed
        const ctx = getAudioContext();
        if (ctx.state === 'suspended') {
          await ctx.resume();
        }
        
        // Play with web audio output
        window.currentPattern.play(webaudioOutput);
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
        if (window.currentPattern) {
          window.currentPattern.stop();
          window.isPlaying = false;
          console.log('Stopped pattern');
          return { success: true };
        }
        return { success: false, error: 'No pattern to stop' };
      } catch (error) {
        console.error('Stop error:', error);
        return { success: false, error: error.message };
      }
    };
    
    // Get audio context info
    window.getAudioInfo = () => {
      try {
        const ctx = getAudioContext();
        if (!ctx) return { initialized: false };
        
        return {
          initialized: true,
          state: ctx.state,
          currentTime: ctx.currentTime,
          sampleRate: ctx.sampleRate,
          latency: ctx.baseLatency || ctx.outputLatency || 0,
          isPlaying: window.isPlaying
        };
      } catch (error) {
        return { initialized: false, error: error.message };
      }
    };
    
    // Mark as ready
    window.strudelReady = true;
    console.log('Headless Strudel Audio Engine V2 Ready');
  </script>
</head>
<body>
  <h1>Headless Strudel Audio Engine V2</h1>
  <p>This page is running in headless mode to provide Web Audio output.</p>
</body>
</html>
    `);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// Browser and page management
let browser = null;
let page = null;

// Try to find Chrome executable
const findChrome = () => {
  const possiblePaths = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Chromium.app/Contents/MacOS/Chromium',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium-browser',
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
  ];
  
  for (const path of possiblePaths) {
    if (existsSync(path)) {
      console.log(chalk.green(`✓ Found Chrome at: ${path}`));
      return path;
    }
  }
  
  return null;
};

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
      // Enable WebGL for future visualization support
      '--enable-webgl',
      '--enable-webgl2',
      // Performance improvements
      '--disable-blink-features=AutomationControlled',
    ],
    // Explicitly exclude mute-audio from default args
    ignoreDefaultArgs: ['--mute-audio'],
  };
  
  // Try to use system Chrome if available
  const chromePath = findChrome();
  if (chromePath) {
    launchOptions.executablePath = chromePath;
  }
  
  try {
    browser = await puppeteer.launch(launchOptions);
  } catch (error) {
    console.error(chalk.red('✗ Failed to launch browser'));
    console.error(chalk.yellow('Try running: npx puppeteer browsers install chrome'));
    throw error;
  }
  
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
  
  // Navigate to our local server
  await page.goto(`http://localhost:${config.serverPort}/`);
  
  // Wait for Strudel to be ready
  await page.waitForFunction(() => window.strudelReady === true, { timeout: 30000 });
  
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
    
    // Start monitoring audio
    monitorAudio();
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

// Monitor audio context
let monitoringInterval = null;
const monitorAudio = async () => {
  if (!page) return;
  
  try {
    const info = await page.evaluate(() => window.getAudioInfo());
    
    if (info.initialized) {
      // Check for audio context issues
      if (info.state !== 'running') {
        console.warn(chalk.yellow(`⚠ Audio context state: ${info.state}`));
      }
      
      // Only log periodically when everything is normal
      if (Date.now() % 20000 < 5000) { // Log every ~20 seconds
        console.log(chalk.cyan('🔊 Audio Status:'), {
          state: info.state,
          time: info.currentTime.toFixed(2) + 's',
          sampleRate: info.sampleRate + 'Hz',
          latency: info.latency ? (info.latency * 1000).toFixed(1) + 'ms' : 'unknown'
        });
      }
    }
    
    // Set up continuous monitoring if playing
    if (info.isPlaying && !monitoringInterval) {
      monitoringInterval = setInterval(() => monitorAudio(), 5000);
    } else if (!info.isPlaying && monitoringInterval) {
      clearInterval(monitoringInterval);
      monitoringInterval = null;
    }
  } catch (error) {
    console.error(chalk.red('Audio monitoring error:'), error.message);
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
  
  watcher.on('add', async (path) => {
    console.log(chalk.green(`📄 Pattern file created`));
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
      case 'info':
        const info = await page.evaluate(() => window.getAudioInfo());
        console.log(chalk.cyan('Audio Info:'), info);
        break;
      default:
        console.log(chalk.red('Unknown command'));
    }
    
    // Clear command file
    writeFileSync(commandFile, '');
  });
};

// Main initialization
const main = async () => {
  console.log(chalk.bold.green(`
╔═══════════════════════════════════════╗
║   Headless Strudel V2 + Web Audio     ║
╚═══════════════════════════════════════╝
`));
  
  // Start HTTP server
  server.listen(config.serverPort, () => {
    console.log(chalk.blue(`📡 Local server running on port ${config.serverPort}`));
  });
  
  // Initialize browser
  await initBrowser();
  
  // Create default pattern if needed
  if (!existsSync(config.patternFile)) {
    const defaultPattern = `// Headless Strudel V2 with Web Audio
// Edit this file to hear changes in real-time!

stack(
  // Drums
  s("bd*4").gain(0.9),
  s("~ sd ~ sd").delay(0.5),
  s("hh*8").gain(0.6).pan(sine),
  
  // Bass
  note("<c1 eb1 g1 bb1>")
    .s("sawtooth")
    .lpf(800)
    .lpq(10)
    .gain(0.7),
  
  // Lead
  note("0 3 7 10 12")
    .scale("c:minor")
    .struct("~ t ~ ~ t ~ ~ ~".fast(2))
    .s("square")
    .delay(0.3)
    .gain(0.5)
)`;
    writeFileSync(config.patternFile, defaultPattern);
  }
  
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
- Create ${chalk.bold('.commands')} file with 'play', 'stop', 'restart', or 'info'
- Set headless: false in config to see the browser
`));
};

// Cleanup on exit
process.on('SIGINT', async () => {
  console.log(chalk.red('\n👋 Shutting down...'));
  
  // Clear monitoring interval
  if (monitoringInterval) {
    clearInterval(monitoringInterval);
  }
  
  if (page) {
    await stop();
    await page.close();
  }
  
  if (browser) {
    await browser.close();
  }
  
  server.close();
  process.exit();
});

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error(chalk.red('Unhandled rejection:'), error);
});

// Run
main().catch(console.error);