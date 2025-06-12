# Test Generation Instructions for Strudel

## Test File Structure

Test files are colocated with source and use `.test.mjs` suffix:
```
packages/core/
├── pattern.mjs
└── test/
    └── pattern.test.mjs
```

## Basic Test Template

```javascript
import { describe, it, expect } from 'vitest';
import { funcName, sequence, stack } from '../index.mjs';

describe('funcName', () => {
  it('basic functionality', () => {
    const result = funcName(param, "a b c");
    expect(result.firstCycle()).toMatchSnapshot();
  });
  
  it('handles edge cases', () => {
    expect(funcName(0, "a").firstCycle()).toEqual([]);
    expect(funcName().firstCycle()).toEqual([]);
  });
  
  it('works with method chaining', () => {
    const result = "a b c".funcName(1).fast(2);
    expect(result.firstCycle()).toMatchSnapshot();
  });
});
```

## Snapshot Testing

Use snapshots for complex pattern outputs:
```javascript
it('complex pattern transformation', () => {
  const pattern = stack(
    sequence('a', 'b').fast(3),
    sequence('c', 'd', 'e').slow(2)
  ).funcName(0.5);
  
  expect(pattern.firstCycle()).toMatchSnapshot();
});
```

Update snapshots when output changes intentionally:
```bash
pnpm snapshot
```

## Test Utilities

### Standard Helpers
```javascript
import { TimeSpan, Hap, State } from '@strudel/core';
import Fraction from '@strudel/core/fraction.mjs';

// Create TimeSpan
const ts = (begin, end) => 
  new TimeSpan(Fraction(begin), Fraction(end));

// Create Hap
const hap = (whole, part, value, context = {}) => 
  new Hap(whole, part, value, context);

// Create State  
const st = (begin, end) => 
  new State(ts(begin, end));

// Compare first cycles
const sameFirst = (a, b) => {
  expect(a.sortHapsByPart().firstCycle())
    .toStrictEqual(b.sortHapsByPart().firstCycle());
};
```

### Pattern Testing Utilities
```javascript
// Test pattern equality
const testPatternEqual = (a, b, cycles = 1) => {
  const aCycles = a.queryArc(0, cycles);
  const bCycles = b.queryArc(0, cycles);
  expect(aCycles).toStrictEqual(bCycles);
};

// Test event count
const testEventCount = (pattern, expectedCount, cycles = 1) => {
  const events = pattern.queryArc(0, cycles);
  expect(events.length).toBe(expectedCount);
};

// Test value transformation
const testValues = (pattern, expectedValues) => {
  const values = pattern.firstCycle().map(h => h.value);
  expect(values).toEqual(expectedValues);
};
```

## Testing Pattern Functions

### Time Transformation Tests
```javascript
describe('timeTransform', () => {
  it('shifts pattern forward', () => {
    const original = sequence('a', 'b', 'c', 'd');
    const shifted = original.late(0.25);
    
    // First event should start at 0.25
    const firstHap = shifted.firstCycle()[0];
    expect(firstHap.part.begin.valueOf()).toBe(0.25);
  });
  
  it('preserves total duration', () => {
    const original = "a b c";
    const transformed = original.timeTransform(0.5);
    
    expect(original._steps).toBe(transformed._steps);
  });
});
```

### Value Transformation Tests
```javascript
describe('valueTransform', () => {
  it('transforms numeric values', () => {
    const pattern = sequence(1, 2, 3).add(10);
    const values = pattern.firstCycle().map(h => h.value);
    expect(values).toEqual([11, 12, 13]);
  });
  
  it('handles object values', () => {
    const pattern = sequence(
      { note: 60 },
      { note: 62 }
    ).add(12);
    
    expect(pattern.firstCycle()[0].value.note).toBe(72);
  });
});
```

### Pattern Combinator Tests
```javascript
describe('combinator', () => {
  it('combines patterns correctly', () => {
    const pat1 = sequence('a', 'b');
    const pat2 = sequence('c', 'd');
    const combined = stack(pat1, pat2);
    
    // Should have events from both patterns
    const events = combined.firstCycle();
    const values = events.map(h => h.value).sort();
    expect(values).toEqual(['a', 'b', 'c', 'd']);
  });
});
```

## Testing Mini Notation

```javascript
import { mini } from '@strudel/mini';

describe('mini notation operator', () => {
  it('parses new operator', () => {
    const result = mini('"a b c"@>0.25');
    const expected = sequence('a', 'b', 'c').rotate(0.25);
    sameFirst(result, expected);
  });
  
  it('handles nested structures', () => {
    expect(mini('"a [b c]"@>0.5').firstCycle())
      .toMatchSnapshot();
  });
});
```

## Error Testing

```javascript
describe('error handling', () => {
  it('throws on invalid input', () => {
    expect(() => funcName('invalid'))
      .toThrow(/expected number/);
  });
  
  it('provides helpful error message', () => {
    expect(() => funcName(-1, "a"))
      .toThrow(/must be between 0 and 1/);
  });
  
  it('handles missing parameters gracefully', () => {
    expect(funcName().firstCycle()).toEqual([]);
  });
});
```

## Performance Testing

```javascript
import { bench, describe } from 'vitest';

describe('performance', () => {
  bench('funcName with simple pattern', () => {
    const pat = sequence('a', 'b', 'c');
    pat.funcName(0.5).queryArc(0, 100);
  });
  
  bench('funcName with complex pattern', () => {
    const pat = stack(
      sequence('a', 'b', 'c').fast(3),
      sequence('d', 'e', 'f', 'g').fast(5)
    );
    pat.funcName(0.5).queryArc(0, 100);
  });
});
```

## Integration Testing

```javascript
describe('integration', () => {
  it('works with other transformations', () => {
    const result = "c3 e3 g3"
      .funcName(0.5)
      .fast(2)
      .add(12)
      .struct("t f t f");
      
    expect(result.firstCycle()).toMatchSnapshot();
  });
  
  it('preserves pattern metadata', () => {
    const original = sequence('a', 'b', 'c');
    const transformed = original.funcName(0.5);
    
    expect(transformed._steps).toBe(original._steps);
  });
});
```

## Test Coverage Guidelines

1. **Happy path**: Basic functionality with typical inputs
2. **Edge cases**: Empty patterns, zero values, boundaries
3. **Error cases**: Invalid inputs, type mismatches
4. **Integration**: Combination with other functions
5. **Performance**: Benchmarks for complex patterns

## Running Tests

```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm --filter @strudel/core test

# Run single test file
pnpm vitest run packages/core/test/pattern.test.mjs

# Run with UI
pnpm test-ui

# Update snapshots
pnpm snapshot
```

## Test Debugging Tips

```javascript
// Log pattern events for debugging
const events = pattern.firstCycle();
console.log('Events:', events.map(h => ({
  value: h.value,
  begin: h.part.begin.valueOf(),
  end: h.part.end.valueOf()
})));

// Use .only to run single test
it.only('debug this test', () => {
  // Test code
});

// Add custom messages
expect(result, 'Should have 4 events').toHaveLength(4);
```