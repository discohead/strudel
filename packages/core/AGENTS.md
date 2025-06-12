# AGENTS.md - @strudel/core

Specialized guidance for AI agents working on the core pattern engine. This package is the foundation of Strudel and requires careful attention to FRP principles.

## Quick Start (1 minute validation)

```bash
# From packages/core directory
pnpm test  # Should pass all tests
pnpm vitest run test/pattern.test.mjs  # Quick pattern test
```

## Core Package Context

### Purpose
The pattern engine implementing Tidal's FRP model in JavaScript. Pure functional, no external dependencies.

### Key Files
- `pattern.mjs` - Pattern class and transformations
- `hap.mjs` - Event (Hap) representation
- `fraction.mjs` - Precise time arithmetic
- `timespan.mjs` - Time interval logic
- `controls.mjs` - Pattern controls (note, gain, etc.)
- `index.mjs` - Public API exports

### References
- Local: `CLAUDE.md` in this directory
- Global: `/claude/technologies/pattern-engine.md`
- Rules: `/.cursor/rules/components/pattern-functions.mdc`

## Common Agent Tasks

### 1. Adding a Pattern Transformation (5-7 minutes)

#### Task Checklist
- [ ] Add function to `pattern.mjs`
- [ ] Add prototype method
- [ ] Export from `index.mjs`
- [ ] Add tests to `test/pattern.test.mjs`
- [ ] Update snapshots if needed
- [ ] Add JSDoc with example

#### Implementation Template
```javascript
// In pattern.mjs

/**
 * Shifts events by a musical interval
 * @param {number} semitones - Number of semitones to shift
 * @returns {Pattern} Pattern with shifted note values
 * @example
 * note("c3 e3 g3").transpose(12) // Up one octave
 */
export const transpose = register('transpose', 
  curry((semitones, pat) => {
    pat = reify(pat);
    semitones = Fraction(semitones);
    
    return pat.withValue(value => {
      // Handle both number and note object values
      if (typeof value === 'number') {
        return value + semitones.valueOf();
      }
      if (value.note !== undefined) {
        return { ...value, note: value.note + semitones.valueOf() };
      }
      return value;
    });
  })
);

// Add prototype method
Pattern.prototype.transpose = function(semitones) {
  return transpose(semitones, this);
};

// In index.mjs - add to exports
export { transpose } from './pattern.mjs';

// In test/pattern.test.mjs
describe('transpose', () => {
  it('transposes numeric notes', () => {
    expect(transpose(12, pure(60)).firstCycle()).toMatchSnapshot();
  });
  
  it('transposes note objects', () => {
    expect(transpose(7, pure({note: 60, s: 'piano'})).firstCycle())
      .toMatchSnapshot();
  });
  
  it('handles mini notation', () => {
    expect("c3 e3 g3".transpose(12).firstCycle()).toMatchSnapshot();
  });
});
```

### 2. Adding a Pattern Combinator (6-8 minutes)

#### Task Checklist
- [ ] Understand time alignment requirements
- [ ] Implement query function
- [ ] Handle edge cases (empty patterns, single values)
- [ ] Preserve or calculate `_steps`
- [ ] Test with various cycle lengths

#### Example Implementation
```javascript
/**
 * Alternates between patterns each cycle
 * @param {...Pattern} pats - Patterns to alternate between
 * @returns {Pattern} Pattern that cycles through inputs
 * @example
 * alternate("c3", "e3", "g3") // Plays c3, then e3, then g3, repeat
 */
export const alternate = register('alternate', 
  (...pats) => {
    pats = pats.map(reify);
    
    return new Pattern((state) => {
      const cycleNum = state.span.begin.floor();
      const patIndex = cycleNum.mod(pats.length).valueOf();
      const chosenPat = pats[patIndex];
      
      return chosenPat.query(state);
    });
  }
);
```

### 3. Fixing Time-Related Bugs (4-6 minutes)

#### Common Issues
1. **JavaScript number precision**
   ```javascript
   // ❌ Bug: Loses precision
   const third = 1/3;
   
   // ✅ Fix: Use Fraction
   const third = Fraction(1, 3);
   ```

2. **Time span calculations**
   ```javascript
   // ❌ Bug: Incorrect intersection
   if (span1.begin < span2.end && span1.end > span2.begin)
   
   // ✅ Fix: Use TimeSpan methods
   if (span1.intersection(span2))
   ```

