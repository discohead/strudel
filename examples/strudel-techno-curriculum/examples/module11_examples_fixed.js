// Module 11: Modular Thinking - System Design Examples (FIXED)
// Complete patterns demonstrating interconnected pattern networks and emergent behaviors

// Example 1: Basic Modular Voice Architecture
// Shows how to build a complete voice from modular components
note(choose(["c3", "eb3", "g3", "bb3", "c4"]))
  .s("sawtooth")
  .cutoff(sine.range(200, 2000).slow(8))
  .resonance(saw.range(1, 20).slow(3))
  .gain(perlin.range(0.3, 0.7))
  .euclid(5, 8)
  .release(0.2)
  .cpm(130)

// Example 2: Clock Division Network
// Master clock driving multiple synchronized elements
stack(
  // Main kick on every 4
  s("bd*4").gain(0.9),
  
  // Snare with mask pattern
  s("sd*8").mask("t f f").gain(0.7).pan(0.3),
  
  // Hi-hat rapid 
  s("hh*16").gain(0.4).pan(0.7),
  
  // Percussion layers with different divisions
  s("rim*12").mask("t f f f").gain(0.5).pan(0.2),
  s("click*16").mask("t f f f f").gain(0.3).hpf(1000),
  
  // Melodic element with euclidean rhythm
  note("c3 eb3 g3").euclid(5, 16).s("fm").fmi(2).gain(0.4)
).cpm(132)

// Example 3: Cross-Modulation System
// Patterns modulating each other
stack(
  // Base
  s("bd*4").gain(0.9),
  
  // Melodic pattern with modulation
  note(choose(["c3", "eb3", "g3", "bb3"]))
    .s("square")
    .euclid(5, 16)
    .cutoff(perlin.range(400, 1200))
    .gain(0.5),
  
  // Click pattern modulated by signals
  s("click*16")
    .gain(sine.range(0.1, 0.5).slow(4))
    .pan(saw.range(-0.8, 0.8).slow(3))
    .hpf(perlin.range(1000, 3000))
).cpm(130)

// Example 4: Feedback FM Network
// FM operators modulating each other
stack(
  // FM operator 1
  note("c3").s("fm")
    .fmi(sine.range(1, 5).slow(8))
    .fmh(2)
    .gain(0.3)
    .pan(-0.5),
    
  // FM operator 2  
  note("c3").add(7).s("fm")
    .fmi(saw.range(2, 8).slow(6))
    .fmh(1.5)
    .gain(0.3)
    .pan(0.5),
    
  // FM operator 3
  note("c3").add(3).s("fm")
    .fmi(perlin.range(0, 4))
    .fmh(3)
    .gain(0.3)
    .pan(0)
)
  .euclid(5, 8)
  .delay(0.3)
  .delayfeedback(0.5)
  .cpm(130)

// Example 5: Surgeon-Style Modular Patch
// Industrial techno through complex routing
stack(
  // Kick pattern
  s("bd ~ bd bd ~ bd bd ~").gain(0.9).shape(0.2),
  
  // Modulated oscillators
  note("c2").s("sawtooth")
    .lpf(sine.range(200, 1500).slow(4))
    .resonance(15)
    .add(perlin.range(-0.1, 0.1))
    .euclid(3, 8)
    .gain(0.4),
    
  note("c2").add(0.07).s("square")
    .hpf(saw.range(100, 800).slow(7))
    .euclid(5, 8)
    .gain(0.3),
    
  // Hi-hats with modulation
  s("hh*16")
    .gain(sine.range(0.2, 0.4).slow(4))
    .pan(sine.slow(4))
    .euclid(11, 16)
)
  .distort(0.4)
  .shape(0.3)
  .cpm(140)

