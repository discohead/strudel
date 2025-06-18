# AGENTS.md - Resources Directory Guide

## Resource Library for AI Assistants

This directory contains supplementary materials for the Strudel Techno Curriculum. This AGENTS.md file helps AI assistants understand and create resources. See CLAUDE.md for comprehensive planning details.

## Current Resources

### quick_reference.md
Essential lookup guide containing:
- Pattern function reference
- Common techno patterns
- Keyboard shortcuts
- Performance tips
- Troubleshooting solutions

## Resource Categories

### 1. Reference Materials

#### Pattern Cookbook
Quick recipes for common needs:
```javascript
// Instant techno patterns
const patterns = {
  // Kicks
  fourOnFloor: sound("bd*4").gain(0.9),
  brokenKick: sound("bd ~ bd bd ~ bd ~ bd").gain(0.9),
  
  // Bass
  rollingBass: note("c1*8").s("bass").lpf(400),
  stabbBass: note("c1 ~ ~ c1 ~ c1 ~ ~").s("bass"),
  
  // Complete grooves
  minimalTechno: () => stack(
    patterns.fourOnFloor,
    patterns.rollingBass,
    sound("hh*16").euclid(11, 16).gain(0.4)
  ).cpm(130)
};
```

#### Effect Chains
Pre-configured effect combinations:
```javascript
// Common techno effects
const effects = {
  // Classic dub delay
  dubDelay: p => p
    .delay(0.8)
    .delaytime(0.375)
    .delayfeedback(0.7)
    .lpf(2000),
    
  // Warehouse reverb
  warehouse: p => p
    .room(0.4)
    .roomsize(0.8)
    .hpf(200),
    
  // Acid filter
  acid: p => p
    .lpf(sine.range(200, 3000).slow(4))
    .resonance(25)
    .distort(0.3)
};
```

#### Scale Reference
Musical scales for techno:
```javascript
const scales = {
  // Dark scales
  minor: "c d eb f g ab bb",
  phrygian: "c db eb f g ab bb",
  locrian: "c db eb f gb ab bb",
  
  // Minimal scales
  pentatonic: "c eb f g bb",
  blues: "c eb f gb g bb",
  
  // Usage
  pattern: note("0 3 5 7").scale("c:minor")
};
```

### 2. Performance Tools

#### Live Setup Checklist
Pre-performance preparation:
```markdown
## Audio Setup
- [ ] Audio interface connected
- [ ] Sample rate: 44.1kHz
- [ ] Buffer size: 128-256 samples
- [ ] Monitor speakers/headphones ready

## Browser Config
- [ ] Chrome/Firefox updated
- [ ] Hardware acceleration enabled
- [ ] Unnecessary tabs closed
- [ ] Ad blockers disabled for Strudel

## Code Preparation
- [ ] Template file loaded
- [ ] Backup patterns ready
- [ ] Emergency patterns tested
- [ ] Font size increased

## Mental Preparation
- [ ] Review key shortcuts
- [ ] Practice transitions
- [ ] Warm up fingers
- [ ] Deep breaths
```

#### Performance Templates
Ready-to-use setups:
```javascript
// Minimal techno performance template
const performance = {
  // Core elements
  kick: sound("bd*4").gain(0.9),
  bass: note("c1*8").s("bass").lpf(400),
  hats: sound("hh*16").euclid(11, 16),
  clap: sound("~ cp ~ cp").gain(0.7),
  
  // Sections
  intro: () => performance.kick,
  build: () => stack(kick, bass),
  main: () => stack(kick, bass, hats, clap),
  break: () => bass.lpf(200).room(0.5),
  
  // Effects
  delay: p => p.delay(0.8).delaytime(0.375),
  filter: p => p.lpf(sine.range(200, 4000).slow(16))
};

// Start with: performance.intro().cpm(130)
```

#### Macro Controllers
Performance control systems:
```javascript
// Macro template
let energy = 0.5;  // 0-1
let chaos = 0;     // 0-1  
let space = 0.2;   // 0-1

const live = () => stack(
  kick.gain(0.7 + energy * 0.3),
  bass.lpf(200 + energy * 3800),
  hats.degradeBy(chaos * 0.5),
  clap.room(space)
).cpm(130);

// During performance:
// energy = 0.8; live();
// chaos = 0.3; live();
```

### 3. Learning Resources

#### Common Patterns
Frequently used techno patterns:
```javascript
// Rhythm patterns
const rhythms = {
  straight: "x x x x",
  broken: "x ~ x x ~ x ~ x",
  syncopated: "~ x ~ x x ~ x ~",
  euclidean: (n, k) => `euclid(${n}, ${k})`
};

// Bassline patterns  
const basslines = {
  constant: "c1*8",
  offbeat: "~ c1 ~ c1 ~ c1 ~ c1",
  melodic: "c1 eb1 g1 f1",
  acid: "c1 c1 eb1 c1 g1 c1 c2 c1"
};
```

