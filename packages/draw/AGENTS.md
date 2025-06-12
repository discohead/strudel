# AGENTS.md - @strudel/draw

Quick reference for AI agents working with the visualization components package.

## Quick Start

```javascript
// Validation steps:
// 1. Import and test basic drawing
import { draw } from '@strudel/draw';

note("c3 e3 g3").draw((ctx, events) => {
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, 100, 100);
}); // Should show blue square

// 2. Test piano roll
note("c3 e3 g3").pianoroll();
// Should show piano roll visualization

// 3. Check animation
pattern.draw((ctx, events, time) => {
  ctx.fillText(`Time: ${time}`, 10, 20);
}); // Should show updating time

// 4. Verify active state
// Active notes should highlight during playback
```

## Package Context

**Purpose**: Visualization components for patterns
- Canvas-based drawing API
- Piano roll visualization
- Spiral/circular displays
- Animation utilities
- Color manipulation
- Pattern debugging

**Key Files**:
- `draw.mjs` - Main drawing API
- `pianoroll.mjs` - Piano roll component
- `spiral.mjs` - Spiral visualization
- `animate.mjs` - Animation helpers
- `color.mjs` - Color utilities

**References**:
- [CLAUDE.md](./CLAUDE.md) - Full package guide
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API) - Web Canvas reference
- [Pattern Viz Examples](../../website/src/pages/examples) - Visual examples

## Common Agent Tasks

### 1. Create Custom Visualization
```javascript
// Create a waveform visualization
// Shows pattern amplitude over time

export const waveform = (options = {}) => {
  const {
    height = 200,
    width = 800,
    color = 'green',
    lineWidth = 2
  } = options;
  
  return drawing((ctx, events, time) => {
    const { canvas } = ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Draw waveform
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    
    events.forEach((event, i) => {
      const x = (event.whole.begin % 1) * width;
      const amplitude = (event.value.gain || 0.5) * height / 2;
      const y = height / 2 - (event.active ? amplitude : 0);
      
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    // Draw playhead
    const playheadX = (time % 1) * width;
    ctx.strokeStyle = 'red';
    ctx.beginPath();
    ctx.moveTo(playheadX, 0);
    ctx.lineTo(playheadX, height);
    ctx.stroke();
  });
};

// Register on Pattern prototype
Pattern.prototype.waveform = function(options) {
  return this.draw(waveform(options));
};

// Usage:
s("bd sd").gain("0.8 0.5").waveform();
```

### 2. Add Interactive Features
```javascript
// Make visualization respond to mouse
// Example: Highlight notes on hover

export const interactivePianoroll = (options = {}) => {
  return drawing((ctx, events, time, mousePos) => {
    const { width, height } = ctx.canvas;
    
    // Standard piano roll drawing
    events.forEach(event => {
      const x = (event.whole.begin % 1) * width;
      const y = height - (event.value.note / 127) * height;
      const w = event.whole.duration * width;
      const h = height / 127;
      
      // Check if mouse is over this note
      const isHovered = mousePos &&
        mousePos.x >= x && mousePos.x <= x + w &&
        mousePos.y >= y && mousePos.y <= y + h;
      
      // Draw with hover effect
      ctx.fillStyle = isHovered ? 'yellow' : 
                     event.active ? 'red' : 'gray';
      ctx.fillRect(x, y, w, h);
      
      // Show info on hover
      if (isHovered) {
        ctx.fillStyle = 'black';
        ctx.font = '12px monospace';
        ctx.fillText(
          `Note: ${event.value.note}`,
          mousePos.x + 10,
          mousePos.y - 10
        );
      }
    });
  });
};

// Add mouse tracking to canvas
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mousePos = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
  };
});
```

