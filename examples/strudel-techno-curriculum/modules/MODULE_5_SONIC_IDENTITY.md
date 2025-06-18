# Module 5: Sonic Identity - Advanced Synthesis & Filtering

## Overview
Your sonic identity is what separates you from every other techno producer. In this module, we dive deep into advanced synthesis techniques, exploring FM synthesis, supersaw detuning, and creative filtering to craft signature sounds. We'll learn how the masters create their distinctive timbres and develop your own unique palette.

## Learning Objectives
By the end of this module, you will be able to:
1. Design complex sounds using FM synthesis
2. Create rich, detuned textures with supersaw
3. Master resonant filtering for techno aesthetics
4. Develop a personal library of signature sounds
5. Understand the relationship between timbre and emotion in techno

## Core Concepts

### Advanced Oscillators in Strudel

```javascript
// FM4: 4-operator FM synthesis
note("c3").s("fm4")
  .fmi(2)      // Modulation index
  .fmh(3.5)    // Harmonic ratio
  .fmenv(0.5)  // Envelope amount
  .fmattack(0.01)
  .fmdecay(0.1)

// Supersaw: Multiple detuned oscillators
note("c3").s("supersaw")
  .unison(7)    // Number of voices
  .detune(0.2)  // Detune amount
  .spread(0.8)  // Stereo spread

// Organ: Additive synthesis
note("c3").s("organ")
  .harmonics("[1, 0.5, 0.25, 0.125, 0.0625]")  // Harmonic amplitudes
```

### Filter Types and Character

```javascript
// Classic lowpass
.lpf(1000).resonance(10)

// Moog ladder filter emulation
.lpf(1000).resonance(20).ftype("ladder")

// Bandpass for focused sounds
.bpf(1000).bpq(5)

// Highpass for removing low end
.hpf(500)
```

## Sound Design Studies

### 1. The Surgeon Stab

Industrial, metallic, aggressive:

```javascript
// Signature Surgeon-style techno stab
const surgeonStab = note("<c3 eb3 g3 bb3>")
  .s("fm4")
  .fmi(sine.range(2, 8).slow(4))     // Dynamic FM amount
  .fmh(7.01)                          // Slightly detuned ratio for beating
  .attack(0.001)
  .decay(0.05)
  .sustain(0.1)
  .release(0.1)
  .lpf(2000)
  .resonance(15)
  .distort(0.4)
  .shape(0.3)
  .gain(0.6)

stack(
  sound("bd*4").gain(0.9),
  surgeonStab.struct("~ x ~ x ~ ~ x ~")
).cpm(140)
```

### 2. The Donato Dozzy Pad

Hypnotic, evolving, organic:

```javascript
// Ethereal, slowly morphing pad
const dozzyPad = note("c2")
  .s("supersaw")
  .unison(5)
  .detune(sine.range(0.1, 0.3).slow(32))
  .attack(4)
  .release(4)
  .lpf(sine.range(400, 1200).slow(16))
  .resonance(5)
  .room(0.7)
  .gain(0.3)
  .pan(sine.range(0.3, 0.7).slow(24))

// Subtle variations every cycle
const evolvingPad = dozzyPad
  .add(choose([0, 3, 5, 7, 10]))  // Minor pentatonic variations
  .sometimes(x => x.add(12))        // Occasional octave jump
```

### 3. The Jeff Mills Lead

Futuristic, precise, cutting:

```javascript
// Sharp, futuristic lead sound
const millsLead = note("c4 eb4 g4 c5")
  .s("square")
  .attack(0.001)
  .release(0.05)
  .lpf(3000)
  .resonance(20)
  .delay(0.3)
  .delaytime(0.375)  // Dotted eighth
  .delayfeedback(0.5)
  .gain(0.5)
  
// Rhythmic gating for Mills-style patterns
const gatedLead = millsLead
  .mask("1 0 1 1 0 1 0 1")
  .sometimes(x => x.fast(2))
```

### 4. The Rrose Texture

Dark, mysterious, spatial:

```javascript
// Complex textural element
const rroseTexture = stack(
  // Base drone
  note("c1").s("sine")
    .gain(0.4)
    .lpf(100),
    
  // Harmonic layer
  note("c2").s("organ")
    .harmonics("[1, 0, 0.5, 0, 0.25, 0, 0, 0.125]")
    .lpf(sine.range(200, 800).slow(64))
    .gain(0.3),
    
  // Noise layer
  s("pink")
    .lpf(sine.range(500, 2000).slow(32))
    .resonance(10)
    .gain(0.1)
)
.room(0.8)
.delay(0.4)
.delaytime(0.666)  // Triplet delay
```

