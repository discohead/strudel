# CLAUDE.md - @strudel/transpiler

This file provides guidance to Claude Code when working with the transpiler package.

## Package Purpose

`@strudel/transpiler` transforms user JavaScript code to add Strudel-specific features:
- Converts double-quoted strings to mini notation patterns
- Adds location tracking for pattern highlighting
- Transforms pseudo note variables (C3, D#4) to strings
- Auto-returns the last expression
- Wraps code for async execution when needed
- Makes pattern methods available as global functions

## Key APIs and Functions

### Main Transpiler Function
```javascript
import { transpiler } from '@strudel/transpiler';

// Transform code with options
const transpiled = transpiler(code, {
  wrapAsync: true,      // Wrap in async function
  addReturn: true,      // Add return to last expression
  simpleLocs: false,    // Add location tracking
  /*
  // Custom tag processing (like midiIn)
  customTags: {
    midiIn: (input) => { channel, ...args }
  },
  */
});
```

### Helper Functions
- `transpiler(code, options)` - Main transformation
- `stringParser` - Parse quoted strings to mini
- `noteParser` - Convert note variables
- `isNoteWithOctave(name)` - Check if valid note
- `correctNumbers(vars)` - Handle negative numbers

## Common Usage Patterns

### Basic Transformation
```javascript
// Input code
const userCode = `note("c3 e3 g3").fast(2)`;

// Transpile
const transpiled = transpiler(userCode);
// Output: mini("c3 e3 g3").withMiniLocation(5,15).note().fast(2)
```

### Note Variable Transformation
```javascript
// Input with note variables
const code = `stack(C3, E3, G3).s("piano")`;

// After transpiling
// stack("C3", "E3", "G3").s("piano")
```

### Location Tracking
```javascript
// With location tracking
transpiler('"c3 e3"', { simpleLocs: true });
// mini("c3 e3").withMiniLocation(0, 7)

// Location helps with highlighting errors
```

### Auto-Return
```javascript
// Input
const code = `
  const melody = note("c3 e3");
  melody.fast(2)
`;

// Transpiled (with return added)
const code = `
  const melody = mini("c3 e3").note();
  return melody.fast(2)
`;
```

## Development Guidelines

### Adding Transformations
1. Modify the appropriate parser function
2. Update tests for new transformations
3. Ensure backwards compatibility
4. Document any new options

### Parser Structure
```javascript
// String detection and transformation
export const stringParser = (code, options) => {
  // Find double-quoted strings
  // Convert to mini() calls
  // Add location tracking
};

// Note variable detection
export const noteParser = (code) => {
  // Find note-like variables (C3, D#4, etc)
  // Wrap in quotes
  // Handle edge cases
};
```

### Working with Locations
```javascript
// Location format: withMiniLocation(start, end)
// Used for:
// - Error highlighting
// - Interactive selection
// - Pattern visualization
```

## Testing Requirements

### Test Location
Tests are in `/test/transpiler.test.mjs`

### Test Categories
```javascript
describe('transpiler', () => {
  describe('string parsing', () => {
    // Test mini notation conversion
  });
  
  describe('note variables', () => {
    // Test note parsing
  });
  
  describe('auto return', () => {
    // Test return statement addition
  });
  
  describe('location tracking', () => {
    // Test location accuracy
  });
});
```

### Edge Cases to Test
```javascript
// Complex strings
test('nested quotes', () => {
  transpiler(`"a 'b' c"`);
});

// Note variables in different contexts
test('notes in arrays', () => {
  transpiler(`[C3, D3, E3]`);
});

// Return statement logic
test('no return for declarations', () => {
  transpiler(`const x = 5`);
});
```

## Dependencies and Relationships

### Dependencies
- No runtime dependencies
- Uses regex-based parsing

### Used By
- `@strudel/repl` - Transpiles user code
- `@strudel/web` - Web-based environments
- `evaluate()` function in core

### Integration Points
- Works with `@strudel/mini` for pattern parsing
- Coordinates with `@strudel/core` for evaluation
- Enables syntax sugar throughout system

## Common Pitfalls

### String Parsing Edge Cases
```javascript
// Escaped quotes
'"hello \\"world\\""'  // Handle escapes

// Template literals (not converted)
`hello ${world}`       // Left as-is

// Single quotes (not converted)
'not converted'        // Only double quotes
```

### Note Variable Conflicts
```javascript
// Real variables vs notes
const C3 = 60;    // Real variable
C3.fast(2);       // Should NOT be quoted

// Context matters
play(C3);         // Should be quoted
play(myC3);       // Should NOT be quoted
```

### Return Statement Logic
```javascript
// Don't add return to:
// - Variable declarations
// - Function declarations  
// - Import statements
// - Statements that already return

// Do add return to:
// - Last expression
// - Pattern chains
```

## Integration Examples

### With REPL
```javascript
// REPL flow
userCode → transpiler → evaluate → pattern → scheduler

// Example REPL usage
const transpiled = transpiler(userInput, {
  wrapAsync: true,
  addReturn: true
});
const pattern = await evaluate(transpiled);
```

### With Error Handling
```javascript
// Location tracking helps with errors
try {
  const pattern = evaluate(transpiled);
} catch (error) {
  // Use location to highlight problem area
  const location = extractLocation(error);
  highlightCode(location.start, location.end);
}
```

### Custom Extensions
```javascript
// Add custom tag processor
const options = {
  customTags: {
    midiIn: (content) => {
      // Custom MIDI input handling
      return `processMidi(${content})`;
    }
  }
};
```

## Transpiler Options Reference

### Standard Options
```javascript
{
  wrapAsync: true,     // Wrap in async function
  addReturn: true,     // Add return statement
  simpleLocs: false,   // Simple location format
  customTags: {},      // Custom tag processors
}
```

### Location Format
```javascript
// Standard format
.withMiniLocation(start, end)

// Simple format (simpleLocs: true)
.withMiniLocation(start, end)
```

### Tag Processing
```javascript
// Built-in: double quotes → mini
"pattern" → mini("pattern")

// Custom tags
customTags: {
  tagName: (content) => `process(${content})`
}
```

## Performance Considerations

- Transpilation happens once per code change
- Regex-based parsing is fast but limited
- No AST manipulation (keeps it simple)
- Minimal overhead for runtime execution

## Future Considerations

- Potential AST-based parsing for complex transforms
- Source map support for better debugging
- More sophisticated note variable detection
- Integration with TypeScript