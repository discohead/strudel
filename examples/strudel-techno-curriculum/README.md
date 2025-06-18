# Strudel Techno Curriculum

A comprehensive graduate-level curriculum for composing hypnotic minimal techno using Strudel's live coding environment.

## Quick Start

1. Open [strudel.cc](https://strudel.cc) in your browser
2. Copy any example from the `examples/` folder
3. Paste into the editor and press Ctrl+Enter (Cmd+Enter on Mac) to run
4. Start with Module 1 examples to learn the basics

## Course Structure

### 📚 [Complete Curriculum Overview](TECHNO_CURRICULUM.md)
The main curriculum document with all 10 modules, learning objectives, and assessment criteria.

### 📁 Modules
Detailed guides for each module:
- Module 1: The Foundation - Four-on-the-Floor
- Module 2: The Groove Engine - Hi-Hats & Claps
- Module 3: Hypnotic Tension - Polyrhythms
- Module 4: The Low End Theory - Basslines
- Module 5: Sonic Identity - Advanced Synthesis
- Module 6: The Hook - Probabilistic Patterns
- Module 7: Space & Dub - Effects as Instruments
- Module 8: Structure & Arrangement
- Module 9: Texture & Soul - Sampling
- Module 10: The Live Coder - Performance
- Module 11: Modular Thinking - System Design

### 🎵 Examples
Working code examples for each module in the `examples/` directory.

### 🎯 Exercises
Practice exercises and challenges in the `exercises/` directory.

### 🛠️ Resources
Additional patterns, sound banks, and reference materials in the `resources/` directory.

## Target Aesthetic

This curriculum focuses on professional hypnotic minimal techno in the style of:
- **Detroit**: Jeff Mills, Robert Hood, Underground Resistance
- **UK**: Surgeon, Luke Slater, James Ruskin  
- **Hypnotic**: Donato Dozzy, Rrose, Shifted
- **Modern**: Oscar Mulero, Abdulla Rashim, Developer

## Prerequisites

- Basic understanding of electronic music structure
- Familiarity with basic programming concepts
- Quality headphones or studio monitors
- Chrome/Firefox browser with Web Audio support

## How to Use This Curriculum

1. **Sequential Learning**: Work through modules 1-10 in order
2. **Practice First**: Try all examples before moving to exercises
3. **Experiment**: Modify examples to develop your own style
4. **Performance**: Practice live coding regularly
5. **Community**: Share your patterns and get feedback

## Example Pattern

Here's a taste of what you'll be creating:

```javascript
// Hypnotic minimal techno pattern
stack(
  // Driving kick
  sound("bd*4").gain(0.9),
  
  // Euclidean hi-hats
  sound("hh*16").euclid(11, 16).gain(0.4),
  
  // Minimal bassline
  note("c1 ~ c1 c1 ~ c1 ~ c1")
    .s("saw")
    .lpf(400)
    .release(0.1)
    .gain(0.7),
    
  // Hypnotic hook
  note("<c4 eb4 g4>")
    .s("fm4")
    .sometimes(x => x.add(12))
    .release(0.1)
    .delay(0.3)
    .gain(0.5)
).cpm(130)
```

## Learning Path

### Beginner (Weeks 1-4)
Focus on Modules 1-3: Master rhythm and groove

### Intermediate (Weeks 5-8)
Work through Modules 4-6: Develop synthesis and pattern skills

### Advanced (Weeks 9-12)
Complete Modules 7-9: Build full arrangements

### Performance (Weeks 13-16)
Master Module 10: Live coding and improvisation

## Community and Support

- Join the [Strudel Discord](https://discord.gg/strudel)
- Share your patterns with #techno tag
- Attend monthly online performances
- Get feedback from instructors and peers

## Contributing

Found an issue or have suggestions? Please:
1. Open an issue on GitHub
2. Submit pull requests with improvements
3. Share your own patterns and techniques

## License

This curriculum is released under Creative Commons CC-BY-SA 4.0. Feel free to use, modify, and share with attribution.

---

Ready to start making techno? Open [Module 1](modules/MODULE_1_FOUNDATION.md) and let's begin!