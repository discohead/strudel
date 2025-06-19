# Module 10: The Live Coder - Performance & Improvisation

## Overview
The ultimate test of your Strudel mastery is live performance. In this final module, we transform from programmers into performers, learning to code techno in real-time. We'll master performance techniques, develop improvisational skills, and understand how to read and respond to a crowd—all while writing code.

## Learning Objectives
By the end of this module, you will be able to:
1. Perform live techno sets using Strudel
2. Improvise and respond to audience energy
3. Manage smooth transitions and build dramatic moments
4. Handle performance pressure and recover from errors
5. Develop a personal live coding style

## Core Performance Concepts

### Performance Commands

```javascript
// Essential live commands
// hush()                    // Stop all sound immediately (run this command when needed)
silence                   // Empty pattern (for transitions)

// Performance utilities
// pattern.cpm(130)          // Tempo control
// pattern.gain(0.8)         // Master volume
// pattern.orbit(1)          // Routing for effects
```

```javascript
// Quick modifications (keyboard shortcuts)
// Ctrl+Enter               // Evaluate code
// Ctrl+.                   // Panic stop
// Ctrl+/                   // Comment/uncomment line
```

### Code Organization for Performance

```javascript
// Performance template structure
// === TEMPO ===
let bpm = 130;

// === ELEMENTS ===
const kick = sound("bd*4").gain(0.9);
const bass = note("c1*8").s("bass").release(0.1).gain(0.7);
const hats = sound("hh*16").euclid(11, 16).gain(0.4);
const clap = sound("~ cp ~ cp").gain(0.7);

// === VARIATIONS ===
const bassVar1 = bass.note("c1 ~ c1 c1 ~ c1 ~ c1");
const bassVar2 = bass.note("c1 eb1 c1 g0");
const hatsBusy = hats.fast(2).gain(0.3);

// === EFFECTS ===
const dubDelay = x => x.delay(0.8).delaytime(0.375).delayfeedback(0.7);
const spaceOut = x => x.room(0.7).lpf(1000);

// === CURRENT PATTERN ===
stack(
  kick,
  bass,
  hats
).cpm(bpm)
```

## Performance Techniques

### 1. The Build-Up

Gradual intensity increase:

```javascript
// Define elements first
const kick = sound("bd*4").gain(0.9);
const bass = note("c1*8").s("bass").release(0.1).gain(0.7);
const hats = sound("hh*16").euclid(11, 16).gain(0.4);
const clap = sound("~ cp ~ cp").gain(0.7);
const lead = note("c3 eb3 g3 c4").s("sawtooth").lpf(1000).gain(0.5);

// Start minimal
stack(
  kick
).cpm(130)

// Add elements (evaluate these one by one)
stack(
  kick,
  bass.gain(0.5)  // Add bass quietly
).cpm(130)

stack(
  kick,
  bass.gain(0.7),  // Increase bass
  hats.gain(0.2)   // Add hats softly
).cpm(130)

stack(
  kick,
  bass.gain(0.7),
  hats.gain(0.4),  // Increase hats
  clap              // Add clap for energy
).cpm(130)

// Peak moment
stack(
  kick.gain(0.95),
  bass.gain(0.8),
  hats.gain(0.5),
  clap.gain(0.8),
  lead.gain(0.6)   // Full pattern
).cpm(130)
```

### 2. The Breakdown

Creating dramatic moments:

```javascript
// Full pattern playing...
// Assuming these elements are already defined:
// const kick = sound("bd*4").gain(0.9);
// const bass = note("c1*8").s("bass").release(0.1).gain(0.7);
// const hats = sound("hh*16").euclid(11, 16).gain(0.4);
// const clap = sound("~ cp ~ cp").gain(0.7);

// Sudden breakdown (evaluate quickly)
stack(
  // kick,  // Comment out kick
  bass.lpf(300).room(0.5),  // Filter and reverb bass
  // hats,  // Remove hats
  // clap,  // Remove clap
  note("c2").s("pad").attack(2).release(4).gain(0.4)  // Add atmospheric element
).cpm(130)

// Build tension
stack(
  bass.lpf(sine.range(300, 2000).slow(8)),  // Filter sweep
  note("c2").s("pad").attack(2).release(4).gain(sine.range(0.4, 0.7).slow(4)),   // Volume swell
  s("riser").gain(saw.range(0, 0.8).slow(8))    // Riser
).cpm(130)

// Drop back in
stack(
  kick.gain(1),    // Kick hits hard
  bass.lpf(2000),  // Open filter
  hats.fast(2),    // Doubled hats
  clap.gain(0.9)   // Loud clap
).cpm(130)
```

