# Module 11: Modular Thinking - System Design

## Overview
In modular synthesis, complex sounds emerge from the interconnection of simple modules. This module applies that philosophy to pattern design in Strudel. We'll explore how to build interconnected pattern networks, create feedback loops and cross-modulation between elements, and design systems where simple parts generate complex, evolving behaviors. This is the bridge between programming patterns and thinking like a modular system designer.

## Learning Objectives
By the end of this module, you will be able to:
1. Design interconnected pattern systems with cross-dependencies
2. Implement feedback loops and cross-modulation between patterns
3. Build complex behaviors from simple, reusable components
4. Create emergent patterns through system interactions
5. Think architecturally about pattern relationships

## Core Concepts

### Pattern as Module
Each pattern becomes a module that can send and receive control signals:

```javascript
// Modular voice using Strudel patterns
note(choose(["c3", "eb3", "g3", "bb3", "c4"]))
  .s("sawtooth")
  .cutoff(sine.range(200, 2000).slow(8))
  .gain(saw.range(0.3, 0.8).slow(4))
  .release(0.2)
  .cpm(130)
```

### Cross-Modulation Systems

```javascript
// Cross-modulation between rhythm and pitch
stack(
  // Base rhythm
  s("bd*4").gain(0.9),
  
  // Melodic pattern modulated by rhythm
  note("c3 eb3 g3 bb3")
    .s("sawtooth")
    .euclid(5, 8)
    .cutoff(perlin.range(400, 2000))
    .gain(0.5),
    
  // Rhythmic pattern modulated by pitch
  s("click*16")
    .gain(sine.range(0.1, 0.4).slow(4))
    .pan(saw.range(-0.8, 0.8).slow(3))
).cpm(130)
```

### Feedback Networks

```javascript
// Simulated feedback using pattern modulation
note("c3 eb3 g3 bb3")
  .s("fm")
  .fmi(perlin.range(0, 8))
  .fmh(sine.range(1, 4).slow(8))
  .gain(0.5)
  .room(0.3)
  .delay(0.25)
  .cpm(130)
```

## Modular Design Patterns

### 1. The Clock Divider System

Emulating modular clock division for polyrhythmic structures:

```javascript
// Clock division using euclidean rhythms and masks
stack(
  // Main kick - every 4
  s("bd*4").gain(0.9),
  
  // Snare - every 3 
  s("sd*8").mask("t f f").gain(0.7),
  
  // Hi-hat - rapid
  s("hh*16").gain(0.4),
  
  // FM hits - euclidean pattern
  note("c4").s("fm")
    .euclid(5, 16)
    .fmi(rand.range(0, 4))
    .gain(0.5),
    
  // Percussion - polyrhythmic
  s("rim*12").mask("t f f f").gain(0.3)
).cpm(130)
```

### 2. The Surgeon Modular Patch

Industrial techno through interconnected modules:

```javascript
// Surgeon-style industrial modular patch
stack(
  // Oscillator 1 - detuned saw
  note("c2").s("sawtooth")
    .lpf(sine.range(200, 2000).slow(4))
    .resonance(10)
    .gain(0.3),
    
  // Oscillator 2 - square with HPF
  note("c2").add(0.1).s("square")
    .hpf(saw.range(100, 1000).slow(7))
    .gain(0.3),
    
  // Oscillator 3 - triangle with BPF
  note("c2").sub(0.1).s("triangle")
    .lpf(perlin.range(300, 1500).slow(3))
    .gain(0.3)
)
  .add(perlin.range(-0.1, 0.1)) // slight detuning
  .distort(0.4)
  .shape(0.3)
  .euclid(3, 8)
  .cpm(140)
```

### 3. The Feedback FM Network

Self-modulating FM synthesis network:

