# Module 8: Structure & Arrangement - Building the Machine

## Overview
A great techno track is more than loops—it's a journey. In this module, we learn to build complete arrangements using Strudel's conditional logic, creating tracks that breathe, build tension, and release energy over time. We'll master the art of subtraction and addition, understanding how minimal changes create maximum impact on the dancefloor.

## Learning Objectives
By the end of this module, you will be able to:
1. Structure complete techno tracks with intro, build, drop, and outro
2. Use conditional functions for arrangement automation
3. Create tension and release through element management
4. Organize code for clarity and live performance
5. Understand DJ-friendly arrangement principles

## Core Concepts

### Arrangement Functions

```javascript
// Conditional execution
.every(n, function)         // Apply every n cycles
.when(condition, function)  // Apply when condition is true
.while(condition, function) // Apply while condition is true

// Sequencing
cat(...patterns)           // Play patterns sequentially
seq(...values)            // Sequence values
stack(...patterns)        // Layer patterns

// Time-based conditions
.early(cycles)            // Shift earlier in time
.late(cycles)             // Shift later in time
```

### Code Organization

```javascript
// Define reusable parts
const kick = sound("bd*4").gain(0.9);
const bass = note("c1*8").s("bass").release(0.1);
const hats = sound("hh*16").euclid(11, 16).gain(0.4);
const lead = note("<c4 eb4 g4>").s("lead").release(0.2);

// Arrange them
stack(
  kick,
  bass.when(x => x.cycle > 8, x => x),    // Bass enters at bar 8
  hats.when(x => x.cycle > 16, x => x),   // Hats at bar 16
  lead.when(x => x.cycle > 32, x => x)    // Lead at bar 32
).cpm(130)
```

## Techno Arrangement Patterns

### 1. Classic 8-Bar Structure

Most techno tracks work in 8-bar (32-beat) sections:

```javascript
// Define sections
const intro = stack(kick);
const groove = stack(kick, hats);
const full = stack(kick, hats, bass);
const peak = stack(kick, hats, bass, lead);

// 64-bar arrangement (4 minutes at 130 BPM)
cat(
  intro.slow(8),    // Bars 1-8
  groove.slow(8),   // Bars 9-16
  full.slow(16),    // Bars 17-32
  peak.slow(16),    // Bars 33-48
  full.slow(8),     // Bars 49-56
  groove.slow(8)    // Bars 57-64
).cpm(130)
```

### 2. Subtractive Arrangement

Start full and remove elements:

```javascript
// All elements defined
const elements = {
  kick: sound("bd*4").gain(0.9),
  bass: note("c1*8").s("saw").lpf(400).release(0.1).gain(0.7),
  hats: sound("hh*16").euclid(11, 16).gain(0.4),
  clap: sound("~ cp ~ cp").gain(0.7),
  lead: note("<c4 eb4 g4>").s("fm4").release(0.1).gain(0.5)
};

// Subtractive approach
stack(
  elements.kick,
  elements.bass.when(x => x.cycle < 48, x => x),  // Remove at 48
  elements.hats.when(x => x.cycle < 56, x => x),  // Remove at 56
  elements.clap.when(x => x.cycle > 8 && x.cycle < 56, x => x),
  elements.lead.when(x => x.cycle > 16 && x.cycle < 48, x => x)
).cpm(130)
```

### 3. Build-and-Drop Pattern

Classic techno energy management:

```javascript
// Build-up function
const buildUp = (pattern, startBar, duration) => {
  return pattern
    .when(x => x.cycle >= startBar && x.cycle < startBar + duration, x => x)
    .lpf(slow(duration, line(200, 10000)))  // Filter sweep
    .gain(slow(duration, line(0.5, 1)));    // Volume increase
};

// Drop function
const drop = (pattern, dropBar) => {
  return pattern.when(x => x.cycle === dropBar, x => silence);
};

// Applied to arrangement
stack(
  kick,
  buildUp(bass, 24, 8),      // Build from bar 24-32
  drop(kick, 32),            // Drop the kick at 32
  lead.when(x => x.cycle > 32, x => x)  // Lead enters after drop
).cpm(130)
```

## Advanced Arrangement Techniques