### 3. Live Remixing

Transform patterns on the fly:

```javascript
// Base pattern
const loop = stack(kick, bass, hats, clap);

// Quick remix variations
loop.cpm(130)  // Original

loop.fast(2).cpm(130)  // Double time

loop.slow(2).cpm(130)  // Half time

loop.rev().cpm(130)  // Reverse

loop.iter(4).cpm(130)  // Rotate pattern

loop.jux(rev).cpm(130)  // Stereo reverse

loop.every(4, x => x.fast(2)).cpm(130)  // Periodic variation

loop.chop(8).cpm(130)  // Glitch effect

loop.euclid(7, 8).cpm(130)  // Euclidean remix
```

### 4. Transition Techniques

Moving between patterns smoothly:

```javascript
// Define elements if not already defined
const kick = sound("bd*4").gain(0.9);
const bass = note("c1*8").s("bass").release(0.1).gain(0.7);
const hats = sound("hh*16").euclid(11, 16).gain(0.4);

// Pattern A playing...
const patternA = stack(kick, bass, hats).cpm(130);

// Prepare Pattern B
const patternB = stack(
  sound("bd*4").gain(0.9).speed(0.9),
  note("f1*8").s("fm").release(0.1),
  sound("cr*16").euclid(9, 16)
);

// Transition approach 1: Gradual fade
stack(
  patternA.gain(0.5),  // Reduce A
  patternB.gain(0.5).hpf(500)  // Bring in B filtered
).cpm(130)

// Full transition
patternB.cpm(130)  // Now just B

// Transition approach 2: Effect wash
stack(
  patternA.room(0.9).lpf(500),  // Wash out A
  patternB.gain(0.3)  // Hint of B
).cpm(130)

// Transition approach 3: Beat matching
stack(
  patternA.mask("1 0 1 0"),  // Thin out A
  patternB.mask("0 1 0 1")   // Fill with B
).cpm(130)
```

## Advanced Performance Strategies

### 1. Macro Control System

```javascript
// Define base elements
const kick = sound("bd*4");
const bass = note("c1*8").s("bass").release(0.1);
const hats = sound("hh*16").euclid(11, 16);
const clap = sound("~ cp ~ cp");

// Performance macros
let energy = 0.5;
let chaos = 0;
let space = 0.2;
let filter = 1;

// Macro-controlled pattern
const perform = () => stack(
  kick.gain(0.7 + energy * 0.3),
  
  bass
    .gain(0.5 + energy * 0.3)
    .lpf(200 + filter * 3800)
    .sometimes(x => x.fast(2).gain(chaos)),
    
  hats
    .gain(energy * 0.5)
    .degradeBy(chaos * 0.5)
    .room(space),
    
  clap
    .gain(energy * 0.8)
    .delay(space * 0.8)
    .fast(energy > 0.7 ? 2 : 1)  // Speed up when high energy
).cpm(130);

// During performance, just change values:
// energy = 0.8; perform();
// chaos = 0.3; perform();
// space = 0.6; perform();
```

### 2. Pattern Banking

Pre-loaded patterns for quick access:

```javascript
// Define all elements for pattern bank
const kick = sound("bd*4").gain(0.9);
const bass = note("c1*8").s("bass").release(0.1).gain(0.7);
const hats = sound("hh*16").euclid(11, 16).gain(0.4);
const clap = sound("~ cp ~ cp").gain(0.7);
const lead = note("c3 eb3 g3 c4").s("sawtooth").lpf(1000).gain(0.5);
const pad = note("c2").s("pad").attack(2).release(4);

// Pattern bank
const patterns = {
  intro: stack(kick, hats.gain(0.3)),
  
  grooveA: stack(kick, bass, hats, clap),
  
  grooveB: stack(
    kick.struct("x ~ x x ~ x ~ x"),
    bass.note("c1 ~ eb1 ~ f1 ~ g1 ~"),
    sound("rim*8").gain(0.5)
  ),
  
  breakdown: stack(
    bass.lpf(300).room(0.5),
    pad.gain(0.4),
    sound("cr*4").gain(0.2).delay(0.7)
  ),
  
  peak: stack(
    kick.gain(1),
    bass.fast(2).gain(0.8),
    hats.fast(2).gain(0.6),
    clap.gain(0.9),
    lead.gain(0.7)
  ),
  
  outro: stack(kick, bass.gain(saw.range(1, 0).slow(32)))
};

// Quick pattern switching:
patterns.intro.cpm(130);      // Start
patterns.grooveA.cpm(130);    // Build
patterns.peak.cpm(130);       // Climax
patterns.breakdown.cpm(130);  // Break
patterns.outro.cpm(130);      // End
```

