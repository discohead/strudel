# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package-Specific Documentation

Each package has its own CLAUDE.md file with detailed guidance:

**Core Packages:**
- [`packages/core/CLAUDE.md`](packages/core/CLAUDE.md) - Pattern engine foundation
- [`packages/mini/CLAUDE.md`](packages/mini/CLAUDE.md) - Mini notation parser
- [`packages/transpiler/CLAUDE.md`](packages/transpiler/CLAUDE.md) - Code transformation

**Audio & MIDI:**
- [`packages/webaudio/CLAUDE.md`](packages/webaudio/CLAUDE.md) - Web Audio output
- [`packages/superdough/CLAUDE.md`](packages/superdough/CLAUDE.md) - Synthesis engine
- [`packages/midi/CLAUDE.md`](packages/midi/CLAUDE.md) - MIDI integration
- [`packages/osc/CLAUDE.md`](packages/osc/CLAUDE.md) - OSC communication

**UI & Visualization:**
- [`packages/codemirror/CLAUDE.md`](packages/codemirror/CLAUDE.md) - Editor integration
- [`packages/draw/CLAUDE.md`](packages/draw/CLAUDE.md) - Visualization components

**Musical Extensions:**
- [`packages/tonal/CLAUDE.md`](packages/tonal/CLAUDE.md) - Musical theory functions

## Common Development Commands

### Setup and Installation
```bash
pnpm i  # Install all dependencies for the monorepo
```

### Development
```bash
pnpm dev        # Start the development server (REPL at localhost:3000)
pnpm start      # Same as dev
pnpm repl       # Same as dev

# In specific package directories:
cd packages/core && pnpm test  # Run package-specific tests
```

### Testing
```bash
pnpm test       # Run all tests
pnpm test-ui    # Run tests with UI
pnpm snapshot   # Update test snapshots
pnpm bench      # Run benchmarks

# Test specific package:
pnpm --filter @strudel/core test
```

### Code Quality
```bash
pnpm lint           # Run ESLint
pnpm codeformat     # Format all files with Prettier
pnpm format-check   # Check if files are formatted correctly
pnpm check          # Run format-check, lint, and tests
```

### Building
```bash
pnpm build      # Build the website
pnpm preview    # Preview the built website

# Build specific package:
pnpm --filter @strudel/core build
```

### Other Commands
```bash
pnpm osc        # Start the OSC server (for SuperDirt)
pnpm sampler    # Start the sample server
```

## High-Level Architecture

### Monorepo Structure
Strudel is organized as a monorepo using pnpm workspaces. The main areas are:

- `/packages/` - All npm packages that make up Strudel
- `/website/` - The main Strudel website and REPL (Astro-based)
- `/examples/` - Example projects using Strudel
- `/test/` - Global tests
- `/src-tauri/` - Tauri desktop app
- `/claude/` - Extended documentation for AI assistance

### Core Packages

**Essential Pattern Engine:**
- `@strudel/core` - The Tidal pattern engine with core primitives
- `@strudel/mini` - Mini notation parser and core bindings
- `@strudel/transpiler` - Transpiles user code with syntax sugar

**Language Extensions:**
- `@strudel/tonal` - Musical functions for scales and chords
- `@strudel/xen` - Microtonal/xenharmonic functions

**Output Bindings:**
- `@strudel/webaudio` - Default Web Audio output
- `@strudel/superdough` - Synthesis engine (used by webaudio)
- `@strudel/osc` - OSC communication (for SuperDirt)
- `@strudel/midi` - Web MIDI bindings
- `@strudel/csound` - Csound bindings
- `@strudel/soundfonts` - Soundfont support

**UI Components:**
- `@strudel/codemirror` - CodeMirror editor integration
- `@strudel/draw` - Visualization components (pianoroll, scope, etc.)
- `@strudel/repl` - The full REPL as a web component

### Pattern System Architecture
The pattern system is based on Functional Reactive Programming (FRP) principles from TidalCycles:
- Patterns are functions of time that return events (called "Haps")
- Patterns can be transformed and combined using various functions
- The query system allows efficient evaluation of patterns over time spans
- Mini notation provides a concise syntax for creating patterns

### Testing Strategy
- Unit tests for individual packages using Vitest
- Snapshot tests for pattern outputs to catch regressions
- Test files are colocated with source code in `test/` folders
- Run a single test file: `pnpm vitest run path/to/test.mjs`
- Performance benchmarks in `bench/` folders

