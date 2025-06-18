# Composing Techno Music with Strudel: A Graduate-Level Masterclass

## Executive Summary

This curriculum provides a comprehensive path to mastering techno composition using Strudel's live coding environment. Over 10 progressive modules, students learn to create professional-quality hypnotic minimal techno in the style of Jeff Mills, Robert Hood, Surgeon, and Donato Dozzy. The course emphasizes practical application, with each module producing immediately usable patterns that build toward complete track construction and live performance.

## Course Overview

### Philosophy
This curriculum treats Strudel not just as a code editor but as a modular synthesizer and sequencer. The goal is to build a "techno machine" in code that you can play and improvise with. We embrace minimalism—the power comes from the interaction of a few well-chosen patterns, not from excessive complexity.

### Learning Outcomes
Upon completion, students will be able to:
- Create complex polyrhythmic patterns using Euclidean rhythms and pattern transformations
- Design professional-quality synthesized sounds using Strudel's synthesis engine
- Apply effects creatively as rhythmic and textural instruments
- Structure complete techno tracks with tension, release, and hypnotic flow
- Perform live using code as an instrument

### Prerequisites
- Basic understanding of electronic music structure
- Familiarity with programming concepts (variables, functions)
- Access to Strudel REPL (strudel.cc)
- Quality headphones or studio monitors

### Target Aesthetic
Professional hypnotic minimal techno in the style of:
- **Detroit Pioneers**: Jeff Mills, Robert Hood, Underground Resistance
- **UK Techno**: Surgeon, Luke Slater, James Ruskin
- **Hypnotic Minimalism**: Donato Dozzy, Rrose, Shifted
- **Modern Masters**: Oscar Mulero, Abdulla Rashim, Developer

## Curriculum Structure

### Module 1: The Foundation - The Four-on-the-Floor Heartbeat
**Duration**: 1 week  
**Learning Objectives**:
- Master basic Strudel syntax for sound triggering
- Establish solid kick drum patterns
- Understand timing and tempo in Strudel
- Create variations in kick patterns for different techno styles

**Key Concepts**: `sound()`, `stack()`, `gain()`, `cpm()`, pattern notation

**Example Pattern**:
```javascript
// Classic techno foundation
stack(
  sound("bd*4").gain(0.9),           // Main kick
  sound("bd*8").gain(0.3).pan(0.7)   // Ghost kicks
).cpm(130)
```

**Assessment**: Create three different kick patterns suitable for different techno sub-genres

---

### Module 2: The Groove Engine - Hi-Hats & Claps
**Duration**: 1 week  
**Learning Objectives**:
- Implement Euclidean rhythms for complex hi-hat patterns
- Place claps and snares effectively
- Layer percussion for groove depth
- Balance elements in the mix

**Key Concepts**: `euclid()`, `euclidRot()`, layering with `stack()`, `pan()`

**Example Pattern**:
```javascript
stack(
  sound("bd*4").gain(0.9),
  sound("~ cp ~ cp").gain(0.7),
  sound("hh*16").euclid(11, 16).gain(0.4).pan(0.3),
  sound("oh").euclid(3, 8).gain(0.5).pan(0.7)
).cpm(132)
```

**Assessment**: Design a complete drum pattern with at least 4 elements using Euclidean rhythms

---

### Module 3: Hypnotic Tension - Polyrhythms & Percussion
**Duration**: 1 week  
**Learning Objectives**:
- Create polyrhythmic patterns for hypnotic effect
- Layer percussion in different time signatures
- Use subtle variations to maintain interest
- Understand the mathematics of groove

**Key Concepts**: `polyrhythm()`, `polymeter()`, nested patterns, mathematical relationships

**Example Pattern**:
```javascript
stack(
  sound("bd*4").gain(0.9),
  polyrhythm(
    sound("rim*3").gain(0.6),
    sound("~*4")
  ),
  sound("mt").euclid(5, 12).gain(0.4)
).cpm(130)
```

**Assessment**: Create a hypnotic groove using at least two polyrhythmic relationships

---

### Module 4: The Low End Theory - Minimal Basslines
**Duration**: 2 weeks  
**Learning Objectives**:
- Synthesize effective bass sounds
- Write basslines that complement kick patterns
- Use filters to shape bass frequency content
- Create movement through modulation

**Key Concepts**: `note()`, `s()`, synthesis parameters, `lpf()`, `envelope`, modulation

**Example Pattern**:
```javascript
stack(
  sound("bd*4").gain(0.9),
  note("c1 ~ c1 c1 ~ c1 ~ c1")
    .s("saw")
    .lpf(400)
    .resonance(0.3)
    .attack(0.01)
    .release(0.1)
    .gain(0.8)
).cpm(130)
```

**Assessment**: Compose three different bassline styles: rolling, stabby, and sub-bass

---

### Module 5: Sonic Identity - Advanced Synthesis & Filtering
**Duration**: 2 weeks  
**Learning Objectives**:
- Master Strudel's advanced synthesis options
- Design signature sounds using FM and supersaw
- Apply resonant filtering creatively
- Develop a personal sonic palette

**Key Concepts**: `supersaw`, `fm4`, `ladder` filter, sound design principles

**Example Pattern**:
```javascript
// Signature techno stab
note("<c3 eb3 g3 bb3>")
  .s("supersaw")
  .unison(7)
  .detune(0.2)
  .lpf(sine.range(800, 2000).slow(8))
  .resonance(0.7)
  .ftype("ladder")
  .attack(0.001)
  .release(0.2)
  .gain(0.6)
```

