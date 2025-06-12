# CLAUDE.md - @strudel/webaudio

This file provides guidance to Claude Code when working with the Web Audio output package.

## Package Purpose

`@strudel/webaudio` provides Web Audio API integration for Strudel patterns:
- Real-time audio scheduling and playback
- Integration with superdough synthesis engine
- Audio effect processing
- Visualization (scope, spectrum analyzer)
- Sample loading and management
- Clock synchronization for precise timing

## Key APIs and Functions

### Main Audio Functions
```javascript
import { webaudioOutput, getAudioContext, initAudioOnFirstClick } from '@strudel/webaudio';

// Initialize audio output
const { scheduler } = webaudioOutput({
  audioContext,
  lookAheadTime: 0.1,
  getTime: () => audioContext.currentTime,
  onEvent: (hap, deadline) => {
    // Handle audio event
  }
});
```

### Pattern Audio Methods
```javascript
// These methods are added to Pattern prototype
pattern
  .s('piano')          // Sound/instrument selection
  .note(60)            // MIDI note number
  .gain(0.8)           // Volume
  .pan(0.5)            // Stereo position
  .speed(2)            // Playback speed
  .begin(0.25)         // Sample start position
  .end(0.75)           // Sample end position
  .vowel('a')          // Filter formant
  .cutoff(2000)        // Filter cutoff frequency
  .resonance(10)       // Filter resonance
  .delay(0.25)         // Delay effect
  .delaytime(0.125)    // Delay time
  .delayfeedback(0.7)  // Delay feedback
  .room(0.8)           // Reverb amount
  .orbit(1)            // Effect bus routing
```

### Visualization
```javascript
// Oscilloscope
pattern.scope()

// Spectrum analyzer  
pattern.spectrum()
```

## Common Usage Patterns

### Basic Playback
```javascript
// Simple note pattern
note("c3 e3 g3 b3").s("piano")

// With effects
note("c3 e3 g3")
  .s("sawtooth")
  .cutoff(1000)
  .resonance(10)
  .room(0.5)
```

### Sample Playback
```javascript
// Play samples
s("bd sd hh sd")
  .speed("<1 2 0.5>")
  .gain("0.8 0.6")

// Sample slicing
s("break")
  .begin("<0 0.25 0.5 0.75>")
  .end("<0.25 0.5 0.75 1>")
```

### Effect Routing
```javascript
// Use orbits for effect buses
stack(
  s("bd*4").orbit(1),
  s("hh*8").orbit(2).delay(0.5),
  note("c3 e3").orbit(3).room(0.9)
)
```

### Dynamic Control
```javascript
// LFO modulation
note("c3")
  .cutoff(sine.range(200, 2000).slow(4))
  .gain(sine.range(0.3, 0.8).slow(2))
```

## Development Guidelines

### Adding Audio Parameters
1. Add parameter to superdough if needed
2. Register control in webaudio.mjs
3. Add Pattern method
4. Document parameter range and behavior

### Audio Parameter Template
```javascript
// In webaudio.mjs
controls.myParam = (value, pat) => pat.set.myParam(value);

// Usage
pattern.myParam(0.5)

// In superdough, handle the parameter
if (myParam !== undefined) {
  node.myParam.value = myParam;
}
```

### Scheduling Architecture
```javascript
// Lookahead scheduling for precise timing
const lookAheadTime = 0.1; // 100ms
const scheduleInterval = 0.05; // 50ms

// Scheduler loop
setInterval(() => {
  const now = getTime();
  const events = pattern.queryArc(now, now + lookAheadTime);
  
  events.forEach(event => {
    const deadline = event.whole.begin.valueOf();
    scheduleEvent(event, deadline);
  });
}, scheduleInterval * 1000);
```

## Testing Requirements

### Audio Testing Challenges
- Web Audio requires user interaction
- Timing is hardware-dependent
- Use mocks for unit tests
- Manual testing for audio quality

