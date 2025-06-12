# Strudel Codebase Map

## Overview
Strudel is a JavaScript/TypeScript port of TidalCycles, organized as a monorepo using pnpm workspaces. It provides a pattern-based live coding environment for music and visuals.

## Project Structure

### Root Directory
```
/
├── packages/           # Core npm packages (see below)
├── website/           # Main website and REPL (Astro-based)
├── examples/          # Example projects demonstrating usage
├── src-tauri/         # Tauri desktop application
├── test/              # Global test suite with snapshots
├── paper/             # Academic papers and documentation
├── samples/           # Audio sample files
├── tools/             # Development tools
├── my-patterns/       # User pattern storage
├── jsdoc/             # Documentation generation config
└── bench/             # Performance benchmarks
```

### Package Organization (`/packages/`)

#### Core Pattern Engine
- **`@strudel/core`** - The heart of Strudel
  - Pattern representation and FRP implementation
  - Hap (happening) system for events
  - Time utilities (TimeSpan, Fraction)
  - Control mappings and state management
  - Base pattern transformations

- **`@strudel/mini`** - Mini notation parser
  - PEG-based parser (krill.pegjs)
  - AST to pattern conversion
  - Operator implementations (bjorklund, replicate, etc.)
  - String pattern parsing integration

- **`@strudel/transpiler`** - Code transformation
  - Converts JavaScript with syntax sugar to valid JS
  - Handles mini notation in strings and backticks
  - Widget injection (sliders, etc.)
  - AST manipulation with acorn/escodegen

#### Language Extensions
- **`@strudel/tonal`** - Musical theory functions
  - Scale and chord support
  - Voicing algorithms
  - iReal Pro format parsing
  - Musical transformations

- **`@strudel/xen`** - Microtonal/xenharmonic support
  - Custom tuning systems
  - EDO (Equal Division of Octave) scales
  - Frequency ratio calculations

#### Output Bindings
- **`@strudel/webaudio`** - Default audio output
  - Web Audio API integration
  - Pattern scheduler
  - Audio context management
  - Visualization (scope, spectrum)

- **`@strudel/superdough`** - Synthesis engine
  - Sample playback system
  - Built-in synthesizers
  - Effects processing (reverb, delay, filters)
  - Audio worklet support

- **`@strudel/osc`** - Open Sound Control
  - OSC message formatting
  - WebSocket transport
  - SuperDirt compatibility
  - Server implementation

- **`@strudel/midi`** - MIDI support
  - WebMIDI API integration
  - MIDI message generation
  - Device management

- **`@strudel/csound`** - Csound integration
  - Orchestra file loading
  - Live coding interface
  - Preset management

- **`@strudel/soundfonts`** - Soundfont support
  - SF2 file loading
  - Instrument mapping
  - MIDI-compatible playback

#### UI Components
- **`@strudel/codemirror`** - Editor integration
  - Custom language mode
  - Syntax highlighting
  - Auto-completion
  - Widget system (sliders, etc.)
  - Theme support

- **`@strudel/draw`** - Visualization
  - Pianoroll display
  - Pattern visualization
  - Color utilities
  - Animation system

- **`@strudel/repl`** - Complete REPL component
  - Web component wrapper
  - Prebaking system
  - Pattern evaluation

#### Additional Packages
- **`@strudel/hydra`** - Hydra visual integration
- **`@strudel/motion`** - Device motion sensors
- **`@strudel/gamepad`** - Gamepad input
- **`@strudel/serial`** - Serial port communication
- **`@strudel/mqtt`** - MQTT messaging
- **`@strudel/embed`** - Embedding utilities
- **`@strudel/desktopbridge`** - Tauri desktop integration
- **`@strudel/reference`** - API reference generation
- **`@strudel/hs2js`** - Haskell to JS transpilation

### Website Structure (`/website/`)
```
website/
├── src/
│   ├── pages/          # Astro pages
│   │   ├── learn/      # Tutorial content
│   │   ├── workshop/   # Workshop materials
│   │   ├── functions/  # API documentation
│   │   └── examples/   # Example patterns
│   ├── repl/           # REPL implementation
│   │   ├── components/ # UI components
│   │   ├── Repl.jsx    # Main REPL component
│   │   └── tunes.mjs   # Example tunes
│   ├── docs/           # Documentation components
│   └── components/     # Shared components
├── public/             # Static assets
└── astro.config.mjs    # Astro configuration
```

### Examples (`/examples/`)
- **buildless/** - HTML examples without build tools
- **codemirror-repl/** - CodeMirror integration example
- **headless-repl/** - REPL without UI
- **minimal-repl/** - Minimal REPL setup
- **superdough/** - Audio engine examples
- **tidal-repl/** - Tidal-compatible REPL

### Test Structure (`/test/`)
- `runtime.mjs` - Test runtime utilities
- `tunes.test.mjs` - Pattern output tests
- `examples.test.mjs` - Example validation
- `__snapshots__/` - Vitest snapshots

## Key Configuration Files
- `pnpm-workspace.yaml` - Workspace configuration
- `package.json` - Root package with scripts
- `vitest.config.mjs` - Test configuration
- `eslint.config.mjs` - Linting rules
- `.gitignore` - Git ignore patterns

## Development Scripts
All scripts are run from the root directory using pnpm:

- `pnpm i` - Install dependencies
- `pnpm dev` - Start development server
- `pnpm test` - Run tests
- `pnpm build` - Build website
- `pnpm lint` - Run linter
- `pnpm format` - Format code