# Module 7: Space & Dub - Effects as an Instrument

## Overview
In dub techno, effects aren't just polish—they're core instruments. Delay creates rhythm, reverb defines space, and filters become performative elements. This module explores how to use effects creatively, turning simple sounds into expansive, evolving textures that define the deeper side of techno.

## Learning Objectives
By the end of this module, you will be able to:
1. Use delay as a rhythmic and melodic instrument
2. Create spatial depth with reverb and positioning
3. Automate effects for dynamic movement
4. Understand dub techno production techniques
5. Build feedback systems that don't spiral out of control

## Core Concepts

### Effects in Strudel

```javascript
// Delay parameters
note("c3").s("sawtooth").delay(0.5)              // Wet/dry mix (0-1)
note("c3").s("sawtooth").delaytime(0.375)        // Delay time (in cycles)
note("c3").s("sawtooth").delayfeedback(0.7)      // Feedback amount (0-0.99)

// Reverb parameters
note("c3").s("sawtooth").room(0.5)               // Reverb mix (0-1)
note("c3").s("sawtooth").roomsize(0.8)           // Room size (0-1)
note("c3").s("sawtooth").roomfade(2)             // Reverb decay time
note("c3").s("sawtooth").roomlp(10000)           // Reverb lowpass filter
note("c3").s("sawtooth").roomdim(0.5)            // Reverb diffusion

// Filters for effects
note("c3").s("sawtooth").lpf(1000)               // Applied to entire signal
note("c3").s("sawtooth").djf(0.5)                // DJ filter (0=LP, 0.5=flat, 1=HP)
```

### Delay Mathematics

Understanding delay timing for rhythmic effects:

```javascript
// Common delay times in cycles
// 1/4 = 0.25    (quarter note)
// 3/8 = 0.375   (dotted eighth)
// 1/2 = 0.5     (half note)
// 2/3 = 0.667   (triplet)
// 3/4 = 0.75    (dotted half)

// Musical delay times
note("c3").s("sawtooth").delaytime(0.375)  // Dotted eighth (classic dub)
note("c3").s("sawtooth").delaytime(0.667)  // Triplet (polyrhythmic feel)
note("c3").s("sawtooth").delaytime(1.5)    // Bar and a half (long echo)
```

## Dub Techno Techniques

### 1. The Classic Dub Chord

```javascript
// Basic Minor 7th chord stab
const dubStab = note("c3").chord("m7")
  .s("supersaw")
  .unison(4)
  .detune(0.1)
  .attack(0.01)
  .release(0.1)
  .lpf(800)
  .gain(0.6)

// Transform it with dub effects
const dubChord = dubStab
  .struct("~ ~ x ~")  // Hit on 3rd beat
  .delay(0.8)         // Heavy delay
  .delaytime(0.375)   // Dotted eighth
  .delayfeedback(0.75)
  .lpf(sine.range(400, 2000).slow(16))  // Filter the delays
  .room(0.3)
  .gain(0.5)
```

### 2. Delay as Melody Generator

```javascript
// Single note becomes melodic pattern through delay
const delayMelody = note("c4")
  .struct("x ~ ~ ~ ~ ~ ~ ~")  // One hit
  .delay(0.9)
  .delaytime("0.375")  // Creates rhythmic pattern
  .delayfeedback(0.8)
  .s("triangle")
  .lpf(slow(8, sine.range(500, 2000)))  // Evolving tone
  .gain(0.5)

// Multiple delay lines for complexity
const complexDelay = note("c4")
  .s("square")
  .struct("x ~ ~ ~")
  .attack(0.001)
  .release(0.05)
  .add(12)  // Original note
  .stack(
    // Three different delay lines
    x => x.delay(0.6).delaytime(0.25).gain(0.7),
    x => x.delay(0.5).delaytime(0.375).gain(0.6),
    x => x.delay(0.4).delaytime(0.667).gain(0.5)
  )
```

