# AGENTS.md - Examples Directory Guide

## Example Code for AI Assistants

This directory contains working code examples for the Strudel Techno Curriculum. This AGENTS.md file helps AI assistants understand example structure and standards. See CLAUDE.md for additional comprehensive context.

## Current Examples

### module1_examples.js
Complete working patterns demonstrating:
- Pattern evolution techniques
- Genre-specific styles (Detroit, Berlin, UK)
- Layering and synthesis
- Performance variations
- Live coding patterns

## Example Code Standards

### Structure Requirements
```javascript
// Example N: Clear Descriptive Title
// What this demonstrates and why it's important

// Start simple
const simple = sound("bd*4").gain(0.9).cpm(130);

// Build complexity
const complex = stack(
  sound("bd*4").gain(0.9),
  sound("hh*16").euclid(11, 16).gain(0.4)
).cpm(130);

// Show variations
const variation1 = /* alternative approach */;
const variation2 = /* different style */;

// Full musical context
stack(
  /* all elements combined */
).cpm(130)
```

### Quality Requirements

1. **Runnable** - Copy, paste, and it works
2. **Musical** - Sounds good at specified BPM
3. **Clear** - Purpose is obvious
4. **Progressive** - Builds from simple to complex
5. **Techno-appropriate** - Fits the aesthetic

## Creating New Examples

### File Naming Convention
```
moduleN_examples.js       // Core examples for module N
moduleN_exercises.js      // Exercise solutions
moduleN_performance.js    // Live coding templates
moduleN_patterns.js       // Additional patterns
```

### Example Categories

#### Foundation Examples
Show basic concept introduction:
```javascript
// Basic Euclidean rhythm
sound("hh*16").euclid(5, 16).gain(0.4)

// Why: Introduces mathematical rhythm distribution
// Result: Syncopated hi-hat pattern
```

#### Evolution Examples
Demonstrate progression:
```javascript
// Step 1: Basic kick
const step1 = sound("bd*4").gain(0.9);

// Step 2: Add ghost notes
const step2 = stack(
  sound("bd*4").gain(0.9),
  sound("bd*8").gain(0.3).pan(0.6)
);

// Step 3: Add variation
const step3 = stack(
  sound("bd ~ bd bd ~ bd ~ bd").gain(0.9),
  sound("bd*16").gain(0.2).hpf(200)
);
```

#### Style Examples
Recreate specific artist approaches:
```javascript
// Robert Hood style - Minimal funk
const hoodStyle = stack(
  sound("bd*4").gain(0.95),
  sound("~ cp ~ cp").gain(0.7),
  note("c1 ~ c1 c1 ~ c1 ~ c1")
    .s("sine")
    .release(0.1)
    .gain(0.8)
).cpm(132)
```

#### Integration Examples
Show complete musical contexts:
```javascript
// Full techno pattern
const fullPattern = stack(
  // Rhythm section
  sound("bd*4").gain(0.9),
  sound("~ cp ~ cp").gain(0.7),
  sound("hh*16").euclid(11, 16).gain(0.4),
  
  // Bass
  note("c1*8").s("saw").lpf(400).release(0.1).gain(0.7),
  
  // Lead
  note("<c4 eb4 g4>").s("fm4")
    .sometimes(x => x.add(12))
    .release(0.1)
    .delay(0.3)
    .gain(0.5)
).cpm(130)
```

## Planned Example Sets

### For Each Module (2-10)
Each needs:
- 10-15 foundation examples
- 5-7 style studies
- 3-5 integration examples
- 2-3 performance templates

### Special Collections

#### Pattern Banks
```javascript
// patterns/kick_patterns.js
export const kickPatterns = {
  fourFloor: "bd*4",
  broken: "bd ~ bd bd ~ bd ~ bd",
  syncopated: "bd ~ ~ bd ~ bd bd ~",
  rolling: "bd*4, bd*8@0.3"
};

// Usage in examples
sound(kickPatterns.broken).gain(0.9)
```

#### Genre Packs
```javascript
// patterns/detroit_techno.js
export const detroit = {
  tempo: 130,
  kicks: [/* patterns */],
  bass: [/* patterns */],
  leads: [/* patterns */],
  arrangements: [/* full patterns */]
};
```

