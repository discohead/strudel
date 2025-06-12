# Testing Patterns Workflow

## Overview
Strudel uses Vitest for testing, with a focus on snapshot testing for pattern outputs and unit tests for core functionality.

## Test Organization

### Directory Structure
```
packages/
├── core/
│   └── test/
│       ├── pattern.test.mjs      # Pattern tests
│       ├── fraction.test.mjs     # Utility tests
│       └── controls.test.mjs     # Control tests
├── mini/
│   └── test/
│       └── mini.test.mjs         # Mini notation tests
└── tonal/
    └── test/
        └── tonal.test.mjs        # Music theory tests

test/                             # Global tests
├── tunes.test.mjs               # Pattern examples
├── examples.test.mjs            # Documentation examples
└── __snapshots__/               # Snapshot files
```

## Writing Pattern Tests

### Basic Pattern Test
```javascript
import { describe, it, expect } from 'vitest';
import { sequence, stack, pure } from '@strudel/core';

describe('pattern basics', () => {
  it('creates a sequence', () => {
    const pat = sequence('a', 'b', 'c');
    const events = pat.firstCycle();
    
    expect(events.length).toBe(3);
    expect(events[0].value).toBe('a');
  });
});
```

### Snapshot Testing
```javascript
describe('complex patterns', () => {
  it('polyrhythm', () => {
    const pat = stack(
      sequence('c3', 'e3', 'g3'),
      sequence('c4', 'd4', 'e4', 'f4')
    );
    
    // Snapshot captures exact output
    expect(pat.firstCycle()).toMatchSnapshot();
  });
});
```

### Testing with Time
```javascript
import { TimeSpan, State } from '@strudel/core';

it('queries specific time range', () => {
  const pat = sequence('a', 'b', 'c', 'd');
  
  // Query second half of first cycle
  const state = new State(new TimeSpan(0.5, 1));
  const events = pat.query(state);
  
  expect(events.map(e => e.value)).toEqual(['c', 'd']);
});
```

## Test Utilities

### Helper Functions
```javascript
// Common test helpers
const st = (begin, end) => new State(ts(begin, end));
const ts = (begin, end) => new TimeSpan(Fraction(begin), Fraction(end));
const hap = (whole, part, value, context = {}) => 
  new Hap(whole, part, value, context);

// Compare first cycles
const sameFirst = (a, b) => {
  return expect(a.sortHapsByPart().firstCycle())
    .toStrictEqual(b.sortHapsByPart().firstCycle());
};
```

### Testing Pattern Equality
```javascript
it('transformations preserve structure', () => {
  const original = sequence('a', 'b', 'c');
  const transformed = original.fast(2).slow(2);
  
  sameFirst(original, transformed);
});
```

## Mini Notation Testing

### Testing Parser Output
```javascript
import { mini } from '@strudel/mini';

it('parses sequences', () => {
  const fromMini = mini('a b c');
  const fromCode = sequence('a', 'b', 'c');
  
  sameFirst(fromMini, fromCode);
});
```

### Testing Operators
```javascript
it('multiplication operator', () => {
  expect(mini('a*3').firstCycle().length).toBe(3);
  expect(mini('[a b]*2').firstCycle().length).toBe(4);
});

it('euclidean rhythm', () => {
  const pat = mini('a(3,8)');
  expect(pat.firstCycle().length).toBe(3);
});
```

### Error Testing
```javascript
it('handles parse errors', () => {
  expect(() => mini('a b [')).toThrow();
  expect(() => mini('a b <')).toThrow(/Expected/);
});
```

## Control Testing

### Testing Control Parameters
```javascript
import { n, s, gain } from '@strudel/core/controls.mjs';

it('applies controls', () => {
  const pat = n(60, 62, 64).s('piano').gain(0.5);
  const events = pat.firstCycle();
  
  expect(events[0].value).toEqual({
    n: 60,
    s: 'piano',
    gain: 0.5
  });
});
```

