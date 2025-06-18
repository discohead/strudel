# Module 9: Texture & Soul - Integrating Samples

## Overview
While synthesis provides precision, samples bring soul. In this module, we explore how to integrate external audio—from vinyl crackle to field recordings—to add unique texture and character to techno productions. We'll learn sampling techniques that transform Strudel from a pattern sequencer into a sophisticated sampler.

## Learning Objectives
By the end of this module, you will be able to:
1. Load and manipulate audio samples effectively
2. Create unique textures through sample processing
3. Use field recordings and found sounds musically
4. Blend samples seamlessly with synthesized elements
5. Build a personal sample library

## Core Concepts

### Sample Manipulation in Strudel

```javascript
// Basic sample playback
s("mysample")                    // Play sample

// Sample selection
.n(2)                           // Select sample variant
.cut(1)                         // Cut group (stops overlaps)

// Playback control
.speed(0.5)                     // Playback rate (0.5 = half speed)
.begin(0.25)                    // Start position (0-1)
.end(0.75)                      // End position (0-1)
.loop(1)                        // Loop sample
.reverse(1)                     // Reverse playback

// Processing
.gain(0.8)                      // Volume
.pan(0.5)                       // Stereo position
.vowel("a")                     // Formant filter
```

### Sample Slicing Techniques

```javascript
// Manual slicing
s("breakbeat")
  .begin(seq(0, 0.25, 0.5, 0.75))    // 4 slices
  .end(seq(0.25, 0.5, 0.75, 1))

// Automatic slicing
s("breakbeat")
  .chop(16)                           // Divide into 16 slices
  .n(run(16))                         // Play sequentially

// Granular-style
s("pad")
  .begin(rand)                        // Random start
  .end(x => x.begin + 0.1)           // 10% grain size
  .speed(choose([0.5, 1, 2]))        // Varied pitch
```

## Sample Categories for Techno

### 1. Drum Samples and Breaks

```javascript
// Classic break manipulation
const amenBreak = s("amen")
  .speed(130/170)  // Original 170 BPM to 130 BPM techno
  .chop(16)
  
// Rearrange the break
const technoBreak = amenBreak
  .n("0 0 2 0 4 0 2 0 8 0 10 0 12 0 14 0")  // Kick-focused pattern
  .sometimes(x => x.speed(2))
  .lpf(sine.range(500, 3000).slow(16))
  .gain(0.7)

// Layer with techno kick
stack(
  sound("bd*4").gain(0.9),
  technoBreak.hpf(200)  // Remove low end to avoid clash
).cpm(130)
```

### 2. Atmospheric Textures

```javascript
// Vinyl crackle atmosphere
const vinyl = s("vinyl")
  .loop(1)
  .speed(0.8)
  .lpf(5000)
  .gain(0.2)
  .pan(sine.range(0.3, 0.7).slow(32))

// Field recording ambience
const fieldRec = s("trainstation")
  .begin(slow(64, line(0, 0.9)))  // Slowly scan through sample
  .end(x => x.begin + 0.1)
  .speed(0.5)
  .room(0.5)
  .hpf(300)
  .gain(0.3)

// Rain texture
const rain = s("rain")
  .loop(1)
  .speed(choose([0.8, 1, 1.2]))
  .lpf(sine.range(1000, 3000).slow(16))
  .gain(0.25)
```

### 3. Vocal Processing

```javascript
// Chopped vocal phrase
const vocalChop = s("vocal")
  .chop(8)
  .n(seq(0, 1, 1, 3, 4, 4, 6, 7))
  .speed(seq(1, 1, 0.5, 1, 2, 1, 1, 1))
  .vowel(choose(["a", "e", "i", "o", "u"]))
  .gain(0.6)
  .delay(0.3)
  .delaytime(0.375)

// Granular vocal texture
const vocalGrain = s("vocal")
  .begin(slow(32, sine.range(0, 0.8)))
  .end(x => x.begin + rand.range(0.05, 0.15))
  .speed(choose([0.5, 0.75, 1, 1.5]))
  .room(0.7)
  .gain(0.4)
  .often(x => x.reverse())

// Pitched vocal stabs
const vocalStab = s("vocal_hit")
  .speed(seq(1, 1.5, 0.75, 2))  // Melodic sequence
  .cut(1)  // Monophonic
  .release(0.1)
  .gain(0.5)
  .struct("x ~ x x ~ x ~ x")
```

### 4. Found Sound Percussion

