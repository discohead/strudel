# AGENTS.md - @strudel/mini

Specialized guidance for AI agents working on the mini notation parser. This package provides the concise pattern syntax that makes Strudel accessible.

## Quick Start (1 minute validation)

```bash
# From packages/mini directory
pnpm test  # Should pass all parser tests

# If you modify the grammar:
npx pegjs krill.pegjs  # Regenerate parser
pnpm test  # Verify tests still pass
```

## Mini Package Context

### Purpose
Parses Tidal's mini notation syntax into Pattern objects. Provides the string-to-pattern magic.

### Key Files
- `krill.pegjs` - PEG grammar definition
- `krill.js` - Generated parser (DO NOT EDIT DIRECTLY)
- `mini.mjs` - Parser integration and exports
- `test/mini.test.mjs` - Parser tests

### References
- Local: `CLAUDE.md` in this directory
- Global: `/claude/technologies/mini-notation.md`
- Rules: `/.cursor/rules/components/mini-notation.mdc`

## Mini Notation Syntax Reference

### Basic Elements
```javascript
"a b c"          // Sequence
"[a b] c"        // Group (plays in half time)
"a [b c]"        // Mixed grouping
"<a b c>"        // Choose one per cycle
"a(3,8)"         // Euclidean rhythm
"a*4"            // Repeat 4 times
"a@2"            // Weight (probability)
"a:2"            // Sample index
"a?"             // Degrade (50% chance)
"a b | c d"      // Alternate patterns
```

### Operators
```javascript
"a!2"            // Replicate (play twice)
"a/2"            // Play every 2 cycles
"a%4"            // Speed up by 4
"[a,b,c]"        // Polyrhythm
"{a b,c d e}"    // Polymeter
"a'major"        // Chord modifier
```

## Common Agent Tasks

### 1. Adding a New Operator (6-8 minutes)

#### Task Checklist
- [ ] Add grammar rule to `krill.pegjs`
- [ ] Define operator behavior
- [ ] Regenerate parser
- [ ] Add tests
- [ ] Document in comments

#### Example: Adding a Reverse Operator (~)
```pegjs
// In krill.pegjs

// Add to operator precedence (find the atom rule)
atom = 
  / value:value "~" { 
      return { 
        type: 'reverse', 
        value: value 
      }; 
    }
  / value:value "?" { return {type: 'degrade', value: value}; }
  // ... other operators

// In mini.mjs - add to patternifyAST
function patternifyAST(ast) {
  switch (ast.type) {
    case 'reverse':
      return patternify(ast.value).rev();
    // ... other cases
  }
}

// In test/mini.test.mjs
it('reverses with ~', () => {
  expect(mini('a b c~').firstCycle()).toMatchSnapshot();
});
```

### 2. Fixing Parser Bugs (4-6 minutes)

#### Common Issues

1. **Precedence Problems**
   ```pegjs
   // ❌ Bug: Wrong precedence
   sequence = repeat / group / atom
   
   // ✅ Fix: Correct order (most specific first)
   sequence = group / repeat / atom
   ```

2. **Whitespace Handling**
   ```pegjs
   // ❌ Bug: Requires spaces
   sequence = value (" " value)*
   
   // ✅ Fix: Optional whitespace
   sequence = value (_ value)*
   _ = [ \t\n\r]*  // whitespace rule
   ```

3. **Ambiguous Grammar**
   ```pegjs
   // ❌ Bug: Can't distinguish
   operator = "*" / "**"
   
   // ✅ Fix: Longer match first
   operator = "**" / "*"
   ```

### 3. Adding Pattern Modifiers (5-7 minutes)

#### Example: Adding Scale Degrees
```pegjs
// In krill.pegjs - add to value rule
value = 
  / note:note "'" scale:word {
      return {
        type: 'scale',
        note: note,
        scale: scale
      };
    }
  / note
  / word
  / number

// In mini.mjs
case 'scale':
  // Assuming a scale function exists
  return pure(ast.note).scale(ast.scale);

// Tests
it('applies scale degrees', () => {
  expect(mini("0 2 4'minor").firstCycle()).toMatchSnapshot();
});
```

### 4. Improving Error Messages (3-5 minutes)

