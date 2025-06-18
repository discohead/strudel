#!/usr/bin/env node
/*
Test script to verify audio configuration improvements
*/

import { spawn } from 'child_process';
import { writeFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(chalk.bold.cyan(`
╔═══════════════════════════════════════╗
║   Testing Audio Configuration         ║
╚═══════════════════════════════════════╝
`));

// Simple test pattern that should produce clear audio
const testPattern = `// Audio configuration test pattern
// You should hear a clear 4/4 kick drum with hi-hats

stack(
  // Kick drum - should be punchy and clear
  s("bd*4").gain(0.9),
  
  // Hi-hats - should be crisp
  s("hh*8").gain(0.5).pan(sine.range(-0.5, 0.5)),
  
  // Test tone - 440Hz sine wave, should be pure
  note("a4")
    .s("sine")
    .gain(0.3)
    .struct("t ~ ~ ~ ~ ~ ~ ~".fast(2))
)`;

// Write test pattern
const patternFile = resolve(__dirname, 'current-pattern.js');
console.log(chalk.blue('📝 Writing test pattern...'));
writeFileSync(patternFile, testPattern);

// Start audio runner (try simple first, then v2, then v1)
console.log(chalk.blue('🚀 Starting audio runner with enhanced configuration...'));
let runnerScript = 'audio-runner.js';
if (existsSync(resolve(__dirname, 'audio-runner-simple.js'))) {
  runnerScript = 'audio-runner-simple.js';
} else if (existsSync(resolve(__dirname, 'audio-runner-v2.js'))) {
  runnerScript = 'audio-runner-v2.js';
}
console.log(chalk.gray(`Using ${runnerScript}`));

const runner = spawn('node', [runnerScript], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Give it time to initialize
setTimeout(() => {
  console.log(chalk.green(`
✓ Audio runner started!

🎧 Listen for:
- Clear kick drum every beat (no distortion)
- Crisp hi-hats panning left and right
- Pure 440Hz test tone (A4 note)

If audio is working correctly, you should hear all three elements clearly.
Press Ctrl+C to stop the test.
`));
}, 5000);

// Handle exit
process.on('SIGINT', () => {
  console.log(chalk.yellow('\n🛑 Stopping test...'));
  runner.kill();
  process.exit();
});