# Module 6: The Hook - Probabilistic & Arpeggiated Patterns

## Overview
The hook is what keeps dancers locked in a hypnotic state. It's not a melody in the traditional sense—it's a pattern that evolves subtly, maintaining interest without dominating. In this module, we master probabilistic functions, generative patterns, and arpeggiation techniques that create the endless variation essential to hypnotic techno.

## Learning Objectives
By the end of this module, you will be able to:
1. Use probability functions to create organic variation
2. Design arpeggiated patterns that evolve over time
3. Implement generative techniques for endless variation
4. Balance predictability with surprise
5. Create hooks that enhance rather than dominate the groove

## Core Concepts

### Probability Functions in Strudel

```javascript
// Basic probability on a pattern
note("c3 eb3 g3 bb3")
  .sometimes(x => x.rev())        // 50% chance
  .sometimesBy(0.25, x => x.fast(2))  // 25% chance
  .often(x => x.add(12))          // 75% chance
  .rarely(x => x.gain(0))         // 10% chance
  .almostAlways(x => x.pan(0.8))  // 90% chance
  .s("fm").cpm(130)

// Degradation
sound("hh*16")
  .degrade()                      // Random 50% note removal
  .gain(0.4).cpm(130)

sound("rim*8")
  .degradeBy(0.3)                 // 30% chance of removal
  .gain(0.5).cpm(130)

// Random selection
note(choose(["c3", "eb3", "g3"]))     // Pick one randomly
  .s("bass").cpm(130)

note(wchoose([["c3", 4], ["eb3", 2], ["g3", 1]]))  // Weighted choice
  .s("bass").cpm(130)
```

### Arpeggiator Patterns

```javascript
// Basic arpeggio
note("c3 e3 g3 c4").fast(2)

// Using arp function
note("c3").arp("0 2 4 7")  // Arpeggio by semitones

// Directional arpeggios
note("c3 e3 g3").seq(
  x => x,                    // Up
  x => x.rev(),             // Down
  x => x.palindrome()       // Up-down
)
```

## Probabilistic Pattern Design

### 1. Subtle Variations

The key to hypnotic techno is variation that you feel but don't necessarily notice:

```javascript
// Base pattern with occasional octave jumps
const subtleHook = note("c3 eb3 g3 eb3")
  .s("fm4")
  .sometimes(x => x.add(12))     // Occasional octave up
  .rarely(x => x.add(-12))       // Rare octave down
  .release(0.1)
  .delay(0.3)
  .gain(0.5)

// Pattern that occasionally doubles speed
const rhythmicVariation = note("c3*4")
  .s("square")
  .sometimesBy(0.2, x => x.fast(2))
  .lpf(1000)
  .gain(0.4)
```

### 2. Evolving Probability

Probability that changes over time creates long-form evolution:

```javascript
// Probability increases over 32 bars
const evolvingHook = note("c3 eb3 g3 c4")
  .s("triangle")
  .degradeBy(slow(32, line(0.8, 0.2)))  // Less degradation over time
  .release(0.1)
  .gain(0.5)

// Different probabilities per cycle
const cyclicProbability = note("c3*8")
  .s("sawtooth")
  .sometimesBy(
    slow(8, cat(0.1, 0.3, 0.5, 0.8)),  // Changing probability
    x => x.add(7)
  )
  .lpf(800)
  .gain(0.4)
```

### 3. Weighted Random Choices

Create controlled randomness with weighted selections:

```javascript
// Weighted note selection
const weightedMelody = note(
  wchoose([
    ["c3", 4],    // Most common
    ["eb3", 2],   // Less common
    ["g3", 2],    // Less common
    ["bb3", 1]    // Rare
  ])
)
.s("supersaw")
.unison(3)
.detune(0.1)
.release(0.15)
.gain(0.5)

// Weighted rhythm patterns
const weightedRhythm = s("fm4")
  .note("c4")
  .struct(
    wchoose([
      ["x ~ x ~", 3],
      ["x x ~ x", 2],
      ["x ~ ~ x", 1]
    ])
  )
  .gain(0.5)
```

## Arpeggiation Techniques

### 1. Classic Techno Arpeggios

```javascript
// Detroit techno arpeggio
const detroitArp = note("c3 eb3 g3 bb3 c4 bb3 g3 eb3")
  .s("square")
  .lpf(sine.range(800, 2000).slow(8))
  .release(0.05)
  .delay(0.4)
  .delaytime(0.375)
  .gain(0.5)

// Acid arpeggio
const acidArp = note("c2 c3 eb3 g3")
  .fast(2)
  .s("sawtooth")
  .lpf(sine.range(200, 3000).fast(4))
  .resonance(20)
  .sometimes(x => x.add(12))
  .gain(0.6)
```

### 2. Generative Arpeggios