### Testing Control Patterns
```javascript
it('patterns controls', () => {
  const pat = s('bd').gain(sequence(0.5, 1));
  const events = pat.firstCycle();
  
  expect(events[0].value.gain).toBe(0.5);
  expect(events[1].value.gain).toBe(1);
});
```

## Performance Testing

### Benchmarking Patterns
```javascript
// bench/pattern.bench.mjs
import { bench, describe } from 'vitest';
import { sequence, stack, fast } from '@strudel/core';

describe('pattern performance', () => {
  bench('sequence creation', () => {
    sequence(...Array(100).fill('a'));
  });
  
  bench('complex query', () => {
    const pat = stack(
      sequence('a', 'b', 'c').fast(3),
      sequence('d', 'e', 'f', 'g').fast(5)
    );
    pat.queryArc(0, 10);
  });
});
```

### Memory Testing
```javascript
bench('memory usage', () => {
  const patterns = [];
  for (let i = 0; i < 1000; i++) {
    patterns.push(sequence('a', 'b', 'c'));
  }
  stack(...patterns).firstCycle();
});
```

## Integration Testing

### Testing Full Examples
```javascript
// test/tunes.test.mjs
import { evaluate } from '@strudel/core';

it('swimming example', async () => {
  const code = `
    stack(
      s("bd*2").gain(1),
      s("~ sd").gain(0.8),
      s("hh*8").gain(0.3)
    )
  `;
  
  const { pattern } = await evaluate(code);
  expect(pattern.firstCycle()).toMatchSnapshot();
});
```

### Testing with Audio
```javascript
import { webaudio } from '@strudel/webaudio';

it('produces audio events', async () => {
  const events = [];
  const mockScheduler = {
    setPattern: (pat, callback) => {
      pat.firstCycle().forEach(hap => {
        events.push(hap);
      });
    }
  };
  
  const pat = s('bd sd').gain(0.5);
  // Test audio triggering logic
});
```

## Snapshot Management

### Updating Snapshots
```bash
# Update all snapshots
pnpm snapshot

# Update specific test file
pnpm vitest run -u pattern.test.mjs
```

### Reviewing Snapshots
```javascript
// Snapshots show exact event structure
exports[`pattern > stack 1`] = `
[
  {
    "value": "a",
    "whole": {
      "begin": 0,
      "end": 1
    },
    "part": {
      "begin": 0,
      "end": 1
    }
  }
]
`;
```

## Debugging Tests

### Using console.log
```javascript
it('debug pattern', () => {
  const pat = sequence('a', 'b', 'c');
  
  // Log events
  console.log(pat.firstCycle());
  
  // Use pattern's log method
  pat.log();
});
```

### Visual Debugging
```javascript
it('visual pattern debug', () => {
  const pat = sequence('a', 'b', 'c').fast(2);
  
  // Draw pattern
  console.log(pat.drawLine());
  
  // Show structure
  pat.struct(true).log();
});
```

## Test Coverage

### Running Coverage
```bash
# Generate coverage report
pnpm test-coverage

# View report
open coverage/index.html
```

### Coverage Guidelines
- Aim for >80% coverage on core packages
- Test edge cases and error conditions
- Focus on public API coverage

## Best Practices

### 1. Test Isolation
```javascript
// Each test should be independent
beforeEach(() => {
  // Reset any global state
});

it('isolated test', () => {
  // Test in isolation
});
```

### 2. Descriptive Names
```javascript
describe('Pattern.fast()', () => {
  it('doubles speed when given factor of 2', () => {
    // Clear what's being tested
  });
  
  it('handles fractional factors', () => {
    // Edge case testing
  });
});
```

### 3. Test Organization
```javascript
describe('feature', () => {
  describe('basic functionality', () => {
    // Core tests
  });
  
  describe('edge cases', () => {
    // Boundary tests
  });
  
  describe('integration', () => {
    // Combined usage
  });
});
```

### 4. Avoid Over-Testing
- Don't test implementation details
- Focus on public API behavior
- Test outcomes, not process