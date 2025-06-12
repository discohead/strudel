# Web Audio Integration Deep Dive

## Overview
Strudel's Web Audio integration provides real-time audio synthesis and playback in the browser through the `@strudel/webaudio` and `@strudel/superdough` packages.

## Architecture

### Audio Context Management
```javascript
// Global audio context singleton
let audioContext;
let destination;

export const getAudioContext = () => {
  if (!audioContext) {
    audioContext = new AudioContext();
    destination = audioContext.createGain();
    destination.connect(audioContext.destination);
  }
  return { audioContext, destination };
};
```

### Pattern Scheduler Integration
```javascript
// webaudio.mjs - main scheduler
export const webaudio = (options = {}) => {
  const { audioContext, destination } = getAudioContext();
  const scheduler = getScheduler();
  
  return (pat) => {
    // Query pattern and schedule audio events
    scheduler.setPattern(pat, (hap, deadline) => {
      // Play audio for this hap
      trigger(hap, deadline, audioContext);
    });
  };
};
```

## Cyclist Scheduler

### High-Precision Timing
```javascript
class Cyclist {
  constructor({ audioContext, onEvent, interval = 0.05 }) {
    this.audioContext = audioContext;
    this.onEvent = onEvent;
    this.interval = interval; // Lookahead time
    this.phase = 0;
  }
  
  query() {
    const now = this.audioContext.currentTime;
    const queryEnd = now + this.interval;
    
    // Query pattern for upcoming events
    const haps = this.pattern.queryArc(
      this.timeToBeats(now),
      this.timeToBeats(queryEnd)
    );
    
    // Schedule each event
    haps.forEach(hap => {
      const deadline = this.beatsToTime(hap.part.begin);
      this.onEvent(hap, deadline);
    });
  }
}
```

### Clock Synchronization
```javascript
// Convert between beat time and audio time
timeToBeats(time) {
  return (time - this.startTime) * this.cps + this.startBeat;
}

beatsToTime(beats) {
  return (beats - this.startBeat) / this.cps + this.startTime;
}
```

## Superdough Audio Engine

### Sample Playback
```javascript
// Sample loading and caching
const sampleCache = new Map();

export async function loadSample(url) {
  if (!sampleCache.has(url)) {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    sampleCache.set(url, audioBuffer);
  }
  return sampleCache.get(url);
}

// Sample playback node
function playSample(buffer, when, options) {
  const source = audioContext.createBufferSource();
  source.buffer = buffer;
  
  // Apply options
  source.playbackRate.value = options.speed || 1;
  
  // Create envelope
  const envelope = createADSR(audioContext, options);
  source.connect(envelope);
  
  // Start playback
  source.start(when, options.begin || 0, options.end);
  
  return envelope;
}
```

### Synthesis Engine
```javascript
// Oscillator-based synthesis
function synth(frequency, when, options = {}) {
  const { wave = 'sawtooth', detune = 0 } = options;
  
  // Create oscillator
  const osc = audioContext.createOscillator();
  osc.type = wave;
  osc.frequency.value = frequency;
  osc.detune.value = detune;
  
  // Create filter
  const filter = audioContext.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = options.cutoff || 2000;
  filter.Q.value = options.resonance || 1;
  
  // Connect graph
  osc.connect(filter);
  
  // Schedule
  osc.start(when);
  osc.stop(when + options.duration);
  
  return filter;
}
```

### Effects Processing
```javascript
// Reverb implementation
class Reverb {
  constructor(audioContext, { roomSize = 0.8, wet = 0.3 }) {
    this.input = audioContext.createGain();
    this.output = audioContext.createGain();
    this.wet = audioContext.createGain();
    this.dry = audioContext.createGain();
    
    // Create impulse response
    const convolver = audioContext.createConvolver();
    convolver.buffer = createImpulseResponse(audioContext, roomSize);
    
    // Routing
    this.input.connect(this.dry);
    this.input.connect(convolver);
    convolver.connect(this.wet);
    
    // Mix
    this.wet.gain.value = wet;
    this.dry.gain.value = 1 - wet;
    
    this.wet.connect(this.output);
    this.dry.connect(this.output);
  }
}

// Delay effect
class FeedbackDelay {
  constructor(audioContext, { time = 0.25, feedback = 0.5, wet = 0.3 }) {
    this.delay = audioContext.createDelay(10);
    this.delay.delayTime.value = time;
    
    this.feedback = audioContext.createGain();
    this.feedback.gain.value = feedback;
    
    this.wetGain = audioContext.createGain();
    this.wetGain.gain.value = wet;
    
    // Feedback loop
    this.delay.connect(this.feedback);
    this.feedback.connect(this.delay);
    
    this.delay.connect(this.wetGain);
  }
}
```

