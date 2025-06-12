# CLAUDE.md - @strudel/codemirror

This file provides guidance to Claude Code when working with the CodeMirror editor integration.

## Package Purpose

`@strudel/codemirror` provides a customized CodeMirror 6 editor for Strudel:
- Syntax highlighting for JavaScript and mini notation
- Auto-completion for Strudel functions
- Pattern highlighting and flash animations
- Custom key bindings (Ctrl+Enter to evaluate)
- Multiple color themes
- Interactive widgets (sliders, number scrubbers)
- Error highlighting and tooltips

## Key APIs and Functions

### Main Setup Function
```javascript
import { strudel } from '@strudel/codemirror';

// Create Strudel-enhanced editor
const editor = strudel({
  initialCode: 'note("c3 e3 g3")',
  theme: 'algoboy',
  fontSize: 16,
  ctx: audioContext,
  onEvaluate: (code) => {
    // Handle code evaluation
  },
  onHush: () => {
    // Handle stop/hush
  },
  beforeEvaluate: () => {
    // Pre-evaluation hook
  },
  afterEvaluate: ({ code, pattern, error }) => {
    // Post-evaluation hook
  },
  theme: 'github-dark',
  activateLineNumbers: true
});
```

### Highlighting System
```javascript
import { highlightMiniLocations, highlightError } from '@strudel/codemirror';

// Highlight mini notation patterns
highlightMiniLocations(view, locations, pattern);

// Highlight error location  
highlightError(view, error, code);

// Flash active patterns
flash(view, pattern, haps);
```

### Interactive Widgets
```javascript
import { slider, scrubber } from '@strudel/codemirror';

// Number slider: 0.5{0,1,0.1}
// Creates draggable slider widget

// Number scrubber: click and drag on numbers
// Modifies values interactively
```

## Common Usage Patterns

### Basic Editor Setup
```javascript
// Minimal setup
const view = strudel({
  initialCode: '"c3 e3 g3"',
  onEvaluate: async (code) => {
    const pattern = await evaluate(code);
    return pattern;
  }
});
```

### Custom Theme
```javascript
// Use built-in theme
const view = strudel({ theme: 'algoboy' });

// Available themes:
// algoboy, androidstudio, aura, dracula, github-dark,
// github-light, gruvbox-dark, material-dark, nord,
// sublime, terminal, tokyo-night, vscode-dark, etc.
```

### Pattern Highlighting
```javascript
// Patterns with location info get highlighted
mini('"c3 e3"').withMiniLocation(5, 12)

// Active notes flash during playback
// Errors highlight problematic code sections
```

### Keybindings
```javascript
// Default keybindings:
// Ctrl/Cmd + Enter: Evaluate code
// Ctrl/Cmd + .: Hush (stop)
// Ctrl/Cmd + S: Save (if configured)

// Custom keybinding
import { keybindings } from '@strudel/codemirror';
const customKeys = [
  ...keybindings,
  { key: 'Ctrl-r', run: myCustomCommand }
];
```

## Development Guidelines

### Adding Editor Features
1. Create new extension/facet
2. Add to strudel() configuration
3. Test with different themes
4. Ensure mobile compatibility

### CodeMirror Extension Pattern
```javascript
// Create extension
const myExtension = ViewPlugin.fromClass(
  class {
    constructor(view) {
      this.view = view;
    }
    
    update(update) {
      // Handle editor updates
    }
    
    destroy() {
      // Cleanup
    }
  }
);

// Add to editor
const extensions = [
  ...defaultExtensions,
  myExtension
];
```

### Widget Implementation
```javascript
// Create interactive widget
class MyWidget extends WidgetType {
  constructor(value) {
    super();
    this.value = value;
  }
  
  toDOM(view) {
    const dom = document.createElement('span');
    // Build widget UI
    return dom;
  }
}
```

## Testing Requirements

### Visual Testing
- Test all themes for readability
- Verify highlighting accuracy
- Check widget interactions
- Test on mobile devices