### 3. Feedback Dub

```javascript
// Controlled feedback system
const feedbackDub = stack(
  // Sparse percussion trigger
  sound("rim").struct("~ ~ x ~").gain(0.8),
  
  // Becomes rhythmic pattern through delay
  sound("rim")
    .struct("~ ~ x ~")
    .delay(0.85)
    .delaytime(0.75)  // Dotted half note
    .delayfeedback(slow(32, sine.range(0.6, 0.85)))  // Varying feedback
    .lpf(slow(16, sine.range(1000, 4000)))
    .hpf(200)
    .gain(0.6)
).cpm(125)
```

### 4. Space Creation with Reverb

```javascript
// Near to far movement
const spatialMovement = note("c3 eb3 g3")
  .s("fm4")
  .release(0.1)
  .room(slow(16, sine.range(0, 0.8)))  // Dry to wet
  .roomsize(0.9)
  .gain(0.5)

// Different spaces for different elements
const spatialMix = stack(
  // Dry, upfront kick
  sound("bd*4").gain(0.9).room(0),
  
  // Mid-distance percussion
  sound("hh*16").euclid(11, 16).gain(0.4).room(0.2),
  
  // Distant atmosphere
  note("c2").s("pad").sustain(1).room(0.7).roomsize(0.95)
).cpm(125)
```

## Advanced Effect Techniques

### 1. Sidechain Compression via Effects

```javascript
// Simulate sidechain with delay ducking
const sidechainDelay = stack(
  sound("bd*4").gain(0.9),
  
  // Pad with delay that ducks on kicks
  note("cm7")
    .s("pad")
    .sustain(1)
    .delay(0.7)
    .delaytime(0.25)
    .delayfeedback(0.6)
    // Reduce delay on kick hits
    .delay("0.7 0.2 0.2 0.2".fast(4))
    .gain(0.4)
).cpm(128)
```

### 2. Resonant Delay Networks

```javascript
// Self-resonating delay system
const resonantDelay = note("c3")
  .s("sine")
  .struct("x ~ ~ ~ ~ ~ ~ ~")
  .delay(0.95)
  .delaytime(choose([0.25, 0.375, 0.5]))  // Random times
  .delayfeedback(0.9)
  .lpf(sine.range(200, 1000).slow(32))
  .resonance(20)  // Filter resonance adds character
  .gain(0.4)
  .every(8, x => x.delaytime(0.667))  // Occasional triplet
```

### 3. Granular-Style Effects

```javascript
// Pseudo-granular using very short delays
const granularEffect = s("pad")
  .note("c3")
  .sustain(1)
  .delay(0.8)
  .delaytime(rand.range(0.01, 0.05))  // Very short, random
  .delayfeedback(0.7)
  .pan(rand)
  .gain(0.3)
  .fast(8)  // Many grains
```

### 4. Dynamic Filter Effects

```javascript
// Filter as performance tool
const filterPerformance = stack(
  sound("bd*4").gain(0.9),
  
  // Full mix through filter
  cat(
    sound("cp").delay(0.7).delaytime(0.375),
    note("c2*8").s("bass").release(0.1)
  )
  .lpf(
    // Manual filter sweep points
    slow(32, cat(
      200, 200, 500, 1000,
      2000, 4000, 8000, 4000,
      2000, 1000, 500, 200
    ))
  )
  .resonance(15)
  .gain(0.6)
).cpm(125)
```

## Dub Techno Masters Study

### Basic Channel / Maurizio Style
```javascript
// Minimal, deep, spacious
const basicChannel = stack(
  // Minimal kick
  sound("bd*4").gain(0.85).lpf(100),
  
  // Classic dub chord
  note("cm9")
    .s("pad")
    .struct("~ ~ ~ x ~ ~ ~ ~")
    .attack(0.1)
    .release(0.5)
    .delay(0.8)
    .delaytime(0.375)
    .delayfeedback(0.8)
    .lpf(slow(64, sine.range(300, 1000)))
    .room(0.4)
    .roomsize(0.9)
    .gain(0.4),
    
  // Subtle bass
  note("c1*8")
    .s("sine")
    .release(0.1)
    .gain(0.6)
    .sometimes(x => x.delay(0.3).delaytime(0.125))
).cpm(120)
```