## Audio Worklet Support

### Custom DSP Processors
```javascript
// Processor definition
class GranularProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.grains = [];
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    const output = outputs[0];
    
    // Granular synthesis logic
    for (let channel = 0; channel < output.length; channel++) {
      for (let i = 0; i < output[channel].length; i++) {
        output[channel][i] = this.processGrain(input[channel][i]);
      }
    }
    
    return true; // Keep processor alive
  }
}

// Registration
audioContext.audioWorklet.addModule('granular-processor.js').then(() => {
  const granular = new AudioWorkletNode(audioContext, 'granular-processor');
});
```

## Pattern to Audio Mapping

### Control Parameters
```javascript
// Map pattern controls to audio parameters
const paramMap = {
  'n': (value) => mtof(value),        // Note to frequency
  's': (value) => getSample(value),    // Sample name
  'gain': (value) => dbToGain(value),  // Volume
  'pan': (value) => value,             // Stereo position
  'cutoff': (value) => value,          // Filter cutoff
  'resonance': (value) => value,       // Filter resonance
  'room': (value) => value,            // Reverb amount
  'delay': (value) => value,           // Delay time
};
```

### Event Triggering
```javascript
function trigger(hap, when, audioContext) {
  const params = hap.value;
  
  // Determine sound source
  let source;
  if (params.s) {
    // Sample playback
    const buffer = sampleCache.get(params.s);
    source = playSample(buffer, when, params);
  } else if (params.n !== undefined) {
    // Synth note
    const freq = mtof(params.n);
    source = synth(freq, when, params);
  }
  
  // Apply effects chain
  let node = source;
  
  if (params.cutoff) {
    const filter = createFilter(audioContext, params);
    node.connect(filter);
    node = filter;
  }
  
  if (params.room) {
    const reverb = getEffect('reverb');
    node.connect(reverb.input);
    node = reverb.output;
  }
  
  // Final output
  const gain = audioContext.createGain();
  gain.gain.value = params.gain || 1;
  node.connect(gain);
  gain.connect(destination);
}
```

## Visualization Integration

### Oscilloscope
```javascript
export function scope(options = {}) {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = options.fftSize || 2048;
  
  // Connect to audio
  destination.connect(analyser);
  
  // Drawing function
  const draw = () => {
    const data = new Float32Array(analyser.fftSize);
    analyser.getFloatTimeDomainData(data);
    
    // Render waveform
    drawWaveform(canvas, data, options);
    
    requestAnimationFrame(draw);
  };
  
  draw();
}
```

### Spectrum Analyzer
```javascript
export function spectrum(options = {}) {
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = options.fftSize || 2048;
  analyser.smoothingTimeConstant = 0.8;
  
  const draw = () => {
    const data = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(data);
    
    // Render spectrum
    drawSpectrum(canvas, data, options);
    
    requestAnimationFrame(draw);
  };
}
```

## Performance Optimization

### Object Pooling
```javascript
// Reuse audio nodes
const nodePool = {
  gains: [],
  filters: [],
  
  getGain() {
    return this.gains.pop() || audioContext.createGain();
  },
  
  releaseGain(node) {
    node.disconnect();
    node.gain.value = 1;
    this.gains.push(node);
  }
};
```

### Efficient Scheduling
```javascript
// Batch schedule events
const eventQueue = [];

function scheduleEvents(haps) {
  // Sort by time
  haps.sort((a, b) => a.part.begin - b.part.begin);
  
  // Schedule in batches
  const batchSize = 100;
  for (let i = 0; i < haps.length; i += batchSize) {
    const batch = haps.slice(i, i + batchSize);
    setTimeout(() => {
      batch.forEach(hap => trigger(hap));
    }, 0);
  }
}
```