# Strudel Copilot Instructions

Strudel is a music live coding environment based on Functional Reactive Programming (FRP). Patterns are immutable time functions that emit events called "Haps".

## Core Pattern Principles

**Patterns are time functions** - They map time spans to events:
```javascript
const pattern = new Pattern((state) => {
  // Query returns events for the given time span
  return calculateEvents(state.span);
});
```

**Patterns are immutable** - Transformations return new patterns:
```javascript
// Good - Returns new pattern
pattern.fast(2).rev()

// Bad - Never mutate
pattern._steps = 4; // ❌
```

**Patterns are lazy** - Evaluation happens at query time:
```javascript
const complex = stack(pattern1, pattern2); // No computation
const events = complex.queryArc(0, 1); // Computation here
```

## Essential Conventions

**Module structure** - ES modules with .mjs extension:
```javascript
import { Pattern } from '@strudel/core';
export { sequence, stack };
```

**Time precision** - Always use Fraction:
```javascript
import Fraction from '@strudel/core/fraction.mjs';
const time = Fraction(1, 3); // Not: 1/3
```

**Pattern creation** - Use factory functions:
```javascript
// Good
const pat = sequence('a', 'b', 'c');
const pat2 = "c3 e3 g3"; // Mini notation

// Avoid
const pat = new Pattern(...); // Internal only
```

## Common Pattern Functions

**Time transformations**:
```javascript
pattern.fast(2)      // Double speed
pattern.slow(0.5)    // Half speed  
pattern.early(0.25)  // Shift earlier
pattern.late(0.25)   // Shift later
pattern.rev()        // Reverse
```

**Value transformations**:
```javascript
pattern.add(12)      // Add to values
pattern.mul(0.5)     // Multiply values
pattern.range(20, 80) // Scale to range
pattern.withValue(v => v * 2) // Custom transform
```

**Pattern combinators**:
```javascript
stack(pat1, pat2)    // Play together
sequence(a, b, c)    // Play in sequence
cat(pat1, pat2)      // Concatenate
slowcat(pat1, pat2)  // Slow concatenate
```

**Structural operations**:
```javascript
pattern.struct("t f t f")  // Apply rhythm
pattern.euclid(3, 8)       // Euclidean rhythm
pattern.every(4, rev)      // Transform cycles
pattern.sometimesBy(0.5, fast(2)) // Random transform
```

## Mini Notation

Strings in double quotes trigger mini notation parsing:
```javascript
"c3 e3 g3"           // Sequence
"bd [sd cp]"         // Subsequence
"bd <sd cp>"         // Alternate
"bd*4"               // Repeat
"bd(3,8)"            // Euclidean
"c3 e3 g3"@2         // Replicate
```

## Function Implementation Pattern

```javascript
/**
 * Brief description of what function does
 * @param {number} param1 - Parameter description  
 * @param {Pattern} pat - Pattern to transform
 * @returns {Pattern} Transformed pattern
 * @example
 * myFunc(0.5, "c3 e3") // => result
 */
export const myFunc = register('myFunc', (param1, pat) => {
  pat = reify(pat); // Convert to Pattern
  param1 = Fraction(param1); // Ensure Fraction
  
  return pat.withTime(t => t.mul(param1));
});

// Add as method
Pattern.prototype.myFunc = function(param1) {
  return myFunc(param1, this);
};
```

## Testing Requirements

**Always write tests** for new pattern functions:
```javascript
describe('myFunc', () => {
  it('basic functionality', () => {
    expect(myFunc(2, "a b c").firstCycle()).toMatchSnapshot();
  });
  
  it('edge cases', () => {
    expect(myFunc(0, "a").firstCycle()).toEqual([]);
  });
});
```

**Test helpers**:
```javascript
const ts = (begin, end) => new TimeSpan(Fraction(begin), Fraction(end));
const hap = (whole, part, value) => new Hap(whole, part, value);
```

## Audio Integration

Pattern values become audio parameters:
```javascript
note("c3 e3 g3")
  .s("sawtooth")     // Sound source
  .cutoff(1000)      // Filter cutoff
  .room(0.5)         // Reverb
  .gain(0.8)         // Volume
```

## Error Handling

Provide clear, actionable errors:
```javascript
if (!validTypes.includes(type)) {
  throw new Error(
    `myFunc: type must be one of ${validTypes.join('|')} but got ${type}`
  );
}
```

Handle edge cases gracefully:
```javascript
if (!span_a || !span_b) return undefined;
```

## Performance Guidelines

- Query only needed time spans
- Reuse patterns instead of recreating
- Use `const ZERO = Fraction(0)` for common values
- Patterns are immutable - transformations create new instances

## Package Structure

- `/packages/core` - Pattern engine foundation
- `/packages/mini` - Mini notation parser
- `/packages/webaudio` - Web Audio output
- `/packages/tonal` - Musical functions
- `/packages/transpiler` - Code transformation

## Development Commands

```bash
pnpm i          # Install dependencies
pnpm dev        # Start REPL (localhost:3000)
pnpm test       # Run tests
pnpm snapshot   # Update snapshots
pnpm lint       # Check code style
pnpm codeformat # Format code
```

## Key Enforcement Rules

- Pattern methods must return Pattern instances
- Time values must use Fraction type
- Functions taking patterns must call `reify()`
- Public APIs must have JSDoc with @example
- Test files use `.test.mjs` suffix
- Files use AGPL-3.0 license header