### 3. Error Recovery

Graceful handling of mistakes:

```javascript
// Safe pattern wrapper
const safe = (pattern) => {
  try {
    return pattern;
  } catch (e) {
    console.error("Pattern error:", e);
    return silence;  // Return silence instead of crashing
  }
};

// Emergency patterns
const emergency = {
  minimal: stack(sound("bd*4"), sound("hh*8")).cpm(130),
  
  simple: stack(
    sound("bd*4"),
    note("c1*8").s("bass").release(0.1)
  ).cpm(130),
  
  // If all else fails
  panic: sound("bd*4").cpm(130)
};

// Quick recovery commands
// hush(); emergency.minimal.cpm(130)  // Stop and restart minimal
// Ctrl+Z to undo last change
// Keep previous working code in comments
```

### 4. Crowd Reading and Response

```javascript
// Energy detection patterns
const crowdTest = {
  // Test energy with different patterns
  high: stack(kick.fast(2), bass.fast(2), hats.fast(4)),
  medium: stack(kick, bass, hats),
  low: stack(kick.slow(2), bass.lpf(300))
};

// Response strategies
const responses = {
  // Crowd losing energy: Add surprise
  surprise: x => x.every(8, jux(rev)).fast(1.5),
  
  // Crowd too intense: Create space
  breathe: x => x.mask("1 0 1 0 1 0 1 0"),
  
  // Crowd locked in: Maintain hypnosis
  lock: x => x.degradeBy(0.1).delay(0.3)
};
```

## Performance Preparation

### Pre-Show Checklist

```javascript
// 1. Test audio setup
sound("bd").cpm(120)  // Test kick
s("test").gain(0.5)   // Test samples

// 2. Prepare templates
const templates = {
  /* Your go-to patterns */
};

// 3. Set up safety nets
const backup = {
  /* Emergency patterns */
};

// 4. Configure screen
// - Large font size
// - Dark theme
// - Hide unnecessary UI
// - Multiple editor tabs ready

// 5. Mental preparation
// - Review key commands
// - Practice transitions
// - Prepare for failures
```

### Set Structure Planning

```javascript
// 30-minute set structure
const setlist = {
  "0-5min": "Intro - establish groove",
  "5-10min": "Build energy - add elements",
  "10-15min": "First peak - full patterns",
  "15-20min": "Breakdown - spacey section",
  "20-25min": "Second peak - maximum energy",
  "25-30min": "Outro - gradual reduction"
};

// Timing helpers
const startTime = Date.now();
const elapsed = () => Math.floor((Date.now() - startTime) / 1000 / 60);

// Check timing during set:
// console.log(`${elapsed()} minutes`);
```

## Performance Styles

### 1. The Minimalist (Robert Hood Style)

```javascript
// Start with almost nothing
sound("bd*4").gain(0.9).cpm(130)

// Tiny additions over time
stack(
  sound("bd*4").gain(0.9),
  sound("rim").struct("~ ~ ~ x").gain(0.4)  // One rim hit
).cpm(130)

// Focus on subtle changes
stack(
  sound("bd*4").gain(0.9),
  sound("rim").struct("~ ~ ~ x").gain(0.4),
  note("c1").struct("x ~ ~ ~").s("sine").gain(0.6)  // One bass note
).cpm(130)
```

### 2. The Maximalist (Chris Liberator Style)

```javascript
// Start big
stack(
  sound("bd*4").gain(0.95).distort(0.3),
  note("c1*16").s("sawtooth").lpf(sine.range(200, 4000).fast(2)),
  sound("cp*4").gain(0.8),
  sound("hh*32").gain(0.5).pan(rand)
).cpm(140)

// Add chaos
.every(4, x => x.rev())
.every(8, x => x.fast(2))
.sometimes(x => x.chop(8))
```

### 3. The Storyteller (Tale of Us Style)