3. **Cycle alignment**
   ```javascript
   // ❌ Bug: Doesn't account for pattern length
   return pat.fast(2);
   
   // ✅ Fix: Preserve steps
   const result = pat.fast(2);
   result._steps = pat._steps;
   return result;
   ```

### 4. Optimizing Pattern Performance (5-7 minutes)

#### Performance Checklist
- [ ] Minimize object allocations in query loops
- [ ] Cache computed values when possible
- [ ] Use early returns for empty results
- [ ] Avoid repeated reification

#### Example Optimization
```javascript
// Before: Creates many intermediate objects
Pattern.prototype.slowOptimized = function(factor) {
  factor = Fraction(factor);
  
  // Cache reciprocal
  const invFactor = factor.inverse();
  
  return new Pattern((state) => {
    // Early return for zero factor
    if (factor.equals(0)) return [];
    
    // Transform state once
    const scaledState = state.setSpan(
      state.span.begin.mul(invFactor),
      state.span.end.mul(invFactor)
    );
    
    // Single query with mapped results
    return this.query(scaledState).map(hap => 
      hap.withSpan(
        span => span.mulBoth(factor),
        span => span.mulBoth(factor)
      )
    );
  });
};
```

## Testing Strategies

### Unit Test Patterns
```javascript
describe('pattern function', () => {
  // Basic functionality
  it('handles simple case', () => {
    const result = myFunction(param, "a b c");
    expect(result.firstCycle()).toMatchSnapshot();
  });
  
  // Edge cases
  it('handles empty pattern', () => {
    expect(myFunction(param, silence).firstCycle()).toEqual([]);
  });
  
  // Time precision
  it('maintains time precision', () => {
    const result = myFunction(Fraction(1, 3), pure('a'));
    const hap = result.firstCycle()[0];
    expect(hap.whole.begin.toString()).toBe('0');
    expect(hap.whole.end.toString()).toBe('1/3');
  });
  
  // Integration
  it('works with controls', () => {
    const result = n(60, 62).s('piano').myFunction(param);
    expect(result.firstCycle()).toMatchSnapshot();
  });
});
```

### Snapshot Testing
```javascript
// Generate readable snapshots
const showHap = (hap) => ({
  value: hap.value,
  whole: `${hap.whole.begin} - ${hap.whole.end}`,
  part: `${hap.part.begin} - ${hap.part.end}`
});

expect(pattern.firstCycle().map(showHap)).toMatchSnapshot();
```

## Common Validation Errors

### 1. Missing Registration
```
Error: myFunction is not a function
Fix: Add register('myFunction', ...) wrapper
```

### 2. Type Errors
```
Error: Cannot read property 'query' of undefined
Fix: Use reify(pat) to handle strings
```

### 3. Time Precision Loss
```
Test failure: Expected "1/3" but got "0.3333333333333333"
Fix: Use Fraction throughout, not JavaScript numbers
```

### 4. Missing Exports
```
Error: myFunction is not exported
Fix: Add to index.mjs exports
```

## Performance Benchmarks

Run benchmarks before/after optimization:
```bash
pnpm bench -- --grep "pattern"
```

Expected performance targets:
- Simple query: < 0.1ms per cycle
- Complex stack: < 1ms per cycle
- Mini notation parse: < 5ms

## Core Principles Reminder

From `.cursor/rules/architecture-principles.mdc`:

1. **Immutability**: Never mutate, always return new
2. **Laziness**: Compute only when queried
3. **Precision**: Always use Fraction for time
4. **Purity**: No side effects in pattern functions
5. **Composability**: Small functions that combine

## Quick Debug Commands

```bash
# Run specific test
pnpm vitest run test/pattern.test.mjs -t "myFunction"

# Debug with console.log
pnpm vitest run test/pattern.test.mjs --reporter=verbose

# Check test coverage
pnpm vitest run --coverage

# Verify no type errors
pnpm tsc --noEmit
```

## When to Escalate

Escalate to human review if:
- Changing Pattern class constructor
- Modifying core query algorithm
- Altering Hap structure
- Performance regression > 20%
- Breaking existing snapshots without clear reason

Remember: Core is the foundation. Every change affects the entire system. Test thoroughly!