#### Troubleshooting Guide
Common issues and solutions:
```javascript
const issues = {
  noSound: {
    problem: "No audio output",
    solutions: [
      "Check browser audio permissions",
      "Verify speakers/headphones connected",
      "Try: sound('bd').gain(1).cpm(120)",
      "Refresh browser"
    ]
  },
  
  timing: {
    problem: "Pattern timing issues",
    solutions: [
      "Use hush() to reset",
      "Check for syntax errors",
      "Verify bracket matching",
      "Simplify pattern"
    ]
  },
  
  performance: {
    problem: "Audio glitches/dropouts",
    solutions: [
      "Reduce pattern complexity",
      "Close other applications",
      "Increase buffer size",
      "Use simpler effects"
    ]
  }
};
```

### 4. Sample Banks (Planned)

#### Kick Drums
Organized by style:
```javascript
const kicks = {
  classic: ["808", "909", "606"],
  modern: ["punch", "sub", "hard"],
  processed: ["distorted", "filtered", "layered"],
  
  // Usage
  pattern: sound(kicks.classic[0])
};
```

#### Percussion Sets
Complete rhythm toolkits:
```javascript
const percussion = {
  hats: {
    closed: ["hh", "hh:1", "hh:2"],
    open: ["oh", "oh:1", "oh:2"],
    variations: ["shaker", "tamb", "shake"]
  },
  
  claps: ["cp", "clap", "clp"],
  snares: ["sd", "snare", "sn"],
  
  ethnic: ["conga", "bongo", "tabla"],
  industrial: ["metal", "clank", "hit"]
};
```

### 5. Preset Banks

#### Synth Presets
Ready-to-use sounds:
```javascript
const presets = {
  // Techno lead
  lead: {
    osc: "saw",
    attack: 0.01,
    release: 0.1,
    filter: 2000,
    res: 15
  },
  
  // Sub bass
  sub: {
    osc: "sine",
    attack: 0.01,
    release: 0.05,
    filter: 100
  },
  
  // Usage
  apply: (note, preset) => 
    note.s(preset.osc)
      .attack(preset.attack)
      .release(preset.release)
      .lpf(preset.filter)
};
```

### 6. Quick Cards

#### Command Reference
Essential commands:
```markdown
## Playback Control
- Run: Ctrl+Enter (Cmd+Enter on Mac)
- Stop: Ctrl+. (Cmd+.)
- Silence: hush()

## Editing
- Comment: Ctrl+/
- Duplicate: Ctrl+D
- Format: Shift+Alt+F

## Pattern Control
- Tempo: .cpm(130)
- Gain: .gain(0.8)
- Pan: .pan(0.5)
```

#### BPM Guide
Tempo ranges for techno:
```javascript
const tempos = {
  deepTechno: "118-125 BPM",
  minimalTechno: "125-130 BPM",
  techno: "130-135 BPM",
  hardTechno: "135-145 BPM",
  industrial: "140-150 BPM"
};
```

## Creating Resources

### Resource Types
1. **References** - Quick lookup information
2. **Templates** - Starting points
3. **Presets** - Reusable configurations
4. **Guides** - Step-by-step instructions
5. **Tools** - Interactive utilities

### Quality Standards
- **Accurate** - All information correct
- **Practical** - Immediately useful
- **Concise** - No unnecessary content
- **Organized** - Easy to navigate
- **Tested** - All code verified

### Contribution Process
1. Identify resource need
2. Create/collect content
3. Test thoroughly
4. Format clearly
5. Add examples

## Resource Philosophy

Resources should:
1. **Save time** - Quick access to common needs
2. **Prevent errors** - Tested solutions
3. **Inspire** - Show possibilities
4. **Educate** - Teach while helping
5. **Evolve** - Update with community needs

## Tips for AI Assistants

### Creating Resources
1. **Focus on common needs** - What do students ask for?
2. **Provide working code** - Everything must run
3. **Keep it practical** - Real-world application
4. **Update regularly** - Stay current
5. **Test everything** - No broken examples

### Resource Formats
```javascript
// Code snippets - ready to copy/paste
const snippet = sound("bd*4").gain(0.9);

// Reference tables - easy scanning
| Function | Purpose | Example |
|----------|---------|---------|
| euclid() | Rhythm  | euclid(5,8) |

// Checklists - actionable steps
- [ ] Step 1
- [ ] Step 2
```

## Quality Checklist

For each resource:
- [ ] Serves clear purpose
- [ ] Well organized
- [ ] Code tested
- [ ] Easy to use
- [ ] Maintains curriculum style
- [ ] Credits sources
- [ ] Updated regularly

## Remember

Great resources:
1. **Solve real problems** - Address actual needs
2. **Save time** - Faster than figuring out alone
3. **Inspire confidence** - Reliable information
4. **Encourage exploration** - Show what's possible
5. **Build community** - Shareable knowledge

The best resource is one that gets bookmarked and shared.