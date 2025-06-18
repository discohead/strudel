# CLAUDE.md - Modules Directory

## Module Development Guide

This directory contains the core educational modules for the Strudel Techno Curriculum. Each module is a self-contained unit that builds upon previous knowledge while introducing new concepts.

## Current Modules (1-10)

### Foundational (Modules 1-3)
- **Module 1: The Foundation** - Kick patterns, tempo, basic syntax
- **Module 2: The Groove Engine** - Euclidean rhythms, hi-hats, groove
- **Module 3: Hypnotic Tension** - Polyrhythms, complex percussion

### Intermediate (Modules 4-6)
- **Module 4: The Low End Theory** - Bass synthesis, frequency management
- **Module 5: Sonic Identity** - FM synthesis, filters, sound design
- **Module 6: The Hook** - Probability, generative patterns, variation

### Advanced (Modules 7-9)
- **Module 7: Space & Dub** - Effects processing, spatial design
- **Module 8: Structure & Arrangement** - Full track construction
- **Module 9: Texture & Soul** - Sampling, found sound, integration

### Performance (Module 10)
- **Module 10: The Live Coder** - Real-time performance techniques

## Module Structure Template

Each module must include:

```markdown
# Module X: Title - Subtitle

## Overview
Brief description of what students will learn and why it matters for techno.

## Learning Objectives
1. Specific skill #1
2. Specific skill #2
3. Specific skill #3
4. Specific skill #4
5. Specific skill #5

## Core Concepts
### Concept 1
Explanation with code examples

### Concept 2
Explanation with code examples

## Practical Exercises
### Exercise 1: Title
Description and starter code

### Exercise 2: Title
Description and starter code

### Exercise 3: Title
Description and starter code

## Style Analysis
### Artist 1 Style
Code example mimicking their approach

### Artist 2 Style
Code example mimicking their approach

## Common Problems and Solutions
### Problem: Description
**Solution**: Fix with code example

## Assessment Criteria
1. **Category** (X%)
   - Criterion 1
   - Criterion 2

## Module Assignment
Detailed project requirements

## Next Module Preview
Teaser for the next module
```

## Creating New Modules

### Planning Phase
1. **Identify the gap**: What techno technique isn't covered?
2. **Research artists**: Find 3-5 artists who exemplify this technique
3. **Prototype patterns**: Create 20+ working examples
4. **Test difficulty**: Ensure it fits the progression
5. **Write objectives**: 5 specific, measurable skills

### Writing Phase
1. Start with the simplest possible example
2. Build complexity gradually
3. Every code block must be runnable
4. Include both minimal and maximal approaches
5. Reference real tracks/artists

### Code Standards
```javascript
// Good example - Clear, runnable, techno-focused
stack(
  sound("bd*4").gain(0.9),           // Kick foundation
  note("c1*8").s("bass").lpf(400),   // Bass pattern
  sound("hh*16").euclid(11, 16)      // Euclidean hats
).cpm(130)  // Techno tempo

// Bad example - Too complex, no context
stack(x=>(y=>z(x,y))(p=>q(r(p))))  // Unclear
```

### Testing Checklist
- [ ] All code runs without errors
- [ ] Patterns sound good at 120-140 BPM
- [ ] Examples progress from simple to complex
- [ ] Exercises are achievable but challenging
- [ ] Assessment criteria are measurable

## Expansion Modules (11-20) - Planning

### Module 11: Modular Thinking
- Pattern routing and interconnection
- Feedback systems
- Complex signal flow
- Modular synthesis concepts in code

### Module 12: The Acid Module
- Deep dive into 303 emulation
- Acid bassline patterns
- Filter automation mastery
- Classic acid techno recreations

### Module 13: Industrial Techno
- Noise synthesis
- Extreme processing
- Distortion as an instrument
- Birmingham/Berlin industrial styles

### Module 14: Ambient Techno
- Beatless compositions
- Drone and texture
- Long-form evolution
- Spatial narratives

### Module 15: Hardware Integration
- MIDI output to hardware
- OSC communication
- Hybrid setups
- Clock synchronization

### Module 16: Visual Techno
- Synchronized visuals with Hydra
- Audio-reactive patterns
- Live coding visuals
- Integrated AV performances

### Module 17: AI Collaboration
- ML pattern generation
- Style transfer
- Intelligent variation
- Human-AI improvisation

### Module 18: Networked Performance
- Collaborative live coding
- Remote jamming
- Pattern sharing protocols
- Global techno sessions

### Module 19: Techno Theory
- Musical analysis of classic tracks
- Tension and release theory
- Psychoacoustics of the dancefloor
- Cultural context

### Module 20: Production Pipeline
- Recording Strudel output
- Integration with DAWs
- Mixing and mastering
- Release preparation

## Module Interconnections

### Prerequisite Chart
```
1 (Foundation) → 2 (Groove) → 3 (Polyrhythm)
                ↓
4 (Bass) → 5 (Synthesis) → 6 (Probability)
         ↓
7 (Effects) → 8 (Arrangement) → 9 (Sampling)
                              ↓
                        10 (Performance)
                              ↓
                    11-20 (Specializations)
```

### Skill Matrix
| Module | Rhythm | Synthesis | Effects | Performance |
|--------|--------|-----------|---------|-------------|
| 1      | ●●●●● | ●○○○○     | ●○○○○   | ●○○○○       |
| 2      | ●●●●● | ●○○○○     | ●●○○○   | ●●○○○       |
| 3      | ●●●●● | ●●○○○     | ●●○○○   | ●●○○○       |
| 4      | ●●●○○ | ●●●●○     | ●●○○○   | ●●○○○       |
| 5      | ●●○○○ | ●●●●●     | ●●●○○   | ●●●○○       |
| 6      | ●●●●○ | ●●●○○     | ●●●○○   | ●●●○○       |
| 7      | ●●●○○ | ●●●○○     | ●●●●●   | ●●●●○       |
| 8      | ●●●●○ | ●●●○○     | ●●●●○   | ●●●●○       |
| 9      | ●●●○○ | ●●○○○     | ●●●○○   | ●●●●○       |
| 10     | ●●●●● | ●●●●○     | ●●●●○   | ●●●●●       |

## Maintenance Guidelines

### Regular Updates
- Test all code with latest Strudel version
- Update deprecated functions
- Add new discoveries/techniques
- Incorporate student feedback
- Refresh artist references

### Quality Improvements
- Add more diverse examples
- Create video companions
- Record audio demonstrations
- Build interactive exercises
- Design module-specific visuals

### Community Integration
- Student pattern showcases
- Guest artist contributions
- Live coding challenges
- Module-specific jam sessions
- Collaborative improvements

## Future Module Ideas

### Genre Expansions
- Dub Techno Deep Dive
- Breakbeat Techno
- Melodic Techno
- Hard Techno
- Experimental Techno

### Technical Expansions
- Advanced FM Synthesis
- Granular Synthesis
- Physical Modeling
- Spectral Processing
- Machine Learning

### Cultural Expansions
- Detroit History
- Berlin Evolution
- UK Hardcore
- Japanese Techno
- South American Techno

### Performance Expansions
- DJ Integration
- Band Improvisation
- Installation Work
- Theater/Dance
- VR Environments

## Remember

Each module should:
1. Stand alone but connect to others
2. Provide immediate musical satisfaction
3. Challenge without frustrating
4. Inspire experimentation
5. Respect techno culture

The goal is not just to teach Strudel, but to cultivate a deep understanding of techno as both a technical and cultural practice.