### Test Patterns
```javascript
// Test parameter ranges
test('gain clamps to valid range', () => {
  const pat = s("bd").gain(2); // Should clamp to max
});

// Test scheduling
test('events scheduled in order', () => {
  const events = pattern.queryArc(0, 1);
  // Verify event ordering
});
```

## Dependencies and Relationships

### Dependencies
- `@strudel/core` - Pattern engine
- `@strudel/superdough` - Synthesis engine

### Audio Context Management
```javascript
// Singleton audio context
let audioContext;
export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};
```

### Integration with Superdough
```javascript
// Webaudio prepares parameters
const params = {
  s: 'piano',
  note: 60,
  gain: 0.8,
  // ... other parameters
};

// Superdough handles synthesis
superdough(params, deadline, duration);
```

## Common Pitfalls

### Audio Context State
```javascript
// Must resume on user interaction
button.addEventListener('click', async () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
});
```

### Timing Precision
```javascript
// Use Web Audio time, not Date.now()
const when = audioContext.currentTime + 0.1; // Good
const when = Date.now() / 1000 + 0.1; // Bad!

// Schedule relative to audio time
source.start(when);
```

### Sample Loading
```javascript
// Samples must be loaded before use
// Default samples auto-load
// Custom samples need explicit loading
await loadSample('mysample', 'path/to/sample.wav');
```

### Parameter Ranges
```javascript
// Common parameter ranges
gain: 0-1 (amplitude)
pan: 0-1 (0=left, 0.5=center, 1=right)
speed: 0.1-10 (playback rate)
cutoff: 20-20000 (Hz)
resonance: 0-40 (Q factor)
room: 0-1 (reverb mix)
```

## Integration Examples

### With Pattern Engine
```javascript
// Pattern provides events
const pattern = note("c3 e3 g3").s("piano");

// Webaudio schedules them
pattern.queryArc(0, 1).forEach(event => {
  const { value, whole } = event;
  scheduleNote(value, whole.begin);
});
```

### With MIDI
```javascript
// MIDI input to pattern
midi.on('noteon', ({ note, velocity }) => {
  // Trigger pattern with MIDI values
  currentPattern
    .note(note)
    .gain(velocity / 127)
    .trigger();
});
```

### With Visualization
```javascript
// Scope shows waveform
note("c3 e3 g3")
  .s("sawtooth")
  .scope() // Adds oscilloscope

// Spectrum shows frequencies
pattern.spectrum() // Adds spectrum analyzer
```

## Performance Optimization

### Buffer Management
```javascript
// Reuse audio buffers
const bufferCache = new Map();

// Preload frequently used samples
['bd', 'sd', 'hh'].forEach(name => {
  preloadSample(name);
});
```

### Scheduling Efficiency
```javascript
// Batch similar events
const eventsByTime = groupBy(events, e => e.whole.begin);

// Minimize parameter changes
if (lastOrbit !== orbit) {
  switchOrbit(orbit);
  lastOrbit = orbit;
}
```

### Audio Graph Optimization
```javascript
// Reuse nodes when possible
const nodePool = [];

// Disconnect unused nodes
node.disconnect();
nodePool.push(node);
```

## Audio Effects Reference

### Filter Effects
- `cutoff` - Low-pass filter frequency (20-20000 Hz)
- `resonance` - Filter emphasis (0-40)
- `hcutoff` - High-pass filter frequency
- `bandq` - Band-pass Q factor
- `vowel` - Formant filter ('a','e','i','o','u')

### Time Effects  
- `delay` - Delay mix (0-1)
- `delaytime` - Delay time in cycles
- `delayfeedback` - Delay regeneration (0-1)
- `room` - Reverb amount (0-1)
- `size` - Reverb size (0-1)

### Modulation
- `vibrato` - Pitch vibrato amount
- `tremolo` - Amplitude tremolo
- `phaser` - Phaser effect depth
- `chorus` - Chorus effect mix

### Dynamics
- `compress` - Compression ratio
- `attack` - Envelope attack time
- `decay` - Envelope decay time
- `sustain` - Envelope sustain level
- `release` - Envelope release time