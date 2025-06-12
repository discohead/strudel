# CLAUDE.md - @strudel/draw

This file provides guidance to Claude Code when working with the visualization components package.

## Package Purpose

`@strudel/draw` provides visualization components for Strudel patterns:
- Piano roll visualization
- Spiral/circular pattern display  
- Custom canvas-based drawing
- Animation utilities
- Color manipulation
- Pitch wheel visualization
- Pattern debugging tools

## Key APIs and Functions

### Drawing Functions
```javascript
import { draw, drawing } from '@strudel/draw';

// Canvas drawing with pattern data
pattern.draw((ctx, events, time) => {
  events.forEach(event => {
    const { value, active } = event;
    // Custom drawing logic
    ctx.fillRect(x, y, width, height);
  });
});

// Get drawing function without applying
const drawFn = drawing((ctx, events, time) => {
  // Drawing logic
});
pattern.draw(drawFn);
```

### Piano Roll
```javascript
import { pianoroll } from '@strudel/draw';

// Add piano roll visualization
pattern.pianoroll({
  fold: 1,           // Fold octaves (0=no fold)
  vertical: false,   // Orientation
  flipTime: false,   // Time direction
  flipPitch: false,  // Pitch direction
  barWidth: 16,      // Width of bars
  timeframe: 4,      // Cycles to show
  hideInactive: true // Hide inactive notes
});
```

### Spiral Visualization
```javascript
import { spiral } from '@strudel/draw';

// Circular/spiral pattern view
pattern.spiral({
  size: 500,         // Canvas size
  cycleDuration: 1,  // Cycle length
  timeframe: 4,      // Cycles to show
  color: 'rainbow'   // Color scheme
});
```

### Animation Utilities
```javascript
import { animate, animateIn } from '@strudel/draw';

// Animate values over time
const animated = animate(ease('bounce'));

// Animate pattern entrance
pattern.animateIn(0.1); // 0.1 cycle fade in
```

## Common Usage Patterns

### Basic Drawing
```javascript
// Simple visualization
note("c3 e3 g3 c4").draw((ctx, events) => {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  
  events.forEach(({ value, whole, active }) => {
    ctx.fillStyle = active ? 'red' : 'gray';
    const x = whole.begin * width;
    const y = height - (value.note / 127) * height;
    ctx.fillRect(x, y, 20, 20);
  });
});
```

### Piano Roll Setup
```javascript
// Standard piano roll
note("c3 e3 g3 c4")
  .s("piano")
  .pianoroll() // Default settings

// Customized piano roll
pattern.pianoroll({
  fold: 0,        // Show all octaves
  vertical: true, // Vertical orientation
  timeframe: 8,   // Show 8 cycles
  barWidth: 4     // Thin bars
});
```

### Color Manipulation
```javascript
// Use color helper
pattern.color('red')      // Named color
pattern.color('#ff0000')  // Hex color
pattern.color('rainbow')  // Special schemes

// Pattern-based coloring
pattern.draw((ctx, events) => {
  events.forEach(event => {
    ctx.fillStyle = event.context.color || 'blue';
    // Draw with color
  });
});
```

## Development Guidelines

### Creating Visualizations
1. Define drawing function
2. Handle canvas sizing/scaling
3. Map pattern time to visual space
4. Support active/inactive states
5. Add to pattern prototype

### Visualization Template
```javascript
// Define visualization
export const myViz = (options = {}) => {
  const { 
    size = 500,
    color = 'blue' 
  } = options;
  
  return drawing((ctx, events, time) => {
    // Clear canvas
    ctx.clearRect(0, 0, size, size);
    
    // Draw events
    events.forEach(event => {
      const { whole, active } = event;
      // Map time to position
      const x = (whole.begin % 1) * size;
      
      // Draw
      ctx.fillStyle = active ? color : 'gray';
      ctx.fillRect(x, 0, 10, size);
    });
  });
};

// Register on Pattern
Pattern.prototype.myViz = function(options) {
  return this.draw(myViz(options));
};
```

### Canvas Management
```javascript
// Handle high DPI displays
const dpr = window.devicePixelRatio || 1;
canvas.width = size * dpr;
canvas.height = size * dpr;
canvas.style.width = size + 'px';
canvas.style.height = size + 'px';
ctx.scale(dpr, dpr);
```

## Testing Requirements

### Visual Testing
- Test on different screen sizes
- Verify high DPI rendering
- Check performance with many events
- Test animation smoothness