### Integration Testing
```javascript
// Test evaluation flow
test('evaluates code on Ctrl+Enter', async () => {
  const onEvaluate = jest.fn();
  const view = strudel({ onEvaluate });
  
  // Simulate keypress
  fireEvent.keyDown(view.dom, {
    key: 'Enter',
    ctrlKey: true
  });
  
  expect(onEvaluate).toHaveBeenCalled();
});
```

## Dependencies and Relationships

### CodeMirror 6 Packages
- `@codemirror/state` - Editor state management
- `@codemirror/view` - Editor view layer
- `@codemirror/language` - Language support
- `@codemirror/autocomplete` - Completions
- `@codemirror/commands` - Editor commands
- `@codemirror/theme` - Theme system

### Integration Points
- `@strudel/transpiler` - Code transformation
- `@strudel/core` - Pattern evaluation
- `@strudel/repl` - Used in REPL component

## Common Pitfalls

### Theme Compatibility
```javascript
// Some decorations may not work with all themes
// Test custom decorations with multiple themes

// Use theme-aware colors
const highlightColor = theme === 'dark' 
  ? 'rgba(255,255,255,0.1)' 
  : 'rgba(0,0,0,0.1)';
```

### Performance
```javascript
// Avoid excessive decorations
// Debounce frequent updates
let updateTimeout;
function scheduleUpdate() {
  clearTimeout(updateTimeout);
  updateTimeout = setTimeout(doUpdate, 100);
}

// Clean up old decorations
view.dispatch({
  effects: removeHighlight.of(null)
});
```

### Mobile Support
```javascript
// Touch interactions differ
// Test slider/scrubber on touch devices
// Consider larger touch targets

element.addEventListener('touchstart', handleTouch);
element.addEventListener('touchmove', handleTouch);
```

## Integration Examples

### With REPL
```javascript
// REPL uses codemirror
import { strudel } from '@strudel/codemirror';
import { evaluate } from '@strudel/transpiler';

const editor = strudel({
  onEvaluate: async (code) => {
    try {
      const pattern = await evaluate(code);
      // Schedule pattern playback
      return { pattern };
    } catch (error) {
      return { error };
    }
  }
});
```

### Custom Completions
```javascript
// Add Strudel-specific completions
const strudelCompletions = completeFromList([
  { label: 'note', type: 'function' },
  { label: 's', type: 'function' },
  { label: 'stack', type: 'function' },
  { label: 'sequence', type: 'function' },
  // ... more completions
]);
```

### Error Handling
```javascript
// Highlight errors with location info
afterEvaluate: ({ error, code }) => {
  if (error && error.location) {
    highlightError(view, error, code);
  }
}
```

## Theme Development

### Creating Custom Theme
```javascript
// Define theme
export const myTheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#1e1e1e',
    foreground: '#d4d4d4',
    selection: '#264f78',
    // ... more colors
  },
  styles: [
    { tag: t.keyword, color: '#569cd6' },
    { tag: t.string, color: '#ce9178' },
    // ... more syntax colors
  ]
});
```

### Theme Structure
```javascript
// Theme files in themes/
export const themeName = {
  name: 'Theme Name',
  author: 'Author Name',
  theme: createTheme({...}),
  settings: {
    // Additional settings
  }
};
```

## Widget Reference

### Slider Widget
```javascript
// Syntax: value{min,max,step}
"0.5{0,1,0.1}".gain() // Creates slider 0-1

// Features:
// - Drag to change value
// - Shift+drag for fine control
// - Updates code in real-time
```

### Number Scrubber
```javascript
// Any number becomes draggable
note(60).s("piano") // Drag on 60 to change

// Features:
// - Horizontal drag changes value
// - Shift+drag for smaller increments
// - Works on integers and decimals
```

## Editor Commands

### Built-in Commands
- `evaluate` - Run current code
- `hush` - Stop all sounds
- `toggleComment` - Comment/uncomment
- `save` - Save (if handler provided)

### Custom Commands
```javascript
// Add custom command
const myCommand = (view) => {
  // Command implementation
  return true; // Handled
};

// Register with keybinding
{ key: 'Ctrl-m', run: myCommand }