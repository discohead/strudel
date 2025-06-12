# CLAUDE.md - @strudel/mini

This file provides guidance to Claude Code when working with the mini notation parser package.

## Package Purpose

`@strudel/mini` implements the Tidal mini notation parser and pattern generation. It provides:
- PEG-based parser for mini notation syntax
- Conversion of mini notation strings to Pattern objects
- Registration system for extending pattern methods
- Core pattern functions accessible via mini notation

## Key APIs and Functions

### Main Entry Point
```javascript
import { mini } from '@strudel/mini';

// Parse mini notation string to pattern
const pattern = mini('c3 [e3 g3]');
```

### Parser Functions
- `mini(string)` - Parse mini notation to pattern
- `register(name, func)` - Register pattern method
- `parseMini(string)` - Low-level parser access

### Mini Notation Syntax Elements
- `a b c` - Sequence (sequential playback)
- `[a b c]` - Subsequence (fits in parent slot)
- `a,b,c` - Stack (parallel playback)
- `a*3` - Repeat (play 3 times)
- `a/3` - Elongate (stretch over 3 steps)
- `a@3` - Weight (give 3x duration weight)
- `a:b` - Select sample/note variant
- `<a b c>` - Alternate per cycle
- `a(3,8)` - Euclidean rhythm
- `a?` - Randomly drop event
- `a!` - Replicate (play on every subdivision)

## Common Usage Patterns

### Basic Patterns
```javascript
// Simple sequence
mini('c3 e3 g3')

// Subsequences
mini('c3 [e3 g3]')  // e3 and g3 share second half

// Stacks (chords)
mini('[c3,e3,g3]')

// Alternating patterns
mini('<c3 e3 g3>')  // Different each cycle
```

### Rhythm Patterns
```javascript
// Repeats
mini('bd*4')        // Four kicks
mini('hh*8')        // Eight hi-hats

// Euclidean rhythms
mini('bd(3,8)')     // 3 hits over 8 steps
mini('sd(5,8,2)')   // 5 hits, 8 steps, rotate by 2

// Elongation
mini('c3/2')        // Hold for 2 steps
```

### Advanced Patterns
```javascript
// Nested structures
mini('[bd sd, hh*4]')    // Kick-snare with hi-hats

// Random elements
mini('c3? e3 g3?')       // Maybe play c3 and g3

// Sample selection
mini('bd:0 bd:1 bd:2')   // Different bass drums

// Complex rhythms
mini('[bd@3 sd, hh*8]')  // Weighted durations
```

## Development Guidelines

### Parser Modifications
The parser is generated from `krill.pegjs` using Peggy:
```bash
# Regenerate parser after modifying krill.pegjs
pnpm run build:parser
```

### Adding Functions to Mini
```javascript
// In mini.mjs, add to exports
export const myfunction = register('myfunction', (arg, pat) => {
  // Transform pattern
  return pat.withValue(v => transform(v, arg));
});
```

### Parser Grammar Structure
```pegjs
// Basic pattern matching in krill.pegjs
Pattern = _ elements:Element+ _ {
  return sequence(...elements);
}

Element = Atom / Group / Stack

Atom = value:Value modifiers:Modifier* {
  return applyModifiers(value, modifiers);
}
```

## Testing Requirements

### Test Location
Tests are in `/test/mini.test.mjs`

### Test Patterns
```javascript
describe('mini notation', () => {
  it('parses sequences', () => {
    expect(mini('a b c').firstCycle()).toEqual(
      sequence('a', 'b', 'c').firstCycle()
    );
  });

  it('parses subsequences', () => {
    expect(mini('a [b c]').firstCycle()).toEqual(
      sequence('a', sequence('b', 'c')).firstCycle()
    );
  });
});
```

### Parser Testing
```javascript
// Test edge cases
testMini('[a b]*2', 'nested repeat');
testMini('a@3 b', 'weight notation');
testMini('<a b> <c d>', 'multiple alternations');
```

## Dependencies and Relationships

### Dependencies
- `@strudel/core` - Pattern engine and primitives
- `fraction.js` - Time arithmetic (via core)

### Parser Generation
- `peggy` (dev dependency) - Parser generator
- `krill.pegjs` - Grammar definition
- `krill-parser.js` - Generated parser (committed)

### Used By
- `@strudel/transpiler` - Integrates mini notation
- All pattern-based packages rely on mini

## Common Pitfalls

### String Parsing Ambiguity
```javascript
// Spaces matter!
mini('a b')    // Two separate events
mini('ab')     // Single event "ab"

// Use quotes for spaces in values
mini('"hello world" "foo bar"')
```

### Precedence Rules
```javascript
// Operators have specific precedence
mini('a b*2')     // b repeats, not "a b"
mini('[a b]*2')   // Entire group repeats

// Stack binds tighter than sequence
mini('a,b c')     // Stack of a,b, then c
mini('[a,b] c')   // Same result
```

### Performance Considerations
```javascript
// Parser is called once per string
const pattern = mini('complex pattern string');
// Reuse pattern object instead of reparsing

// Avoid dynamic mini notation generation
// Bad: mini(`${note} ${rhythm}`)
// Good: sequence(note, rhythm)
```

## Integration Examples

### With Pattern Methods
```javascript
// Mini notation returns Pattern instance
mini('c3 e3 g3')
  .fast(2)
  .add(12)
  .s('piano')
```

### With Controls
```javascript
// Control patterns in mini
mini('c3 e3 g3').n('<0 12 24>')
// Each cycle transposes differently
```

### Custom Functions
```javascript
// Register custom mini function
register('reverse', (pat) => pat.rev());

// Use in mini notation
mini('c3 e3 g3').reverse()
```

## Mini Notation Reference

### Sequence and Grouping
- `a b c` → `sequence(a, b, c)`
- `[a b c]` → fits in one step
- `<a b c>` → `slowcat(a, b, c)`

### Stacking
- `a,b,c` → `stack(a, b, c)`
- `[a,b] [c,d]` → stacks within sequences

### Modifiers
- `a*4` → repeat 4 times
- `a/4` → stretch over 4 steps
- `a@4` → 4x weight
- `a?` → 50% probability
- `a!` → replicate

### Special Notation
- `a:3` → select variant 3
- `a(3,8)` → euclidean rhythm
- `a(3,8,2)` → euclidean with rotation
- `~` → silence/rest

### Operators
Can be chained: `a*2@3` (repeat 2, weight 3)

### Grouping Priority
1. Parentheses/brackets
2. Modifiers
3. Stack (`,`)
4. Sequence (space)
5. Alternate (`< >`)