**Assessment**: Design a complete sound palette for a techno track (kick, bass, lead, atmosphere)

---

### Module 6: The Hook - Probabilistic & Arpeggiated Patterns
**Duration**: 1 week  
**Learning Objectives**:
- Create evolving melodic patterns
- Use probability for organic variation
- Implement arpeggiators and sequences
- Maintain hypnotic quality while adding interest

**Key Concepts**: `choose()`, `sometimes()`, `degrade()`, `arp()`, `scale()`

**Example Pattern**:
```javascript
const scale = "c minor pentatonic";
stack(
  note(choose(["c4*4", "c4 eb4 g4 c5", "~ eb4 ~ g4"]))
    .scale(scale)
    .s("fm4")
    .sometimes(x => x.add(12))
    .release(0.1)
    .gain(0.5)
).cpm(133)
```

**Assessment**: Create an evolving 16-bar melodic pattern using probabilistic functions

---

### Module 7: Space & Dub - Effects as an Instrument
**Duration**: 2 weeks  
**Learning Objectives**:
- Use delay and reverb as compositional tools
- Create dub techno textures
- Automate effects for dynamic movement
- Master spatial placement in the mix

**Key Concepts**: `delay()`, `room()`, effect automation, dub techniques

**Example Pattern**:
```javascript
// Dub techno atmosphere
stack(
  sound("cp")
    .euclid(3, 16)
    .delay(0.8)
    .delaytime("3/8")
    .delayfeedback(0.7)
    .lpf(sine.range(1000, 3000).slow(16))
    .room(0.3)
    .gain(0.6)
).cpm(125)
```

**Assessment**: Create a complete dub techno section using effects as primary instruments

---

### Module 8: Structure & Arrangement - Building the Machine
**Duration**: 2 weeks  
**Learning Objectives**:
- Organize code for clarity and performance
- Implement track sections (intro, build, drop, etc.)
- Use conditional logic for arrangement
- Create dynamic interest over time

**Key Concepts**: `every()`, `when()`, code organization, arrangement strategies

**Example Pattern**:
```javascript
// Organized track structure
const kick = sound("bd*4").gain(0.9);
const hats = sound("hh*16").euclid(13, 16).gain(0.4);
const bass = note("c1*8").s("sine").lpf(400).gain(0.7);
const lead = note("<c4 eb4 g4>").s("supersaw").release(0.2);

stack(
  kick,
  every(4, () => hats),
  every(8, () => bass),
  every(16, () => lead.delay(0.5))
).cpm(132)
```

**Assessment**: Create a complete 64-bar arrangement with clear sections

---

### Module 9: Texture & Soul - Integrating Samples
**Duration**: 1 week  
**Learning Objectives**:
- Load and manipulate audio samples
- Create unique textures through sampling
- Blend samples with synthesis
- Add organic elements to digital productions

**Key Concepts**: Sample loading, `begin()`, `end()`, `speed()`, granular techniques

**Example Pattern**:
```javascript
// Atmospheric texture from samples
stack(
  s("ambient_pad")
    .begin(rand)
    .end(x => x.begin + 0.1)
    .speed(choose([0.5, 1, 1.5]))
    .lpf(2000)
    .gain(0.4)
    .every(4, x => x.rev())
).cpm(130)
```

**Assessment**: Integrate three different sample types into a cohesive techno pattern

---

### Module 10: The Live Coder - Performance & Improvisation
**Duration**: 2 weeks  
**Learning Objectives**:
- Develop live coding performance skills
- Create smooth transitions and builds
- Improvise with prepared code blocks
- Master real-time parameter manipulation

**Key Concepts**: Performance techniques, `hush()`, live manipulation, improvisation

**Final Project Requirements**:
1. A complete, performable techno track (5-8 minutes)
2. Well-organized, commented code
3. Live performance recording
4. Written reflection on aesthetic choices

**Assessment**: Live performance demonstrating all course concepts

## Assessment Methodology

### Continuous Assessment (60%)
- Weekly pattern submissions
- Participation in code reviews
- Technical exercises

### Module Projects (25%)
- End-of-module compositions
- Documented code examples
- Peer reviews

### Final Project (15%)
- Complete techno track
- Live performance
- Written reflection

## Resources and References

### Essential Listening
- Jeff Mills - "The Bells"
- Robert Hood - "Minimal Nation"
- Surgeon - "Force + Form"
- Donato Dozzy - "K"

### Technical Resources
- Strudel Documentation: strudel.cc/docs
- TidalCycles patterns (for reference)
- Web Audio API documentation

### Community
- Strudel Discord
- Live coding forums
- Monthly online performances

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-4)
Modules 1-3: Establish rhythmic foundation

### Phase 2: Sound Design (Weeks 5-8)
Modules 4-5: Develop synthesis skills

### Phase 3: Composition (Weeks 9-12)
Modules 6-8: Build complete arrangements

### Phase 4: Performance (Weeks 13-16)
Modules 9-10: Integration and live performance

## Next Steps

1. Set up student workspace with example files
2. Create detailed module guides with video tutorials
3. Establish online community for peer learning
4. Schedule guest lectures from techno artists using live coding
5. Develop assessment rubrics with clear criteria

This curriculum provides a comprehensive path from basic pattern creation to professional techno production, emphasizing the unique capabilities of Strudel as both a composition tool and performance instrument.