### 3. Fix Performance Issues
```javascript
// Optimize drawing for many events
// Use techniques to reduce redraws

const optimizedDraw = (options = {}) => {
  let lastFrame = 0;
  let eventCache = new Map();
  
  return drawing((ctx, events, time) => {
    const currentFrame = Math.floor(time * 60); // 60 FPS
    
    // Only redraw if frame changed
    if (currentFrame === lastFrame) return;
    lastFrame = currentFrame;
    
    // Clear only changed regions
    const changedRegions = [];
    
    events.forEach(event => {
      const cached = eventCache.get(event.id);
      const wasActive = cached?.active;
      const isActive = event.active;
      
      // Only redraw if state changed
      if (wasActive !== isActive) {
        const x = (event.whole.begin % 1) * ctx.canvas.width;
        const y = 0;
        const w = 50;
        const h = ctx.canvas.height;
        
        changedRegions.push({ x, y, w, h });
        eventCache.set(event.id, { active: isActive });
      }
    });
    
    // Clear and redraw only changed regions
    changedRegions.forEach(({ x, y, w, h }) => {
      ctx.clearRect(x, y, w, h);
      // Redraw events in this region
    });
  });
};

// Use offscreen canvas for complex drawings
const offscreen = new OffscreenCanvas(800, 400);
const offCtx = offscreen.getContext('2d');

// Draw to offscreen
offCtx.drawImage(complexImage, 0, 0);

// Copy to main canvas
ctx.drawImage(offscreen, 0, 0);
```

### 4. Implement Color Mapping
```javascript
// Map pattern values to colors
// Example: Frequency-based coloring

import { noteToFreq } from '@strudel/core';

export const frequencyColor = () => {
  return drawing((ctx, events) => {
    events.forEach(event => {
      const note = event.value.note || 60;
      const freq = noteToFreq(note);
      
      // Map frequency to hue (20Hz-20kHz to 0-360)
      const minFreq = Math.log(20);
      const maxFreq = Math.log(20000);
      const logFreq = Math.log(freq);
      const normalized = (logFreq - minFreq) / (maxFreq - minFreq);
      const hue = normalized * 360;
      
      // Set color based on frequency
      ctx.fillStyle = `hsl(${hue}, 70%, ${event.active ? 60 : 40}%)`;
      
      // Draw visualization
      const x = (event.whole.begin % 1) * ctx.canvas.width;
      const y = ctx.canvas.height / 2;
      const radius = (event.value.gain || 0.5) * 30;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  });
};

// Use with pattern
note("c2 c3 c4 c5").draw(frequencyColor());
```

## Testing Strategies

```javascript
// Test canvas creation
test('creates canvas element', () => {
  const pattern = note("c3").draw(() => {});
  const canvas = document.querySelector('canvas');
  expect(canvas).toBeTruthy();
  expect(canvas.width).toBeGreaterThan(0);
});

// Test event mapping
test('maps events to visual space', () => {
  const events = [
    { whole: { begin: 0, end: 0.5 }, value: { note: 60 } },
    { whole: { begin: 0.5, end: 1 }, value: { note: 64 } }
  ];
  
  const positions = events.map(e => ({
    x: e.whole.begin * 800,
    y: 400 - (e.value.note / 127) * 400
  }));
  
  expect(positions[0].x).toBe(0);
  expect(positions[1].x).toBe(400);
});

// Test animation frame
test('animates over time', (done) => {
  let frames = [];
  
  const pattern = note("c3").draw((ctx, events, time) => {
    frames.push(time);
    if (frames.length === 3) {
      expect(frames[0]).toBeLessThan(frames[1]);
      expect(frames[1]).toBeLessThan(frames[2]);
      done();
    }
  });
});

// Test color utilities
test('parses color values', () => {
  expect(parseColor('red')).toBe('#ff0000');
  expect(parseColor('#123')).toBe('#112233');
  expect(parseColor('rgb(255,0,0)')).toBe('#ff0000');
});
```

## Common Validation Errors

### Canvas Errors
```javascript
// Error: Cannot read property 'getContext' of null
// Fix: Ensure canvas element exists
const canvas = document.getElementById('myCanvas') || 
               document.createElement('canvas');

// Error: Canvas size is 0
// Fix: Set dimensions before drawing
canvas.width = options.width || 800;
canvas.height = options.height || 400;

// Error: High DPI blur
// Fix: Handle device pixel ratio
const dpr = window.devicePixelRatio || 1;
canvas.width = size * dpr;
canvas.height = size * dpr;
ctx.scale(dpr, dpr);
```

