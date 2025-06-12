# CLAUDE.md - @strudel/superdough

This file provides guidance to Claude Code when working with the superdough synthesis engine.

## Package Purpose

`@strudel/superdough` is Strudel's Web Audio synthesis engine, providing:
- Sample playback with extensive manipulation
- Multiple synthesizer implementations
- Audio effects (reverb, delay, filters, etc.)
- Audio worklet integration for custom DSP
- Efficient voice allocation and management
- SuperCollider-inspired parameter names

## Key APIs and Functions

### Main Entry Point
```javascript
import { superdough, samples, initAudioOnFirstClick } from '@strudel/superdough';

// Trigger a sound
superdough({
  s: 'sawtooth',     // Sound source
  note: 60,          // MIDI note
  gain: 0.8,         // Volume
  cutoff: 2000,      // Filter cutoff
  // ... other parameters
}, audioContext.currentTime);
```

### Sample Management
```javascript
import { registerSound, getSound } from '@strudel/superdough/sampler';

// Register a sample
await registerSound('mysample', audioBuffer);

// Get registered sound
const buffer = getSound('mysample');

// Default sample library
import { samples } from '@strudel/superdough';
// Includes: bd, sd, hh, piano, etc.
```

### Synthesizers
```javascript
// Available synth types
const synths = [
  'sawtooth', 'saw',     // Sawtooth wave
  'sine',                // Sine wave
  'triangle', 'tri',     // Triangle wave
  'square',              // Square wave
  'white', 'pink',       // Noise generators
  'fm',                  // FM synthesis
  'csine', 'ctriangle',  // Cheap oscillators
];
```

## Common Usage Patterns

### Sample Playback
```javascript
// Basic sample
superdough({ s: 'bd' }, when);

// Sample with effects
superdough({
  s: 'piano',
  note: 60,
  gain: 0.8,
  room: 0.5,      // Reverb
  delay: 0.25,    // Delay mix
  cutoff: 1000,   // Low-pass filter
}, when);
```

### Synthesis
```javascript
// Subtractive synthesis
superdough({
  s: 'sawtooth',
  note: 60,
  cutoff: 800,
  resonance: 10,
  attack: 0.01,
  decay: 0.2,
  sustain: 0.5,
  release: 0.5,
}, when);

// FM synthesis
superdough({
  s: 'fm',
  note: 60,
  fmh: 2,        // Harmonicity ratio
  fmi: 3,        // Modulation index
}, when);
```

### Sample Manipulation
```javascript
// Granular-style playback
superdough({
  s: 'break',
  begin: 0.25,    // Start at 25%
  end: 0.5,       // End at 50%
  speed: 0.5,     // Half speed
  unit: 'c',      // Use cycles for timing
}, when);

// Pitch shifting
superdough({
  s: 'vocal',
  speed: 1.5,     // 1.5x speed (up pitch)
  note: 67,       // Or use MIDI note
}, when);
```

## Development Guidelines

### Adding Parameters
1. Add parameter handling in superdough function
2. Implement audio processing logic
3. Add appropriate value scaling/mapping
4. Document parameter range and behavior

### Parameter Implementation Pattern
```javascript
// In superdough.mjs
export function superdough(params, deadline) {
  const { myParam = defaultValue } = params;
  
  // Create/configure audio nodes
  if (myParam !== undefined) {
    // Apply parameter
    node.myParam.setValueAtTime(myParam, deadline);
  }
}
```

### Audio Worklet Integration
```javascript
// Custom DSP via AudioWorklet
class MyProcessor extends AudioWorkletProcessor {
  process(inputs, outputs, parameters) {
    // Custom audio processing
    return true;
  }
}

// Register and use
await registerProcessor('my-processor', MyProcessor);
```

## Testing Requirements

### Testing Approach
- Unit tests for parameter processing
- Integration tests with mock audio context
- Manual testing for audio quality
- Performance benchmarking

### Test Examples
```javascript
// Parameter validation
test('cutoff clamps to valid range', () => {
  const params = { cutoff: 30000 };
  const processed = processParams(params);
  expect(processed.cutoff).toBeLessThanOrEqual(20000);
});

// Voice allocation
test('reuses inactive voices', () => {
  const voice1 = getVoice();
  releaseVoice(voice1);
  const voice2 = getVoice();
  expect(voice2).toBe(voice1);
});
```

## Dependencies and Relationships

### Internal Structure
- `sampler.mjs` - Sample loading and playback
- `synth.mjs` - Oscillator-based synthesis
- `reverb.mjs` - Reverb implementation
- `feedbackdelay.mjs` - Delay effect
- `vowel.mjs` - Formant filter
- `helpers.mjs` - Utility functions

