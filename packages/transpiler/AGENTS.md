# AGENTS.md - @strudel/transpiler

Specialized guidance for AI agents working on the transpiler package. This package transforms user code to enable Strudel's syntactic sugar and features.

## Quick Start (1 minute validation)

```bash
# From packages/transpiler directory
pnpm test  # Should pass all transpiler tests

# Quick functionality check
node -e "import {transpiler} from './transpiler.mjs'; console.log(transpiler('\"c3 e3\"'))"
```

## Transpiler Package Context

### Purpose
Transforms JavaScript code to add Strudel-specific features like mini notation syntax and pattern method globals.

### Key Files
- `transpiler.mjs` - Main transpiler logic
- `test/transpiler.test.mjs` - Comprehensive test suite

### References
- Local: `CLAUDE.md` in this directory
- Global: `/claude/technologies/transpiler-system.md`
- Rules: `/.cursor/rules/components/transpiler-logic.mdc`

## Common Agent Tasks

### 1. Adding String Transformation Features (4-6 minutes)

#### Task Checklist
- [ ] Identify string pattern to transform
- [ ] Add regex or parser logic
- [ ] Preserve location information
- [ ] Handle edge cases (escapes, nesting)
- [ ] Add comprehensive tests

#### Example: Adding Custom String Tag
```javascript
// In transpiler.mjs - add to string processing
export const transpiler = (code, options = {}) => {
  // Add custom tag processing
  if (options.customTags?.rhythm) {
    code = code.replace(
      /rhythm`([^`]+)`/g,
      (match, content, offset) => {
        const processed = options.customTags.rhythm(content);
        return options.simpleLocs 
          ? `${processed}.withLocation(${offset}, ${offset + match.length})`
          : processed;
      }
    );
  }
  
  // Continue with existing processing...
};

// In test file
it('processes rhythm tag', () => {
  const result = transpiler('rhythm`x..x..x.`', {
    customTags: {
      rhythm: (content) => `parseDrumPattern("${content}")`
    }
  });
  expect(result).toContain('parseDrumPattern("x..x..x.")');
});
```

### 2. Fixing Note Variable Detection (3-5 minutes)

#### Common Issues and Fixes
```javascript
// Issue: Note variables in object properties
// Input: { note: C3 }
// Should become: { note: "C3" }