## FM Synthesis Deep Dive

### Understanding FM Parameters

```javascript
// Basic FM relationship
note("c3").s("fm4")
  .fmi(1)    // Low index = few harmonics
  .fmh(1)    // Ratio 1:1 = harmonic sound

// Complex timbres
note("c3").s("fm4")
  .fmi(5)    // High index = many harmonics
  .fmh(3.5)  // Non-integer = inharmonic/metallic

// Animated FM
note("c3*8").s("fm4")
  .fmi(sine.range(0, 8).slow(8))      // Sweep modulation
  .fmh(choose([1, 2, 3.5, 7.01]))     // Random harmonics
  .fmenv(0.8)                         // Envelope affects FM amount
```

### FM Techno Presets

```javascript
// 1. FM Kick
const fmKick = note("c1")
  .s("fm4")
  .fmi(10)
  .fmh(0.5)
  .fmattack(0.001)
  .fmdecay(0.05)
  .attack(0.001)
  .decay(0.1)
  .sustain(0)
  .release(0.2)
  .gain(0.8)

// 2. FM Hi-Hat
const fmHat = note("c6")
  .s("fm4")
  .fmi(20)
  .fmh(11.3)  // Inharmonic ratio
  .attack(0.001)
  .release(0.02)
  .hpf(8000)
  .gain(0.4)

// 3. FM Bass
const fmBass = note("c1*8")
  .s("fm4")
  .fmi(2)
  .fmh(1)
  .fmenv(0.5)
  .lpf(400)
  .release(0.1)
  .gain(0.7)
```

## Supersaw Mastery

### Creating Wide, Rich Textures

```javascript
// Classic rave stab
const raveStab = note("<c4 eb4 g4 bb4>")
  .s("supersaw")
  .unison(8)
  .detune(0.3)
  .spread(0.9)
  .attack(0.001)
  .release(0.2)
  .lpf(2000)
  .resonance(10)
  .gain(0.5)

// Ambient supersaw pad
const ambientPad = note("c3")
  .s("supersaw")
  .unison(16)
  .detune(0.15)
  .spread(1)
  .attack(2)
  .release(4)
  .lpf(sine.range(800, 1500).slow(32))
  .room(0.5)
  .gain(0.3)

// Aggressive lead
const aggressiveLead = note("c4*8")
  .s("supersaw")
  .unison(3)
  .detune(0.4)
  .lpf(sine.range(1000, 5000).fast(2))
  .resonance(25)
  .distort(0.5)
  .gain(0.6)
```

## Creative Filtering Techniques

### 1. Filter as Rhythm

```javascript
// Rhythmic filter patterns
note("c2")
  .s("saw")
  .lpf("200 1000 200 2000".fast(4))
  .resonance(20)
  .sustain(1)
  .gain(0.6)
```

### 2. Vowel Filtering

```javascript
// Formant/vowel sounds
note("c3*8")
  .s("saw")
  .vowel("<a e i o u>")
  .gain(0.5)
```

### 3. Dual Filter Techniques

```javascript
// Bandpass sweep with resonance
note("c2")
  .s("saw")
  .bpf(sine.range(200, 2000).slow(8))
  .bpq(sine.range(1, 20).slow(16))
  .gain(0.6)
```

### 4. Self-Oscillating Filter

```javascript
// Filter becomes sound source at high resonance
note("c3*8")
  .s("saw")
  .lpf(sine.range(200, 1000).slow(4))
  .resonance(40)  // Self-oscillation
  .gain(0.4)
```

## Building Your Sound Palette

### Template Organization

```javascript
// --- BASS SOUNDS ---
const subBass = note("c1*8").s("sine").lpf(80).release(0.1);
const acidBass = note("c1*8").s("saw").lpf(500).resonance(20);
const fmBass = note("c1*8").s("fm4").fmi(2).fmh(1);

// --- LEAD SOUNDS ---
const sharpLead = note("c4").s("square").lpf(3000).resonance(15);
const fmLead = note("c4").s("fm4").fmi(5).fmh(7);
const superLead = note("c4").s("supersaw").unison(5).detune(0.2);

// --- PAD SOUNDS ---
const warmPad = note("c3").s("tri").attack(1).release(2);
const spacePad = note("c3").s("supersaw").unison(8).detune(0.1);
const fmPad = note("c3").s("fm4").fmi(1).fmh(2).attack(2);

// --- PERCUSSION ---
const fmHat = note("c6").s("fm4").fmi(30).fmh(11.3).release(0.02);
const metalHit = note("c5").s("fm4").fmi(15).fmh(5.7).release(0.05);
```

