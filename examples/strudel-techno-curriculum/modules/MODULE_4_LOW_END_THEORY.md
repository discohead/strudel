# Module 4: The Low End Theory - Minimal Basslines

## Overview
The bassline is the soul of techno—it connects the rhythmic drive of the kick drum with the hypnotic elements above. In this module, we master the art of minimal bassline composition, exploring how simple patterns create maximum impact. We'll learn synthesis techniques, frequency management, and the subtle art of bassline-kick interaction that defines professional techno production.

## Learning Objectives
By the end of this module, you will be able to:
1. Synthesize powerful bass sounds using Strudel's oscillators
2. Write effective minimal basslines that complement kick patterns
3. Use filters and envelopes to shape bass character
4. Manage low frequencies to avoid muddiness
5. Create movement and evolution in basslines

## Core Concepts

### Bass Synthesis Fundamentals
The key oscillators for techno bass:

```javascript
// Sine: Pure sub bass
note("c1*8").s("sine").release(0.1).gain(0.8)

// Saw: Classic acid/techno bass
note("c1*8").s("saw").lpf(400).release(0.1).gain(0.7)

// Square: Hollow, powerful bass
note("c1*8").s("square").lpf(300).release(0.1).gain(0.7)

// Triangle: Softer, rounder bass
note("c1*8").s("tri").release(0.1).gain(0.8)
```

### The Kick-Bass Relationship
```javascript
// Bass and kick working together
stack(
  sound("bd*4").gain(0.9),
  
  // Bass avoids the kick
  note("c1 ~ c1 c1 ~ c1 ~ c1")
    .s("saw")
    .lpf(400)
    .release(0.1)
    .gain(0.7)
).cpm(130)
```

## Bassline Patterns

### 1. Classic Minimal Patterns

#### The Offset Bass
```javascript
// Bass hits between kicks
stack(
  sound("bd*4").gain(0.9),
  note("~ c1 ~ c1 ~ c1 ~ c1")
    .s("sine")
    .release(0.15)
    .gain(0.8)
).cpm(130)
```

#### The Rolling Bass
```javascript
// Continuous movement
note("c1*8")
  .s("saw")
  .lpf(400)
  .release(0.08)
  .gain("0.8 0.6")  // Accent pattern
  .cpm(130)
```

#### The Stabby Bass
```javascript
// Short, percussive hits
note("c1 ~ ~ c1 ~ c1 ~ ~")
  .s("square")
  .lpf(500)
  .attack(0.001)
  .release(0.05)
  .gain(0.8)
  .cpm(132)
```

### 2. Melodic Movement

#### Octave Jumps
```javascript
note("c1 c1 c2 c1 ~ c1 c2 ~")
  .s("saw")
  .lpf(600)
  .release(0.1)
  .gain(0.7)
```

#### Minor Progression
```javascript
// Hypnotic minor movement
note("<c1 eb1 f1 g1>*2")
  .s("sine")
  .release(0.15)
  .gain(0.8)
```

#### Call and Response
```javascript
note("c1 ~ ~ ~ eb1 ~ ~ ~ f1 ~ ~ ~ c1 ~ ~ ~")
  .s("saw")
  .lpf(500)
  .release(0.2)
  .gain(0.7)
```

### 3. Advanced Bass Techniques

#### Filter Modulation
```javascript
// Classic acid bass movement
note("c1*8")
  .s("saw")
  .lpf(sine.range(200, 2000).slow(4))  // Filter sweep
  .resonance(10)
  .release(0.1)
  .gain(0.7)
```

#### Envelope Modulation
```javascript
// Dynamic envelope shapes
note("c1*8")
  .s("saw")
  .attack(choose([0.001, 0.01, 0.02]))
  .release(choose([0.05, 0.1, 0.2]))
  .lpf(500)
  .gain(0.7)
```

#### FM Bass
```javascript
// Complex harmonic content
note("c1*8")
  .s("fm4")
  .fmi(sine.range(0, 5).slow(8))  // Modulation index
  .fmh(2)  // Harmonic ratio
  .release(0.1)
  .gain(0.6)
```

