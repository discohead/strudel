# Module 1: The Foundation - The Four-on-the-Floor Heartbeat

## Overview
The kick drum is the heartbeat of techno. In this foundational module, we establish the rhythmic core that will drive all our compositions. We'll explore how different kick patterns create different energy levels and learn to use Strudel's pattern language to create rock-solid grooves.

## Learning Objectives
By the end of this module, you will be able to:
1. Write and execute basic Strudel patterns
2. Create various four-on-the-floor kick patterns
3. Adjust timing, velocity, and dynamics
4. Layer multiple kick drums for depth
5. Understand the relationship between BPM and groove

## Core Concepts

### Basic Pattern Syntax
```javascript
// The fundamental techno kick
sound("bd*4").cpm(130)
```

This creates:
- `sound()` - Triggers a sound sample
- `"bd"` - Bass drum sample
- `*4` - Plays 4 times per cycle
- `.cpm(130)` - Sets tempo to 130 cycles per minute

### Pattern Variations

#### 1. Classic Four-on-the-Floor
```javascript
// The foundation of techno
sound("bd*4").gain(0.9).cpm(130)
```

#### 2. Rolling Techno
```javascript
// Adds momentum with ghost notes
stack(
  sound("bd*4").gain(0.9),              // Main hits
  sound("bd*8").gain(0.3).pan(0.6)      // Quieter in-between hits
).cpm(135)
```

#### 3. Broken Kick
```javascript
// Creates space and syncopation
sound("bd ~ bd bd ~ bd ~ bd").gain(0.85).cpm(128)
```

#### 4. Warehouse Rumble
```javascript
// Heavy, industrial feel
stack(
  sound("bd*4").gain(1).lpf(200),       // Sub kick
  sound("bd:1*4").gain(0.7).lpf(1000)   // Click layer
).cpm(140)
```

## Practical Exercises

### Exercise 1: Tempo Exploration
Create the same pattern at different tempos and observe how it changes the feel:

```javascript
// Slow and heavy (125 BPM)
sound("bd*4").gain(0.9).cpm(125)

// Classic techno (130 BPM)
sound("bd*4").gain(0.9).cpm(130)

// Driving energy (135 BPM)
sound("bd*4").gain(0.9).cpm(135)

// Hard techno (140+ BPM)
sound("bd*4").gain(0.9).cpm(142)
```

### Exercise 2: Dynamic Variation
Use gain to create dynamic interest:

```javascript
// Accented pattern
sound("bd*4").gain("0.9 0.7 0.8 0.7").cpm(130)

// Building energy
sound("bd*4")
  .gain(sine.range(0.6, 0.9).slow(8))  // Slowly increases over 8 cycles
  .cpm(130)
```

### Exercise 3: Sample Selection
Explore different kick samples:

```javascript
// Try different kick sounds
stack(
  sound("bd").gain(0.9),       // Default kick
  sound("bd:1").gain(0.7),     // Variation 1
  sound("bd:2").gain(0.7),     // Variation 2
  sound("kick").gain(0.7),     // Alternative sample
  sound("kick:1").gain(0.7)    // Alternative variation
).cpm(130)
```

### Exercise 4: Layering for Impact
Combine multiple elements for a fuller kick:

```javascript
// Professional layered kick
stack(
  // Sub layer - the body
  sound("bd*4")
    .gain(0.9)
    .lpf(100)
    .n("c1"),
    
  // Mid punch - the impact
  sound("bd:1*4")
    .gain(0.6)
    .lpf(500)
    .hpf(60),
    
  // Top click - the definition
  sound("click*4")
    .gain(0.3)
    .hpf(2000)
    .pan(0.5)
).cpm(130)
```

## Advanced Techniques

### Sidechain Compression Effect
Simulate the classic techno "pumping" effect:

```javascript
// Ducking pattern that simulates sidechain
const duck = sine.range(0.3, 1).fast(4);

stack(
  sound("bd*4").gain(0.9),
  // Other elements duck when kick hits
  sound("pad").gain(duck).sustain(1)
).cpm(130)
```

### Kick Synthesis
Create kicks from scratch using synthesis:

```javascript
// Synthesized kick drum
note("c1*4")
  .s("sine")
  .attack(0.001)
  .decay(0.05)
  .sustain(0)
  .release(0.2)
  .lpf(200)
  .distort(0.2)
  .gain(0.8)
  .cpm(130)
```

### Polymetric Kicks
Create tension with different kick patterns:

```javascript
// 3 against 4 polyrhythm
polyrhythm(
  sound("bd*3").gain(0.9),
  sound("~*4")  // Placeholder for timing
).cpm(130)
```

## Style Studies

### Detroit Techno (Jeff Mills style)
```javascript
// Minimal, powerful, relentless
sound("bd*4")
  .gain(0.95)
  .n("c1")
  .shape(0.1)  // Slight distortion
  .cpm(135)
```

### Berlin Techno (Berghain style)
```javascript
// Dark, heavy, compressed
stack(
  sound("bd*4").gain(1).lpf(150),
  sound("bd*4").gain(0.4).delay(0.03)  // Slight delay for width
).cpm(128)
```

### UK Techno (Surgeon style)
```javascript
// Industrial, distorted, aggressive
sound("bd*4")
  .gain(0.9)
  .distort(0.4)
  .shape(0.3)
  .lpf(300)
  .cpm(140)
```

## Common Pitfalls and Solutions

### Problem: Kick is too weak
**Solution**: Layer multiple samples, boost low frequencies
```javascript
stack(
  sound("bd*4").gain(1).lpf(100),      // Sub layer
  sound("bd:1*4").gain(0.7).lpf(1000)  // Punch layer
).cpm(130)
```

### Problem: Kick clashes with bass
**Solution**: Use sidechain effect or frequency separation
```javascript
// Frequency separation approach
stack(
  sound("bd*4").gain(0.9).hpf(30).lpf(100),  // Kick: 30-100Hz
  note("c2*8").s("bass").hpf(100).lpf(300)   // Bass: 100-300Hz
).cpm(130)
```

### Problem: Pattern feels rigid
**Solution**: Add micro-timing variations
```javascript
sound("bd*4")
  .nudge(sine.range(-0.01, 0.01).fast(4))  // Subtle timing variations
  .gain(0.9)
  .cpm(130)
```

## Assessment Criteria

Your module 1 submission should demonstrate:

1. **Technical Proficiency** (25%)
   - Correct syntax usage
   - Proper gain staging
   - Appropriate tempo selection

2. **Musical Quality** (35%)
   - Strong, driving groove
   - Appropriate energy level
   - Clean, powerful sound

3. **Creativity** (25%)
   - Unique pattern variations
   - Effective use of layering
   - Personal style emerging

4. **Code Organization** (15%)
   - Clear comments
   - Logical structure
   - Reusable patterns

## Module Assignment

Create three different kick patterns that demonstrate:
1. A minimal, hypnotic pattern (Jeff Mills inspired)
2. A rolling, energetic pattern (Robert Hood inspired)
3. Your own creative variation

Each pattern should:
- Run for at least 16 bars
- Include appropriate comments
- Use at least two different techniques from this module
- Sound professional and club-ready

## Next Module Preview
In Module 2, we'll add the groove elements: hi-hats, claps, and percussion using Euclidean rhythms to create complex, evolving patterns that complement our solid kick foundation.