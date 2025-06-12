# AGENTS.md - @strudel/superdough

Specialized guidance for AI agents working on the superdough synthesis engine. This package is the audio heart of Strudel, handling all sound generation and effects.

## Quick Start (1 minute validation)

```bash
# From packages/superdough directory
pnpm test  # Should pass synthesis tests

# Note: Audio synthesis requires browser environment
# Many features need manual listening tests
```

## Superdough Package Context

### Purpose
Web Audio synthesis engine providing sample playback, synthesizers, and effects processing with SuperCollider-inspired parameter names.

### Key Files
- `superdough.mjs` - Main synthesis engine
- `sampler.mjs` - Sample loading and playback
- `synth.mjs` - Oscillator synthesizers
- `reverb.mjs` - Reverb implementation
- `feedbackdelay.mjs` - Delay effect
- `vowel.mjs` - Formant filter
- `helpers.mjs` - Audio utilities

### References
- Local: `CLAUDE.md` in this directory
- Global: `/claude/technologies/audio-synthesis.md`
- Rules: `/.cursor/rules/components/audio-effects.mdc`

## Common Agent Tasks

### 1. Adding New Synthesizer Types (5-7 minutes)

#### Task Checklist
- [ ] Define oscillator configuration
- [ ] Implement synthesis function
- [ ] Add parameter handling
- [ ] Register synth type
- [ ] Add tests and documentation
- [ ] Test audio quality manually

#### Example: Adding a Pulse Wave Synth
```javascript
// In synth.mjs - add to synth types
export const synthTypes = {
  // ... existing synths
  pulse: (value, deadline, hapDuration) => {
    const { note = 60, gain = 0.5, attack = 0.001, decay = 0.1, 
            sustain = 0.5, release = 0.1, width = 0.5 } = value;
    
    const freq = midiToFreq(note);
    const ctx = getAudioContext();
    
    // Create pulse wave using two square waves
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const mix = ctx.createGain();
    
    osc1.type = 'square';
    osc2.type = 'square';
    osc1.frequency.value = freq;
    osc2.frequency.value = freq;
    
    // Phase shift for pulse width
    osc2.detune.value = width * 100; // Width controls phase
    
    gain1.gain.value = 1;
    gain2.gain.value = -1; // Invert second oscillator
    
    // Connect graph
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(mix);
    gain2.connect(mix);
    
    // Apply envelope
    const env = getEnvelope(attack, decay, sustain, release, 
                           gain, deadline, hapDuration);
    mix.connect(env);
    
    // Start oscillators
    osc1.start(deadline);
    osc2.start(deadline);
    
    const stop = deadline + hapDuration + release;
    osc1.stop(stop);
    osc2.stop(stop);
    
    return env;
  }
};

// In superdough.mjs - handle the new synth
if (synthTypes[s]) {
  return synthTypes[s](value, deadline, hapDuration);
}
```

### 2. Adding Audio Effects (6-8 minutes)

#### Task Checklist
- [ ] Create effect audio nodes
- [ ] Add parameter mapping
- [ ] Integrate into signal chain
- [ ] Handle wet/dry mixing
- [ ] Test with various sounds
- [ ] Document parameter ranges

#### Example: Adding a Chorus Effect
```javascript
// New file: chorus.mjs
export function createChorus(ctx, params = {}) {
  const { 
    rate = 1.5,      // LFO rate in Hz
    depth = 0.002,   // Delay modulation depth in seconds
    mix = 0.5        // Wet/dry mix
  } = params;
  
  // Create nodes
  const input = ctx.createGain();
  const output = ctx.createGain();
  const dry = ctx.createGain();
  const wet = ctx.createGain();
  const delay = ctx.createDelay(0.1);
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  
  // Configure
  dry.gain.value = 1 - mix;
  wet.gain.value = mix;
  delay.delayTime.value = 0.02; // Base delay
  lfo.frequency.value = rate;
  lfoGain.gain.value = depth;
  
  // Connect graph
  input.connect(dry);
  input.connect(delay);
  delay.connect(wet);
  
  lfo.connect(lfoGain);
  lfoGain.connect(delay.delayTime);
  
  dry.connect(output);
  wet.connect(output);
  
  // Start LFO
  lfo.start();
  
  return {
    input,
    output,
    setMix: (value) => {
      dry.gain.value = 1 - value;
      wet.gain.value = value;
    },
    setRate: (value) => lfo.frequency.value = value,
    setDepth: (value) => lfoGain.gain.value = value
  };
}

// In superdough.mjs - integrate chorus
if (value.chorus !== undefined) {
  const chorus = createChorus(ctx, {
    mix: value.chorus,
    rate: value.chorusrate || 1.5,
    depth: value.chorusdepth || 0.002
  });
  
  // Insert in signal chain
  lastNode.connect(chorus.input);
  lastNode = chorus.output;
}
```