// Example 6: Generative Sequencer Network
// Multiple sequencers influencing each other
stack(
  // Bass sequencer
  note(shuffle(["c2", "eb2", "g2", "bb2"]))
    .s("sawtooth")
    .lpf(sine.range(200, 800).slow(4))
    .gain(0.5)
    .release(0.2),
    
  // Mid sequencer
  note(shuffle(["c3", "eb3", "f3", "g3", "bb3"]))
    .s("square")
    .euclid(5, 8)
    .cutoff(perlin.range(400, 1200))
    .gain(0.4)
    .pan(-0.3),
    
  // High sequencer
  note(shuffle(["c4", "eb4", "g4", "c5"]))
    .s("triangle")
    .euclid(7, 16)
    .delay(0.125)
    .gain(0.3)
    .pan(0.3)
)
  .room(0.2)
  .cpm(132)

// Example 7: Blawan-Style Kick Synthesis
// Complex modular kick with multiple modulation sources
stack(
  // Main FM kick
  note("c1").s("fm")
    .fmi(sine.range(0, 8).fast(16))
    .fmh(saw.range(1, 3).slow(4))
    .lpf(150)
    .release(0.1)
    .distort(0.6)
    .shape(0.4)
    .euclid(3, 8)
    .gain(0.9),
    
  // Sub layer
  note("c1").s("sine")
    .lpf(80)
    .release(0.15)
    .gain(0.6)
    .euclid(3, 8),
    
  // Click layer
  s("click*8")
    .hpf(3000)
    .gain(0.5)
    .euclid(3, 8),
    
  // Metallic percussion
  s("metal")
    .n(irand(10))
    .speed(2)
    .hpf(4000)
    .euclid(2, 8)
    .gain(0.3)
).cpm(135)

// Example 8: Evolving System
// Pattern that develops using randomness
note(shuffle(["c3", "eb3", "g3", "bb3", "c4", "d4", "f4"]))
  .s("fm")
  .fmi(perlin.range(0, 5))
  .fmh(sine.range(1, 3).slow(8))
  .sometimes(x => x.add(12))
  .sometimes(x => x.fast(2))
  .rarely(x => x.rev())
  .euclid(run(8), 16)
  .delay(0.3)
  .delayfeedback(0.4)
  .gain(0.5)
  .cpm(130)

// Example 9: Chaos-Driven Modulation
// Using perlin noise for organic modulation
stack(
  // Steady kick
  s("bd*4").gain(0.9),
  
  // Chaotic melody
  note("c3")
    .add(perlin.range(0, 12).segment(8))
    .s("sawtooth")
    .cutoff(perlin.range(200, 2000))
    .resonance(sine.range(5, 20).slow(7))
    .euclid(5, 8)
    .gain(0.5),
    
  // Modulated FM voice
  note("c4").s("fm")
    .fmi(perlin.range(0, 10))
    .fmh(sine.range(0.5, 4).slow(11))
    .euclid(3, 8)
    .gain(0.4)
    .pan(0.5)
).cpm(132)

// Example 10: Complete Modular Live Set
// Performance-ready modular system
stack(
  // Kick module
  note("c1").s("fm")
    .fmi(2)
    .release(0.1)
    .lpf(100)
    .distort(0.4)
    .euclid(3, 8)
    .gain(0.9),
    
  // Bass module
  note(choose(["c1", "c1", "eb1", "f1"]))
    .s("sawtooth")
    .lpf(sine.range(100, 500).slow(8))
    .resonance(10)
    .euclid(5, 8)
    .gain(0.7),
    
  // Lead module
  note("c4")
    .add(choose([0, 3, 5, 7, 10]))
    .s("square")
    .cutoff(sine.range(500, 2000).slow(4))
    .sometimes(x => x.add(12))
    .sometimes(x => x.fast(2))
    .euclid(run(8), 16)
    .delay(0.3)
    .gain(0.5),
    
  // Percussion module
  stack(
    s("hh*16").euclid(11, 16).gain(0.3),
    s("rim").euclid(5, 12).gain(0.4),
    s("click*16").euclid(7, 16).gain(0.2).hpf(2000)
  ).room(0.1)
).cpm(132)