```javascript
// FM operators that modulate each other
const createFMNetwork = () => {
  let op1Freq = 1;
  let op2Freq = 1;
  let op3Freq = 1;
  
  const operator1 = note("c3")
    .s("fm4")
    .fmh(op2Freq)
    .fmi(op3Freq);
    
  const operator2 = note("c3")
    .s("fm4")
    .fmh(op3Freq)
    .fmi(op1Freq)
    .onTrigger(x => {
      op2Freq = 1 + (x.value.note % 7);
    });
    
  const operator3 = note("c3")
    .s("fm4")
    .fmh(op1Freq)
    .fmi(op2Freq)
    .onTrigger(x => {
      op3Freq = 1 + (x.value.note % 5);
      op1Freq = 1 + (x.value.note % 3);
    });
  
  return stack(
    operator1.gain(0.3).pan(0.2),
    operator2.gain(0.3).pan(0.5),
    operator3.gain(0.3).pan(0.8)
  );
};

const fmNetwork = createFMNetwork()
  .struct("t ~ t t ~ t ~ t")
  .cpm(130)
```

### 4. The Generative Sequencer Network

Multiple sequencers influencing each other:

```javascript
// Sequencer modules
const seqA = shuffle([0, 3, 5, 7]);
const seqB = shuffle([0, 2, 4, 7]);
const seqC = shuffle([0, 1, 5, 8]);

// Cross-modulation matrix
const crossMod = {
  // A influences B's octave
  AtoB: x => x.add(seqA.fmap(n => n > 5 ? 12 : 0)),
  // B influences C's timing
  BtoC: x => x.euclid(seqB.fmap(n => 3 + (n % 4)), 16),
  // C influences A's filter
  CtoA: x => x.lpf(seqC.fmap(n => 200 + (n * 200)))
};

// Interconnected system
const modularSeq = stack(
  note("c3").add(seqA).s("sawtooth")
    .chain(crossMod.CtoA)
    .gain(0.5),
    
  note("c3").add(seqB).s("square")
    .chain(crossMod.AtoB)
    .gain(0.4),
    
  note("c3").add(seqC).s("triangle")
    .chain(crossMod.BtoC)
    .gain(0.3)
).cpm(132)
```

### 5. The Blawan Kick Modulation System

Complex kick drum synthesis through modular routing:

```javascript
// Modular kick synthesis
const blawanKick = () => {
  // Pitch envelope
  const pitchEnv = trigger
    .range(80, 20)
    .exp(0.05);
    
  // Amp envelope  
  const ampEnv = trigger
    .adsr(0.001, 0.05, 0.1, 0.1);
    
  // Harmonic modulator
  const harmonicMod = sine
    .fast(7)
    .range(1, 3);
    
  // FM feedback amount
  const feedbackAmount = saw
    .slow(16)
    .range(0, 8);
  
  // Main synthesis
  return note("c1")
    .s("fm4")
    .fmh(harmonicMod)
    .fmi(feedbackAmount)
    .freq(pitchEnv)
    .gain(ampEnv)
    .distort(0.6)
    .shape(0.4)
    .lpf(150);
};

// Use in pattern with modulation
stack(
  blawanKick().struct("t ~ ~ t ~ ~ t ~").gain(0.9),
  blawanKick().struct("~ ~ t ~ ~ t ~ ~").gain(0.6).hpf(200)
).cpm(135)
```

## Emergent Behaviors

### Self-Organizing Patterns

```javascript
// Pattern that evolves based on its own history
const createEvolvingSystem = () => {
  let history = [0, 3, 5, 7];
  let pointer = 0;
  
  return note("c3")
    .add(x => {
      const current = history[pointer % history.length];
      pointer++;
      
      // System rule: new notes based on interval analysis
      if (pointer % 8 === 0) {
        const lastInterval = history[history.length - 1] - history[history.length - 2];
        const newNote = (current + lastInterval + 12) % 12;
        history.push(newNote);
        
        // Keep history manageable
        if (history.length > 16) {
          history = history.slice(-16);
        }
      }
      
      return current;
    })
    .s("fm4")
    .fmi(x => (x.value.note % 12) * 0.5)
    .sometimes(x => x.add(12))
    .release(0.1);
};

const evolvingMelody = createEvolvingSystem()
  .euclid(5, 8)
  .delay(0.3)
  .gain(0.5)
  .cpm(130)
```