### Key Development Patterns
- When adding new pattern functions, they should be added to the appropriate package
- Pattern functions should be pure and composable
- All public API functions need JSDoc documentation
- The transpiler automatically makes pattern methods available as global functions
- Use `register` to make functions available in the pattern API

## Common Pattern Examples

### Basic Patterns
```javascript
// Sequences
note("c3 e3 g3 c4")  // Simple melody
s("bd sd cp sd")     // Drum pattern

// Polyrhythm
pr(
  "c3 e3 g3",    // 3 notes
  "c4 e4 g4 b4"  // 4 notes
)

// Euclidean rhythms
"bd(3,8)"  // 3 hits over 8 steps
```

### Pattern Transformations
```javascript
// Time manipulation
pattern.fast(2)      // Double speed
pattern.slow(0.5)    // Half speed
pattern.rev()        // Reverse
pattern.early(0.25)  // Shift earlier

// Value manipulation
pattern.add(12)      // Transpose up octave
pattern.mul(0.5)     // Half values
pattern.range(20, 80) // Scale to range

// Structure manipulation
pattern.struct("t f t f")  // Apply rhythm
pattern.euclid(3, 8)        // Euclidean rhythm
pattern.every(4, rev)       // Transform every 4 cycles
```

### Effects and Sound
```javascript
// Audio effects
pattern
  .s("sawtooth")     // Sound source
  .cutoff(1000)      // Filter cutoff
  .resonance(10)     // Filter resonance
  .room(0.5)         // Reverb
  .delay(0.25)       // Delay effect
  .gain(0.8)         // Volume

// Musical functions
note("0 2 4 5")
  .scale("C:minor")  // Apply scale
  .voicing()         // Smart voicing
```

## Common Pitfalls and Best Practices

### Pattern Evaluation
```javascript
// Patterns are lazy - they don't compute until queried
const pattern = note("c3").add(12); // Not evaluated yet
const events = pattern.queryArc(0, 1); // Now it evaluates
```

### Time Precision
```javascript
// Always use Fraction for precise timing
import { Fraction } from '@strudel/core';
const oneThird = Fraction(1, 3); // Exact
// Not: const oneThird = 1/3;     // Loses precision
```

### String Conversion
```javascript
// Double quotes trigger mini notation parsing
"c3 e3 g3"  // Becomes: mini("c3 e3 g3")

// Single quotes or backticks are plain strings
'not parsed'  // Stays as string
`also not parsed`
```

### Performance
```javascript
// Reuse patterns instead of recreating
const melody = note("c3 e3 g3 c4");
// Use melody multiple times

// Avoid creating patterns in hot loops
// Patterns are immutable - transformations create new instances
```

## Integration Patterns Between Packages

### Core + Mini
```javascript
// Mini notation creates Pattern instances
const pattern = mini("c3 e3 g3");
// Returns Pattern from core

// All Pattern methods work
pattern.fast(2).rev()
```

### Pattern + Audio
```javascript
// Pattern generates events
const pattern = note("c3 e3 g3");

// Webaudio schedules them
pattern.s("piano").play();

// Or send via MIDI/OSC
pattern.midi();
pattern.osc();
```

### Transpiler Integration
```javascript
// User writes:
note("c3 e3 g3").fast(2)

// Transpiler converts to:
mini("c3 e3 g3").note().fast(2)
```

### Visualization
```javascript
// Any pattern can be visualized
pattern
  .pianoroll()  // Piano roll view
  .scope()      // Oscilloscope
  .play()       // And play audio
```

## Debugging Tips

### Pattern Debugging
```javascript
// Log pattern events
pattern.log()  // Prints events to console

// Visualize pattern structure
pattern.pianoroll()
pattern.draw((ctx, events) => {
  console.log(events);
});

// Check first cycle
pattern.firstCycle() // Array of events
```

### Audio Debugging
```javascript
// Check audio context state
getAudioContext().state // Should be 'running'

// Enable verbose logging
logger.set(true);

// Test with simple pattern first
s("bd").play() // Should hear kick drum
```

### MIDI/OSC Debugging
```javascript
// Check MIDI access
await navigator.requestMIDIAccess();

// List MIDI devices
WebMidiOut.outputs()

// Test OSC connection
// Must run: pnpm osc
s("bd").osc() // Check server logs
```