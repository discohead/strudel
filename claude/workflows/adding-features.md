# Adding Features Workflow

## Adding a New Pattern Function

### 1. Define the Function
```javascript
// packages/core/pattern.mjs

/**
 * Rotates a pattern by the given amount
 * @param {number} amount - Rotation amount (0-1)
 * @param {Pattern} pat - Pattern to rotate
 * @returns {Pattern} Rotated pattern
 * @example
 * rotate(0.25, "c d e f") // "f c d e"
 */
export const rotate = register('rotate', function(amount, pat) {
  pat = reify(pat);
  amount = Fraction(amount);
  
  return pat.withTime(t => t.add(amount));
});

// Also add as method
Pattern.prototype.rotate = function(amount) {
  return rotate(amount, this);
};
```

### 2. Export from Package
```javascript
// packages/core/index.mjs
export { rotate } from './pattern.mjs';
```

### 3. Add Tests
```javascript
// packages/core/test/pattern.test.mjs
describe('rotate', () => {
  it('rotates pattern forward', () => {
    expect(rotate(0.25, sequence('a', 'b', 'c', 'd')).firstCycle())
      .toStrictEqual(sequence('d', 'a', 'b', 'c').firstCycle());
  });
  
  it('handles negative rotation', () => {
    expect(rotate(-0.25, sequence('a', 'b', 'c', 'd')).firstCycle())
      .toStrictEqual(sequence('b', 'c', 'd', 'a').firstCycle());
  });
});
```

### 4. Update Documentation
The function is automatically included in API docs via JSDoc.

## Adding a Mini Notation Feature

### 1. Update Grammar
```pegjs
// packages/mini/krill.pegjs

// Add new operator
operator = stretch / replicate / bjorklund / degrade / range / tail / rotate

// Define rotate operator
rotate = "|>" _ amount:number {
  return {
    type_: 'rotate',
    arguments_: { amount }
  };
}
```

### 2. Regenerate Parser
```bash
cd packages/mini
npx pegjs krill.pegjs
```

### 3. Implement in Mini
```javascript
// packages/mini/mini.mjs
const applyOptions = (parent, enter) => (pat, i) => {
  // ... existing code ...
  
  for (const op of ops) {
    switch (op.type_) {
      // ... existing cases ...
      
      case 'rotate': {
        const { amount } = op.arguments_;
        pat = strudel.reify(pat).rotate(enter(amount));
        break;
      }
    }
  }
};
```

### 4. Add Tests
```javascript
// packages/mini/test/mini.test.mjs
it('rotate operator', () => {
  expect(mini('"a b c d"|>0.25').firstCycle())
    .toStrictEqual(mini('"d a b c"').firstCycle());
});
```

## Adding a Control Parameter

### 1. Define Control
```javascript
// packages/core/controls.mjs

/**
 * Sets the filter type
 * @param {string} type - Filter type (lowpass, highpass, bandpass)
 * @example
 * note("c3 e3").filtertype("highpass")
 */
export const filtertype = register('filtertype', (type, pat) => 
  pat.set({ filtertype: type })
);
```

### 2. Map in Audio Engine
```javascript
// packages/superdough/superdough.mjs

const getFilter = (ctx, params) => {
  const filter = ctx.createBiquadFilter();
  
  filter.type = params.filtertype || 'lowpass';
  filter.frequency.value = params.cutoff || 2000;
  filter.Q.value = params.resonance || 1;
  
  return filter;
};
```

### 3. Document Usage
```javascript
// In function JSDoc
/**
 * @example
 * s("sawtooth").filtertype("highpass").cutoff(1000)
 */
```

## Adding a UI Widget

### 1. Create Widget Component
```javascript
// website/src/repl/components/Knob.jsx
export function Knob({ value, onChange, min = 0, max = 1 }) {
  return (
    <div className="knob-container">
      <input 
        type="range"
        className="knob"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}
```

### 2. Register with Transpiler
```javascript
// packages/transpiler/transpiler.mjs
registerWidgetType('knob');

// Add to widget detection
if (node.callee.property?.name === 'knob') {
  widgets.push({
    type: 'knob',
    from: node.start,
    to: node.end,
    // ... config
  });
}
```

### 3. Integrate with CodeMirror
```javascript
// packages/codemirror/widget.mjs
export function knobWidget(options) {
  return new WidgetType({
    render() {
      const container = document.createElement('span');
      ReactDOM.render(<Knob {...options} />, container);
      return container;
    }
  });
}
```

## Adding an Output Target

### 1. Create Package
```bash
# Create new package directory
mkdir packages/dmx
cd packages/dmx

# Initialize package.json
pnpm init
```

### 2. Implement Output
```javascript
// packages/dmx/dmx.mjs
import { getScheduler } from '@strudel/core';

export const dmx = (options = {}) => {
  const scheduler = getScheduler();
  
  return (pat) => {
    scheduler.setPattern(pat, (hap) => {
      // Convert hap to DMX commands
      const channel = hap.value.channel || 1;
      const value = hap.value.brightness || 0;
      
      sendDMX(channel, value);
    });
  };
};
```

### 3. Add to Website
```javascript
// website/src/repl/prebake.mjs
import { dmx } from '@strudel/dmx';

// Register globally
window.dmx = dmx;
```

## Adding a Visualization

### 1. Create Visualization Component
```javascript
// packages/draw/spiral.mjs
export function spiral(options = {}) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  const draw = (haps) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    haps.forEach(hap => {
      const angle = hap.whole.begin * Math.PI * 2;
      const radius = hap.value.velocity * 100;
      
      const x = Math.cos(angle) * radius + canvas.width/2;
      const y = Math.sin(angle) * radius + canvas.height/2;
      
      ctx.fillStyle = hap.value.color || 'white';
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  };
  
  return { canvas, draw };
}
```

### 2. Connect to Pattern
```javascript
// packages/draw/index.mjs
Pattern.prototype.spiral = function(options) {
  const viz = spiral(options);
  
  // Update visualization on each cycle
  this.onTrigger((_, haps) => {
    viz.draw(haps);
  });
  
  return this;
};
```

## Testing New Features

### 1. Unit Tests
```javascript
// Test the core functionality
describe('feature', () => {
  it('basic case', () => {
    // Test implementation
  });
  
  it('edge cases', () => {
    // Test boundaries
  });
  
  it('integration', () => {
    // Test with other features
  });
});
```

### 2. Snapshot Tests
```javascript
it('produces expected output', () => {
  const pattern = myFeature("c3 e3 g3");
  expect(pattern.firstCycle()).toMatchSnapshot();
});
```

### 3. Manual Testing
```javascript
// Add to test tunes
// test/testtunes.mjs
export const testMyFeature = `
// Test new feature
"c3 e3 g3".myFeature(0.5).s("piano")
`;
```

### 4. Performance Testing
```javascript
// bench/feature.bench.mjs
import { bench } from 'vitest';

bench('myFeature performance', () => {
  const pat = sequence('a', 'b', 'c');
  pat.myFeature(0.5).queryArc(0, 100);
});
```