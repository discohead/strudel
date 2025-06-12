# Development Setup Workflow

## Initial Setup

### 1. Clone Repository
```bash
git clone https://github.com/tidalcycles/strudel.git
cd strudel
```

### 2. Install Dependencies
```bash
# Install pnpm if not already installed
npm install -g pnpm

# Install all dependencies
pnpm i
```

This installs dependencies for all packages in the monorepo using pnpm workspaces.

### 3. Start Development Server
```bash
pnpm dev
# or
pnpm start
# or
pnpm repl
```

All three commands start the development server at `http://localhost:3000`.

## Development Environment

### Code Editor Setup

#### VSCode Configuration
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "eslint.validate": ["javascript"],
  "files.associations": {
    "*.mjs": "javascript"
  }
}
```

#### Recommended Extensions
- ESLint
- Prettier
- JavaScript and TypeScript Nightly
- Vitest

### Environment Structure
```
Development consists of:
- Website dev server (Astro)
- Hot module reloading
- Pattern evaluation
- Audio context
```

## Common Development Tasks

### 1. Working on Core Package
```bash
# Make changes in packages/core/
# The dev server auto-reloads

# Run tests for core
cd packages/core
pnpm test

# Run specific test
pnpm vitest run pattern.test.mjs
```

### 2. Adding a New Pattern Function
```javascript
// 1. Add to packages/core/pattern.mjs
export const myFunction = register('myFunction', 
  (arg, pat) => pat.withValue(v => myTransform(v, arg))
);

// 2. Export from packages/core/index.mjs
export { myFunction } from './pattern.mjs';

// 3. Function is now available globally
"c3 e3 g3".myFunction(123)
```

### 3. Working on Mini Notation
```bash
# Edit grammar in packages/mini/krill.pegjs
# Regenerate parser
cd packages/mini
npx pegjs krill.pegjs

# Test changes
pnpm test
```

### 4. Adding UI Components
```javascript
// 1. Create component in website/src/components/
// 2. Import in website/src/repl/
// 3. Use React + Tailwind for styling
```

## Testing Workflow

### Running Tests
```bash
# Run all tests
pnpm test

# Run with UI
pnpm test-ui

# Update snapshots
pnpm snapshot

# Run specific package tests
cd packages/core && pnpm test
```

### Writing Tests
```javascript
// packages/core/test/myfeature.test.mjs
import { describe, it, expect } from 'vitest';
import { myFunction } from '../index.mjs';

describe('myFunction', () => {
  it('should transform values', () => {
    const result = myFunction(2, pure(10)).firstCycle();
    expect(result).toMatchSnapshot();
  });
});
```

### Test Patterns
1. Use snapshots for pattern output
2. Test edge cases
3. Test with different time spans
4. Verify immutability

## Code Quality Workflow

### Before Committing
```bash
# Format code
pnpm codeformat

# Check formatting
pnpm format-check

# Run linter
pnpm lint

# Run all checks
pnpm check
```

### Linting Rules
- Uses ESLint with custom config
- Enforces consistent style
- Catches common errors
- No console.log in production

### Code Formatting
- Prettier with 2-space indent
- Single quotes
- No semicolons (in most cases)
- Trailing commas

## Building and Preview

### Build Website
```bash
pnpm build
```

### Preview Build
```bash
pnpm preview
```

### Build Individual Packages
```bash
cd packages/core
pnpm build
```

## Documentation Workflow

### Adding JSDoc
```javascript
/**
 * Brief description of function
 * @param {Pattern} pat - The input pattern
 * @param {number} factor - Speed multiplier
 * @returns {Pattern} The transformed pattern
 * @example
 * fast(2, "c3 e3 g3") // Doubles the speed
 */
export const fast = (factor, pat) => pat.fast(factor);
```

### Generate Documentation
```bash
# Generate JSDoc
pnpm jsdoc

# Generate JSON docs
pnpm jsdoc-json

# Check undocumented functions
pnpm report-undocumented
```

## Debugging Workflow

### Browser DevTools
1. Open Chrome DevTools
2. Sources tab for breakpoints
3. Console for pattern evaluation
4. Network tab for sample loading

### Pattern Debugging
```javascript
// Use .log() to see events
"c3 e3 g3".fast(2).log()

// Use .logValues() for just values
pattern.logValues()

// Inspect first cycle
pattern.firstCycle()
```

### Audio Debugging
```javascript
// Check audio context state
getAudioContext().audioContext.state

// Monitor CPU usage
getAudioContext().audioContext.baseLatency
```

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

### Commit Messages
```bash
# Good examples
git commit -m "feat(core): add polymeter function"
git commit -m "fix(mini): handle empty patterns"
git commit -m "docs: update installation guide"
```

### Pull Request Process
1. Create feature branch
2. Make changes with tests
3. Run `pnpm check`
4. Push and create PR
5. Wait for CI checks
6. Address review feedback

## Performance Profiling

### Using Chrome DevTools
1. Performance tab
2. Start recording
3. Run pattern
4. Stop and analyze

### Benchmarking
```bash
# Run benchmarks
pnpm bench

# Add new benchmark
// bench/pattern.bench.mjs
bench('fast', () => {
  pattern.fast(2).queryArc(0, 10);
});
```