```javascript
// Self-modifying arpeggio
const genArp = note("0 3 7 10")  // Minor 7th
  .scale("c:minor")
  .add(perlin.range(0, 2).slow(16))  // Perlin noise modulation
  .sometimes(x => x.add(choose([0, 5, 7, 12])))
  .s("triangle")
  .release(0.1)
  .gain(0.5)

// Euclidean arpeggio
const euclidArp = note("c3 eb3 g3 bb3 c4")
  .euclid(5, 8)
  .sometimes(x => x.fast(2))
  .s("fm4")
  .fmi(2)
  .release(0.1)
  .gain(0.5)
```

### 3. Directional Movement

```javascript
// Ascending and descending patterns
const directionalArp = cat(
  note("c3 e3 g3 c4").slow(2),          // Up
  note("c4 g3 e3 c3").slow(2),          // Down
  note("c3 e3 g3 e3").slow(2),          // Up-down
  note("g3 e3 g3 c4").slow(2)           // Middle-out
)
.s("sawtooth")
.lpf(1500)
.release(0.1)
.gain(0.5)

// Spiral arpeggio
const spiralArp = note("0 3 7 12 15 12 7 3")
  .add("<0 2 4 5>")  // Shift base note each cycle
  .scale("c:minor")
  .s("triangle")
  .release(0.1)
  .pan(sine.range(0.3, 0.7).fast(8))
  .gain(0.4)
```

## Generative Techniques

### 1. Rule-Based Generation

```javascript
// Generate patterns based on mathematical rules
const fibonacci = [1, 1, 2, 3, 5, 8, 13, 21];
const fibonacciPattern = note(
  fibonacci.map(n => n % 12)  // Map to chromatic scale
)
.scale("c:minor")
.s("fm4")
.release(0.1)
.gain(0.5)

// Prime number pattern
const primes = [2, 3, 5, 7, 11, 13, 17, 19];
const primePattern = note(
  primes.map(p => p % 7)  // Map to scale degrees
)
.scale("c:phrygian")
.s("square")
.release(0.1)
.gain(0.4)
```

### 2. Markov Chains

Simulating Markov chain behavior for pattern generation:

```javascript
// Simple Markov-like behavior
const markovNote = perlin.range(0, 4).segment(8)
  .map(n => {
    const notes = ["c3", "eb3", "f3", "g3"];
    return notes[Math.floor(n)];
  });

const markovPattern = note(markovNote)
  .s("triangle")
  .sometimes(x => x.add(choose([0, 12, -12])))
  .release(0.1)
  .gain(0.5)
```

### 3. Constraint-Based Patterns

```javascript
// Pattern with constraints
const constrainedHook = note("c3")
  .add(choose([0, 3, 5, 7, 10]))  // Stay in minor pentatonic
  .sometimesBy(0.3, x => x.add(12))  // Occasionally jump octave
  .rarely(x => x.add(-12))  // Rarely drop octave
  .s("sawtooth")
  .lpf(1000)
  .release(0.1)
  .struct("x ~ x x ~ x ~ x")  // Rhythmic constraint
  .gain(0.5)
```

## Hypnotic Hook Design

### 1. The Subtle Morpher

```javascript
// Hook that slowly morphs over time
const morphingHook = note("c3 eb3 g3 c4")
  .add(slow(64, sine.range(0, 2).round()))  // Slow pitch drift
  .s("triangle")
  .lpf(slow(32, sine.range(800, 1500)))
  .sometimes(x => x.degrade())
  .release(0.1)
  .delay(0.3)
  .delaytime(choose([0.375, 0.5, 0.75]))
  .gain(0.4)
```

### 2. The Question-Answer

```javascript
// Call and response pattern
const question = note("c4 ~ eb4 ~").s("square");
const answer = note("~ g3 ~ bb3").s("triangle");

const qaHook = cat(question, answer)
  .sometimes(x => x.add(choose([0, 5, 7])))
  .lpf(1200)
  .release(0.1)
  .gain(0.5)
  .every(8, x => x.rev())  // Reverse every 8 cycles
```

### 3. The Polymetric Hook

```javascript
// Different length patterns creating evolution
stack(
  note("c3 eb3 g3").s("fm4").gain(0.4),      // 3 notes
  note("c4 g3 bb3 f3").s("triangle").gain(0.3),  // 4 notes
  note("c2 g2 c3 eb3 g3").s("sine").gain(0.5)    // 5 notes
)
.release(0.1)
.delay(0.2)
// Full pattern repeats after 60 beats (LCM of 3,4,5)
```

## Style Analysis

### Richie Hawtin (Minimal Loop)
```javascript
// Plastikman-style minimal hook
const plastikmanHook = note("c3")
  .sometimes(x => x.add(choose([0, 3, 7])))
  .struct("x ~ ~ x ~ ~ x ~")
  .s("sine")
  .shape(0.3)
  .delay(0.6)
  .delaytime(0.75)
  .delayfeedback(0.7)
  .gain(0.5)
  .rarely(x => x.fast(2))
```

