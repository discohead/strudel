# AGENTS.md - @strudel/webaudio

Specialized guidance for AI agents working on the Web Audio output package. This package handles real-time audio scheduling and playback in the browser.

## Quick Start (1 minute validation)

```bash
# From packages/webaudio directory
pnpm test  # Should pass audio-related tests

# Note: Full audio testing requires browser environment
# Many features need manual testing due to Web Audio API constraints
```

## Web Audio Package Context

### Purpose
Provides Web Audio API integration for pattern playback, managing real-time scheduling, effects, and audio synthesis.

### Key Files
- `webaudio.mjs` - Main audio output and scheduling
- `sampler.mjs` - Sample loading and playback
- `scope.mjs` - Oscilloscope visualization
- `spectrum.mjs` - Spectrum analyzer
- `index.mjs` - Public exports

### References
- Local: `CLAUDE.md` in this directory
- Global: `/claude/technologies/webaudio-integration.md`
- Rules: `/.cursor/rules/components/audio-scheduling.mdc`

## Common Agent Tasks

### 1. Adding Audio Control Parameters (4-6 minutes)

#### Task Checklist
- [ ] Define parameter in controls object
- [ ] Add validation/clamping if needed
- [ ] Create Pattern prototype method
- [ ] Coordinate with superdough for synthesis
- [ ] Add documentation and examples
- [ ] Test parameter ranges

#### Example: Adding a Distortion Control
```javascript
// In webaudio.mjs - add to controls
controls.distortion = (amount, pat) => pat.set.distortion(amount);

// Add validation if needed
controls.distortion = (amount, pat) => {
  // Clamp to reasonable range
  amount = Math.max(0, Math.min(1, amount));
  return pat.set.distortion(amount);
};

// Document the control
/**
 * Applies distortion effect to the sound
 * @param {number} amount - Distortion amount (0-1)
 * @example
 * s("sawtooth").note("c3").distortion(0.8)
 */

// In superdough, handle the parameter
// (This would be in superdough package)
if (value.distortion !== undefined) {
  const dist = audioContext.createWaveShaper();
  dist.curve = makeDistortionCurve(value.distortion * 100);
  // Connect in audio graph
}
```

### 2. Improving Audio Scheduling (5-7 minutes)

#### Task Checklist
- [ ] Identify scheduling issue
- [ ] Adjust lookahead parameters
- [ ] Handle timing edge cases
- [ ] Test with various tempos
- [ ] Ensure no audio glitches

#### Example: Dynamic Lookahead Adjustment
```javascript
// Adaptive lookahead based on tempo
export const webaudioOutput = ({ 
  lookAheadTime = 0.1,
  scheduleInterval = 0.05,
  adaptive = true 
} = {}) => {
  
  let currentLookahead = lookAheadTime;
  
  const scheduler = {
    setTempo: (bpm) => {
      if (adaptive) {
        // Faster tempo needs smaller lookahead
        const beatDuration = 60 / bpm;
        currentLookahead = Math.max(0.05, Math.min(0.2, beatDuration / 4));
      }
    },
    
    schedule: () => {
      const now = audioContext.currentTime;
      const until = now + currentLookahead;
      
      // Query and schedule events
      const events = pattern.queryArc(now, until);
      events.forEach(event => {
        const when = event.whole.begin.valueOf();
        if (when >= now) {
          scheduleEvent(event, when);
        }
      });
    }
  };
  
  return scheduler;
};
```

### 3. Adding Visualization Features (4-6 minutes)

#### Task Checklist
- [ ] Create visualization component
- [ ] Connect to audio graph
- [ ] Add Pattern method
- [ ] Handle cleanup/disconnection
- [ ] Test performance impact

#### Example: Adding a Level Meter
```javascript
// New file: levelmeter.mjs
export class LevelMeter {
  constructor(audioContext) {
    this.analyser = audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.dataArray = new Float32Array(this.analyser.fftSize);
  }
  
  connect(source) {
    source.connect(this.analyser);
  }
  
  getLevel() {
    this.analyser.getFloatTimeDomainData(this.dataArray);
    let sum = 0;
    for (let i = 0; i < this.dataArray.length; i++) {
      sum += this.dataArray[i] * this.dataArray[i];
    }
    return Math.sqrt(sum / this.dataArray.length);
  }
  
  draw(canvas) {
    const ctx = canvas.getContext('2d');
    const level = this.getLevel();
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width * level, canvas.height);
  }
}

// Add to Pattern prototype
Pattern.prototype.meter = function() {
  return this.onTrigger((t, hap) => {
    // Connect meter to audio output
    const meter = new LevelMeter(getAudioContext());
    // Implementation details...
  });
};
```

### 4. Optimizing Sample Loading (3-5 minutes)

#### Task Checklist
- [ ] Implement sample caching
- [ ] Add preloading mechanism
- [ ] Handle loading errors gracefully
- [ ] Show loading progress
- [ ] Test with various sample sizes