### Unit Testing
```javascript
// Test color functions
test('color parsing', () => {
  expect(parseColor('red')).toBe('#ff0000');
  expect(parseColor('#123')).toBe('#112233');
});

// Test time mapping
test('time to position', () => {
  const pos = timeToX(0.5, 100);
  expect(pos).toBe(50);
});
```

## Dependencies and Relationships

### Internal Dependencies
- `@strudel/core` - Pattern engine
- Uses Pattern prototype for methods
- Integrates with event system

### Canvas API
- Uses standard Canvas 2D context
- No external drawing libraries
- Pure JavaScript implementation

### Integration Points
- Works with any pattern
- Coordinates with scheduler for timing
- Can be combined with audio output

## Common Pitfalls

### Performance Issues
```javascript
// Avoid redrawing everything
// Keep track of what changed
let lastDrawn = new Set();

events.forEach(event => {
  if (!lastDrawn.has(event.id)) {
    // Draw new event
  }
});

// Use requestAnimationFrame
let rafId;
function animate() {
  draw();
  rafId = requestAnimationFrame(animate);
}

// Cleanup
cancelAnimationFrame(rafId);
```

### Coordinate Systems
```javascript
// Canvas origin is top-left
// Musical pitch often bottom-up
// May need to flip Y coordinate

const flippedY = canvasHeight - y;

// Time wrapping for cycles
const wrappedTime = time % cycleLength;
```

### Active State Tracking
```javascript
// Events have 'active' property
// True when currently playing
// Use for highlighting

ctx.fillStyle = event.active 
  ? 'red'      // Playing now
  : 'gray';    // Not playing
```

## Integration Examples

### With Audio Output
```javascript
// Visualize what's playing
note("c3 e3 g3")
  .s("piano")
  .pianoroll()  // See the notes
  .play()       // Hear them too
```

### Custom Instrument Display
```javascript
// Guitar tab visualization
pattern.draw((ctx, events) => {
  // Draw guitar strings
  for (let string = 0; string < 6; string++) {
    ctx.strokeStyle = '#999';
    ctx.beginPath();
    ctx.moveTo(0, string * 20);
    ctx.lineTo(width, string * 20);
    ctx.stroke();
  }
  
  // Draw fret positions
  events.forEach(event => {
    const { string, fret } = parseGuitarNote(event.value);
    const x = (event.whole.begin % 1) * width;
    const y = string * 20;
    
    ctx.fillStyle = event.active ? 'red' : 'black';
    ctx.fillText(fret, x, y);
  });
});
```

### Debug Visualization
```javascript
// Show pattern structure
pattern.draw((ctx, events, time) => {
  // Draw timeline
  ctx.strokeStyle = 'green';
  ctx.beginPath();
  ctx.moveTo(time * width, 0);
  ctx.lineTo(time * width, height);
  ctx.stroke();
  
  // Show event data
  events.forEach((event, i) => {
    ctx.fillStyle = 'black';
    ctx.font = '10px monospace';
    ctx.fillText(
      JSON.stringify(event.value), 
      10, 
      i * 15 + 15
    );
  });
});
```

## Visualization Options Reference

### Piano Roll Options
```javascript
{
  fold: 1,              // Octave folding (0=none)
  vertical: false,      // Orientation
  flipTime: false,      // Reverse time
  flipPitch: false,     // Reverse pitch
  barWidth: 16,         // Note width
  timeframe: 4,         // Cycles shown
  hideInactive: true,   // Hide when not playing
  notes: 128,          // MIDI note range
  palette: 'rainbow'    // Color scheme
}
```

### Spiral Options
```javascript
{
  size: 500,           // Canvas size (pixels)
  cycleDuration: 1,    // Length of one cycle
  timeframe: 4,        // Total cycles shown
  color: 'rainbow',    // Color scheme
  lineWidth: 4,        // Line thickness
  dotSize: 8,          // Event dot size
  drawLines: true      // Connect events
}
```

### Drawing Options
```javascript
{
  width: 800,          // Canvas width
  height: 400,         // Canvas height
  background: 'white', // Background color
  foreground: 'black', // Default draw color
  lineWidth: 1,        // Default line width
  fontFamily: 'Arial'  // Default font
}
```

## Color Schemes

### Built-in Palettes
- `rainbow` - Full spectrum
- `warm` - Red/orange/yellow
- `cool` - Blue/green/purple
- `grayscale` - Black to white
- `plasma` - Scientific colormap
- `viridis` - Perceptually uniform

### Custom Colors
```javascript
// Function-based color
pattern.color((event) => {
  const hue = (event.value.note % 12) * 30;
  return `hsl(${hue}, 70%, 50%)`;
});

// Pattern-based color  
pattern.color("<red blue green>")
```