#### Better Parse Errors
```javascript
// In mini.mjs
export function mini(str) {
  try {
    const ast = parser.parse(str);
    return patternifyAST(ast);
  } catch (e) {
    // Enhance error with context
    const line = str.split('\n')[e.location.start.line - 1];
    const pointer = ' '.repeat(e.location.start.column - 1) + '^';
    
    throw new Error(
      `Mini notation parse error at line ${e.location.start.line}:\n` +
      `${line}\n${pointer}\n` +
      `Expected: ${e.expected.map(e => e.description).join(' or ')}`
    );
  }
}
```

## Parser Development Workflow

### 1. Grammar Modification
```bash
# Edit krill.pegjs
vim krill.pegjs

# Regenerate parser
npx pegjs krill.pegjs

# Test immediately
pnpm test -- --grep "my new feature"
```

### 2. Testing Grammar Changes
```javascript
// Quick test in REPL
import { mini } from './mini.mjs';
console.log(mini("a b c").firstCycle());

// Add formal test
it('new syntax', () => {
  const pattern = mini('a!2 b');
  expect(pattern.firstCycle().length).toBe(3);
  expect(pattern.firstCycle()).toMatchSnapshot();
});
```

### 3. Debugging Parser Issues
```pegjs
// Add debug labels
sequence = 
  first:atom rest:(_ atom)* {
    console.log('Parsed sequence:', first, rest);
    return buildSequence([first, ...rest.map(r => r[1])]);
  }
```

## Grammar Best Practices

### 1. Rule Organization
```pegjs
// Top-level rule first
pattern = sequence

// Then work down in precedence
sequence = element+
element = grouped / modified / simple
grouped = "[" pattern "]"
modified = simple operator
simple = word / number
```

### 2. Consistent AST Structure
```pegjs
// Every AST node should have 'type'
repeat = value:atom "*" count:number {
  return {
    type: 'repeat',
    value: value,
    count: count
  };
}
```

### 3. Location Tracking
```pegjs
// Include location for error messages
value = val:(word / number) {
  return {
    type: 'value',
    value: val,
    location: location()
  };
}
```

## Common Validation Errors

### 1. Parser Not Regenerated
```
Error: Expected "(" but found "["
Fix: Run `npx pegjs krill.pegjs` after grammar changes
```

### 2. AST Type Missing
```
Error: Unknown AST type: undefined
Fix: Ensure all grammar rules return {type: '...'}
```

### 3. Precedence Issues
```
Test failure: "a*2+1" parsed incorrectly
Fix: Review operator precedence in grammar
```

### 4. Whitespace Problems
```
Error: Expected value but found end of input
Fix: Add proper whitespace handling with _ rules
```

## Performance Considerations

### Parser Optimization
1. **Avoid backtracking**: Use '/' ordered choice carefully
2. **Cache common patterns**: Store parsed subsequences
3. **Minimize lookahead**: Keep grammar mostly LL(1)

### Benchmarks
```bash
# Run parser benchmarks
pnpm bench -- --grep "mini"
```

Target performance:
- Simple pattern: < 1ms
- Complex pattern (100 elements): < 10ms
- Deeply nested: < 20ms

## Integration Points

### With Core Package
```javascript
// mini.mjs imports from core
import { sequence, stack, pure, fastcat } from '@strudel/core';

// Converts AST to Pattern objects
function patternifyAST(ast) {
  // Uses core functions to build patterns
}
```

### With Transpiler
```javascript
// Transpiler makes mini notation available globally
// "a b c" automatically becomes mini("a b c")
```

## Quick Debug Commands

```bash
# Test specific mini notation
pnpm vitest run test/mini.test.mjs -t "euclidean"

# Check grammar syntax
npx pegjs krill.pegjs --allowed-start-rules pattern

# Test parser output
node -e "import {mini} from './mini.mjs'; console.log(mini('a b c').firstCycle())"
```

## When to Escalate

Escalate to human review if:
- Major grammar restructuring needed
- Breaking changes to existing syntax
- Performance regression in parser
- Ambiguous grammar conflicts
- Need to support new pattern core features

Remember: Mini notation is the user's first contact with Strudel. Keep it intuitive and well-tested!