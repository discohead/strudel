# CLAUDE.md - Resources Directory

## Resource Library Overview

This directory contains supplementary materials, references, and tools to support the Strudel Techno Curriculum. Resources are organized to provide quick access during learning and performance.

## Current Resources

### quick_reference.md
- Essential pattern functions
- Common techno patterns
- Keyboard shortcuts
- Performance tips
- Troubleshooting guide

## Planned Resource Categories

### 1. Reference Materials

#### pattern_cookbook.md
```javascript
// Quick pattern recipes
export const cookbook = {
  // Rhythms
  kicks: {
    fourFloor: "bd*4",
    broken: "bd ~ bd bd ~ bd ~ bd",
    syncopated: "bd ~ ~ bd ~ bd bd ~"
  },
  
  // Basslines
  bass: {
    rolling: "c1*8",
    stabby: "c1 ~ ~ c1 ~ c1 ~ ~",
    melodic: "c1 eb1 g1 c1"
  },
  
  // Full grooves
  grooves: {
    minimal: () => stack(kicks.fourFloor, bass.rolling),
    driving: () => stack(kicks.broken, bass.stabby),
    hypnotic: () => stack(kicks.syncopated, bass.melodic)
  }
};
```

#### techno_scales.md
Musical scales and modes for techno:
- Minor scales (natural, harmonic, melodic)
- Phrygian mode (dark techno)
- Locrian mode (experimental)
- Pentatonic scales (hooks)
- Chromatic approaches

#### effect_chains.md
Common effect combinations:
```javascript
// Dub delay
const dubDelay = p => p
  .delay(0.8)
  .delaytime(0.375)
  .delayfeedback(0.7)
  .lpf(2000);

// Space reverb
const spaceReverb = p => p
  .room(0.8)
  .roomsize(0.9)
  .roomfade(4)
  .hpf(200);
```

### 2. Sample Banks

#### kicks/
- 808 kicks
- 909 kicks
- Distorted kicks
- Sub kicks
- Layered kicks

#### percussion/
- Hi-hats (open/closed)
- Claps and snares
- Rides and crashes
- Shakers and tambourines
- Industrial hits

#### textures/
- Vinyl crackle
- Tape saturation
- Field recordings
- Ambient drones
- Noise textures

#### vocals/
- Vocal stabs
- Spoken word
- Crowd sounds
- Processed vocals
- Robotic voices

### 3. Preset Banks

#### synth_presets.js
```javascript
export const presets = {
  // Classic techno lead
  technoLead: {
    synth: "saw",
    attack: 0.01,
    release: 0.1,
    filter: 2000,
    resonance: 15
  },
  
  // Acid bass
  acidBass: {
    synth: "saw",
    attack: 0.01,
    release: 0.05,
    filter: "200-3000",
    resonance: 30
  },
  
  // Detroit pad
  detroitPad: {
    synth: "supersaw",
    unison: 5,
    detune: 0.1,
    attack: 1,
    release: 2
  }
};
```

#### pattern_templates.js
Ready-to-use pattern structures:
```javascript
export const templates = {
  // 16-bar intro template
  intro16: {
    bars1_4: "kick",
    bars5_8: "kick, hats",
    bars9_12: "kick, hats, bass",
    bars13_16: "kick, hats, bass, fx"
  },
  
  // Standard arrangement
  standard128: {
    intro: 16,
    build1: 16,
    main1: 32,
    breakdown: 16,
    build2: 16,
    main2: 32,
    outro: 16
  }
};
```

### 4. Performance Tools

#### live_setup.md
Performance preparation checklist:
- Audio interface setup
- Browser configuration
- Screen layout
- Backup patterns
- Emergency procedures

#### macro_controllers.js
Performance macro systems:
```javascript
// Macro control template
export const macros = {
  energy: {
    min: 0,
    max: 1,
    default: 0.5,
    targets: ["gain", "filter", "density"]
  },
  
  chaos: {
    min: 0,
    max: 1,
    default: 0,
    targets: ["degrade", "randomness", "glitch"]
  },
  
  space: {
    min: 0,
    max: 1,
    default: 0.2,
    targets: ["reverb", "delay", "pan"]
  }
};
```

#### performance_cues.md
Visual cue system for live performance:
```
⚡ ENERGY UP - Increase intensity
🌊 FLOW - Maintain groove
🔥 PEAK - Maximum energy
❄️ COOL - Reduce intensity
🌀 TWIST - Add variation
⏸️ BREAK - Breakdown section
▶️ DROP - Big moment
```

### 5. Learning Resources

#### theory/
- Techno history timeline
- Genre evolution chart
- Artist family trees
- Label catalogs
- Classic track analyses

#### tutorials/
- Video companion scripts
- Step-by-step guides
- Common patterns explained
- Troubleshooting videos
- Performance examples

#### challenges/
- Daily pattern challenges
- Weekly genre studies
- Monthly competitions
- Collaborative projects
- Remix contests

### 6. Community Resources

#### showcase/
Student and instructor patterns:
```javascript
// Student showcase template
export const showcase = {
  author: "Student Name",
  date: "2024-01-01",
  module: 5,
  title: "Industrial Acid Fusion",
  pattern: /* their code */,
  notes: "Inspired by..."
};
```

#### collaborations/
Shared pattern development:
- Duo performances
- Group compositions
- Global jam sessions
- Cross-genre experiments

### 7. Technical Resources

#### optimization.md
Performance optimization tips:
- CPU-efficient patterns
- Browser settings
- Audio latency reduction
- Pattern complexity management

#### compatibility.md
Cross-platform notes:
- Browser differences
- OS-specific issues
- Mobile considerations
- Hardware requirements

#### troubleshooting.md
Common issues and solutions:
- No sound problems
- Timing issues
- Browser crashes
- Pattern errors

### 8. Extended Learning

#### beyond_basics/
Advanced topics not in main curriculum:
- Microtonal techno
- Algorithmic composition
- Live sampling techniques
- Visual programming
- Hardware integration

#### research/
Academic and experimental:
- Papers on live coding
- Techno musicology
- Pattern perception studies
- Audience response research

#### future_tech/
Emerging possibilities:
- VR performance spaces
- AI collaboration tools
- Blockchain pattern sharing
- Quantum rhythm generation

## Resource Development Guidelines

### Quality Standards
1. **Accurate** - All code must work
2. **Current** - Updated regularly
3. **Useful** - Solves real problems
4. **Organized** - Easy to find
5. **Credited** - Attribute sources

### Contribution Process
1. Identify resource need
2. Create/collect material
3. Test thoroughly
4. Document clearly
5. Submit with examples

### Maintenance Schedule
- Weekly: Check for broken links
- Monthly: Update sample banks
- Quarterly: Refresh examples
- Yearly: Major reorganization

## Future Resource Plans

### Interactive Tools
- Pattern generator
- BPM calculator
- Scale finder
- Effect chain builder
- Arrangement planner

### Mobile Resources
- Quick reference app
- Pattern library
- Performance timer
- Cue sheet viewer
- Emergency patterns

### Physical Resources
- Printable cheat sheets
- Performance cards
- Sticker commands
- Reference posters
- Note templates

## Resource Philosophy

Resources should:
1. **Accelerate learning** - Quick access to information
2. **Support performance** - Real-time helpful
3. **Inspire creativity** - Spark new ideas
4. **Build community** - Shareable and collaborative
5. **Evolve constantly** - Living documents

The best resource is one that gets used repeatedly and modified for personal needs.

## Remember

> "In techno, less is more, but having more options lets you choose less wisely."

Keep resources:
- Practical
- Musical
- Accessible
- Inspiring
- Evolving