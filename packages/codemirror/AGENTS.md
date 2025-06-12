# AGENTS.md - @strudel/codemirror

Quick reference for AI agents working with the CodeMirror editor integration.

## Quick Start

```javascript
// Validation steps:
// 1. Create basic editor
import { strudel } from '@strudel/codemirror';

const view = strudel({
  initialCode: 'note("c3 e3 g3")',
  theme: 'github-dark'
});

// 2. Test evaluation
// Press Ctrl/Cmd + Enter in editor

// 3. Check highlighting
// Mini notation should be highlighted

// 4. Test widgets
// Try: gain(0.5{0,1,0.1})
// Slider should appear
```

## Package Context

**Purpose**: CodeMirror 6 editor for Strudel
- Syntax highlighting for JS and mini notation
- Auto-completion for functions
- Interactive widgets (sliders, scrubbers)
- Pattern highlighting and animations
- Custom keybindings

**Key Files**:
- `index.mjs` - Main strudel() function
- `themes/*.mjs` - Color themes
- `widgets/*.mjs` - Interactive widgets
- `highlight.mjs` - Pattern highlighting

**References**:
- [CLAUDE.md](./CLAUDE.md) - Full package guide
- [CodeMirror 6 Docs](https://codemirror.net/6/) - CM6 reference
- [REPL Integration](../repl/CLAUDE.md) - How REPL uses this

## Common Agent Tasks

### 1. Add Custom Theme
```javascript
// Create new theme file: themes/mytheme.mjs
import { createTheme } from '../utils';
import { tags as t } from '@lezer/highlight';

export const mytheme = createTheme({
  theme: 'dark',
  settings: {
    background: '#1a1a1a',
    foreground: '#e0e0e0',
    selection: '#3d3d3d',
    cursor: '#ffffff',
    lineHighlight: '#2a2a2a'
  },
  styles: [
    { tag: t.keyword, color: '#ff79c6' },
    { tag: t.string, color: '#f1fa8c' },
    { tag: t.comment, color: '#6272a4' },
    { tag: t.number, color: '#bd93f9' },
    { tag: t.function(t.variableName), color: '#50fa7b' }
  ]
});

// Add to theme list in index.mjs
import { mytheme } from './themes/mytheme.mjs';

const themes = {
  // ... existing themes
  mytheme
};
```

### 2. Implement Custom Widget
```javascript
// Create interactive widget for pattern selection
// Example: Pattern picker widget

import { WidgetType } from '@codemirror/view';
import { syntaxTree } from '@codemirror/language';

class PatternPickerWidget extends WidgetType {
  constructor(patterns) {
    super();
    this.patterns = patterns;
  }
  
  toDOM(view) {
    const select = document.createElement('select');
    select.className = 'pattern-picker';
    
    this.patterns.forEach(p => {
      const option = document.createElement('option');
      option.value = p;
      option.textContent = p;
      select.appendChild(option);
    });
    
    select.onchange = () => {
      // Replace widget with selected pattern
      const pos = view.posAtDOM(select);
      view.dispatch({
        changes: { from: pos, to: pos + 1, insert: select.value }
      });
    };
    
    return select;
  }
}

// Decorator to insert widget
const patternPickerDecorator = ViewPlugin.fromClass(class {
  decorations = Decoration.none;
  
  constructor(view) {
    this.decorations = this.buildDecorations(view);
  }
  
  update(update) {
    if (update.docChanged || update.viewportChanged) {
      this.decorations = this.buildDecorations(update.view);
    }
  }
  
  buildDecorations(view) {
    const widgets = [];
    // Find pattern picker syntax: @{bd,sd,cp}
    // Add widget decorations
    return Decoration.set(widgets);
  }
});
```

### 3. Add Auto-completion
```javascript
// Add Strudel-specific completions
import { completeFromList } from '@codemirror/autocomplete';

const strudelFunctions = [
  { label: 'note', type: 'function', info: 'Play musical notes' },
  { label: 's', type: 'function', info: 'Play samples' },
  { label: 'stack', type: 'function', info: 'Layer patterns' },
  { label: 'sequence', type: 'function', info: 'Sequential patterns' },
  { label: 'fast', type: 'method', info: 'Speed up pattern' },
  { label: 'slow', type: 'method', info: 'Slow down pattern' },
  { label: 'rev', type: 'method', info: 'Reverse pattern' },
  { label: 'struct', type: 'method', info: 'Apply structure' }
];

const strudelCompletions = completeFromList(strudelFunctions);

// Add to editor extensions
const extensions = [
  autocompletion({ override: [strudelCompletions] })
];
```

### 4. Fix Highlighting Issues
```javascript
// Problem: Mini notation not highlighted correctly
// Solution: Update highlighting locations

// In highlight.mjs
export function highlightMiniLocations(view, locations, pattern) {
  const decorations = [];
  
  locations.forEach(loc => {
    // Ensure correct position mapping
    const from = Math.max(0, loc.start);
    const to = Math.min(view.state.doc.length, loc.end);
    
    if (from < to) {
      decorations.push(
        Decoration.mark({
          class: 'mini-notation',
          attributes: { 'data-pattern': pattern }
        }).range(from, to)
      );
    }
  });
  
  view.dispatch({
    effects: setHighlights.of(decorations)
  });
}

// CSS for highlighting
.mini-notation {
  background-color: rgba(100, 200, 100, 0.2);
  border-bottom: 2px solid rgba(100, 200, 100, 0.5);
}
```

## Testing Strategies

```javascript
// Test theme application
test('applies custom theme', () => {
  const view = strudel({ theme: 'algoboy' });
  const themeClass = view.dom.className;
  expect(themeClass).toContain('algoboy');
});

// Test evaluation keybinding
test('evaluates on Ctrl+Enter', async () => {
  const onEvaluate = jest.fn();
  const view = strudel({ onEvaluate });
  
  // Simulate keypress
  const event = new KeyboardEvent('keydown', {
    key: 'Enter',
    ctrlKey: true
  });
  view.dom.dispatchEvent(event);
  
  expect(onEvaluate).toHaveBeenCalled();
});

// Test widget interaction
test('slider widget updates value', () => {
  const view = strudel({ initialCode: 'gain(0.5{0,1,0.1})' });
  const slider = view.dom.querySelector('.slider-widget');
  
  // Simulate drag
  fireEvent.mouseDown(slider);
  fireEvent.mouseMove(slider, { clientX: 100 });
  fireEvent.mouseUp(slider);
  
  const newCode = view.state.doc.toString();
  expect(newCode).not.toBe('gain(0.5{0,1,0.1})');
});

// Test highlighting
test('highlights pattern locations', () => {
  const view = strudel({});
  const locations = [{ start: 5, end: 10 }];
  
  highlightMiniLocations(view, locations);
  
  const marks = view.dom.querySelectorAll('.mini-notation');
  expect(marks.length).toBe(1);
});
```

## Common Validation Errors

### Theme Errors
```javascript
// Error: Theme not found
// Fix: Register theme in themes object
const themes = {
  algoboy,
  'github-dark': githubDark,
  // Add new theme here
};

// Error: Invalid theme colors
// Fix: Use valid CSS colors
settings: {
  background: '#1e1e1e',  // Valid hex
  foreground: 'rgb(212, 212, 212)',  // Valid rgb
}
```

### Widget Errors
```javascript
// Error: Widget not appearing
// Fix: Check decoration placement
const pos = view.posAtDOM(element);
if (pos >= 0 && pos <= view.state.doc.length) {
  // Safe to place widget
}

// Error: Widget interaction not working
// Fix: Add proper event handlers
widget.addEventListener('mousedown', e => {
  e.preventDefault();  // Prevent text selection
  startDrag(e);
});
```

### Highlighting Errors
```javascript
// Error: Decorations overlap
// Fix: Clear old decorations first
view.dispatch({
  effects: clearHighlights.of(null)
});

// Error: Flash animation stutters
// Fix: Use requestAnimationFrame
function flash() {
  requestAnimationFrame(() => {
    updateFlashDecorations();
  });
}
```

## Performance Considerations

### Decoration Management
```javascript
// Limit decoration count
const MAX_DECORATIONS = 1000;
let decorations = buildDecorations();
if (decorations.length > MAX_DECORATIONS) {
  decorations = decorations.slice(0, MAX_DECORATIONS);
}

// Debounce updates
let updateTimer;
function scheduleUpdate() {
  clearTimeout(updateTimer);
  updateTimer = setTimeout(doUpdate, 100);
}
```

### Widget Optimization
```javascript
// Reuse DOM elements
const widgetCache = new WeakMap();

toDOM(view) {
  if (widgetCache.has(this)) {
    return widgetCache.get(this);
  }
  const dom = createWidget();
  widgetCache.set(this, dom);
  return dom;
}
```

### Theme Performance
```javascript
// Use CSS variables for dynamic theming
:root {
  --background: #1e1e1e;
  --foreground: #d4d4d4;
}

// Avoid complex selectors
.cm-line.cm-activeLine {  // Good
  background: var(--lineHighlight);
}
```

## Integration Points

### With Transpiler
```javascript
// Editor provides code to transpiler
import { evaluate } from '@strudel/transpiler';

onEvaluate: async (code) => {
  const { pattern, error, meta } = await evaluate(code);
  
  // Highlight based on meta info
  if (meta.miniLocations) {
    highlightMiniLocations(view, meta.miniLocations);
  }
  
  return { pattern, error };
}
```

### With REPL
```javascript
// REPL creates editor instance
const editor = strudel({
  initialCode: settings.initialCode,
  theme: settings.theme,
  onEvaluate: handleEvaluate,
  onHush: handleHush
});

// REPL adds to DOM
container.appendChild(editor.dom);
```

### With Pattern System
```javascript
// Flash animations sync with pattern
const haps = pattern.queryArc(0, 1);
flash(view, pattern, haps);

// Error locations from pattern errors
if (error.location) {
  highlightError(view, error, code);
}
```

## Quick Debug Commands

```javascript
// Get editor state
console.log(view.state.doc.toString());
console.log(view.state.selection.main);

// List active extensions
console.log(view.state.facet(EditorView.exts));

// Check theme
console.log(view.dom.className);

// Inspect decorations
console.log(view.state.field(decorationField));

// Force update
view.dispatch({ changes: [] });

// Test highlighting
highlightMiniLocations(view, [{ start: 0, end: 10 }]);
```

## When to Escalate

Escalate to package maintainers when:

1. **CodeMirror Core**: Need to modify CM6 core behavior or fix upstream bugs
2. **Language Support**: Adding new language modes or parsers
3. **Mobile Issues**: Touch interaction problems that require architecture changes
4. **Performance**: Editor becomes slow with normal-sized documents
5. **Accessibility**: Screen reader or keyboard navigation issues

For pattern-related features, coordinate with @strudel/core.
For REPL integration issues, check @strudel/repl first.