### Chaotic Attractors

```javascript
// Lorenz attractor for parameter modulation
const lorenzSystem = () => {
  let x = 0.1, y = 0, z = 0;
  const sigma = 10, rho = 28, beta = 8/3;
  const dt = 0.01;
  
  return signal(t => {
    // Lorenz equations
    const dx = sigma * (y - x);
    const dy = x * (rho - z) - y;
    const dz = x * y - beta * z;
    
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    
    return { x, y, z };
  });
};

const chaos = lorenzSystem();

const chaoticTechno = stack(
  sound("bd*4").gain(0.9),
  
  note("c3")
    .add(chaos.fmap(v => Math.floor(v.x) % 12))
    .s("fm4")
    .fmi(chaos.fmap(v => Math.abs(v.y) % 10))
    .lpf(chaos.fmap(v => 200 + Math.abs(v.z) * 50))
    .euclid(5, 8)
    .gain(0.4)
).cpm(132)
```

## Practical Exercises

### Exercise 1: Build a Clock Distribution Network
Create a master clock that drives multiple pattern divisions:

```javascript
// Your solution: Create a system where one master pattern
// controls the timing of at least 4 other patterns with
// different divisions and phase relationships
```

### Exercise 2: Design a Feedback Loop
Build a pattern where the output influences its own parameters:

```javascript
// Your solution: Create a melodic pattern where the pitch
// values affect the rhythm, and the rhythm affects the filter
```

### Exercise 3: Modular Drum Synth
Design a complete drum voice using modular principles:

```javascript
// Your solution: Build a kick drum from basic modules
// (oscillator, envelope, filter) that can be repatched
// for different sounds
```

### Exercise 4: Emergent Melody Generator
Create a self-modifying melodic system:

```javascript
// Your solution: Design a pattern that generates new notes
// based on analysis of previously played notes
```

## Advanced Techniques

### Voltage Control Emulation

```javascript
// Emulate CV control in modular systems
const cv = (min, max, signal) => signal.range(min, max);
const gate = pattern => pattern.struct("t ~ ~ t ~ t ~ ~");
const trigger = pattern => pattern.mask("t ~ ~ ~");

// Modular voice with CV control
const modularVoice = (cvPitch, cvFilter, cvAmp, gatePattern) => {
  return note("c3")
    .add(cvPitch)
    .s("sawtooth")
    .lpf(cvFilter)
    .gain(cvAmp)
    .mask(gatePattern);
};

// Patch the system
const patch = stack(
  modularVoice(
    cv(-12, 12, sine.slow(4)),      // Pitch CV
    cv(200, 2000, saw.slow(8)),     // Filter CV
    cv(0.3, 0.8, square.slow(2)),   // Amp CV
    gate("t*8")                       // Gate pattern
  )
).cpm(130)
```

### Matrix Mixing

```javascript
// Create a mixing matrix for signal routing
const mixMatrix = (sources, destinations, routingMatrix) => {
  return destinations.map((dest, i) => {
    return sources.reduce((acc, source, j) => {
      const amount = routingMatrix[i][j] || 0;
      return acc.add(source.mul(amount));
    }, silence());
  });
};

// Example: 3x3 routing matrix
const sources = [
  note("c3").s("sawtooth"),
  note("g3").s("square"),
  note("c4").s("triangle")
];

const routingMatrix = [
  [1, 0.5, 0],    // Destination 1: full source 1, half source 2
  [0, 1, 0.5],    // Destination 2: full source 2, half source 3
  [0.5, 0, 1]     // Destination 3: half source 1, full source 3
];

const mixed = mixMatrix(sources, [1, 2, 3], routingMatrix);
```

## Style Studies

### Karenn (Blawan & Pariah) - Brutal Modular Techno

