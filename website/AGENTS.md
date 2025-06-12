# AGENTS.md - Website & REPL

Specialized guidance for AI agents working on the Strudel website and REPL. This package provides the user interface and interactive environment.

## Quick Start (2 minute validation)

```bash
# From project root (website needs full context)
pnpm dev  # Starts dev server on localhost:3000

# Quick checks from website directory
cd website
pnpm astro check  # TypeScript validation
```

## Website Package Context

### Purpose
The Strudel website including the interactive REPL, documentation, and examples. Built with Astro and React.

### Key Directories
- `src/pages/` - Astro pages (routing)
- `src/components/` - React components
- `src/repl/` - REPL implementation
- `src/docs/` - Documentation content
- `public/` - Static assets
- `astro.config.mjs` - Astro configuration

### Key Technologies
- **Astro** - Static site generator
- **React** - UI components
- **CodeMirror** - Code editor
- **Tailwind CSS** - Styling
- **Web Workers** - Pattern evaluation

### References
- Global: `/claude/workflows/adding-features.md`
- Components: `/packages/codemirror/CLAUDE.md`
- UI: `/packages/draw/CLAUDE.md`

## Common Agent Tasks

### 1. Adding REPL UI Features (6-8 minutes)

#### Task Checklist
- [ ] Identify component location
- [ ] Add UI with React/Tailwind
- [ ] Connect to REPL state
- [ ] Test interaction
- [ ] Verify responsive design

#### Example: Adding a Tempo Slider
```jsx
// In src/repl/components/TempoSlider.jsx
import React from 'react';
import { useRepl } from '../hooks/useRepl';

export function TempoSlider() {
  const { tempo, setTempo } = useRepl();
  
  return (
    <div className="flex items-center gap-2 p-2">
      <label className="text-sm text-gray-600 dark:text-gray-400">
        Tempo
      </label>
      <input
        type="range"
        min="20"
        max="300"
        value={tempo}
        onChange={(e) => setTempo(Number(e.target.value))}
        className="flex-1"
      />
      <span className="text-sm font-mono w-12 text-right">
        {tempo}
      </span>
    </div>
  );
}

// Add to src/repl/Repl.jsx
import { TempoSlider } from './components/TempoSlider';

// In the toolbar section
<div className="toolbar">
  <TempoSlider />
  {/* other controls */}
</div>
```

### 2. Adding Documentation Pages (4-6 minutes)

#### Using Astro for Docs
```astro
---
// src/pages/learn/new-topic.astro
import Layout from '../../layouts/Layout.astro';
import { Code } from '../../components/Code';
---

<Layout title="New Topic - Strudel">
  <div class="prose max-w-none">
    <h1>New Topic</h1>
    
    <p>Introduction to the topic...</p>
    
    <h2>Basic Usage</h2>
    <Code client:load code={`
// Live example
"c3 e3 g3".fast(2)
    `} />
    
    <h2>Advanced Patterns</h2>
    <Code client:load code={`
stack(
  "bd*2",
  "~ sd",
  "hh*8".gain(0.3)
)
    `} />
  </div>
</Layout>
```

### 3. Fixing REPL Bugs (5-7 minutes)

#### Common Issues and Fixes

1. **State Synchronization**
   ```javascript
   // ❌ Bug: State out of sync
   const [code, setCode] = useState(initialCode);
   
   // ✅ Fix: Use REPL context
   const { code, setCode } = useRepl();
   ```

2. **CodeMirror Integration**
   ```javascript
   // ❌ Bug: Editor doesn't update
   useEffect(() => {
     editor.setValue(code);
   }, [code]);
   
   // ✅ Fix: Use CodeMirror transactions
   useEffect(() => {
     if (editor && editor.state.doc.toString() !== code) {
       editor.dispatch({
         changes: {
           from: 0,
           to: editor.state.doc.length,
           insert: code
         }
       });
     }
   }, [code, editor]);
   ```

3. **Web Worker Communication**
   ```javascript
   // ❌ Bug: Pattern evaluation blocks UI
   const pattern = evaluate(code);
   
   // ✅ Fix: Use worker
   worker.postMessage({ type: 'evaluate', code });
   worker.onmessage = (e) => {
     if (e.data.type === 'pattern') {
       setPattern(e.data.pattern);
     }
   };
   ```

### 4. Improving Performance (5-8 minutes)

#### Performance Checklist
- [ ] Lazy load heavy components
- [ ] Memoize expensive computations
- [ ] Optimize re-renders
- [ ] Use virtual scrolling for long lists

