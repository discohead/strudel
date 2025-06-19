# AGENTS.md - Strudel Techno Curriculum

## Project Overview for AI Agents

This is a comprehensive, ever-expanding curriculum for teaching hypnotic minimal techno composition using Strudel. This AGENTS.md file provides context for AI assistants working with this project. For additional detailed context, see the accompanying CLAUDE.md file.

## Core Philosophy

- **Practical Over Theoretical**: Every concept must produce immediate musical results
- **Hypnotic Minimal Techno**: Focus on the aesthetic of Jeff Mills, Robert Hood, Donato Dozzy, Surgeon
- **Progressive Mastery**: Each module builds on previous knowledge
- **Never-Ending Journey**: The curriculum expands as techno and live coding evolve

## Current Project Structure

```
strudel-techno-curriculum/
├── TECHNO_CURRICULUM.md      # Main curriculum document
├── README.md                  # Quick start guide
├── CLAUDE.md                  # Detailed context for Claude
├── AGENTS.md                  # This file - AI agent guide
├── FUTURE_MODULES.md          # Expansion roadmap
├── modules/                   # Individual module guides
│   ├── MODULE_1_FOUNDATION.md through MODULE_10_THE_LIVE_CODER.md
│   ├── CLAUDE.md             # Module development context
│   └── AGENTS.md             # Module agent guide
├── examples/                  # Working code examples
│   ├── module1_examples.js   # Complete example patterns
│   ├── CLAUDE.md             # Example development context
│   └── AGENTS.md             # Example agent guide
├── exercises/                 # Hands-on practice
│   ├── CLAUDE.md             # Exercise framework
│   └── AGENTS.md             # Exercise agent guide
└── resources/                 # Supporting materials
    ├── quick_reference.md     # Quick lookup guide
    ├── CLAUDE.md             # Resource planning
    └── AGENTS.md             # Resource agent guide
```

## Working with This Project

### For AI Assistants

When helping with this project:

1. **Maintain the aesthetic**: All code should produce hypnotic, minimal techno
2. **Validate all code**: Use `node ../../packages/transpiler/validate.mjs` before inclusion
3. **Test all code**: Every example must be runnable in Strudel
4. **Follow patterns**: Use existing modules as templates
5. **Think musically**: Technical accuracy must serve musical goals
6. **Reference artists**: Connect techniques to real techno producers

### Code Validation Requirement
**CRITICAL**: All Strudel code must be validated before inclusion:
```bash
# From this directory
node ../../packages/transpiler/validate.mjs 's("bd*4").gain(0.9)'
# Should output: ✓ Valid Strudel code
```

### Code Style Example

```javascript
// Always provide working, musical examples
stack(
  sound("bd*4").gain(0.9),           // Kick foundation
  note("c1*8").s("bass").lpf(400),   // Minimal bass
  sound("hh*16").euclid(11, 16)      // Euclidean hi-hats
).cpm(130)  // Always include tempo
```

## Current Modules Summary

1. **The Foundation** - Kick drum patterns and tempo
2. **The Groove Engine** - Hi-hats and Euclidean rhythms  
3. **Hypnotic Tension** - Polyrhythms and percussion
4. **The Low End Theory** - Bass synthesis and patterns
5. **Sonic Identity** - Advanced synthesis techniques
6. **The Hook** - Probabilistic and generative patterns
7. **Space & Dub** - Effects as compositional tools
8. **Structure & Arrangement** - Building complete tracks
9. **Texture & Soul** - Sample integration
10. **The Live Coder** - Performance techniques

## Expansion Guidelines

### Adding New Content

When creating new modules or content:

1. **Research Phase**: Study specific techno artists/techniques
2. **Prototype Phase**: Create 10-20 working patterns
3. **Structure Phase**: Organize into learning progression
4. **Testing Phase**: Verify all code works
5. **Documentation Phase**: Write clear explanations

### Quality Standards

- **Validated**: All code must pass validation tool
- **Musical**: Must sound professional at 120-140 BPM
- **Technical**: Clean, efficient, well-commented code
- **Educational**: Clear progression from simple to complex
- **Practical**: Immediately usable in performance

### Validation Examples
```bash
# Simple pattern
node ../../packages/transpiler/validate.mjs 's("bd sd")'

# Complex stack
node ../../packages/transpiler/validate.mjs 'stack(s("bd*4"), s("hh*8").euclid(11,16))'

# With effects
node ../../packages/transpiler/validate.mjs 's("bd").room(0.5).delay(0.125).cpm(130)'
```

## Key Strudel Concepts for Techno

### Essential Functions
```javascript
// Pattern creation
sound("bd*4")              // Sample playback
note("c3").s("sawtooth")        // Synthesized notes

// Rhythm
.euclid(5, 8)             // Euclidean rhythms
.polyrhythm(3, 4)         // Polyrhythmic patterns

// Effects
.delay(0.5).delaytime(0.375)  // Dub delay
.lpf(1000).resonance(20)      // Filter sweeps
.room(0.5)                    // Reverb

// Probability
.sometimes(x => x.rev())      // Random variation
.degradeBy(0.3)              // Random removal

// Structure
.every(8, x => x.fast(2))    // Periodic changes
.slow(32)                    // Long cycles
```

## Common Tasks

### Creating a New Module

1. Choose a specific techno technique
2. Research 3-5 artists who exemplify it
3. Create learning objectives (5 specific skills)
4. Write 10+ code examples progressing in complexity
5. **Validate all code examples with validation tool**
6. Design 3 practical exercises
7. Create assessment criteria
8. Write module assignment

#### Validation Workflow
```bash
# Before adding any code to a module:
node ../../packages/transpiler/validate.mjs 'your_pattern_here'
```

### Improving Existing Modules

1. Add more artist-specific examples
2. Create additional exercises
3. Expand style studies
4. Add common problems/solutions
5. Include performance notes

### Building Resources

1. Pattern collections by genre
2. Effect chain presets
3. Performance templates
4. Quick reference guides
5. Troubleshooting documents

## Future Development Areas

- **Modules 11-20**: Advanced techniques (modular systems, acid, industrial)
- **Modules 21-30**: Genre studies (Detroit, Berlin, UK, etc.)
- **Modules 31-40**: Performance mastery
- **Modules 41-50**: Technical deep dives

See FUTURE_MODULES.md for detailed expansion plans.

## Important Notes

### Strudel Syntax
- Patterns are lazy-evaluated
- Use `stack()` for layering
- Use `.cpm()` for tempo
- Chain methods for transformations

### Techno Principles
- Less is more
- Repetition creates hypnosis
- Subtle variation maintains interest
- Space is as important as sound

### Performance Focus
- Code should be editable live
- Patterns should evolve over time
- Transitions must be smooth
- Always consider the dancefloor

## Resources

- **Strudel Documentation**: strudel.cc/docs
- **Pattern Examples**: See examples/ directory
- **Quick Reference**: resources/quick_reference.md
- **Full Context**: See CLAUDE.md files throughout

## Remember

This curriculum is designed to be:
- **Living**: Constantly evolving with new discoveries
- **Practical**: Every lesson produces club-ready techno
- **Inclusive**: Accessible to coders and musicians alike
- **Infinite**: No limit to exploration and growth

When in doubt, make it hypnotic, make it minimal, make it techno.