### Drawing Errors
```javascript
// Error: fillStyle is not a valid color
// Fix: Validate color values
const isValidColor = (color) => {
  const s = new Option().style;
  s.color = color;
  return s.color !== '';
};

ctx.fillStyle = isValidColor(color) ? color : 'black';

// Error: Drawing outside canvas bounds
// Fix: Clamp coordinates
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const x = clamp(xPos, 0, canvas.width);
const y = clamp(yPos, 0, canvas.height);
```

### Animation Errors
```javascript
// Error: Animation stutters
// Fix: Use requestAnimationFrame properly
let animationId;

function animate() {
  draw();
  animationId = requestAnimationFrame(animate);
}

// Start
animate();

// Stop - important!
cancelAnimationFrame(animationId);

// Error: Memory leak from animations
// Fix: Clean up on unmount
pattern.onStop = () => {
  cancelAnimationFrame(animationId);
  canvas.remove();
};
```

## Performance Considerations

### Canvas Optimization
```javascript
// Batch drawing operations
ctx.beginPath();
events.forEach(event => {
  ctx.rect(x, y, w, h);
});
ctx.fill(); // Single fill call

// Use layers for static content
const bgCanvas = document.createElement('canvas');
drawBackground(bgCanvas.getContext('2d'));

// Copy background once per frame
ctx.drawImage(bgCanvas, 0, 0);
drawDynamicContent(ctx);
```

### Event Processing
```javascript
// Pre-calculate positions
const positions = events.map(event => ({
  x: (event.whole.begin % 1) * width,
  y: height - (event.value.note / 127) * height,
  event
}));

// Sort for efficient drawing
positions.sort((a, b) => a.x - b.x);
```

### Memory Management
```javascript
// Clear references to prevent leaks
let events = null;
let canvas = null;

pattern.onStop = () => {
  events = null;
  if (canvas) {
    canvas.width = 0; // Release backing store
    canvas = null;
  }
};
```

## Integration Points

### With Pattern System
```javascript
// Access pattern metadata in drawings
pattern.draw((ctx, events, time, meta) => {
  // Use pattern info
  const { cycles, cps } = meta;
  
  ctx.fillText(`Cycle: ${Math.floor(time)}`, 10, 20);
  ctx.fillText(`BPM: ${cps * 60}`, 10, 40);
});
```

### With Audio Context
```javascript
// Sync visualization with audio
import { getAudioContext } from '@strudel/webaudio';

pattern.draw((ctx, events, time) => {
  const audioCtx = getAudioContext();
  const currentTime = audioCtx.currentTime;
  
  // Use audio time for precise sync
  const syncedTime = currentTime % 1;
  
  // Draw with audio-synced time
  const x = syncedTime * ctx.canvas.width;
  ctx.fillRect(x, 0, 2, ctx.canvas.height);
});
```

### With UI Components
```javascript
// Embed in React component
function PatternVisualizer({ pattern }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (canvasRef.current) {
      pattern.draw((ctx, events) => {
        // Drawing logic
      }, canvasRef.current);
    }
    
    return () => pattern.onStop?.();
  }, [pattern]);
  
  return <canvas ref={canvasRef} />;
}
```

## Quick Debug Commands

```javascript
// Log canvas state
console.log({
  width: canvas.width,
  height: canvas.height,
  context: canvas.getContext('2d')
});

// Debug event positions
events.forEach(e => {
  console.log({
    time: e.whole.begin,
    value: e.value,
    active: e.active
  });
});

// Test color output
console.log(ctx.fillStyle);
console.log(ctx.strokeStyle);

// Check animation frame rate
let lastTime = 0;
function checkFPS(time) {
  const fps = 1000 / (time - lastTime);
  console.log(`FPS: ${fps.toFixed(1)}`);
  lastTime = time;
  requestAnimationFrame(checkFPS);
}

// Profile drawing performance
console.time('draw');
drawFunction();
console.timeEnd('draw');
```

## When to Escalate

Escalate to package maintainers when:

1. **Canvas API Limits**: Need WebGL or other advanced graphics APIs
2. **Performance Wall**: Optimizations aren't enough for complex visualizations
3. **New Viz Types**: Adding fundamentally new visualization approaches
4. **Browser Issues**: Canvas bugs or compatibility problems
5. **Architecture**: Need to change how visualizations integrate with patterns

For pattern timing issues, check @strudel/core first.
For audio sync problems, coordinate with @strudel/webaudio.