#### Example Optimizations
```jsx
// Lazy load visualization
const Pianoroll = React.lazy(() => 
  import('./components/Pianoroll')
);

// Memoize pattern analysis
const patternInfo = useMemo(() => {
  if (!pattern) return null;
  return {
    events: pattern.firstCycle().length,
    duration: pattern.duration,
    // ... expensive calculations
  };
}, [pattern]);

// Prevent unnecessary renders
const EditorPanel = React.memo(({ code, onChange }) => {
  // Component only re-renders if props change
  return <Editor value={code} onChange={onChange} />;
});
```

## REPL Architecture

### Component Structure
```
Repl.jsx                 # Main REPL container
├── EditorPanel.jsx      # Code editor
├── ControlPanel.jsx     # Play/stop, settings
├── VisualizerPanel.jsx  # Pattern visualization
└── ConsolePanel.jsx     # Error/log output

hooks/
├── useRepl.js          # REPL state management
├── usePattern.js       # Pattern evaluation
└── useAudio.js         # Web Audio integration
```

### State Management
```javascript
// REPL Context provides:
{
  code: string,           // Current code
  setCode: function,      // Update code
  pattern: Pattern,       // Evaluated pattern
  isPlaying: boolean,     // Playback state
  error: Error | null,    // Evaluation errors
  logs: Array,           // Console output
  settings: {            // User preferences
    theme: 'dark',
    fontSize: 14,
    // ...
  }
}
```

## Styling Guidelines

### Using Tailwind CSS
```jsx
// Follow existing patterns
<div className="flex flex-col h-full">
  <header className="border-b border-gray-200 dark:border-gray-700 p-4">
    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
      Title
    </h1>
  </header>
  
  <main className="flex-1 overflow-auto p-4">
    {/* Content */}
  </main>
</div>

// Dark mode support
<button className="
  bg-white dark:bg-gray-800 
  text-gray-900 dark:text-white
  hover:bg-gray-100 dark:hover:bg-gray-700
">
  Click me
</button>
```

### Component Patterns
```jsx
// Consistent spacing
const spacing = {
  xs: 'p-1',
  sm: 'p-2',
  md: 'p-4',
  lg: 'p-6'
};

// Consistent colors
const colors = {
  primary: 'text-blue-600 dark:text-blue-400',
  secondary: 'text-gray-600 dark:text-gray-400',
  error: 'text-red-600 dark:text-red-400'
};
```

## Testing Website Features

### Component Testing
```javascript
// Using React Testing Library
import { render, fireEvent } from '@testing-library/react';
import { TempoSlider } from './TempoSlider';

test('updates tempo on change', () => {
  const setTempo = jest.fn();
  const { getByRole } = render(
    <TempoSlider tempo={120} setTempo={setTempo} />
  );
  
  const slider = getByRole('slider');
  fireEvent.change(slider, { target: { value: '140' } });
  
  expect(setTempo).toHaveBeenCalledWith(140);
});
```

### E2E Testing Approach
```javascript
// Manual testing checklist
// 1. Start dev server: pnpm dev
// 2. Test pattern evaluation
// 3. Test play/stop
// 4. Test visualizations
// 5. Test error handling
// 6. Test examples loading
// 7. Test share functionality
```

## Build and Deployment

### Build Process
```bash
# Build website
pnpm build

# Preview production build
pnpm preview

# Check for issues
pnpm astro check
```

### Performance Metrics
- Lighthouse score > 90
- First paint < 1s
- Interactive < 3s
- Bundle size < 500KB (excluding samples)

## Common Validation Errors

### 1. TypeScript Errors
```
Error: Property 'pattern' does not exist
Fix: Add proper type definitions or use @ts-ignore sparingly
```

### 2. Build Failures
```
Error: Cannot find module '@strudel/core'
Fix: Ensure pnpm i was run at root level
```

### 3. Hydration Mismatches
```
Error: Hydration failed
Fix: Ensure server and client render same content
Use client:only for dynamic components
```

### 4. Asset Loading
```
Error: Failed to load samples
Fix: Check public/ directory and paths
Ensure correct base URL in production
```

## Quick Debug Commands

```bash
# Check TypeScript
pnpm astro check

# Analyze bundle
pnpm build
pnpm analyze

# Test specific page
pnpm dev
# Navigate to http://localhost:3000/path

# Clear cache
rm -rf .astro
pnpm dev
```

## When to Escalate

Escalate to human review if:
- Major UI/UX changes
- New visualization types
- Authentication/user features
- Performance degradation
- Accessibility concerns
- SEO modifications

Remember: The website is the face of Strudel. Ensure changes are polished and tested across browsers!