### 1. Tension Curves

Create mathematical tension progression:

```javascript
// Exponential tension build
const tension = (cycle) => Math.pow(cycle / 64, 2);  // 0 to 1 over 64 bars

stack(
  kick.gain(0.9),
  
  // Elements fade in based on tension
  bass.gain(x => 0.7 * tension(x.cycle)),
  hats.gain(x => 0.4 * tension(x.cycle)),
  
  // Filter opens with tension
  lead
    .lpf(x => 200 + 3800 * tension(x.cycle))
    .gain(x => 0.5 * tension(x.cycle))
).cpm(130)
```

### 2. Call and Response Sections

Elements interact dynamically:

```javascript
// Define conversation elements
const call = note("c4 ~ eb4 ~").s("lead").gain(0.6);
const response = note("~ g3 ~ bb3").s("bass").gain(0.7);

// Arrangement with dialog
stack(
  kick,
  
  // Call and response pattern
  cat(
    call.slow(4),
    response.slow(4)
  ).when(x => x.cycle > 16 && x.cycle < 48, x => x),
  
  // Both play together at peak
  stack(call, response)
    .when(x => x.cycle >= 48 && x.cycle < 56, x => x)
).cpm(130)
```

### 3. Breakdown Automation

Automated breakdown and rebuild:

```javascript
// Breakdown parameters
const breakdownStart = 32;
const breakdownEnd = 48;

stack(
  // Kick drops out during breakdown
  kick.when(x => x.cycle < breakdownStart || x.cycle >= breakdownEnd, x => x),
  
  // Bass gets filtered and reverbed
  bass
    .lpf(x => {
      if (x.cycle >= breakdownStart && x.cycle < breakdownEnd) {
        return 200;  // Heavy filter
      }
      return 1000;   // Normal filter
    })
    .room(x => {
      if (x.cycle >= breakdownStart && x.cycle < breakdownEnd) {
        return 0.7;  // Big reverb
      }
      return 0.1;   // Dry
    }),
    
  // Atmospheric element during breakdown only
  note("cm7")
    .s("pad")
    .sustain(1)
    .room(0.8)
    .gain(0.3)
    .when(x => x.cycle >= breakdownStart && x.cycle < breakdownEnd, x => x)
).cpm(130)
```

### 4. DJ-Friendly Arrangements

Structure for mixing:

```javascript
// DJ-friendly structure with clear mix points
const djTrack = {
  // Clean intro for mixing in (16 bars)
  intro: stack(
    kick,
    sound("hh*16").gain(0.2)  // Minimal hats for beat matching
  ),
  
  // Main groove (32 bars)
  main: stack(
    kick,
    bass,
    hats,
    sound("~ cp ~ cp").gain(0.7)
  ),
  
  // Breakdown (16 bars)
  breakdown: stack(
    bass.lpf(300).room(0.5),
    note("cm7").s("pad").room(0.8).gain(0.3)
  ),
  
  // Peak (32 bars)
  peak: stack(
    kick.gain(0.95),
    bass.gain(0.8),
    hats.gain(0.5),
    lead.gain(0.6),
    sound("~ cp ~ cp").gain(0.8)
  ),
  
  // Outro for mixing out (16 bars)
  outro: stack(
    kick,
    bass.gain(x => 0.7 * (1 - (x.cycle - 112) / 16))  // Fade out
  )
};

// Full arrangement (128 bars = 8 minutes at 130 BPM)
cat(
  djTrack.intro.slow(16),      // 0-16
  djTrack.main.slow(32),       // 16-48
  djTrack.breakdown.slow(16),  // 48-64
  djTrack.peak.slow(32),       // 64-96
  djTrack.main.slow(16),       // 96-112
  djTrack.outro.slow(16)       // 112-128
).cpm(130)
```

## Performance-Ready Code

### 1. Section Triggers

Prepare for live arrangement:

```javascript
// Sections as variables for live triggering
const sections = {
  A: stack(kick, bass),
  B: stack(kick, bass, hats),
  C: stack(kick, bass, hats, lead),
  D: stack(bass.lpf(200), pad),  // Breakdown
  X: silence  // Full stop
};

// Current section (change this live)
let current = 'A';

// Play current section
sections[current].cpm(130);

// To perform: change 'current' variable and re-evaluate
```