```javascript
// Narrative arc through code
// Chapter 1: Introduction
const intro = note("c2").s("pad").attack(4).release(8).gain(0.3);

// Chapter 2: Development
const development = stack(
  intro,
  sound("bd*4").gain(0.7),
  note("c1 eb1 g1 c2").s("piano").gain(0.5)
);

// Define lead for climax
const lead = note("c4 eb4 g4 c5").s("sawtooth").lpf(2000);

// Chapter 3: Climax
const climax = stack(
  development,
  lead.gain(0.7),
  sound("crash").struct("x ~ ~ ~").gain(0.6)
);

// Chapter 4: Resolution
const resolution = intro.add(12).room(0.8);
```

## Practical Exercises

### Exercise 1: 10-Minute Mini Set
Perform a complete journey:
- 2 min: Introduction
- 3 min: Build
- 2 min: Peak
- 2 min: Breakdown
- 1 min: Outro

### Exercise 2: Transition Practice
Create 5 different transition types:
1. Filter sweep
2. Beat displacement
3. Effect wash
4. Sudden cut
5. Gradual morph

### Exercise 3: Error Recovery Drill
Practice recovering from:
- Syntax errors
- Wrong tempo
- Too loud/quiet
- Pattern chaos
- Complete silence

## Common Performance Challenges

### Challenge: Stage fright
**Solution**: Preparation and safety nets
```javascript
// Have these ready:
const safe1 = sound("bd*4").cpm(130);  // Can't fail
const safe2 = stack(
  sound("bd*4").gain(0.9),
  note("c1*8").s("bass").release(0.1).gain(0.7)
).cpm(130);  // Pre-tested
// Practice typing them blind
```

### Challenge: Losing track of time
**Solution**: Visual cues
```javascript
// Define elements for this example
const kick = sound("bd*4").gain(0.9);
const bass = note("c1*8").s("bass").release(0.1).gain(0.7);
const hats = sound("hh*16").euclid(11, 16).gain(0.4);

// Add comments during performance
stack(
  kick,  // 5 mins - ADD BASS SOON
  bass,  // 8 mins - BUILD TO PEAK
  hats   // 10 mins - PEAK TIME!
).cpm(130)
```

### Challenge: Technical difficulties
**Solution**: Have backups
```javascript
// Multiple approaches ready
const planA = stack(
  sound("bd*4").gain(0.9),
  note("c1*8").s("bass").release(0.1),
  sound("hh*16").euclid(11, 16)
);  // Complex pattern
const planB = stack(
  sound("bd*4"),
  note("c1*4").s("bass")
);  // Simpler version
const planC = sound("bd*4").cpm(130);  // Ultra-safe
```

## Assessment Criteria

Your Module 10 submission should demonstrate:

1. **Performance Skills** (30%)
   - Smooth transitions
   - Good timing and pacing
   - Error recovery

2. **Musical Journey** (30%)
   - Clear structure
   - Energy management
   - Crowd awareness

3. **Technical Proficiency** (20%)
   - Code efficiency
   - Creative techniques
   - Real-time problem solving

4. **Personal Style** (20%)
   - Unique approach
   - Signature sounds
   - Performance personality

## Final Assignment

Prepare and perform:

1. **20-Minute Live Set**
   - Record video of screen and audio
   - Include at least 3 distinct sections
   - Show various performance techniques
   - Handle at least one "mistake"

2. **Performance Documentation**
   - Annotated code with performance notes
   - Timing plan
   - Reflection on what worked/didn't

3. **Performance Toolkit**
   - Your personal template file
   - Emergency patterns
   - Signature sounds/techniques
   - Pre-show checklist

Requirements:
- Live coding only (no pre-recording)
- Must maintain techno energy
- Show personality and style
- Demonstrate course concepts

## Course Conclusion

Congratulations! You've completed the journey from basic patterns to live performance. You now have the skills to:

- Create professional techno patterns
- Design unique sounds
- Build hypnotic arrangements
- Perform live coded sets

Remember: Live coding is about expression, not perfection. Every performance is unique, every mistake an opportunity for innovation.

Keep practicing, keep performing, and keep pushing the boundaries of what's possible with code and sound.

Welcome to the global live coding techno community!

```javascript
// Your journey continues...
stack(
  sound("bd*4"),
  note("c1*8").s("bass"),
  sound("hh*16").euclid(11, 16),
  // Add your voice here...
).cpm(130)
```