## Synthesis Deep Dive

### 1. Classic 303-Style Acid Bass
```javascript
// TB-303 emulation
const acid303 = note("c1 eb1 c1 g1 c1 bb0 c1 f1")
  .s("sawtooth")
  .lpf(sine.range(200, 3000).slow(2))
  .resonance(25)  // High resonance for squelch
  .ftype("ladder")  // Moog-style filter
  .distort(0.3)
  .attack(0.01)
  .decay(0.1)
  .sustain(0.2)
  .release(0.05)
  .gain(0.7)

stack(
  sound("bd*4").gain(0.9),
  acid303
).cpm(130)
```

### 2. Sub Bass Design
```javascript
// Pure sub for modern techno
const subBass = note("c1*8")
  .s("sine")
  .lpf(80)  // Only sub frequencies
  .attack(0.01)
  .release(0.05)
  .gain(0.9)
  
// Layer with mid bass for definition
const midBass = note("c1*8")
  .s("triangle")
  .hpf(80)
  .lpf(300)
  .attack(0.001)
  .release(0.05)
  .gain(0.5)

stack(
  sound("bd*4").gain(0.9),
  subBass,
  midBass
).cpm(130)
```

### 3. Reese Bass
```javascript
// Detuned saw bass
const reeseBass = note("c1*4")
  .s("supersaw")
  .unison(2)
  .detune(0.15)  // Slight detune for width
  .lpf(400)
  .attack(0.01)
  .release(0.2)
  .gain(0.6)
```

## Frequency Management

### EQ Strategies
```javascript
// Frequency separation between kick and bass
stack(
  // Kick owns 20-80Hz
  sound("bd*4")
    .gain(0.9)
    .lpf(80),
    
  // Bass owns 80-300Hz  
  note("c1*8")
    .s("saw")
    .hpf(80)
    .lpf(300)
    .release(0.1)
    .gain(0.7)
).cpm(130)
```

### Sidechain Compression Effect
```javascript
// Bass ducks when kick hits
const kickPattern = "1 0 0 0";
const sidechain = 1 - kickPattern;

stack(
  sound("bd*4").gain(0.9),
  
  note("c1*8")
    .s("saw")
    .lpf(400)
    .release(0.1)
    .gain(0.7)
    .mul(sidechain.fast(4))  // Apply ducking
).cpm(130)
```

## Style Studies

### Detroit Techno Bass (Juan Atkins)
```javascript
// Melodic, futuristic
const detroitBass = note("c1 ~ g1 ~ bb0 ~ f1 ~")
  .s("square")
  .lpf(600)
  .release(0.15)
  .gain(0.7)
  .delay(0.1)
  .delaytime(0.375)
  .delayfeedback(0.3)
```

### UK Acid Techno (Liberator DJs)
```javascript
// Aggressive 303 patterns
const ukAcid = note("c1 c1 eb1 c1 g1 c1 c2 c1")
  .fast(2)
  .s("sawtooth")
  .lpf(sine.range(300, 4000).fast(2))
  .resonance(30)
  .ftype("ladder")
  .distort(0.5)
  .gain(0.6)
```

### Berghain Techno (Function)
```javascript
// Dark, minimal, powerful
const berghainBass = note("c1 ~ ~ c1 ~ c1 ~ ~")
  .s("sine")
  .shape(0.2)  // Subtle distortion
  .lpf(100)
  .attack(0.001)
  .release(0.08)
  .gain(0.85)
```

## Practical Exercises

### Exercise 1: Bassline Variations
Create variations on a simple pattern:

```javascript
// Theme
const bassTheme = "c1 ~ c1 c1 ~ c1 ~ c1";

// Variation 1: Octave movement
note(bassTheme)
  .add("<0 0 12 0>")
  .s("saw")
  .lpf(400)
  .release(0.1)
  .gain(0.7)

// Variation 2: Note changes
note(bassTheme)
  .add("<0 3 5 7>")  // Add minor scale degrees
  .s("saw")
  .lpf(400)
  .release(0.1)
  .gain(0.7)

// Variation 3: Rhythm changes
note("c1 c1 ~ c1 c1 ~ c1 ~")
  .s("saw")
  .lpf(400)
  .release(0.1)
  .gain(0.7)
```

### Exercise 2: Bass Sound Design
Design three different bass sounds:

```javascript
// 1. Sub Bass
const subBass = note("c1*8")
  .s("sine")
  .lpf(60)
  .gain(0.9)

// 2. Mid Bass  
const midBass = note("c1*8")
  .s("triangle")
  .lpf(200)
  .resonance(5)
  .gain(0.7)

// 3. Top Bass
const topBass = note("c1*8")
  .s("square")
  .hpf(200)
  .lpf(800)
  .distort(0.2)
  .gain(0.5)

// Layer them
stack(subBass, midBass, topBass).cpm(130)
```

### Exercise 3: Bassline Evolution
Create a bassline that evolves over 32 bars:

```javascript
stack(
  sound("bd*4").gain(0.9),
  
  note("c1*8")
    .s("saw")
    // Filter opens over time
    .lpf(slow(32, line(200, 1000)))
    // Pattern gets busier
    .mask(slow(32, line(0.5, 1)))
    // Resonance increases
    .resonance(slow(32, line(0, 20)))
    .release(0.1)
    .gain(0.7)
).cpm(130)
```

## Common Problems and Solutions

### Problem: Bass masks the kick
**Solution**: Use EQ and timing
```javascript
stack(
  sound("bd*4").gain(0.9),
  // Bass avoids kick frequencies and timing
  note("~ c1 ~ c1 ~ c1 ~ c1")
    .s("saw")
    .hpf(80)  // High-pass to avoid kick
    .lpf(300)
    .release(0.08)
    .gain(0.7)
)
```

### Problem: Bass lacks punch
**Solution**: Layer and compress
```javascript
stack(
  // Sub layer
  note("c1*8").s("sine").lpf(80).gain(0.8),
  // Punch layer
  note("c1*8").s("square")
    .hpf(80).lpf(300)
    .attack(0.001)
    .release(0.05)
    .shape(0.3)  // Compression/saturation
    .gain(0.6)
)
```

### Problem: Bass sounds static
**Solution**: Add movement
```javascript
note("c1*8")
  .s("saw")
  .lpf(sine.range(300, 800).slow(8))
  .resonance(sine.range(5, 15).slow(16))
  .gain(sine.range(0.6, 0.8).fast(4))
  .release(0.1)
```

## Assessment Criteria

Your Module 4 submission should demonstrate:

1. **Sound Design** (30%)
   - Clean, powerful bass synthesis
   - Appropriate frequency content
   - Professional sound quality

2. **Pattern Writing** (30%)
   - Effective minimal patterns
   - Good kick-bass interaction
   - Musical movement

3. **Technical Skills** (20%)
   - Proper use of filters and envelopes
   - Good frequency management
   - Clean mixing

4. **Creativity** (20%)
   - Original patterns
   - Interesting sound design choices
   - Personal style development

## Module Assignment

Create three complete bassline arrangements:

1. **Classic Minimal**: Robert Hood style
   - Simple, effective pattern
   - Perfect kick-bass relationship
   - 64-bar arrangement with subtle variations

2. **Acid Evolution**: 303-inspired
   - Use filter modulation
   - Create tension and release
   - Include breakdown and build-up

3. **Modern Sub Bass**: Contemporary style
   - Layer sub and mid frequencies
   - Include sidechain effect
   - Demonstrate evolution over 128 bars

Requirements:
- Include kick drum for context
- Export each as separate audio file
- Document synthesis parameters used
- Explain frequency management approach

## Next Module Preview
In Module 5, we'll explore advanced synthesis techniques including FM, additive synthesis, and complex filter modulation to create signature techno sounds that define your unique style.