### Luke Slater (Planetary Assault Systems)
```javascript
// Relentless, slowly evolving
const pasHook = note("0 0 0 3 0 0 5 0")
  .add(slow(128, run(0, 12)))  // Slowly transpose up
  .scale("c:minor")
  .s("sawtooth")
  .lpf(sine.range(400, 1200).slow(64))
  .resonance(15)
  .release(0.05)
  .gain(0.5)
  .sometimes(x => x.struct("x x ~ x x ~ x ~"))
```

### Blawan (UK Experimental)
```javascript
// Unconventional, rhythmically complex
const blawanHook = note("c3 eb3 f#3")
  .euclid(7, 12)
  .add(choose([0, 7, 12, -5]))
  .s("fm4")
  .fmi(choose([2, 5, 8, 12]))
  .fmh(choose([1.5, 3.3, 7.1]))
  .release(0.05)
  .distort(0.3)
  .gain(0.5)
  .sometimesBy(0.3, x => x.fast(1.5))
```

## Practical Exercises

### Exercise 1: Probability Progression
Create a pattern that uses increasing probability:

```javascript
// Start sparse, become dense
const progression = note("c3 eb3 g3 bb3")
  .s("triangle")
  .degradeBy(slow(64, line(0.8, 0)))  // From 80% removal to 0%
  .release(0.1)
  .gain(0.5)
```

### Exercise 2: Generative Melody
Design a self-generating melodic pattern:

```javascript
// Never repeats exactly
const generative = note(
  perlin.range(0, 7).segment(8).scale("c:minor")
)
.add(choose([0, 12]))
.sometimes(x => x.rest())
.s("fm4")
.release(0.1)
.gain(0.5)
```

### Exercise 3: Evolving Arpeggio
Create an arpeggio that changes character:

```javascript
// Morphing arpeggio
const arp = note("c3 e3 g3 b3")
  .add(slow(32, "<0 3 5 7>"))  // Change mode
  .fast(slow(64, line(1, 4)))   // Accelerate
  .s("sawtooth")
  .lpf(slow(32, sine.range(500, 3000)))
  .release(slow(32, line(0.2, 0.05)))
  .gain(0.5)
```

## Common Problems and Solutions

### Problem: Hook too prominent
**Solution**: Reduce frequency content and use space
```javascript
note("c4 ~ eb4 ~ ~ g4 ~ ~")  // More rests
  .s("triangle")  // Softer timbre
  .lpf(800)       // Remove highs
  .gain(0.4)      // Lower volume
  .pan(0.3)       // Move off-center
```

### Problem: Pattern too repetitive
**Solution**: Add multiple probability layers
```javascript
note("c3 eb3 g3")
  .sometimes(x => x.add(12))
  .rarely(x => x.fast(2))
  .sometimesBy(0.3, x => x.rev())
  .degradeBy(0.1)
```

### Problem: Randomness feels chaotic
**Solution**: Constrain the possibilities
```javascript
// Limited, musical choices
note(choose(["c3", "eb3", "g3", "bb3"]))  // Only chord tones
  .struct("x ~ x x ~ x ~ x")  // Fixed rhythm
  .s("triangle")
  .release(0.1)
  .gain(0.5)
```

## Assessment Criteria

Your Module 6 submission should demonstrate:

1. **Probability Mastery** (30%)
   - Effective use of chance operations
   - Musical application of randomness
   - Balance between variation and stability

2. **Pattern Evolution** (30%)
   - Patterns that develop over time
   - Long-form structural thinking
   - Maintaining hypnotic quality

3. **Musical Integration** (25%)
   - Hooks that enhance the groove
   - Appropriate register and timbre choices
   - Effective use of space

4. **Creative Innovation** (15%)
   - Original generative approaches
   - Personal style in pattern design
   - Technical creativity

## Module Assignment

Create three hypnotic hook patterns:

1. **Minimal Probability**: Subtle variations
   - Use at least 3 probability functions
   - Pattern should evolve over 64 bars
   - Maximum 4 notes in the scale

2. **Generative Arpeggio**: Self-modifying pattern
   - Implement algorithmic generation
   - Include directional movement
   - Must remain musical and danceable

3. **Long-form Evolution**: 128-bar journey
   - Start minimal, build complexity
   - Use probability changes over time
   - Include at least one "surprise" element

Requirements:
- Each pattern in full techno context (kicks, bass, etc.)
- Document probability strategies used
- Export 4-minute audio demonstrations
- Include code comments explaining choices

## Next Module Preview
In Module 7, we'll explore how effects become instruments themselves, learning to use delay, reverb, and filtering as compositional tools in the style of dub techno masters.