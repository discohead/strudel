# Transpiler System Deep Dive

## Overview
The Strudel transpiler transforms user code with syntax sugar into valid JavaScript, enabling features like automatic mini notation parsing and widget injection.

## Architecture

### Core Components
```javascript
// Main transpiler function
export function transpiler(input, options = {}) {
  const { 
    wrapAsync = false,      // Wrap in async IIFE
    addReturn = true,       // Add return statement
    emitMiniLocations = true, // Track mini notation locations
    emitWidgets = true      // Extract widget info
  } = options;
  
  // Parse to AST
  let ast = parse(input, {
    ecmaVersion: 2022,
    allowAwaitOutsideFunction: true,
    locations: true,
  });
  
  // Transform AST
  walk(ast, visitors);
  
  // Generate code
  return escodegen.generate(ast);
}
```

## Syntax Transformations

### String to Mini Notation
```javascript
// Input
"c3 e3 g3"
`c3 e3 g3`

// Transformed to
m("c3 e3 g3", 0)  // With location offset
```

### Implementation:
```javascript
function isStringWithDoubleQuotes(node) {
  return node.type === 'Literal' && node.raw[0] === '"';
}

function miniWithLocation(value, node) {
  const { start: fromOffset } = node;
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'm',  // mini() function
    },
    arguments: [
      { type: 'Literal', value },
      { type: 'Literal', value: fromOffset },
    ],
  };
}
```

### Slider Widget Injection
```javascript
// Input
note(slider(60, 0, 127))

// Transformed to
note(sliderWithID('slider_123', 60, 0, 127))
```

### Widget Detection:
```javascript
function isSliderFunction(node) {
  return node.type === 'CallExpression' && 
         node.callee.name === 'slider';
}

function sliderWithLocation(node) {
  const id = 'slider_' + node.arguments[0].start;
  
  return {
    type: 'CallExpression',
    callee: {
      type: 'Identifier',
      name: 'sliderWithID',
    },
    arguments: [
      { type: 'Literal', value: id },
      ...node.arguments
    ],
  };
}
```

## AST Walking

### Visitor Pattern
```javascript
walk(ast, {
  enter(node, parent) {
    // Transform on entry
    if (isBackTickString(node, parent)) {
      this.skip(); // Don't traverse children
      return this.replace(miniWithLocation(node.quasi.quasis[0].value.raw, node));
    }
  },
  leave(node, parent) {
    // Transform on exit (rarely used)
  }
});
```

### Node Types Handled
1. **TemplateLiteral** - Backtick strings
2. **Literal** - Double-quoted strings
3. **CallExpression** - Function calls (widgets)
4. **TaggedTemplateExpression** - Special handling for h\`\`
5. **LabeledStatement** - Label to pattern conversion

## Location Tracking

### Mini Notation Locations
```javascript
const collectMiniLocations = (value, node) => {
  const leafLocs = getLeafLocations(`"${value}"`, node.start, input);
  miniLocations = miniLocations.concat(leafLocs);
};

// Result structure
{
  value: "c3",
  start: 10,
  end: 12,
  line: 1,
  column: 10
}
```

### Widget Locations
```javascript
widgets.push({
  from: node.arguments[0].start,
  to: node.arguments[0].end,
  value: node.arguments[0].raw,
  min: node.arguments[1]?.value ?? 0,
  max: node.arguments[2]?.value ?? 1,
  step: node.arguments[3]?.value,
  type: 'slider',
});
```

## Special Transformations

### Haskell String Support
```javascript
// Input
h`[bd sd, hh*4]`

// Detection
function isTidalTemplateLiteral(node) {
  return node.type === 'TaggedTemplateExpression' &&
         node.tag.name === 'h';
}

// Transform to
tidal(`[bd sd, hh*4]`, offset)
```

### Sample Loading
```javascript
// Input
samples('github:user/repo')

// Transformed to
await samples('github:user/repo')
```

### Label Statements
```javascript
// Input
mypattern: "c3 e3 g3"

// Transformed to
const mypattern = m("c3 e3 g3", 0)
```

## Integration with CodeMirror

### Syntax Highlighting
```javascript
// Locations used for highlighting
miniLocations.forEach(loc => {
  editor.addHighlight({
    from: loc.start,
    to: loc.end,
    class: 'mini-notation'
  });
});
```

### Widget Rendering
```javascript
// Widget info passed to editor
widgets.forEach(widget => {
  editor.addWidget({
    pos: widget.from,
    widget: createSliderWidget(widget),
  });
});
```

## Error Handling

### Parse Errors
```javascript
try {
  ast = parse(input, options);
} catch (error) {
  return {
    error: {
      message: error.message,
      line: error.loc?.line,
      column: error.loc?.column,
    }
  };
}
```

### Transform Errors
```javascript
walk(ast, {
  enter(node) {
    try {
      // Transform logic
    } catch (error) {
      console.error('Transform error:', error);
      // Continue with original node
    }
  }
});
```

## Output Generation

### Return Statement Addition
```javascript
// Add return to last expression
if (addReturn) {
  const { expression } = body[body.length - 1];
  body[body.length - 1] = {
    type: 'ReturnStatement',
    argument: expression,
  };
}
```

### Async Wrapper
```javascript
if (wrapAsync) {
  output = `(async ()=>{${output}})()`;
}
```

## Extension Points

### Custom Widgets
```javascript
// Register new widget type
registerWidgetType('knob');

// Will detect: pattern.knob()
```

### Custom Transformations
```javascript
// Add to visitor
if (isCustomSyntax(node)) {
  return this.replace(transformCustomSyntax(node));
}
```

## Performance Considerations

### AST Caching
```javascript
// Cache parsed ASTs for repeated evaluation
const astCache = new Map();

function getCachedAST(code) {
  if (!astCache.has(code)) {
    astCache.set(code, parse(code, options));
  }
  return astCache.get(code);
}
```

### Minimal Transformations
- Only transform what's necessary
- Skip traversal when possible
- Batch similar transformations

## Testing the Transpiler

### Unit Tests
```javascript
import { transpiler } from '@strudel/transpiler';

it('transforms double-quoted strings', () => {
  const { output } = transpiler('"c3 e3 g3"');
  expect(output).toContain('m("c3 e3 g3", 0)');
});

it('injects widget IDs', () => {
  const { output, widgets } = transpiler('slider(60)');
  expect(output).toContain('sliderWithID');
  expect(widgets).toHaveLength(1);
});
```

### Integration Tests
```javascript
it('full transformation', () => {
  const code = `
    "c3 e3 g3".fast(2)
    .gain(slider(0.5, 0, 1))
    .s("piano")
  `;
  
  const { output, miniLocations, widgets } = transpiler(code);
  
  expect(miniLocations).toHaveLength(1);
  expect(widgets).toHaveLength(1);
  expect(output).toMatchSnapshot();
});
```

## Common Patterns

### Multi-line Patterns
```javascript
// Input
stack(
  "c3 e3 g3",
  "c4 e4 g4"
)

// Each string transformed independently
stack(
  m("c3 e3 g3", 10),
  m("c4 e4 g4", 25)
)
```

### Nested Widgets
```javascript
// Input
gain(slider(0.5).range(0, 1))

// Widgets extracted recursively
```

### Method Chaining
```javascript
// Preserved through transformation
"c3 e3"
  .fast(2)
  .gain(slider(0.5))
  .s("piano")
```