### 3. Optimizing Voice Allocation (4-6 minutes)

#### Task Checklist
- [ ] Analyze voice usage patterns
- [ ] Implement smart voice stealing
- [ ] Add priority system
- [ ] Test polyphony limits
- [ ] Monitor performance impact

#### Example: Priority-Based Voice Stealing
```javascript
// Enhanced voice management
class VoiceAllocator {
  constructor(maxVoices = 16) {
    this.maxVoices = maxVoices;
    this.activeVoices = [];
    this.freeVoices = [];
  }
  
  allocate(priority = 0.5) {
    // Try free voice first
    if (this.freeVoices.length > 0) {
      return this.freeVoices.pop();
    }
    
    // Need to steal a voice
    if (this.activeVoices.length >= this.maxVoices) {
      // Sort by priority and age
      this.activeVoices.sort((a, b) => {
        if (a.priority !== b.priority) {
          return a.priority - b.priority; // Lower priority first
        }
        return a.startTime - b.startTime; // Older first
      });
      
      // Steal lowest priority/oldest voice
      const stolen = this.activeVoices.shift();
      stolen.stop();
      
      return stolen;
    }
    
    // Create new voice
    return this.createVoice();
  }
  
  release(voice) {
    const index = this.activeVoices.indexOf(voice);
    if (index >= 0) {
      this.activeVoices.splice(index, 1);
      this.freeVoices.push(voice);
    }
  }
  
  createVoice() {
    return new Voice(this);
  }
}

// Usage in superdough
const allocator = new VoiceAllocator();

export function superdough(value, deadline) {
  // Calculate priority based on parameters
  const priority = value.gain || 0.5; // Louder = higher priority
  
  const voice = allocator.allocate(priority);
  voice.play(value, deadline);
}
```

### 4. Working with ZZFX Synths (5-6 minutes)

#### Task Checklist
- [ ] Understand ZZFX parameter mapping
- [ ] Create game sound presets
- [ ] Add new ZZFX-based effects
- [ ] Test retro sound generation
- [ ] Document parameter ranges

#### Example: Creating ZZFX Game Sound Presets
```javascript
// In zzfx-presets.mjs - create preset library
export const zzfxPresets = {
  // Retro game sounds
  laser: {
    s: 'z_square',
    note: 90,
    slide: -0.3,
    attack: 0,
    decay: 0,
    release: 0.1,
    duration: 0.1,
    curve: 0
  },
  
  explosion: {
    s: 'z_noise',
    zcrush: 4,
    decay: 0,
    release: 0.5,
    slide: -0.1,
    tremolo: 0.8,
    duration: 0.5
  },
  
  powerup: {
    s: 'z_sawtooth',
    note: 40,
    slide: 0.3,
    zmod: 2,
    attack: 0.1,
    release: 0.3,
    curve: 2,
    duration: 0.5
  },
  
  hurt: {
    s: 'z_square',
    note: 30,
    zrand: 0.5,
    znoise: 0.5,
    attack: 0,
    release: 0.2,
    curve: 0,
    duration: 0.2
  },
  
  jump: {
    s: 'z_square',
    note: 50,
    pitchJump: 12,
    pitchJumpTime: 0.1,
    curve: 0,
    duration: 0.2
  }
};

// Register presets as sounds
export function registerZZFXPresets() {
  Object.entries(zzfxPresets).forEach(([name, params]) => {
    registerSound(`zfx_${name}`, (t, value, onended) => {
      const merged = { ...params, ...value };
      return getZZFX(merged, t, onended);
    }, { type: 'zzfx-preset', prebake: true });
  });
}

// Usage in patterns
s("zfx_laser zfx_explosion").speed(0.5)
s("zfx_powerup").delay(0.5).room(0.3)
```

#### Creating Custom ZZFX Waveforms
```javascript
// Extend ZZFX with custom wave shapes
function customZZFXWave(name, shapeFunction) {
  registerSound(`z_${name}`, (t, value, onended) => {
    // Custom wave generation
    const samples = generateCustomWave(shapeFunction, value);
    const buffer = createBufferFromSamples(samples);
    
    const source = getAudioContext().createBufferSource();
    source.buffer = buffer;
    source.start(t);
    
    return {
      node: source,
      stop: () => source.stop()
    };
  }, { type: 'zzfx-custom', prebake: true });
}

// Example: Pulse width modulation wave
customZZFXWave('pwm', (phase, params) => {
  const { pw = 0.5, pwrate = 0 } = params;
  const modulated = pw + Math.sin(phase * pwrate) * 0.3;
  return phase % 1 < modulated ? 1 : -1;
});
```

