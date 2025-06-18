#!/usr/bin/env node
/*
Pattern Runner - Headless Strudel execution environment
Watches pattern files and evaluates them through Strudel engine
Outputs via OSC to SuperDirt or other targets
*/

import { Pattern, TimeSpan, controls } from '@strudel/core';
import { mini } from '@strudel/mini';
import { transpiler } from '@strudel/transpiler';
import * as tonal from '@strudel/tonal';
import { oscWithTrigger } from '@strudel/osc';
import { watch } from 'chokidar';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Pattern state
let currentPattern = null;
let isPlaying = false;
let startTime = null;
let nextId = 1;

// Configuration
const config = {
  patternFile: resolve(__dirname, 'current-pattern.js'),
  stateFile: resolve(__dirname, '.pattern-state.json'),
  outputFile: resolve(__dirname, 'pattern-output.log'),
  fps: 30, // frames per second for query loop
  lookAhead: 0.1, // seconds to look ahead
  osc: {
    enabled: true,
    port: 57120,
    host: 'localhost'
  }
};

// Initialize Strudel globals
const initStrudel = () => {
  // Register all Strudel functions globally
  const funcs = {
    ...controls,
    ...tonal,
    mini,
    s: controls.s,
    note: controls.note,
    stack: Pattern.stack,
    sequence: Pattern.sequence,
    cat: Pattern.cat,
    arrange: Pattern.arrange,
  };

  // Make functions available globally for eval
  Object.entries(funcs).forEach(([name, func]) => {
    global[name] = func;
  });

  console.log(chalk.green('✓ Strudel environment initialized'));
};

// Load and evaluate pattern
const loadPattern = async (code) => {
  try {
    console.log(chalk.blue('\n→ Evaluating pattern...'));
    
    // Transpile the code
    const transpiled = await transpiler(code, {
      wrapAsync: false,
      simpleLiterals: true,
      processDoubleQuotes: true
    });
    
    // Evaluate in global context
    const result = eval(transpiled.output);
    
    // Ensure we have a pattern
    let pattern;
    if (result instanceof Pattern) {
      pattern = result;
    } else if (result && result.constructor && result.constructor.name === 'Pattern') {
      pattern = result;
    } else {
      throw new Error('Code did not return a Pattern');
    }
    
    currentPattern = pattern;
    console.log(chalk.green('✓ Pattern loaded successfully'));
    
    // Save state
    saveState({ code, status: 'loaded', timestamp: Date.now() });
    
    return pattern;
  } catch (error) {
    console.error(chalk.red('✗ Pattern evaluation error:'), error.message);
    saveState({ code, status: 'error', error: error.message, timestamp: Date.now() });
    return null;
  }
};

// Query loop for pattern evaluation
const runQueryLoop = () => {
  if (!isPlaying || !currentPattern) return;
  
  const now = (Date.now() - startTime) / 1000;
  const span = new TimeSpan(now, now + config.lookAhead);
  
  try {
    const events = currentPattern.query(span);
    
    events.forEach(event => {
      const eventData = {
        ...event.value,
        _id: nextId++,
        _time: event.whole.begin.valueOf(),
        _duration: event.duration.valueOf()
      };
      
      // Log event
      logEvent(eventData);
      
      // Send via OSC if enabled
      if (config.osc.enabled && event.value.s) {
        sendOSC(event);
      }
    });
  } catch (error) {
    console.error(chalk.red('Query error:'), error.message);
  }
  
  // Schedule next query
  setTimeout(runQueryLoop, 1000 / config.fps);
};

// Send OSC message
const sendOSC = (event) => {
  // This would integrate with the OSC bridge
  // For now, just log
  console.log(chalk.yellow('OSC:'), event.value.s, event.value);
};

// Log event to file
const logEvent = (event) => {
  const line = JSON.stringify(event) + '\n';
  writeFileSync(config.outputFile, line, { flag: 'a' });
};

// Save state
const saveState = (state) => {
  writeFileSync(config.stateFile, JSON.stringify(state, null, 2));
};

// Load state
const loadState = () => {
  if (existsSync(config.stateFile)) {
    return JSON.parse(readFileSync(config.stateFile, 'utf8'));
  }
  return null;
};

