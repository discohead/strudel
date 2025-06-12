# CLAUDE.md - @strudel/core

This file provides guidance to Claude Code when working with the core pattern engine package.

## Package Purpose

`@strudel/core` is the foundation of Strudel, implementing the Tidal pattern engine. It provides:
- The Pattern class and core FRP (Functional Reactive Programming) primitives
- Time-based event generation and querying
- Pattern combinators and transformations
- No external dependencies - pure JavaScript implementation

## Key APIs and Classes

### Pattern Class
```javascript
class Pattern {
  constructor(query, steps = undefined) {
    this.query = query;        // (State) => Hap[]
    this._Pattern = true;      // Type detection
    this._steps = steps;       // Steps per cycle
  }
}
```

### Core Pattern Constructors
- `pure(value)` - Constant pattern
- `sequence(...patterns)` - Sequential composition
- `stack(...patterns)` - Parallel composition
- `slowcat(...patterns)` - Concatenate patterns
- `fastcat(...patterns)` - Fast concatenation
- `choose(...values)` - Random selection
- `chooseWith(seed, values)` - Seeded random

### Time Transformations
- `fast(factor)` / `slow(factor)` - Time scaling
- `early(time)` / `late(time)` - Time shifting
- `rev()` - Reverse pattern
- `palindrome()` - Forward then backward
- `iter(n)` / `iterBack(n)` - Rotate pattern
- `ply(n)` - Repeat each event n times

### Value Transformations
- `withValue(func)` - Map over values
- `add(n)` / `sub(n)` / `mul(n)` / `div(n)` - Arithmetic
- `struct(binaryPattern)` - Apply structure
- `mask(binaryPattern)` - Filter by structure

### Pattern Queries
- `queryArc(begin, end)` - Get events in timespan
- `firstCycle()` - Get first cycle events
- `withContext(func)` - Transform event context

## Common Usage Patterns

### Creating Basic Patterns
```javascript
// Constant value
const c = pure(60);

// Sequence of values
const melody = sequence(60, 62, 64, 65);

// Stacked patterns (chord)
const chord = stack(60, 64, 67);

// Pattern from array
const pattern = sequence(...[60, 62, 64]);
```

### Pattern Transformations
```javascript
// Time transformations
pattern.fast(2)      // Double speed
pattern.slow(0.5)    // Half speed
pattern.rev()        // Reverse
pattern.early(0.25)  // Start 1/4 cycle early

// Combining patterns
pattern1.cat(pattern2)           // Concatenate
pattern1.stack(pattern2)         // Layer
patternOfFunctions.appLeft(values) // Apply functions
```

### Querying Patterns
```javascript
// Get events from time 0 to 1
const events = pattern.queryArc(0, 1);

// Process events
events.forEach(event => {
  console.log({
    value: event.value,
    start: event.whole.begin.toFraction(),
    end: event.whole.end.toFraction()
  });
});
```

## Development Guidelines

### Adding Pattern Methods
1. Add method to Pattern prototype in pattern.mjs
2. Use `patternify2` for binary operations that should work with plain values
3. Maintain immutability - always return new Pattern instances
4. Document with JSDoc including @example

### Pattern Method Template
```javascript
/**
 * Description of what the method does
 * @param {number} param - Parameter description
 * @returns {Pattern} - Transformed pattern
 * @example
 * sequence(1, 2, 3).myMethod(4)
 */
Pattern.prototype.myMethod = function(param) {
  return new Pattern((state) => {
    // Transform query results
    return this.query(state).map(hap => 
      // Return transformed haps
    );
  });
};
```

### Performance Considerations
- Patterns are lazy - computation happens during query
- Use `_steps` to track pattern cycle length for alignment
- Minimize object allocations in hot paths
- Cache computed values when possible

## Testing Requirements

### Test Location
Tests are in `/test/pattern.test.mjs`

### Test Structure
```javascript
describe('pattern method', () => {
  it('should transform values correctly', () => {
    const pattern = sequence(1, 2, 3).myMethod(4);
    expect(pattern.firstCycle()).toEqual([
      // Expected haps
    ]);
  });
});
```

### Snapshot Testing
```javascript
// Use snapshots for complex pattern outputs
expect(pattern.firstCycle().map(h => h.show())).toMatchSnapshot();
```

## Dependencies and Relationships

### Internal Dependencies
- `fraction.mjs` - Precise time arithmetic
- `hap.mjs` - Event representation
- `timespan.mjs` - Time interval logic
- `state.mjs` - Query state management
- `util.mjs` - Helper functions

### Used By
- `@strudel/mini` - Adds mini notation parsing
- `@strudel/transpiler` - Adds syntax sugar
- `@strudel/webaudio` - Audio scheduling
- All other Strudel packages build on core

### No External Dependencies
Core is deliberately dependency-free to ensure:
- Maximum portability
- Minimal bundle size
- Easy testing
- Clear architecture

## Common Pitfalls

### Time Precision
Always use Fraction for time values:
```javascript
// Good
const time = Fraction(1, 3);

// Bad - loses precision
const time = 1/3;
```

### Pattern Evaluation
Patterns are lazy - they don't compute until queried:
```javascript
// This doesn't execute immediately
const pattern = sequence(1, 2, 3).add(1);

// Computation happens here
const events = pattern.queryArc(0, 1);
```

### Mutability
Never mutate patterns or haps:
```javascript
// Bad
pattern.value = newValue;

// Good
const newPattern = pattern.withValue(v => newValue);
```

## Integration Examples

### With Controls
```javascript
// Controls are merged into event values
pure({ note: 60 })
  .set.s('piano')
  .set.gain(0.8)
// Results in: { note: 60, s: 'piano', gain: 0.8 }
```

### With Mini Notation
```javascript
// After mini is registered
"c3 e3 g3".fast(2)
// Equivalent to:
sequence('c3', 'e3', 'g3').fast(2)
```

### With Scheduling
```javascript
// Pattern provides events, scheduler handles timing
const haps = pattern.queryArc(audioTime, audioTime + lookAhead);
haps.forEach(hap => {
  scheduler.schedule(hap.part.begin, () => {
    playSound(hap.value);
  });
});
```