#### Performance Templates
```javascript
// performance/minimal_set.js
export const minimalSet = {
  // Elements
  kick: sound("bd*4").gain(0.9),
  bass: note("c1*8").s("bass").release(0.1),
  hats: sound("hh*16").euclid(11, 16),
  
  // Sections
  intro: () => stack(kick),
  build: () => stack(kick, bass),
  main: () => stack(kick, bass, hats),
  
  // Transitions
  breakdown: () => bass.lpf(300).room(0.5)
};
```

## Development Workflow

### 1. Concept Phase
- Identify pattern to demonstrate
- Determine learning goal
- Find musical reference

### 2. Sketch Phase
```javascript
// Quick ideas
"bd*4"
"bd ~ bd bd"
"bd ~ bd bd ~ bd ~ bd"
```

### 3. Development Phase
```javascript
// Refine musical details
sound("bd ~ bd bd ~ bd ~ bd")
  .gain("0.9 0 0.85 0.9 0 0.8 0 0.85")
  .shape(0.1)
  .cpm(132)
```

### 4. Context Phase
```javascript
// Place in full pattern
stack(
  refinedKick,
  supportingElements
).cpm(132)
```

### 5. Documentation Phase
```javascript
// Example: UK Techno Broken Kick
// Demonstrates syncopation common in Birmingham techno
// Note rests on beats 2 and 6 creating forward drive
// Shape adds subtle distortion for warehouse sound
```

## Testing Guidelines

### For Each Example
1. Run in clean Strudel environment
2. Test at multiple tempos (125, 130, 135, 140)
3. Check CPU usage
4. Verify musical quality
5. Confirm learning objective met

### Performance Testing
```javascript
// Tempo flexibility test
[125, 130, 135, 140].forEach(bpm => {
  pattern.cpm(bpm);  // Should sound good at all tempos
});

// Resource usage
console.time('pattern');
pattern.cpm(130);
console.timeEnd('pattern');  // Should be < 50ms
```

## Common Patterns Library

### Utility Functions
```javascript
// helpers.js
export const helpers = {
  // Sidechain simulation
  sidechain: (pattern, kick) => {
    return pattern.gain(1 - kick.gain());
  },
  
  // Humanization
  humanize: (pattern) => {
    return pattern.nudge(rand.range(-0.01, 0.01));
  },
  
  // Swing
  swing: (pattern, amount = 0.1) => {
    return pattern.swing(amount);
  }
};
```

### Reusable Elements
```javascript
// elements.js
export const elements = {
  // Standard kicks
  kick: () => sound("bd*4").gain(0.9),
  
  // Classic patterns
  offbeat: () => sound("~ cp ~ cp").gain(0.7),
  
  // Euclidean hats
  hats: (n = 11, k = 16) => 
    sound("hh*16").euclid(n, k).gain(0.4)
};
```

## Guidelines for AI Assistants

### When Creating Examples
1. **Test everything** - Must run without errors
2. **Sound check** - Must be musically valid
3. **Progress logically** - Simple to complex
4. **Document clearly** - Explain the why
5. **Stay focused** - One concept per example

### Code Style
```javascript
// Use descriptive names
const hypnoticBass = /* pattern */;

// Not generic names
const pattern1 = /* unclear */;

// Clear structure
stack(
  kick,     // Foundation
  bass,     // Low end
  hats,     // Groove
  lead      // Interest
).cpm(130)  // Always include tempo
```

### Musical Guidelines
- Tempo: 120-140 BPM for techno
- Gain: Usually 0.4-0.9 range
- Effects: Use sparingly but effectively
- Space: Silence is part of the groove

## Quality Checklist

- [ ] All code syntax correct
- [ ] Runs without errors
- [ ] Sounds professional
- [ ] Clear purpose
- [ ] Well commented
- [ ] Follows module progression
- [ ] References real techno
- [ ] Performance ready

## Remember

Good examples should:
1. **Inspire** - Make people want to try
2. **Teach** - Clear learning outcome
3. **Sound Good** - Club-ready quality
4. **Work** - No debugging needed
5. **Build** - Connect to bigger picture

Each example is a mini-lesson in techno production through code.