#### Example: Smart Sample Cache
```javascript
// Enhanced sample management
class SampleCache {
  constructor(maxSize = 100 * 1024 * 1024) { // 100MB
    this.cache = new Map();
    this.currentSize = 0;
    this.maxSize = maxSize;
    this.accessOrder = [];
  }
  
  async get(url) {
    if (this.cache.has(url)) {
      // Move to end (most recently used)
      this.accessOrder = this.accessOrder.filter(u => u !== url);
      this.accessOrder.push(url);
      return this.cache.get(url);
    }
    
    const buffer = await this.load(url);
    this.add(url, buffer);
    return buffer;
  }
  
  add(url, buffer) {
    const size = buffer.length * buffer.numberOfChannels * 4; // bytes
    
    // Evict old samples if needed
    while (this.currentSize + size > this.maxSize && this.accessOrder.length > 0) {
      const oldUrl = this.accessOrder.shift();
      const oldBuffer = this.cache.get(oldUrl);
      this.currentSize -= oldBuffer.length * oldBuffer.numberOfChannels * 4;
      this.cache.delete(oldUrl);
    }
    
    this.cache.set(url, buffer);
    this.currentSize += size;
    this.accessOrder.push(url);
  }
  
  async load(url) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await getAudioContext().decodeAudioData(arrayBuffer);
  }
}
```

## Testing Strategies

### Unit Test Patterns
```javascript
describe('webaudio', () => {
  // Mock audio context for testing
  let mockContext;
  
  beforeEach(() => {
    mockContext = {
      currentTime: 0,
      createGain: () => ({ connect: jest.fn(), gain: { value: 1 } }),
      createOscillator: () => ({ 
        connect: jest.fn(), 
        start: jest.fn(),
        frequency: { value: 440 }
      })
    };
  });
  
  it('schedules events with correct timing', () => {
    const scheduler = createScheduler(mockContext);
    const events = [
      { whole: { begin: Fraction(0), end: Fraction(1) }, value: {} }
    ];
    
    scheduler.schedule(events);
    // Verify scheduling happened
  });
});
```

### Integration Testing
```javascript
// Test with real Web Audio (requires browser)
it('plays audio without glitches', async () => {
  const ctx = new AudioContext();
  const pattern = s("bd*4");
  
  // Record output
  const recorder = ctx.createScriptProcessor(1024, 1, 1);
  let hasSound = false;
  
  recorder.onaudioprocess = (e) => {
    const data = e.inputBuffer.getChannelData(0);
    hasSound = hasSound || data.some(v => Math.abs(v) > 0.01);
  };
  
  // Play pattern
  pattern.play();
  
  // Wait and check
  await new Promise(r => setTimeout(r, 1000));
  expect(hasSound).toBe(true);
});
```

## Common Validation Errors

### 1. Audio Context Not Started
```
Error: AudioContext state is 'suspended'
Fix: Ensure user interaction before audio playback
```

### 2. Sample Not Found
```
Error: Failed to fetch sample
Fix: Check sample paths and loading mechanism
```

### 3. Scheduling Drift
```
Issue: Events play late over time
Fix: Use audio context time, not wall clock time
```

### 4. Parameter Out of Range
```
Error: Value outside nominal range
Fix: Add parameter validation and clamping
```

## Performance Considerations

### Audio Graph Optimization
1. **Node Reuse**: Pool and reuse audio nodes
2. **Minimal Connections**: Only connect what's needed
3. **Batch Operations**: Group similar parameter changes
4. **Cleanup**: Disconnect and garbage collect unused nodes

### Scheduling Optimization
```javascript
// Efficient event grouping
const scheduleEvents = (events) => {
  // Group by time
  const byTime = events.reduce((acc, event) => {
    const time = event.whole.begin.valueOf();
    (acc[time] = acc[time] || []).push(event);
    return acc;
  }, {});
  
  // Schedule groups
  Object.entries(byTime).forEach(([time, group]) => {
    scheduleEventGroup(parseFloat(time), group);
  });
};
```

## Integration Points

### With Superdough
```javascript
// Webaudio prepares event data
const audioEvent = {
  s: hap.value.s || 'sine',
  note: hap.value.note || 60,
  gain: hap.value.gain || 1,
  // ... other parameters
};

// Superdough handles synthesis
const node = await superdough(
  audioEvent,
  when, // deadline
  duration,
  hap.context.cps
);
```

### With Pattern Engine
```javascript
// Pattern generates events
const pattern = note("c3 e3 g3").s("piano");

// Webaudio queries and schedules
const events = pattern.queryArc(start, end);
events.forEach(event => schedule(event));
```

## Quick Debug Commands

```bash
# Test audio output (needs browser)
# Open test.html in browser

# Check for audio issues
# In browser console:
# - Check audio context state
# - Monitor performance
# - Debug scheduling

# Run specific tests
pnpm vitest run test/webaudio.test.mjs
```

## When to Escalate

Escalate to human review if:
- Core scheduling algorithm changes
- Web Audio API workarounds needed
- Performance issues with audio playback
- Complex DSP algorithm implementation
- Browser compatibility issues

Remember: Web Audio requires careful handling of timing and user interaction. Test thoroughly in real browser environments!