// Play pattern
const play = () => {
  if (!currentPattern) {
    console.log(chalk.yellow('No pattern loaded'));
    return;
  }
  
  if (isPlaying) {
    console.log(chalk.yellow('Already playing'));
    return;
  }
  
  console.log(chalk.green('▶ Playing pattern'));
  isPlaying = true;
  startTime = Date.now();
  writeFileSync(config.outputFile, ''); // Clear output file
  runQueryLoop();
};

// Stop pattern
const stop = () => {
  if (!isPlaying) {
    console.log(chalk.yellow('Not playing'));
    return;
  }
  
  console.log(chalk.red('■ Stopping pattern'));
  isPlaying = false;
  currentPattern = null;
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
    
    const wasPlaying = isPlaying;
    if (isPlaying) {
      stop();
    }
    
    const code = readFileSync(config.patternFile, 'utf8');
    await loadPattern(code);
    
    if (wasPlaying && currentPattern) {
      play();
    }
  });
  
  watcher.on('add', async (path) => {
    console.log(chalk.green(`📄 Pattern file created`));
    const code = readFileSync(config.patternFile, 'utf8');
    await loadPattern(code);
  });
};

// Command interface via file
const watchCommandFile = () => {
  const commandFile = resolve(__dirname, '.commands');
  
  const watcher = watch(commandFile, {
    persistent: true,
    ignoreInitial: true
  });
  
  watcher.on('change', (path) => {
    const command = readFileSync(commandFile, 'utf8').trim();
    console.log(chalk.cyan(`\n💻 Command: ${command}`));
    
    switch (command) {
      case 'play':
        play();
        break;
      case 'stop':
        stop();
        break;
      case 'restart':
        stop();
        setTimeout(play, 100);
        break;
      default:
        console.log(chalk.red('Unknown command'));
    }
    
    // Clear command file
    writeFileSync(commandFile, '');
  });
};

// ASCII visualization of pattern
const visualizePattern = (pattern, duration = 4) => {
  const resolution = 32; // characters per cycle
  const span = new TimeSpan(0, duration);
  const events = pattern.query(span);
  
  // Group events by sound
  const tracks = {};
  events.forEach(event => {
    const sound = event.value.s || 'note';
    if (!tracks[sound]) tracks[sound] = [];
    tracks[sound].push(event);
  });
  
  console.log(chalk.cyan('\n📊 Pattern Visualization:'));
  console.log(chalk.gray('─'.repeat(resolution * duration + 10)));
  
  Object.entries(tracks).forEach(([sound, events]) => {
    let line = sound.padEnd(8) + '│';
    
    for (let i = 0; i < resolution * duration; i++) {
      const time = i / resolution;
      const hasEvent = events.some(e => 
        time >= e.whole.begin.valueOf() && 
        time < e.whole.end.valueOf()
      );
      line += hasEvent ? '█' : '·';
    }
    
    console.log(line);
  });
  
  console.log(chalk.gray('─'.repeat(resolution * duration + 10)));
};

// Main initialization
const main = async () => {
  console.log(chalk.bold.green(`
╔═══════════════════════════════════╗
║   Headless Strudel Environment    ║
╚═══════════════════════════════════╝
`));
  
  initStrudel();
  
  // Create default pattern file if it doesn't exist
  if (!existsSync(config.patternFile)) {
    const defaultPattern = `// Headless Strudel Pattern
// Edit this file to change the pattern
// The pattern will auto-reload on save

stack(
  s("bd*4"),
  s("~ sd ~ sd").delay(0.5),
  s("hh*8").gain(0.6)
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
    await loadPattern(state.code);
  }
  
  console.log(chalk.green(`
Ready! 
- Edit ${chalk.bold('current-pattern.js')} to change the pattern
- Create ${chalk.bold('.commands')} file with 'play', 'stop', or 'restart'
- Check ${chalk.bold('pattern-output.log')} for event output
- View ${chalk.bold('.pattern-state.json')} for current state
`));
  
  // Keep process alive
  process.stdin.resume();
};

// Handle exit
process.on('SIGINT', () => {
  console.log(chalk.red('\n👋 Shutting down...'));
  if (isPlaying) stop();
  process.exit();
});

// Run
main().catch(console.error);