```javascript
// Metal hits as percussion
const metalPerc = s("metal")
  .n(choose([0, 1, 2, 3]))
  .speed(seq(1, 0.9, 1.1, 0.8))
  .gain(0.4)
  .pan(rand)
  .euclid(5, 8)
  .hpf(1000)

// Glass samples as hi-hats
const glassHats = s("glass")
  .speed(4)  // Pitch up for hat-like sound
  .gain(0.3)
  .cut(2)
  .struct("x x x x x x x x x x x x x x x x")
  .sometimes(x => x.gain(0.5))

// Foley rhythms
const foleyRhythm = stack(
  s("keys").struct("x ~ ~ x ~ ~ x ~").gain(0.4),
  s("paper").struct("~ x ~ ~ x ~ ~ x").gain(0.3),
  s("wood").struct("~ ~ x ~ ~ x ~ ~").gain(0.5)
).speed(1.2)
```

## Advanced Sampling Techniques

### 1. Harmonic Sampling

Match samples to your track's key:

```javascript
// Tune samples to key of C
const tunedSample = s("chord")
  .speed(seq(1, 1.122, 1.26, 1.335))  // C, D, E, F ratios
  .cut(1)
  .gain(0.5)

// Auto-tune to scale
const melodicSample = s("string")
  .speed(note("c3 eb3 g3 bb3").value() / 60)  // 60 = middle C in sample
  .release(0.2)
  .gain(0.5)
```

### 2. Rhythmic Sample Integration

```javascript
// Sync loop to tempo
const loop = s("techno_loop")
  .speed(130/128)  // Original 128 to 130 BPM
  .loop(1)
  
// Sidechain compression effect
const sidechained = loop
  .gain(seq(0.3, 0.7, 0.3, 0.7).fast(4))  // Duck on kicks
  
// Rhythmic gating
const gated = loop
  .struct("x ~ x x ~ x ~ x . ~ x ~ x ~ ~ ~")
  .gain(0.6)
```

### 3. Textural Layering

```javascript
// Multi-layer texture
const texture = stack(
  // Base layer - continuous
  s("drone").loop(1).speed(0.5).gain(0.3),
  
  // Middle layer - rhythmic
  s("texture")
    .begin(seq(0, 0.25, 0.5, 0.75))
    .end(x => x.begin + 0.25)
    .gain(0.4)
    .pan(sine.range(0.2, 0.8).slow(8)),
    
  // Top layer - sparse accents
  s("sparkle")
    .speed(choose([0.5, 1, 2]))
    .gain(0.5)
    .struct("~ ~ x ~ ~ ~ ~ x")
    .reverse(choose([0, 1]))
).lpf(3000).room(0.3)
```

### 4. Creative Resampling

```javascript
// Record and manipulate your own output
const resample = s("bounce")  // Your recorded Strudel output
  .chop(32)
  .n(shuffle(run(32)))  // Randomize slice order
  .speed(choose([0.5, 1, 1.5, 2]))
  .sometimes(x => x.reverse())
  .gain(0.5)
  
// Feedback system (careful with levels!)
const feedback = s("feedback_loop")
  .begin(slow(16, sine.range(0, 0.8)))
  .end(x => x.begin + 0.2)
  .speed(0.95)  // Slight detune
  .delay(0.7)
  .delaytime(0.75)
  .delayfeedback(0.6)
  .lpf(2000)
  .gain(0.3)
```

## Building a Techno Sample Library

### Essential Sample Categories

1. **Drums**
   - Kicks: Sub-heavy, punchy, distorted
   - Claps/Snares: Crisp, wide, processed
   - Hi-hats: Closed, open, shaker variants
   - Percussion: Congas, rims, cowbells

2. **Textures**
   - Atmosphere: Vinyl, tape, field recordings
   - Noise: White, pink, filtered
   - Foley: Metal, glass, wood, plastic

3. **Musical**
   - Chords: Stabs, pads, organ hits
   - Bass: One-shots, loops
   - Vocals: Phrases, shouts, whispers

4. **Effects**
   - Sweeps: Risers, fallers
   - Impacts: Crashes, booms
   - Transitions: Whooshes, builds

### Sample Preparation Workflow

```javascript
// 1. Load and audition
s("newsample").gain(0.5)

// 2. Find useful sections
s("newsample")
  .begin(0.2)    // Start at 20%
  .end(0.4)      // End at 40%
  
// 3. Process for techno context
s("newsample")
  .begin(0.2).end(0.4)
  .speed(1.2)    // Tune to tempo
  .hpf(100)      // Remove rumble
  .lpf(8000)     // Remove harshness
  .gain(0.6)
  
// 4. Create variations
const sampleKit = n => s("newsample")
  .begin(0.2 + n * 0.1)
  .end(0.3 + n * 0.1)
  .speed(1 + n * 0.1)
  
// Use variations
sampleKit(choose([0, 1, 2, 3])).gain(0.5)
```

