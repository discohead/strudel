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

## AI Composition with Mini Notation

Mini notation is the primary interface for AI-human collaborative music composition in Strudel. Understanding how to map musical intent to valid syntax is crucial for generating effective patterns.

### Natural Language to Mini Notation Mappings

| Musical Intent | Mini Notation | Example |
|---------------|---------------|---------|
| Play faster | `*n` | `"bd sd"*2` (double speed) |
| Play slower | `/n` | `"bd sd cp"/2` (half speed) |
| Sometimes play | `?` | `"bd sd?"` (50% chance for sd) |
| Repeat | `!` or `*n` | `"bd!"` or `"bd*4"` |
| Play together | `,` | `"[bd,hh]"` (kick + hihat) |
| Then | space | `"bd sd"` (kick then snare) |
| Every cycle | `<>` | `"<bd sd cp>"` (different each cycle) |
| Build up | progression | `"bd . bd hh . bd hh cp"` |

### Common Musical Patterns

```javascript
// Basic drum patterns
"bd sd"                    // Kick-snare
"bd hh sd hh"             // Basic rock beat
"bd*2 [~ sd]"            // Syncopated

// Melodic patterns
"c3 e3 g3 c4"             // Arpeggio
"[c3,e3,g3]"              // Chord
"c3 <e3 g3>"              // Alternating notes

// Rhythmic variations
"bd(3,8)"                 // Euclidean rhythm
"bd ~ ~ bd ~ ~ bd ~"      // Same as above
"[bd cp]*2 sd"            // Mixed subdivisions
```

### Building Complex Patterns

Start simple and layer complexity:

```javascript
// 1. Basic beat
"bd sd"

// 2. Add hi-hats
"bd sd, hh*8" 

// 3. Add variation
"bd [~ sd], hh*8"

// 4. Add fills every 4 bars
"bd [~ sd], hh*8"
  .every(4, x => x.append("[bd*2 sd*2]"))

// 5. Add melodic layer
stack(
  "bd [~ sd], hh*8",
  note("c3 <e3 g3> f3 <g3 c4>").s("bass")
)
```

### Genre-Specific Templates

```javascript
// House
stack(
  "bd*4",                          // Four-on-floor
  "[~ cp]*2",                      // Claps on 2 & 4
  "[hh*2 hh]*2",                   // Hi-hat pattern
  "[~ ~ ~ bass:2]*2"               // Syncopated bass
)

// Drum & Bass
stack(
  "bd ~ ~ bd ~ ~ ~ ~",             // Sparse kick
  "~ ~ sd ~ ~ ~ sd ~",             // Snare on 3 & 7
  "hh*16"                          // Rapid hi-hats
).fast(2)                          // 170+ BPM feel

// Ambient
stack(
  note("<c3 e3 g3 a3>").s("pad").slow(4),
  "hh?"*8,                         // Sparse percussion
  note("c5 ~ e5 ~").s("bell").often(rev)
)
```

### Syntax Validation Guidelines

When generating mini notation:
1. **Spaces separate elements**: `"a b"` not `"ab"`
2. **Brackets must match**: Count `[` and `]`, `<` and `>`
3. **Modifiers apply rightward**: `"bd*2"` repeats bd, not the whole pattern
4. **Numbers need context**: Use `"3"` for rhythm, `note("c3")` for pitch
5. **Special chars in values need protection**: Use single quotes for complex strings

### Progressive Complexity Strategies

```javascript
// Start minimal
"bd"

// Add rhythm
"bd ~ bd ~"

// Add layers
"bd ~ bd ~, hh*4"

// Add variation
"bd ~ bd <~ sd>, hh*4"

// Add dynamics
"bd ~ bd <~ sd>, hh*4"
  .gain("1 0.8 0.9 0.7")

// Add effects
"bd ~ bd <~ sd>, hh*4"
  .gain("1 0.8 0.9 0.7")
  .room(0.2)
  .delay(0.125)
```

For deeper understanding of mini notation mechanics and advanced AI composition techniques, see [`packages/mini/CLAUDE.md`](packages/mini/CLAUDE.md).

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