#### ZZFX Parameter Animation
```javascript
// Animate ZZFX parameters over time
const animatedLaser = note("c4")
  .s("z_square")
  .slide(sine.range(-0.5, -0.1))
  .zmod(saw.range(0, 3))
  .curve(square.range(0, 2))
  .duration(0.2);

// Morphing between ZZFX sounds
const morph = s("z_square z_sawtooth z_tan z_noise")
  .zrand("<0 0.2 0.5 1>")
  .znoise("<0 0.1 0.3 0.5>")
  .duration(0.5);
```

### 5. Adding Worklet Processors (7-8 minutes)

#### Task Checklist
- [ ] Write AudioWorkletProcessor
- [ ] Handle parameter automation
- [ ] Implement process() method
- [ ] Register processor
- [ ] Create wrapper node
- [ ] Test in supported browsers

#### Example: Bitcrusher Worklet
```javascript
// bitcrusher-processor.js
class BitcrusherProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bits', defaultValue: 16, minValue: 1, maxValue: 16 },
      { name: 'rate', defaultValue: 44100, minValue: 1000, maxValue: 44100 }
    ];
  }
  
  constructor() {
    super();
    this.phase = 0;
    this.lastSample = 0;
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    if (!input || !input[0]) return true;
    
    const bits = parameters.bits[0];
    const rate = parameters.rate[0];
    const step = 1 / Math.pow(2, bits);
    const phaseIncr = rate / sampleRate;
    
    for (let channel = 0; channel < output.length; channel++) {
      const inputChannel = input[channel];
      const outputChannel = output[channel];
      
      for (let i = 0; i < outputChannel.length; i++) {
        // Sample rate reduction
        this.phase += phaseIncr;
        if (this.phase >= 1) {
          this.phase -= 1;
          this.lastSample = inputChannel[i];
        }
        
        // Bit depth reduction
        outputChannel[i] = Math.round(this.lastSample / step) * step;
      }
    }
    
    return true;
  }
}

registerProcessor('bitcrusher', BitcrusherProcessor);

// In superdough.mjs - use the worklet
if (value.crush !== undefined) {
  await ctx.audioWorklet.addModule('bitcrusher-processor.js');
  
  const crusher = new AudioWorkletNode(ctx, 'bitcrusher');
  crusher.parameters.get('bits').value = 16 - (value.crush * 15);
  
  lastNode.connect(crusher);
  lastNode = crusher;
}
```

## ZZFX-Specific Guidelines

### ZZFX Parameter Reference
```javascript
// ZZFX uses a 20-parameter array internally:
const zzfxParams = [
  volume,         // 0: Volume (0-1)
  randomness,     // 1: Frequency randomness (zrand)
  frequency,      // 2: Base frequency in Hz
  attack,         // 3: Attack time (seconds)
  sustain,        // 4: Sustain time (seconds)
  release,        // 5: Release time (seconds)
  shape,          // 6: Wave shape (0-4)
  shapeCurve,     // 7: Curve amount (0=square wave)
  slide,          // 8: Frequency slide
  deltaSlide,     // 9: Slide acceleration
  pitchJump,      // 10: Pitch jump amount
  pitchJumpTime,  // 11: Time to pitch jump
  repeatTime,     // 12: LFO/repeat time
  noise,          // 13: Noise amount (znoise)
  modulation,     // 14: Ring mod amount (zmod)
  bitCrush,       // 15: Bit crush (zcrush)
  delay,          // 16: Delay amount (zdelay)
  sustainVolume,  // 17: Sustain volume level
  decay,          // 18: Decay time
  tremolo         // 19: Tremolo amount
];

// Shape values:
// 0 = sine
// 1 = triangle
// 2 = sawtooth
// 3 = tan
// 4 = noise
```

### ZZFX Sound Design Tips
1. **Start Simple**: Begin with basic waveform and add effects
2. **Envelope First**: Set ADSR before adding modulation
3. **Subtle Randomness**: Small zrand values (0.01-0.1) add life
4. **Curve Control**: Use curve=0 for pure square waves
5. **Pitch Effects**: Combine slide and pitchJump for complex movements
6. **Bit Crushing**: Lower values = more distortion (1-16)

### Common ZZFX Patterns
```javascript
// Chiptune bass
s("z_square")
  .note("c2 c2 g2 c3")
  .curve(0)
  .attack(0)
  .decay(0.01)
  .sustain(0.9)
  .release(0.01)

// Glitch percussion
s("z_noise")
  .zcrush("<1 4 8 16>")
  .zmod("<0 1 2 3>")
  .duration(0.05)

// Sci-fi ambience
s("z_tan")
  .note(30)
  .zrand(0.3)
  .znoise(0.5)
  .tremolo(0.2)
  .lfo(0.5)
  .attack(0.5)
  .release(1)
  .duration(2)
```

