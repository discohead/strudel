# Module 2: The Groove Engine - Hi-Hats & Claps

## Overview
The groove is what makes people move. In this module, we explore how hi-hats, claps, and snares create the forward momentum and swing that define great techno. We'll master Euclidean rhythms—a mathematical approach to creating complex, hypnotic patterns that are central to modern techno production.

## Learning Objectives
By the end of this module, you will be able to:
1. Create complex hi-hat patterns using Euclidean rhythms
2. Place claps and snares for maximum groove impact
3. Layer multiple percussion elements without cluttering the mix
4. Use panning and dynamics to create spatial interest
5. Understand how groove relates to hypnotic states in dance music

## Core Concepts

### Euclidean Rhythms
Euclidean rhythms distribute hits as evenly as possible across a pattern:

```javascript
// Basic Euclidean rhythm: 5 hits across 8 steps
sound("hh*8").euclid(5, 8)

// Rotated Euclidean: shifts the pattern
sound("hh*16").euclidRot(7, 16, 2)  // 7 hits, 16 steps, rotated by 2
```

### The Classic Techno Groove
```javascript
stack(
  sound("bd*4").gain(0.9),              // Foundation
  sound("~ cp ~ cp").gain(0.7),         // Backbeat
  sound("hh*16").euclid(11, 16).gain(0.4)  // Driving hats
).cpm(130)
```

## Pattern Studies

### 1. Hi-Hat Variations

#### Straight 16ths (Classic)
```javascript
sound("hh*16").gain(0.4).pan(0.6)
```

#### Euclidean Groove (Modern)
```javascript
// Creates interesting syncopation
sound("hh*16").euclid(13, 16).gain(0.4)
```

#### Velocity Patterns (Dynamic)
```javascript
// Emphasizes certain hits
sound("hh*16")
  .gain("0.5 0.3 0.4 0.3".fast(4))
  .pan(sine.range(0.4, 0.6).fast(8))
```

#### Open/Closed Combinations
```javascript
stack(
  sound("hh*16").euclid(11, 16).gain(0.3),
  sound("oh").euclid(3, 8).gain(0.5).cut(1)  // Cut group stops overlap
)
```

### 2. Clap and Snare Placement

#### Classic Backbeat
```javascript
sound("~ cp ~ cp").gain(0.7)
```

#### Syncopated Claps
```javascript
sound("~ cp ~ cp:1 ~ ~ cp ~").gain(0.6)
```

#### Layered Claps for Width
```javascript
stack(
  sound("~ cp ~ cp").gain(0.7).pan(0.5),
  sound("~ cp ~ cp").gain(0.5).pan(0.3).delay(0.01),
  sound("~ cp ~ cp").gain(0.5).pan(0.7).delay(0.02)
)
```

#### Snare Rolls and Fills
```javascript
// Basic pattern with fill every 4 bars
sound("~ sd ~ sd")
  .gain(0.7)
  .every(4, x => x.fast(4).gain(0.5))
```

### 3. Advanced Groove Techniques

#### Polymetric Hi-Hats
```javascript
// Different pattern lengths create evolution
stack(
  sound("hh*16").euclid(11, 16).gain(0.3),
  sound("hh*12").euclid(7, 12).gain(0.3).pan(0.7)
)
```

#### Ghost Notes
```javascript
// Subtle hits that add groove depth
stack(
  sound("hh*16").gain("0.5 0.2 0.3 0.1".fast(4)),
  sound("shaker*32").gain(0.1).pan(rand)
)
```

#### Swing and Humanization
```javascript
// Add swing to straight pattern
sound("hh*16")
  .swing(0.1)
  .gain(0.4)
  .nudge(sine.range(-0.005, 0.005).fast(16))  // Micro-timing
```

## Practical Exercises

### Exercise 1: Euclidean Exploration
Create grooves using different Euclidean combinations:

```javascript
// Find your favorite Euclidean grooves
stack(
  sound("bd*4").gain(0.9),
  sound("hh").euclid(5, 8).gain(0.4),     // Try: (3,8), (7,8), (9,16)
  sound("rim").euclid(3, 7).gain(0.5),    // Try: (4,7), (5,9), (7,12)
  sound("oh").euclid(2, 5).gain(0.3)      // Try: (3,5), (4,9), (5,11)
).cpm(130)
```

### Exercise 2: Building Groove Layers
Start minimal and add complexity:

```javascript
// Layer 1: Basic
stack(
  sound("bd*4").gain(0.9),
  sound("~ cp ~ cp").gain(0.7)
).cpm(130)

// Layer 2: Add driving hats
stack(
  sound("bd*4").gain(0.9),
  sound("~ cp ~ cp").gain(0.7),
  sound("hh*16").euclid(11, 16).gain(0.4)
).cpm(130)

// Layer 3: Add ghost notes and variation
stack(
  sound("bd*4").gain(0.9),
  sound("~ cp ~ cp").gain(0.7),
  sound("hh*16").euclid(11, 16).gain(0.4),
  sound("hh*32").gain(0.15).degradeBy(0.7),  // Random ghost notes
  sound("rim").euclid(3, 7).gain(0.3).pan(0.7)
).cpm(130)
```

### Exercise 3: Spatial Groove Design
Use panning to create width:

```javascript
stack(
  sound("bd*4").gain(0.9).pan(0.5),      // Center
  sound("~ cp ~ cp").gain(0.7).pan(0.5), // Center
  
  // Hi-hats panned and moving
  sound("hh*16")
    .euclid(11, 16)
    .gain(0.4)
    .pan(sine.range(0.3, 0.7).fast(2)),
    
  // Percussion in stereo field
  sound("rim").euclid(5, 8).gain(0.4).pan(0.2),
  sound("shaker*16").gain(0.2).degradeBy(0.5).pan(0.8)
).cpm(132)
```

## Style Analysis

### Detroit Techno Hi-Hats (Juan Atkins Style)
```javascript
// Mechanical, precise, minimal
stack(
  sound("bd*4").gain(0.9),
  sound("hh*8").gain("0.4 0.2".fast(4)).pan(0.6),
  sound("~ ~ cp ~").gain(0.6)
).cpm(130)
```

### UK Techno Groove (Surgeon Style)
```javascript
// Industrial, aggressive, complex
stack(
  sound("bd*4").gain(0.9).distort(0.2),
  sound("~ cp ~ cp").gain(0.8).shape(0.3),
  sound("hh*16").euclid(13, 16).gain(0.5).lpf(8000),
  sound("metal").euclid(5, 9).gain(0.3).pan(rand)
).cpm(140)
```

### Hypnotic Minimal (Rrose Style)
```javascript
// Subtle, evolving, deep
const hypnoticGroove = stack(
  sound("bd*4").gain(0.85),
  sound("~ ~ ~ cp").gain(0.5).room(0.2),
  
  // Evolving hi-hat pattern
  sound("hh*16")
    .euclid(slow(32, run(9, 13)), 16)  // Slowly changing pattern
    .gain(sine.range(0.2, 0.4).slow(16))
    .pan(sine.range(0.4, 0.6).slow(8))
).cpm(128)
```

## Advanced Techniques

### Sidechain Simulation
```javascript
// Hi-hats duck with the kick
const sidechain = 1 - sound("bd*4").gain(0.5);

stack(
  sound("bd*4").gain(0.9),
  sound("hh*16")
    .euclid(11, 16)
    .gain(0.4)
    .mul(sidechain)  // Volume follows inverse of kick
).cpm(130)
```

### Probability-Based Variations
```javascript
stack(
  sound("bd*4").gain(0.9),
  
  // Main groove
  sound("hh*16").euclid(11, 16).gain(0.4),
  
  // Occasional variations
  sound("hh*16")
    .sometimes(x => x.fast(2))
    .gain(0.3)
    .degradeBy(0.8),
    
  // Random accents
  sound("oh")
    .euclid(3, 8)
    .sometimes(x => x.gain(0.6))
    .gain(0.3)
).cpm(132)
```

### Groove Modulation Over Time
```javascript
// Pattern that evolves over 32 bars
stack(
  sound("bd*4").gain(0.9),
  
  // Claps fade in
  sound("~ cp ~ cp")
    .gain(slow(16, saw.range(0, 0.7))),
    
  // Hi-hats get busier
  sound("hh*16")
    .euclid(
      slow(32, run(7, 13)),  // Gradually more hits
      16
    )
    .gain(0.4),
    
  // Percussion appears after 16 bars
  sound("rim")
    .euclid(5, 8)
    .gain(0.4)
    .when(x => x.cycle >= 16, x => x)
).cpm(130)
```

## Common Groove Problems and Solutions

### Problem: Groove feels stiff
**Solution**: Add swing and micro-timing variations
```javascript
sound("hh*16")
  .swing(0.08)
  .nudge(rand.range(-0.003, 0.003))
  .gain(0.4)
```

### Problem: Hi-hats clash with other elements
**Solution**: Use EQ and spatial separation
```javascript
stack(
  sound("hh*16").hpf(2000).pan(0.3).gain(0.4),
  sound("percussion").lpf(2000).pan(0.7).gain(0.5)
)
```

### Problem: Pattern lacks movement
**Solution**: Automate parameters over time
```javascript
sound("hh*16")
  .euclid(11, 16)
  .gain(sine.range(0.3, 0.5).slow(8))
  .lpf(sine.range(5000, 10000).slow(16))
```

## Assessment Criteria

Your Module 2 submission should demonstrate:

1. **Rhythmic Complexity** (30%)
   - Effective use of Euclidean rhythms
   - Interesting pattern combinations
   - Appropriate complexity for style

2. **Groove Quality** (30%)
   - Strong sense of forward motion
   - Proper swing and feel
   - Hypnotic quality

3. **Mix Balance** (20%)
   - Clear separation of elements
   - Effective use of stereo field
   - No frequency clashes

4. **Evolution** (20%)
   - Patterns that develop over time
   - Use of variation techniques
   - Maintains interest over 32+ bars

## Module Assignment

Create three different groove patterns:

1. **Minimal Groove**: Focus on space and subtlety
   - Maximum 4 percussion elements
   - Use Euclidean rhythms creatively
   - Should feel hypnotic over 32 bars

2. **Driving Groove**: High energy and complexity
   - Layer multiple hi-hat patterns
   - Include percussion accents
   - Build intensity over time

3. **Experimental Groove**: Push boundaries
   - Use polymetric relationships
   - Explore unusual Euclidean combinations
   - Incorporate probability and randomness

Each pattern should:
- Include kick, clap/snare, and at least two hi-hat layers
- Run for minimum 32 bars
- Show evolution or variation
- Be mixed clearly with no masking

## Next Module Preview
In Module 3, we'll explore polyrhythmic patterns and complex percussion arrangements that create the hypnotic tension characteristic of minimal techno.