```javascript
// Raw, distorted, modular chaos
const karennStyle = () => {
  // Unstable oscillator
  const unstableOsc = note("c1")
    .s("sawtooth")
    .detune(sine.range(-0.5, 0.5).fast(11));
    
  // Aggressive filter modulation
  const brutalFilter = x => x
    .lpf(saw.range(50, 500).fast(7))
    .resonance(30)
    .distort(0.8);
    
  // Chaotic rhythm generator
  const chaosRhythm = euclid(
    choose([3, 5, 7]),
    choose([8, 11, 13])
  );
  
  return stack(
    unstableOsc
      .chain(brutalFilter)
      .struct(chaosRhythm)
      .gain(0.8),
      
    // Metallic percussion
    s("metal")
      .n(rand.range(0, 10))
      .speed(rand.range(0.8, 1.2))
      .struct("t ~ t ~ ~ t ~ ~")
      .hpf(2000)
      .gain(0.5)
  );
};

karennStyle().cpm(138)
```

### Surgeon - Controlled Modular Precision

```javascript
// Precise, calculated modular techno
const surgeonModular = () => {
  // Precision oscillator bank
  const oscBank = stack(
    note("c2").s("sawtooth").detune(0),
    note("c2").s("sawtooth").detune(0.1),
    note("c2").s("sawtooth").detune(-0.1)
  );
  
  // Surgical filter sweeps
  const filterBank = [
    x => x.lpf(sine.range(200, 1000).slow(16)),
    x => x.hpf(cosine.range(100, 500).slow(12)),
    x => x.bpf(saw.range(400, 800).slow(8)).bpq(10)
  ];
  
  // Precise modulation routing
  return oscBank
    .chain(...filterBank)
    .distort(0.3)
    .shape(0.2)
    .struct("t ~ t t ~ t t ~")
    .gain(0.7);
};

stack(
  sound("bd*4").gain(0.9),
  surgeonModular()
).cpm(140)
```

## Common Pitfalls and Solutions

### Problem: Feedback loops cause audio explosions
**Solution**: Always limit feedback ranges and use soft clipping
```javascript
// Safe feedback implementation
const safeFeedback = (amount) => {
  return Math.tanh(amount * 0.5); // Soft clipping
};
```

### Problem: Too many interconnections become chaotic
**Solution**: Use mixing and scaling to control interaction strength
```javascript
// Controlled interaction
const interaction = (sourceA, sourceB, amount = 0.5) => {
  return sourceA.add(sourceB.mul(amount));
};
```

### Problem: System doesn't evolve predictably
**Solution**: Add constraints and rules to guide evolution
```javascript
// Constrained evolution
const evolve = (current, rule, constraint) => {
  const next = rule(current);
  return constraint(next);
};
```

## Assessment Criteria

Your Module 11 submission should demonstrate:

1. **System Design** (30%)
   - Clear modular architecture
   - Well-defined signal flow
   - Reusable components

2. **Interconnection** (25%)
   - Meaningful cross-modulation
   - Effective feedback loops
   - Balanced interactions

3. **Emergent Behavior** (25%)
   - Unexpected but musical results
   - Self-organizing patterns
   - Evolution over time

4. **Technical Implementation** (20%)
   - Clean, efficient code
   - Proper parameter ranges
   - System stability

## Module Assignment

Create a complete modular techno system that demonstrates:

1. **A Master Clock Network**: Design a clock distribution system that drives at least 5 different pattern elements with various divisions and phase relationships

2. **A Feedback Synthesis Engine**: Build a synthesis voice where at least 3 parameters influence each other in a feedback network

3. **An Emergent Composition**: Create a 32-bar arrangement that evolves through system interactions rather than explicit programming

Requirements:
- Use at least 3 different types of cross-modulation
- Include both audio-rate and control-rate modulations
- System should remain stable but generate variety
- Total code should be under 100 lines
- Include comments explaining signal routing

Bonus: Create a "patch sheet" diagram showing your modular routing

## Next Module Preview

In Module 12: The Acid Dimension, we'll dive deep into 303 emulation, exploring how to create authentic acid basslines with filter modulation, accent patterns, and the characteristic sound of resonant filter sweeps that defined an era of techno.