## Practical Exercises

### Exercise 1: FM Exploration
Create 5 different sounds using only FM synthesis:

```javascript
// 1. Bright pluck
note("c4*4").s("fm4").fmi(3).fmh(2).release(0.1)

// 2. Metallic percussion
note("c5*8").s("fm4").fmi(20).fmh(7.3).release(0.02)

// 3. Evolving bass
note("c1*8").s("fm4").fmi(sine.range(0, 5).slow(8)).fmh(1)

// 4. Bell tone
note("c5").s("fm4").fmi(5).fmh(3).release(2).gain(0.3)

// 5. Noise burst
note("c6*16").s("fm4").fmi(30).fmh(13.7).release(0.01)
```

### Exercise 2: Filter Animation
Create patterns using only filter modulation:

```javascript
// Single note, all movement from filter
note("c2")
  .s("saw")
  .sustain(1)
  .lpf(sine.range(100, 3000).segment(16))
  .resonance(cosine.range(0, 30).slow(4))
  .gain(0.6)
```

### Exercise 3: Signature Sound Design
Design your three signature sounds:

```javascript
// 1. Your signature stab
const myStab = // Your design here

// 2. Your signature bass  
const myBass = // Your design here

// 3. Your signature lead
const myLead = // Your design here
```

## Sound Design Philosophy

### The Minimal Approach
Less is more in techno:
- Start with simple waveforms
- Add complexity gradually
- Every parameter change should have purpose
- Space is as important as sound

### The Maximal Approach
Sometimes more is more:
- Layer multiple synthesis types
- Use extreme parameter values
- Push resonance to self-oscillation
- Embrace distortion and saturation

## Common Problems and Solutions

### Problem: Sounds too thin
**Solution**: Layer multiple oscillators
```javascript
stack(
  note("c3").s("saw").lpf(500),
  note("c3").s("square").lpf(300).detune(0.1),
  note("c2").s("sine").gain(0.5)
).gain(0.6)
```

### Problem: FM sounds harsh
**Solution**: Filter and envelope shaping
```javascript
note("c3").s("fm4")
  .fmi(8)
  .fmh(3.5)
  .lpf(1500)  // Remove harsh highs
  .attack(0.01)
  .release(0.2)
  .fmenv(0.5)  // Reduce FM over time
```

### Problem: Sounds don't cut through mix
**Solution**: Frequency focusing and distortion
```javascript
note("c4").s("saw")
  .hpf(200)   // Remove unnecessary lows
  .lpf(3000)  // Focus frequency range
  .resonance(15)  // Boost presence
  .distort(0.2)   // Add harmonics
  .gain(0.7)
```

## Assessment Criteria

Your Module 5 submission should demonstrate:

1. **Synthesis Mastery** (30%)
   - Effective use of FM synthesis
   - Creative supersaw applications
   - Understanding of synthesis principles

2. **Sound Design Quality** (30%)
   - Professional, usable sounds
   - Appropriate for techno context
   - Clean, well-balanced timbres

3. **Creative Innovation** (25%)
   - Original sound design choices
   - Personal style emerging
   - Risk-taking with parameters

4. **Technical Execution** (15%)
   - Proper gain staging
   - Efficient CPU usage
   - Well-commented code

## Module Assignment

Create a sound design portfolio:

1. **FM Suite**: 5 sounds using only FM synthesis
   - Bass, lead, pad, percussion, effect
   - Document parameters and ratios used
   - Explain the harmonic choices

2. **Filter Study**: 3 patterns using identical source
   - Same oscillator, different filter treatments
   - Show how filtering changes character
   - Include modulation and automation

3. **Signature Bank**: Your 10 essential sounds
   - 3 bass sounds
   - 3 lead/stab sounds
   - 2 pad sounds
   - 2 percussion sounds
   - Save as reusable code templates

Requirements:
- Export audio examples of each sound
- Include parameter documentation
- Demonstrate sounds in musical context
- Show evolution/modulation over time

## Next Module Preview
In Module 6, we'll explore probabilistic and generative techniques to create evolving patterns that maintain hypnotic interest over extended periods—the key to truly mesmerizing techno.