### 2. Progressive Layering

Build complexity gradually:

```javascript
// Layer control
const layers = [
  kick,                          // Layer 0
  bass,                          // Layer 1
  hats,                          // Layer 2
  sound("~ cp ~ cp").gain(0.7),  // Layer 3
  lead,                          // Layer 4
  fx                             // Layer 5
];

// Add layers over time
stack(
  ...layers.map((layer, i) => 
    layer.when(x => x.cycle >= i * 8, x => x)
  )
).cpm(130)
```

### 3. Macro Controls

High-level performance parameters:

```javascript
// Performance macros
const macros = {
  energy: 0.5,    // 0-1
  space: 0.2,     // 0-1
  chaos: 0.1      // 0-1
};

// Apply macros to elements
stack(
  kick.gain(0.7 + 0.3 * macros.energy),
  
  bass
    .lpf(200 + 800 * macros.energy)
    .room(macros.space),
    
  hats
    .degradeBy(macros.chaos)
    .gain(0.4 * macros.energy),
    
  lead
    .sometimesBy(macros.chaos, x => x.fast(2))
    .delay(macros.space)
).cpm(130)
```

## Practical Exercises

### Exercise 1: 32-Bar Mini Arrangement
Create a complete mini-track:

```javascript
// Your 32-bar arrangement
// Bar 1-8: Intro (kick only)
// Bar 9-16: Add bass
// Bar 17-24: Add percussion
// Bar 25-32: Full pattern with variation
```

### Exercise 2: Automated Breakdown
Design a breakdown that happens automatically:

```javascript
// 16-bar breakdown starting at bar 32
// Should include:
// - Kick removal
// - Filter automation
// - Reverb increase
// - Atmospheric elements
```

### Exercise 3: Live Performance Setup
Prepare code for live manipulation:

```javascript
// Create sections A, B, C, D
// Add comments for performance cues
// Include at least 3 "macro" controls
// Design for 5-minute performance
```

## Common Arrangement Problems

### Problem: Transitions too abrupt
**Solution**: Use gradual parameter changes
```javascript
// Smooth 4-bar transition
.gain(slow(4, line(0, 1)))
.lpf(slow(4, line(200, 2000)))
```

### Problem: Energy drops in middle
**Solution**: Add variation and automation
```javascript
.every(8, x => x.fast(2))  // Double-time variation
.when(x => x.cycle % 16 === 15, x => x.rev())  // Reverse at end of 16
```

### Problem: No clear structure
**Solution**: Use consistent section lengths
```javascript
const sectionLength = 16;  // Standard section
cat(
  intro.slow(sectionLength),
  main.slow(sectionLength * 2),  // Double length for main
  breakdown.slow(sectionLength),
  outro.slow(sectionLength)
)
```

## Assessment Criteria

Your Module 8 submission should demonstrate:

1. **Structural Clarity** (30%)
   - Clear sections and transitions
   - Logical energy progression
   - DJ-friendly arrangement

2. **Technical Implementation** (25%)
   - Effective use of conditional logic
   - Clean, organized code
   - Performance-ready setup

3. **Musical Flow** (25%)
   - Smooth transitions
   - Tension and release
   - Maintains groove throughout

4. **Creative Arrangement** (20%)
   - Original structural ideas
   - Effective use of space
   - Personal style evident

## Module Assignment

Create three arrangements:

1. **Club Track**: 8-minute DJ tool
   - Full intro/outro for mixing
   - Clear 8-bar sections
   - At least one breakdown
   - Peak moment clearly defined

2. **Live Set Track**: Performance-ready
   - Modular sections
   - Macro controls implemented
   - Comments for performance cues
   - 5-minute length

3. **Experimental Structure**: Push boundaries
   - Non-standard section lengths
   - Unusual energy curve
   - Creative transitions
   - 6-minute journey

Requirements:
- Include arrangement diagram/notes
- Export full audio
- Provide DJ/performance instructions
- Document all section timings

## Next Module Preview
In Module 9, we'll explore sampling and texture, learning to integrate found sounds, field recordings, and external audio to add unique character and soul to our techno productions.