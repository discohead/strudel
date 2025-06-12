# Discovered Patterns and Conventions

## Code Organization Patterns

### Module Structure
All packages follow ES modules with `.mjs` extension:
```javascript
// Import pattern
import { Pattern, TimeSpan } from '@strudel/core';
import Fraction from '@strudel/core/fraction.mjs';

// Export pattern
export { pattern, stack, sequence };
export default Pattern;
```

### License Headers
Every source file includes AGPL-3.0 license header:
```javascript
/*
filename.mjs - <short description TODO>
Copyright (C) 2022 Strudel contributors - see <https://github.com/tidalcycles/strudel/blob/main/packages/...>
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License...
*/
```

## Pattern System Conventions

### Pattern Creation
Patterns are created through factory functions, not direct instantiation:
```javascript
// Good - using factory functions
const pat = sequence('a', 'b', 'c');
const pat2 = stack(sine, saw);

// Avoid - direct instantiation
const pat = new Pattern(query); // Only used internally
```

### Method Chaining
Pattern methods return new patterns for chaining:
```javascript
"c3 eb3 g3"
  .fast(2)
  .slow(3)
  .rev()
  .euclidRot(3, 8, 1)
  .s('piano');
```

### Pattern Steps Tracking
Patterns track their step count for proper cycle alignment:
```javascript
const pat = sequence('a', 'b', 'c'); // _steps = 3
const pat2 = stack(pat1, pat2); // _steps = lcm of children

// Internal pattern property
pattern._steps = Fraction(4);
pattern.__steps_source = true; // marks explicitly set steps
```

## Function Patterns

### Curried Functions
Many functions use currying for partial application:
```javascript
// Definition
export const fast = curry((factor, pat) => pat.fast(factor));

// Usage
const doubleFast = fast(2);
const pattern = doubleFast(sequence('a', 'b'));
```

### WithValue Pattern
Transforming pattern values follows the `withValue` convention:
```javascript
pattern.withValue(v => v * 2)
pattern.fmap(func) // alias for withValue
```

### Registration Pattern
Functions are registered to be available globally:
```javascript
// In package
export const rev = register('rev', (pat) => pat.rev());

// Available as
rev("a b c") // or
"a b c".rev()
```

## Testing Patterns

### Snapshot Testing
Pattern outputs are snapshot tested:
```javascript
it('seq', () => {
  expect(sequence('a', 'b', 'c').firstCycle()).toMatchSnapshot();
});
```

### Test Helpers
Common test utilities:
```javascript
const st = (begin, end) => new State(ts(begin, end));
const ts = (begin, end) => new TimeSpan(Fraction(begin), Fraction(end));
const hap = (whole, part, value, context = {}) => 
  new Hap(whole, part, value, context);
```

### Cycle Comparison
Testing pattern equality by comparing first cycles:
```javascript
const sameFirst = (a, b) => {
  return expect(a.sortHapsByPart().firstCycle())
    .toStrictEqual(b.sortHapsByPart().firstCycle());
};
```

## Mini Notation Patterns

### String Parsing
Strings are automatically parsed as mini notation:
```javascript
// These are equivalent
"c3 eb3 g3"
sequence('c3', 'eb3', 'g3')
mini('c3 eb3 g3')
```

### Operator Syntax
Mini notation supports operators:
```javascript
"a b c"@3      // replicate 3 times
"a b c"*2      // fast by 2
"a b c"/2      // slow by 2
"a [b c]"      // subsequence
"a <b c>"      // alternate
```

## UI Component Patterns

### Widget Integration
UI widgets are injected via transpilation:
```javascript
// Source code
note(slider(60, 0, 127))

// Transpiled to
note(sliderWithID('slider_123', 60, 0, 127))
```

### React Component Structure
REPL components follow context pattern:
```javascript
export function Component() {
  const context = useReplContext();
  const { setting } = useSettings();
  
  return <Editor context={context} />;
}
```

## Error Handling Patterns

### Graceful Degradation
Functions handle undefined/null gracefully:
```javascript
if (span_a == undefined || span_b == undefined) {
  return undefined;
}
```

### User-Facing Errors
Clear error messages for user code:
```javascript
throw new Error(`mini: stretch: type must be one of ${legalTypes.join('|')} but got ${type}`);
```

## Performance Patterns

### Lazy Evaluation
Patterns are evaluated lazily via query functions:
```javascript
const pattern = new Pattern((state) => {
  // Only evaluated when queried
  return this.query(state).map(hap => ...);
});
```

### Caching
Results are cached where appropriate:
```javascript
// Fraction caching
this.__steps = steps === undefined ? undefined : Fraction(steps);
```

## Documentation Patterns

### JSDoc Comments
All public APIs have JSDoc:
```javascript
/**
 * Returns a new pattern, with the function applied to the value of
 * each hap. It has the alias `fmap`.
 * @synonyms fmap
 * @param {Function} func to to apply to the value
 * @returns Pattern
 * @example
 * "0 1 2".withValue(v => v + 10).log()
 */
withValue(func) { ... }
```

### @noAutocomplete Tag
Internal methods marked to hide from autocomplete:
```javascript
/**
 * @noAutocomplete
 */
appWhole(whole_func, pat_val) { ... }
```

## Build Patterns

### Vite Configuration
Each package has its own vite config:
```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './index.mjs',
      name: 'StrudelCore',
      fileName: 'index'
    }
  }
});
```

### Workspace Dependencies
Internal dependencies use workspace protocol:
```json
{
  "dependencies": {
    "@strudel/core": "workspace:*"
  }
}
```