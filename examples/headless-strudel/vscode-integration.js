#!/usr/bin/env node
/*
VS Code Integration for Headless Strudel
Provides commands and utilities for pattern development
*/

import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

const COMMANDS_FILE = resolve(__dirname, '.commands');
const PATTERN_FILE = resolve(__dirname, 'current-pattern.js');
const STATE_FILE = resolve(__dirname, '.pattern-state.json');
const OUTPUT_FILE = resolve(__dirname, 'pattern-output.log');

// Send command to pattern runner
const sendCommand = (command) => {
  writeFileSync(COMMANDS_FILE, command);
  console.log(chalk.green(`✓ Sent command: ${command}`));
};

// Get current state
const getState = () => {
  if (existsSync(STATE_FILE)) {
    return JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  }
  return null;
};

// Pattern templates
const templates = {
  basic: `// Basic drum pattern
s("bd sd bd sd")`,

  polyrhythm: `// Polyrhythmic pattern
stack(
  s("bd*4"),
  s("cp(3,8)"),
  s("hh*7")
)`,

  melodic: `// Melodic pattern
stack(
  note("c3 eb3 g3 bb3").s("bass").struct("t(5,8)"),
  note("<c4 eb4 g4 bb4>").s("piano").slow(2),
  s("hh*8").gain(0.3)
)`,

  generative: `// Generative pattern
stack(
  s("bd").euclid(3, 8),
  s("sd cp").sometimes(fast(2)),
  note("0 3 7 10").scale("C:minor")
    .s("triangle")
    .sometimes(add(12))
)`,

  complex: `// Complex layered pattern
const drums = stack(
  s("bd:2*4").gain(0.9),
  s("~ sd ~ sd").delay(0.5),
  s("hh*16").gain("0.6 0.3".fast(4))
);

const bass = note("<c1 eb1 g1 bb1>")
  .struct("t(7,16)")
  .s("sawtooth")
  .lpf(800);

const melody = note("0 3 7 10 12")
  .scale("c:minor")
  .struct("~ t ~ ~ t ~ ~ ~".fast(2))
  .s("square")
  .delay(0.3);

stack(drums, bass, melody)`
};

// Command line interface
const command = process.argv[2];
const arg = process.argv[3];

switch (command) {
  case 'play':
    sendCommand('play');
    break;
    
  case 'stop':
    sendCommand('stop');
    break;
    
  case 'restart':
    sendCommand('restart');
    break;
    
  case 'status':
    const state = getState();
    if (state) {
      console.log(chalk.blue('Current State:'));
      console.log(`Status: ${state.status}`);
      console.log(`Last updated: ${new Date(state.timestamp).toLocaleString()}`);
      if (state.error) {
        console.log(chalk.red(`Error: ${state.error}`));
      }
    } else {
      console.log(chalk.yellow('No state found'));
    }
    break;
    
  case 'template':
    if (!arg || !templates[arg]) {
      console.log(chalk.blue('Available templates:'));
      Object.keys(templates).forEach(name => {
        console.log(`  - ${name}`);
      });
    } else {
      writeFileSync(PATTERN_FILE, templates[arg]);
      console.log(chalk.green(`✓ Loaded template: ${arg}`));
    }
    break;
    
  case 'tail':
    // Follow output log
    const tail = spawn('tail', ['-f', OUTPUT_FILE]);
    tail.stdout.on('data', (data) => {
      const lines = data.toString().split('\n').filter(l => l);
      lines.forEach(line => {
        try {
          const event = JSON.parse(line);
          const time = event._time.toFixed(2);
          const sound = event.s || 'note';
          console.log(`[${time}] ${sound} ${JSON.stringify(event)}`);
        } catch (e) {
          // Not JSON, just print
          console.log(line);
        }
      });
    });
    break;
    
  case 'run':
    // Start the pattern runner
    console.log(chalk.green('Starting pattern runner...'));
    spawn('node', ['pattern-runner.js'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    break;
    
  default:
    console.log(chalk.bold(`
Headless Strudel - VS Code Integration

Commands:
  ${chalk.cyan('play')}      - Start playing the current pattern
  ${chalk.cyan('stop')}      - Stop playing
  ${chalk.cyan('restart')}   - Restart playback
  ${chalk.cyan('status')}    - Show current state
  ${chalk.cyan('template')}  - Load a pattern template
  ${chalk.cyan('tail')}      - Follow pattern output
  ${chalk.cyan('run')}       - Start the pattern runner

Examples:
  node vscode-integration.js play
  node vscode-integration.js template melodic
  node vscode-integration.js tail
`));
}