### External Dependencies
- `@strudel/core` - Uses Fraction for timing
- Web Audio API - Core audio functionality

### Used By
- `@strudel/webaudio` - Primary consumer
- Handles all audio generation for Strudel

## Common Pitfalls

### Voice Stealing
```javascript
// Limited polyphony - voices are reused
// Old notes may cut off when voice limit reached
// Default: ~8 simultaneous voices per sound

// Increase polyphony if needed
maxVoices = 16; // In source code
```

### Sample Loading Timing
```javascript
// Samples must be loaded before playback
// Wait for load before playing
await registerSound('custom', url);
// Now safe to use

// Default samples auto-load on first use
```

### Parameter Scaling
```javascript
// Many parameters use different scales
gain: 0-1 (linear amplitude)
cutoff: 20-20000 (Hz, logarithmic)
resonance: 0-40 (Q factor)
pan: 0-1 (0=left, 1=right)

// Speed vs note
speed: 2 = octave up (2x playback)
note: 12 = octave up (MIDI semitones)
```

### Effect Order
```javascript
// Signal flow matters
// Source → Filter → Effects → Output

// Current chain:
// Oscillator/Sample → Filter → Delay → Reverb → Gain → Pan → Output
```

## Integration Examples

### With Pattern System
```javascript
// Pattern generates events
note("c3 e3 g3").s("piano")

// Webaudio schedules them
events.forEach(event => {
  superdough(event.value, event.whole.begin);
});
```

### Custom Synthesis
```javascript
// Register custom synth
registerSynth('mysynth', (params) => {
  const osc = new OscillatorNode(ctx, {
    frequency: midiToFreq(params.note),
    type: 'sawtooth'
  });
  
  // Custom processing...
  
  return {
    node: osc,
    stop: (when) => osc.stop(when)
  };
});
```

### Effect Buses (Orbits)
```javascript
// Orbit system routes to effect buses
superdough({
  s: 'bd',
  orbit: 1  // Route to bus 1
}, when);

// Each orbit has independent effects
// Useful for grouping/mixing
```

## Performance Optimization

### Voice Pooling
```javascript
// Reuse audio nodes
const voicePool = new Map();

function getVoice(type) {
  const pool = voicePool.get(type) || [];
  return pool.pop() || createVoice(type);
}

function releaseVoice(voice, type) {
  voice.reset();
  voicePool.get(type).push(voice);
}
```

### Buffer Caching
```javascript
// Cache decoded audio
const bufferCache = new Map();

async function loadBuffer(url) {
  if (bufferCache.has(url)) {
    return bufferCache.get(url);
  }
  const buffer = await fetchAndDecode(url);
  bufferCache.set(url, buffer);
  return buffer;
}
```

### Parameter Smoothing
```javascript
// Avoid clicks with parameter ramping
gain.setTargetAtTime(value, when, 0.01);
// Instead of: gain.setValueAtTime(value, when);
```

## Parameter Reference

### Source Parameters
- `s` - Sound source name
- `n` - Sample variant number
- `note` - MIDI note (overrides speed)
- `speed` - Playback rate multiplier
- `unit` - Time unit ('c'=cycles, 's'=seconds)

### Envelope
- `attack` - Attack time (0-1)
- `decay` - Decay time (0-1)
- `sustain` - Sustain level (0-1)
- `release` - Release time (0-1)

### Sample Control
- `begin` - Start position (0-1)
- `end` - End position (0-1)
- `loop` - Loop playback (0/1)
- `loopBegin` - Loop start point
- `loopEnd` - Loop end point
- `cut` - Cut group (stops others)

### Filters
- `cutoff` - Low-pass frequency
- `hcutoff` - High-pass frequency
- `bandq` - Band-pass Q
- `resonance` - Filter resonance
- `vowel` - Formant vowel

### Effects
- `gain` - Volume (0-1)
- `pan` - Stereo position (0-1)
- `room` - Reverb amount (0-1)
- `size` - Reverb size (0-1)
- `delay` - Delay mix (0-1)
- `delaytime` - Delay time
- `delayfeedback` - Feedback (0-1)

### FM Synthesis
- `fmh` - FM harmonicity
- `fmi` - FM modulation index
- `fmenv` - FM envelope amount
- `fmattack` - FM attack time
- `fmdecay` - FM decay time
- `fmsustain` - FM sustain level
- `fmrelease` - FM release time

### Modulation
- `vibrato` - Vibrato depth
- `vibratorate` - Vibrato rate
- `tremolo` - Tremolo depth
- `tremolorate` - Tremolo rate