### Deepchord / Rod Modell Style
```javascript
// Lush, organic, field recordings
const deepchord = stack(
  // Kick with slight swing
  sound("bd*4").swing(0.05).gain(0.8),
  
  // Layers of filtered delay
  note("c2").chord("m11")
    .s("pad")
    .attack(2)
    .release(4)
    .delay(0.7)
    .delaytime(slow(32, sine.range(0.3, 0.4)))
    .delayfeedback(0.85)
    .lpf(600)
    .room(0.6)
    .roomsize(0.95)
    .gain(0.3),
    
  // Texture layer
  s("noise")
    .lpf(400)
    .resonance(5)
    .delay(0.6)
    .delaytime(0.75)
    .gain(0.1)
    .degradeBy(0.8)
).cpm(122)
```

### Rhythm & Sound Style
```javascript
// Reggae-influenced dub techno
const rhythmSound = stack(
  // Heavy, subsonic kick
  sound("bd*4").gain(0.95).lpf(80).shape(0.3),
  
  // Offbeat chord stabs
  note("cm7")
    .s("organ")
    .struct("~ x ~ x")
    .delay(0.9)
    .delaytime(0.375)
    .delayfeedback(0.7)
    .lpf(sine.range(400, 1200).slow(16))
    .room(0.5)
    .pan(sine.range(0.3, 0.7).slow(8))
    .gain(0.5),
    
  // Dub siren
  note(slow(8, sine.range("c3", "c5")))
    .s("sine")
    .gain(0.2)
    .delay(0.6)
    .delaytime(0.5)
    .sometimes(x => x)
).cpm(125)
```

## Performance Techniques

### 1. Live Dub Mixing

```javascript
// Setup for live manipulation
const liveeDub = stack(
  sound("bd*4").gain(0.9),
  sound("~ cp ~ cp").gain(0.7),
  
  // Element 1: Ready for delay throws
  sound("rim")
    .euclid(5, 8)
    .gain(0.5)
    .delay(0)  // <- Increase to 0.8 for effect
    .delaytime(0.375)
    .delayfeedback(0.7),
    
  // Element 2: Filter sweep ready
  note("c2*8")
    .s("bass")
    .release(0.1)
    .lpf(400)  // <- Sweep from 200 to 4000
    .gain(0.7),
    
  // Element 3: Space control
  note("cm7")
    .struct("~ ~ x ~")
    .s("epiano")
    .room(0.2)  // <- Increase to 0.8 for breakdown
    .gain(0.5)
).cpm(125)

// Performance notes:
// - Throw delays on percussion for builds
// - Open filters during drops
// - Increase reverb for breakdowns
// - Use delayfeedback carefully (max 0.9)
```

### 2. Effect Automation Patterns

```javascript
// Pre-programmed effect changes
const automatedDub = stack(
  sound("bd*4").gain(0.9),
  
  // Automated delay throws
  sound("cp")
    .struct("~ x ~ x")
    .delay(
      slow(16, cat(
        0, 0, 0, 0.8,  // Throw on bar 4
        0, 0, 0, 0,
        0, 0, 0.8, 0.8,  // Throw on bars 11-12
        0, 0, 0, 0
      ))
    )
    .delaytime(0.375)
    .delayfeedback(0.75)
    .gain(0.6)
).cpm(125)
```

## Practical Exercises

### Exercise 1: Delay Rhythm Design
Create a rhythm using only delays:

