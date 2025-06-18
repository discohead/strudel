# AGENTS.md - Modules Directory Guide

## Module Development for AI Assistants

This directory contains the educational modules for the Strudel Techno Curriculum. This AGENTS.md file helps AI assistants understand the module structure and development process. For comprehensive context, refer to the accompanying CLAUDE.md file.

## Current Modules Overview

### Foundation Track (Modules 1-3)
- **Module 1: The Foundation** - Kick drum mastery
- **Module 2: The Groove Engine** - Euclidean rhythms and hi-hats
- **Module 3: Hypnotic Tension** - Polyrhythms and percussion

### Intermediate Track (Modules 4-6)
- **Module 4: The Low End Theory** - Bassline composition
- **Module 5: Sonic Identity** - Advanced synthesis
- **Module 6: The Hook** - Probabilistic patterns

### Advanced Track (Modules 7-9)
- **Module 7: Space & Dub** - Effects as instruments
- **Module 8: Structure & Arrangement** - Full track construction
- **Module 9: Texture & Soul** - Sample integration

### Performance (Module 10)
- **Module 10: The Live Coder** - Live performance techniques

## Module Structure Template

When creating or modifying modules, follow this structure:

```markdown
# Module X: Title - Descriptive Subtitle

## Overview
Brief introduction explaining what students will learn and why it matters for techno production.

## Learning Objectives
By the end of this module, you will be able to:
1. [Specific measurable skill]
2. [Specific measurable skill]
3. [Specific measurable skill]
4. [Specific measurable skill]
5. [Specific measurable skill]

## Core Concepts
### Concept 1: [Name]
Explanation with immediate code example:
```javascript
// Working example
```

### Concept 2: [Name]
[Continue pattern...]

## Practical Exercises
### Exercise 1: [Title]
Clear instructions with starter code

### Exercise 2: [Title]
[Continue pattern...]

### Exercise 3: [Title]
[Continue pattern...]

## Style Analysis
### [Artist Name] Style
```javascript
// Code recreating their signature sound
```

### [Artist Name] Style
[Continue pattern...]

## Common Problems and Solutions
### Problem: [Description]
**Solution**: [Fix with code example]

## Assessment Criteria
1. **Category Name** (X%)
   - Specific criterion
   - Specific criterion
   
[Continue categories...]

## Module Assignment
Detailed project requirements with clear deliverables.

## Next Module Preview
Brief teaser of what's coming next.
```

## Code Standards for Modules

### Example Requirements
```javascript
// GOOD: Clear, musical, runnable
stack(
  sound("bd*4").gain(0.9),
  note("c1*8").s("bass").lpf(400).release(0.1),
  sound("hh*16").euclid(11, 16).gain(0.4)
).cpm(130)

// BAD: Abstract, non-musical, unclear
x => f(g(h(x)))  // What does this do?
```

### Pattern Progression
1. Start with simplest possible example
2. Add one concept at a time
3. Build to full musical context
4. Show variations and possibilities

## Creating New Modules

### Research Phase
1. Identify specific techno technique
2. Find 3-5 artists who exemplify it
3. Analyze their signature sounds
4. Extract teachable patterns

### Development Phase
1. Create 15-20 working examples
2. Order by complexity
3. Group into logical sections
4. Write clear explanations

### Testing Phase
1. Verify all code runs
2. Check musical quality at 120-140 BPM
3. Test exercise difficulty
4. Validate learning progression

## Module Interconnections

### Prerequisite Flow
```
Module 1 → Module 2 → Module 3
    ↓          ↓          ↓
Module 4 → Module 5 → Module 6
    ↓          ↓          ↓
Module 7 → Module 8 → Module 9
              ↓
          Module 10
```

### Skill Building Map
- **Rhythm**: Modules 1, 2, 3, 6
- **Synthesis**: Modules 4, 5, 9
- **Effects**: Modules 5, 7, 8
- **Performance**: All modules, focus on 10

## Expansion Modules (Planned)

### Modules 11-20: Advanced Techniques
- Module 11: Modular Thinking
- Module 12: The Acid Module
- Module 13: Industrial Techno
- Module 14: Ambient Techno
- Module 15: Hardware Integration
- Module 16: Visual Techno
- Module 17: AI Collaboration
- Module 18: Networked Performance
- Module 19: Techno Theory
- Module 20: Production Pipeline

## Common Module Patterns

### Introduction Pattern
```javascript
// Start minimal
sound("bd*4").gain(0.9).cpm(130)

// Add complexity
stack(
  sound("bd*4").gain(0.9),
  sound("hh*8").gain(0.4)
).cpm(130)

// Full pattern
stack(
  sound("bd*4").gain(0.9),
  sound("hh*8").gain(0.4),
  note("c1*8").s("bass").lpf(400)
).cpm(130)
```

### Variation Pattern
```javascript
// Basic version
const basic = sound("bd*4");

// Variation 1: Rhythm
const rhythmic = sound("bd ~ bd bd ~ bd ~ bd");

// Variation 2: Sound
const textured = sound("bd*4").shape(0.3).lpf(200);

// Variation 3: Dynamic
const dynamic = sound("bd*4").gain("0.9 0.7 0.8 0.7");
```

## Quality Checklist

For each module element:
- [ ] Code runs without errors
- [ ] Sounds professional
- [ ] Clear learning objective
- [ ] Appropriate difficulty
- [ ] Connected to previous modules
- [ ] References real artists
- [ ] Includes practical exercises
- [ ] Has assessment criteria

## Style Guidelines

### Writing Style
- Direct and concise
- Technical but accessible
- Musical terminology when needed
- Always explain the "why"

### Code Comments
```javascript
// Explain musical intent, not syntax
sound("bd*4").gain(0.9),  // Driving kick
note("c1*8").s("bass").lpf(400),  // Rolling sub bass
sound("hh*16").euclid(11, 16)  // Syncopated hi-hats
```

## Module Maintenance

### Regular Updates
- Test with latest Strudel version
- Update deprecated functions
- Add new discoveries
- Incorporate feedback
- Refresh examples

### Improvement Areas
- More diverse examples
- Additional exercises
- Video companions
- Interactive elements
- Performance demos

## Tips for AI Assistants

1. **Always test code** - Every example must run
2. **Think musically** - Technical serves musical
3. **Progress gradually** - Don't jump in complexity
4. **Reference culture** - Connect to real techno
5. **Maintain style** - Hypnotic, minimal, effective

## Resources

- Full module list: See individual MODULE_N_*.md files
- Development guide: Refer to CLAUDE.md
- Example patterns: Check examples/ directory
- Quick reference: See resources/quick_reference.md

## Remember

Each module should:
- Build specific skills
- Sound professionally musical
- Connect to techno culture
- Prepare for performance
- Inspire experimentation

The goal is mastery through practice, creating techno producers who code.