// Fix in noteParser
export const noteParser = (code) => {
  // Existing regex for simple cases
  let parsed = code.replace(/\b([A-G]#?\d+)\b/g, (match, note, offset) => {
    // Check context - is it already in quotes?
    const before = code.substring(Math.max(0, offset - 10), offset);
    const after = code.substring(offset + match.length, offset + match.length + 10);
    
    if (before.match(/["']$/) || after.match(/^["']/)) {
      return match; // Already quoted
    }
    
    // Check if it's a property access
    if (before.match(/\.\s*$/)) {
      return match; // It's a method/property
    }
    
    return `"${match}"`;
  });
  
  return parsed;
};
```

### 3. Improving Location Tracking (4-5 minutes)

#### Enhanced Location Information
```javascript
// Add source map style locations
export const stringParser = (code, options) => {
  return code.replace(/"([^"\\]*(\\.[^"\\]*)*)"/gm, (match, str, _, offset) => {
    const lines = code.substring(0, offset).split('\n');
    const line = lines.length;
    const column = lines[lines.length - 1].length;
    
    if (options.sourceMap) {
      return `mini(${match}).withLocation({
        offset: ${offset},
        length: ${match.length},
        line: ${line},
        column: ${column}
      })`;
    }
    
    // Standard location format
    return `mini(${match}).withMiniLocation(${offset}, ${offset + match.length})`;
  });
};
```

### 4. Adding Auto-Import Detection (5-7 minutes)

#### Smart Import Addition
```javascript
// Detect used functions and add imports
export const addAutoImports = (code) => {
  const usedFunctions = new Set();
  
  // Pattern functions used
  const patternFuncs = ['note', 's', 'n', 'fast', 'slow', 'rev'];
  patternFuncs.forEach(func => {
    if (code.match(new RegExp(`\\b${func}\\s*\\(`))) {
      usedFunctions.add(func);
    }
  });
  
  if (usedFunctions.size === 0) return code;
  
  // Generate import statement
  const imports = Array.from(usedFunctions).join(', ');
  return `import { ${imports} } from '@strudel/core';\n${code}`;
};

// Test
it('adds necessary imports', () => {
  const code = 'note("c3").fast(2)';
  const result = addAutoImports(code);
  expect(result).toContain('import { note, fast }');
});
```

## Testing Strategies

### Unit Test Patterns
```javascript
describe('transpiler', () => {
  // Test basic transformations
  it('converts double quotes to mini', () => {
    expect(transpiler('"c3 e3"')).toContain('mini("c3 e3")');
  });
  
  // Test location preservation
  it('adds location tracking', () => {
    const result = transpiler('"test"', { simpleLocs: true });
    expect(result).toMatch(/withMiniLocation\(\d+,\s*\d+\)/);
  });
  
  // Test note variables
  it('quotes note variables', () => {
    expect(transpiler('note(C3)')).toBe('note("C3")');
  });
  
  // Test edge cases
  it('handles escaped quotes', () => {
    expect(transpiler('"say \\"hello\\""')).toContain('\\"hello\\"');
  });
});
```

### Integration Testing
```javascript
// Test with actual pattern evaluation
it('transpiled code evaluates correctly', async () => {
  const code = '"c3 e3".fast(2)';
  const transpiled = transpiler(code);
  
  // Would need actual evaluation context
  // const pattern = await evaluate(transpiled);
  // expect(pattern.firstCycle().length).toBe(2);
});
```

## Common Validation Errors

### 1. Regex Escaping Issues
```
Error: Invalid regular expression
Fix: Properly escape special characters in regex patterns
```

### 2. Location Offset Errors
```
Error: Location points outside string bounds
Fix: Ensure offset calculations account for transformations
```

### 3. Quote Mismatch
```
Error: Unterminated string constant
Fix: Handle nested quotes and escapes properly
```

### 4. Breaking Existing Code
```
Test failure: Existing patterns fail
Fix: Ensure backward compatibility with all transformations
```

## Performance Considerations

### Optimization Strategies
1. **Single Pass Processing**: Combine transformations when possible
2. **Regex Optimization**: Use non-greedy matches, avoid backtracking
3. **Early Returns**: Skip processing if no transformations needed
4. **Cache Compiled Regexes**: Store frequently used patterns

### Benchmarks
```bash
# Run transpiler benchmarks
pnpm bench -- --grep "transpiler"
```

Target performance:
- Simple code: < 1ms
- Complex code (1000 lines): < 10ms
- With location tracking: < 15ms

## Integration Points

### With REPL
```javascript
// REPL uses transpiler before evaluation
const userCode = getEditorContent();
const transpiled = transpiler(userCode, {
  wrapAsync: true,
  addReturn: true,
  simpleLocs: false
});
const pattern = await evaluate(transpiled);
```

### With Error Reporting
```javascript
// Location info helps highlight errors
try {
  evaluate(transpiled);
} catch (error) {
  const location = error.location;
  highlightEditor(location.start, location.end);
}
```

## Transpiler Architecture

### Processing Pipeline
1. **Custom Tags**: Process special template tags
2. **String Conversion**: Double quotes → mini()
3. **Note Variables**: C3, D#4 → "C3", "D#4"
4. **Location Tracking**: Add position information
5. **Auto Return**: Add return to last expression
6. **Async Wrapping**: Wrap in async if needed

### Extension Points
```javascript
// Options allow customization
{
  customTags: {
    // Add new template tag processors
  },
  preprocessors: [
    // Add code preprocessors
  ],
  postprocessors: [
    // Add post-transformation processors
  ]
}
```

## Quick Debug Commands

```bash
# Test specific transformation
echo '"c3 e3".fast(2)' | node -e "
  import {transpiler} from './transpiler.mjs';
  const input = require('fs').readFileSync(0, 'utf-8');
  console.log(transpiler(input.trim()));
"

# Check all test cases
pnpm vitest run test/transpiler.test.mjs

# Debug with verbose output
DEBUG=transpiler pnpm test
```

## When to Escalate

Escalate to human review if:
- Major changes to transformation logic
- New syntax features that affect parsing
- Performance regression > 10%
- Breaking changes to transpiler API
- Complex AST manipulation needed

Remember: The transpiler enables Strudel's user-friendly syntax. Keep transformations predictable and well-tested!