```javascript
// Start with single hit
const source = sound("click").struct("x ~ ~ ~ ~ ~ ~ ~");

// Build rhythm with delays
const delayRhythm = stack(
  source.delay(0.8).delaytime(0.25),    // Quarter notes
  source.delay(0.6).delaytime(0.375),   // Dotted eighths
  source.delay(0.4).delaytime(0.667)    // Triplets
).gain(0.5)
```

### Exercise 2: Spatial Journey
Design a pattern that moves through space:

```javascript
// From intimate to vast
const journey = note("c3 eb3 g3 c4")
  .s("piano")
  .room(slow(64, line(0, 0.9)))
  .roomsize(slow(64, line(0.5, 0.98)))
  .delay(slow(64, line(0, 0.7)))
  .gain(slow(64, line(0.8, 0.3)))  // Quieter as more distant
```

### Exercise 3: Feedback Control
Master feedback without chaos:

```javascript
// Safe feedback exploration
const feedback = note("c3")
  .s("fm4")
  .struct("x ~ ~ ~ ~ ~ ~ ~")
  .delay(0.9)
  .delaytime(0.5)
  // Feedback automation with safety
  .delayfeedback(
    slow(32, sine.range(0.5, 0.89))  // Never exceeds 0.9
  )
  .lpf(1000)  // Filter prevents harsh buildup
  .gain(0.4)
```

## Common Problems and Solutions

### Problem: Delays muddy the mix
**Solution**: Filter the delay return
```javascript
// High-pass filtered delay
sound("cp")
  .struct("~ x ~ x")
  .delay(0.7)
  .delaytime(0.375)
  .hpf(300)  // Remove low frequencies from delays
  .lpf(5000)  // Also remove extreme highs
```

### Problem: Feedback gets out of control
**Solution**: Limit feedback and add compression
```javascript
// Safe feedback setup
sound("hh")
  .struct("x*8")
  .delay(0.8)
  .delaytime(0.375)
  .delayfeedback(0.89)  // Keep below 0.9
  .shape(0.3)  // Soft compression
  .gain(0.6)   // Lower overall level
```

### Problem: Effects sound separate from dry signal
**Solution**: Blend and process together
```javascript
// Unified sound
const unified = note("c3")
  .s("sawtooth")
  .stack(
    x => x.gain(0.6),  // Dry signal
    x => x.delay(1).delaytime(0.375).gain(0.4)  // Wet signal
  )
  .lpf(1000)  // Filter both together
  .room(0.2)  // Reverb on everything
```

## Assessment Criteria

Your Module 7 submission should demonstrate:

1. **Effect Mastery** (30%)
   - Creative use of delay and reverb
   - Understanding of timing relationships
   - Effective automation techniques

2. **Spatial Design** (25%)
   - Clear depth and positioning
   - Coherent spatial narrative
   - Professional use of reverb

3. **Dub Techniques** (25%)
   - Authentic dub techno sound
   - Effective delay throws
   - Feedback control

4. **Musical Integration** (20%)
   - Effects enhance rather than dominate
   - Maintain groove and drive
   - Clear mix despite heavy effects

## Module Assignment

Create three dub techno studies:

1. **Classic Dub Techno**: Basic Channel inspired
   - Minimal elements (max 5 parts)
   - Heavy use of delay on one element
   - Evolving filter automation
   - 8-minute arrangement

2. **Spatial Composition**: Deepchord inspired
   - Create clear near/far relationships
   - Use reverb as primary tool
   - Include at least 3 spatial zones
   - Show movement between spaces

3. **Live Dub Performance**: Your style
   - Prepare code for live manipulation
   - Mark performance points in comments
   - Include "throw" moments
   - Record 5-minute performance

Requirements:
- Document all effect chains
- Export both dry and effected versions
- Include performance notes
- Show restraint and musicality

## Next Module Preview
In Module 8, we'll learn how to structure complete tracks, using conditional logic and arrangement techniques to create dynamic techno compositions that maintain energy across extended durations.