## Testing Strategies

### ZZFX Testing Patterns
```javascript
describe('zzfx synthesis', () => {
  it('generates correct waveform shape', () => {
    const samples = buildSamples(
      1,    // volume
      0,    // randomness
      440,  // frequency
      0,    // attack
      0.1,  // sustain
      0,    // release
      0,    // shape (sine)
      1     // curve
    );
    
    // Test first cycle is sine-like
    expect(samples[0]).toBe(0);
    expect(samples[Math.floor(samples.length/4)]).toBeCloseTo(1, 1);
  });
  
  it('applies bit crushing correctly', () => {
    const params = { s: 'z_square', zcrush: 4 };
    const processed = getZZFX(params, 0);
    
    // Verify bit depth reduction
    const uniqueValues = new Set(processed.samples);
    expect(uniqueValues.size).toBeLessThan(256);
  });
});
```

### Unit Test Patterns
```javascript
describe('superdough', () => {
  let mockContext;
  
  beforeEach(() => {
    mockContext = createMockAudioContext();
  });
  
  it('creates correct oscillator type', () => {
    const nodes = [];
    mockContext.createOscillator = () => {
      const osc = { type: null, connect: jest.fn() };
      nodes.push(osc);
      return osc;
    };
    
    superdough({ s: 'square' }, 0);
    expect(nodes[0].type).toBe('square');
  });
  
  it('applies envelope correctly', () => {
    const gain = { gain: { setValueAtTime: jest.fn() } };
    applyEnvelope(gain, { attack: 0.1, decay: 0.2 }, 0);
    
    expect(gain.gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
  });
});
```

### Audio Quality Testing
```javascript
// Manual test helpers
function testSynth(type) {
  const pattern = note("c3 e3 g3 c4").s(type);
  pattern.play();
  
  console.log(`Testing ${type} synth - listen for:
    - Clean attack/release
    - No clicks or pops
    - Correct pitch
    - Expected timbre`);
}

// Test all synths
['sine', 'saw', 'square', 'triangle', 'fm'].forEach(testSynth);
```

## Common Validation Errors

### 1. Voice Limit Reached
```
Issue: Notes cut off unexpectedly
Fix: Increase voice pool size or implement better stealing
```

### 2. Parameter Out of Range
```
Error: Failed to set AudioParam value
Fix: Clamp parameters to valid ranges
```

### 3. Sample Not Loaded
```
Error: Cannot read property 'buffer' of undefined
Fix: Ensure samples are loaded before playback
```

### 4. Worklet Not Supported
```
Error: audioWorklet is undefined
Fix: Provide fallback for unsupported browsers
```

## Performance Considerations

### Voice Management
1. **Pool Size**: Balance polyphony vs memory usage
2. **Voice Stealing**: Use intelligent algorithms
3. **Early Release**: Stop silent voices early
4. **Node Reuse**: Recycle audio nodes when possible

### DSP Optimization
```javascript
// Efficient parameter updates
const updateParam = (param, value, time, smooth = true) => {
  if (smooth) {
    param.setTargetAtTime(value, time, 0.01);
  } else {
    param.setValueAtTime(value, time);
  }
};

// Batch node creation
const createFilterChain = (ctx) => {
  const nodes = {
    input: ctx.createGain(),
    lpf: ctx.createBiquadFilter(),
    hpf: ctx.createBiquadFilter(),
    output: ctx.createGain()
  };
  
  // Connect once
  nodes.input.connect(nodes.lpf);
  nodes.lpf.connect(nodes.hpf);
  nodes.hpf.connect(nodes.output);
  
  return nodes;
};
```

## Integration Points

### With WebAudio Package
```javascript
// WebAudio calls superdough
import { superdough } from '@strudel/superdough';

const playEvent = (hap) => {
  superdough(
    hap.value,
    hap.whole.begin.valueOf(),
    hap.duration
  );
};
```

### With Pattern System
```javascript
// Patterns define sound parameters
note("c3 e3 g3")
  .s("fm")
  .fmh("<1 2 3>")
  .fmi("0.5 2 4")

// Superdough interprets them
// Each event becomes a superdough() call
```

## Quick Debug Commands

```bash
# Run tests
pnpm test

# Test specific synth
node -e "
  import { superdough } from './superdough.mjs';
  const ctx = new AudioContext();
  superdough({ s: 'fm', note: 60 }, ctx.currentTime);
"

# Check sample loading
# In browser console:
# Check loaded samples
# Monitor voice count
```

## When to Escalate

Escalate to human review if:
- Core synthesis algorithms change
- New DSP algorithms needed
- Audio quality issues reported
- Browser compatibility problems
- Performance degradation > 20%

Remember: Superdough is where the sound happens. Audio quality and performance are critical. Test by listening!