## Integration Strategies

### 1. Sample as Lead Element

```javascript
// Featured sample with support
stack(
  // Main sample hook
  s("vintage_synth")
    .chop(8)
    .n("0 1 1 3 4 4 6 7")
    .speed(1)
    .gain(0.7)
    .delay(0.4)
    .delaytime(0.375),
    
  // Supporting elements
  sound("bd*4").gain(0.9),
  note("c1*8").s("bass").release(0.1).gain(0.6),
  sound("hh*16").euclid(11, 16).gain(0.3)
).cpm(130)
```

### 2. Sample as Texture

```javascript
// Subtle textural enhancement
stack(
  // Main techno elements
  sound("bd*4").gain(0.9),
  note("c1*8").s("bass").release(0.1).gain(0.7),
  sound("hh*16").euclid(11, 16).gain(0.4),
  
  // Textural samples
  s("vinyl").loop(1).gain(0.15),  // Subtle crackle
  s("room_tone").loop(1).speed(0.8).gain(0.1).hpf(1000),  // Air
  s("tape_hiss").loop(1).gain(0.05).lpf(8000)  // Warmth
).cpm(130)
```

### 3. Sample as Transition

```javascript
// Transition effects
const riser = s("sweep_up")
  .speed(0.5)
  .gain(slow(8, line(0, 0.8)))
  .lpf(slow(8, line(500, 10000)))
  
const impact = s("crash")
  .speed(0.8)
  .room(0.5)
  .gain(0.7)
  
// Use in arrangement
stack(
  // Main pattern
  mainGroove,
  
  // Riser before drop
  riser.when(x => x.cycle >= 24 && x.cycle < 32, x => x),
  
  // Impact on drop
  impact.when(x => x.cycle === 32, x => x)
).cpm(130)
```

## Practical Exercises

### Exercise 1: Sample Rhythm Construction
Build a complete rhythm using only samples:

```javascript
// No synthesized sounds allowed
// Create kick, snare, hats, and percussion
// Must groove at 130 BPM
// Use creative processing
```

### Exercise 2: Vocal Science
Create three different treatments of the same vocal:

```javascript
// 1. Rhythmic chop
// 2. Ambient texture
// 3. Melodic sequence
// Each should sound completely different
```

### Exercise 3: Field Recording Integration
Record your own field recording and integrate it:

```javascript
// Record 30 seconds of environmental sound
// Process it into a techno-appropriate texture
// Use it in a full pattern
// Should enhance, not distract
```

## Common Problems and Solutions

### Problem: Samples sound out of place
**Solution**: Match the sonic character
```javascript
// Process to fit
s("bright_sample")
  .lpf(2000)      // Match track's brightness
  .room(0.1)      // Match spatial depth
  .gain(0.5)      // Appropriate level
  .hpf(100)       // Remove unnecessary lows
```

### Problem: Timing feels off
**Solution**: Quantize and adjust
```javascript
// Tighten timing
s("loose_loop")
  .chop(16)       // Requantize
  .n(run(16))
  .nudge(-0.01)   // Shift slightly earlier
```

### Problem: Samples muddy the mix
**Solution**: Frequency separation
```javascript
// Carve out space
s("full_sample")
  .hpf(300)       // Remove lows
  .lpf(5000)      // Remove extreme highs
  .notch(1000, 5) // Carve mid frequency
```

## Assessment Criteria

Your Module 9 submission should demonstrate:

1. **Sample Selection** (25%)
   - Appropriate choice of samples
   - Quality and character
   - Fits techno aesthetic

2. **Processing Skills** (30%)
   - Creative manipulation
   - Technical proficiency
   - Musical results

3. **Integration** (25%)
   - Seamless blending
   - Enhances overall track
   - Maintains groove

4. **Originality** (20%)
   - Unique sample sources
   - Creative techniques
   - Personal style

## Module Assignment

Create three sample-based compositions:

1. **Found Sound Techno**: All sounds from non-musical sources
   - Record/find 10 everyday sounds
   - Process into techno elements
   - Create 4-minute track
   - Document source materials

2. **Vocal Science**: Vocal-focused techno
   - Use single vocal sample
   - Create at least 5 variations
   - Build complete arrangement
   - Maintain techno energy

3. **Hybrid Integration**: 50/50 samples and synthesis
   - Perfect balance of both worlds
   - Samples enhance synthesis
   - 6-minute club track
   - Seamless integration

Requirements:
- Provide source samples
- Document processing chains
- Export both solo samples and full mix
- Credit all sample sources

## Next Module Preview
In Module 10, we'll master live coding performance, learning to improvise, build sets, and perform complete techno shows using Strudel as our instrument.