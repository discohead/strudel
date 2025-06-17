/*
signal-demo.mjs - Interactive demo of signal notation
This file demonstrates the signal notation in a format ready for the Strudel REPL
*/

// Note: In a real implementation, these would be imported from '@strudel/mini'
// For now, this shows how the syntax would look and feel

// Example 1: Classic Acid Bass with Filter Modulation
// The filter sweeps create the characteristic acid sound
`
note("c2 c2 c3 eb2")
  .s("sawtooth")
  .gain(sig("~env(0.01, 0.1, 0.7, 0.1)"))  // Quick envelope
  .cutoff(sig("~sine:0.5 * ~saw:8 * 2000 + 300"))  // Complex filter mod
  .resonance(15)
  .distort(0.4)
  .room(0.1)
  .cpm(130)
`;

// Example 2: Ambient Generative Piece
// Multiple signals create evolving textures
`
stack(
  // Drone with slow modulation
  note("c2").s("sawtooth")
    .gain(sig("~sine:0.1 * 0.3 + 0.2"))
    .cutoff(sig("~perlin:0.2.range(200, 1000)")),
  
  // Shimmering high frequencies
  note("<c5 e5 g5 b5>").s("sine")
    .gain(sig("~tri:0.3 * ~sine:8 * 0.4"))
    .pan(sig("~sine:0.2.range(-0.8, 0.8)"))
    .delay(0.4),
  
  // Rhythmic noise bursts
  s("noise")
    .gain(sig("~square:2 * ~env(0.001, 0.05, 0, 0)"))
    .hpf(sig("~sine:0.1.range(2000, 8000)"))
    .struct("t ~ ~ t ~ ~ ~ ~")
)
.room(0.9)
.cpm(60)
`;

// Example 3: Techno with Polyrhythmic Modulation
// Different modulation rates create complex rhythmic interactions
`
stack(
  // Pumping kick
  s("bd*4").gain(sig("~sine:8 * 0.2 + 0.8")),
  
  // Hi-hats with 3-against-4 amplitude mod
  s("hh*16")
    .gain(sig("[~sine:3, ~square:4] * 0.5 + 0.5"))
    .pan(sig("~tri:2")),
  
  // Bass with morphing filter
  note("c2 c2 ~ c2 ~ c3 ~ c2")
    .s("square")
    .cutoff(sig("<~sine ~tri ~saw>:1.range(100, 1500)"))
    .resonance(10)
)
.cpm(135)
`;

// Example 4: FM Synthesis Exploration
// Signal notation makes FM synthesis intuitive
`
note("c3 e3 g3 c4")
  .s("sine")
  // Carrier amplitude modulated by two signals
  .gain(sig("~sine:100 * ~sine:1 * 0.8"))
  // Frequency modulation effect
  .speed(sig("~sine:10 * ~sine:0.5 * 0.2 + 1"))
  .room(0.3)
  .slow(2)
`;

// Example 5: Breakbeat with Dynamic Processing
// Signals control multiple parameters for dynamic variation
`
stack(
  // Main beat
  s("bd ~ sd ~ bd bd ~ sd")
    .speed(sig("~square:0.25 * 0.1 + 0.95")),  // Subtle pitch drops
  
  // Percussion with filter automation
  s("hh*8 oh*2")
    .gain(sig("~saw:4 * 0.5 + 0.5"))
    .cutoff(sig("~sine:0.5 * ~square:8.range(500, 4000)"))
    .pan(sig("~sine:0.3")),
  
  // Reese bass
  note("c2 ~ ~ c2 ~ eb2 ~ ~")
    .s("sawtooth")
    .detune(sig("~sine:20 * 10"))  // Detuning for thickness
    .cutoff(sig("~env(0.01, 0.2, 0.5, 0.5).range(100, 800)"))
)
.cpm(170)
`;

// Example 6: Live Coding Performance Pattern
// Concise notation perfect for live manipulation
`
// Easy to modify on the fly!
stack(
  "bd*4".gain(sig("~sine:8")),
  "cp(3,8)".gain(sig("~saw:2")),
  "hh*16".gain(sig("~square:4*0.7")),
  "bass:1(5,8)".cutoff(sig("~tri:1*2000+500"))
)
.every(8, x => x.fast(2))
.cpm(128)
`;

// Example 7: Microsound Textures
// Rapid modulation creates granular-like textures
`
note("c4 e4 g4".slow(8))
  .s("triangle")
  .gain(sig("~square:47 * ~sine:0.1"))  // Rapid gating
  .speed(sig("~perlin:10.range(0.5, 2)"))  // Pitch variation
  .pan(sig("~noise"))  // Random panning
  .delay(0.1)
  .delayfeedback(0.8)
  .room(0.7)
`;

// Example 8: Melodic Dubstep
// Combining musical patterns with modulation
`
stack(
  // Sub bass
  note("<c2 ~ ~ ~ g1 ~ ~ ~>")
    .s("sine")
    .gain(sig("~env(0.01, 0.1, 1, 0.2)")),
  
  // Wobble bass
  note("c2 c2 c2 c2")
    .s("sawtooth")
    .cutoff(sig("~sine:2 * 1500 + 500"))
    .resonance(sig("~tri:0.5 * 10 + 5"))
    .gain(0.7),
  
  // Drums
  s("bd ~ ~ bd ~ ~ sd ~"),
  s("hh ~ hh ~ hh ~ hh ~").gain(0.6),
  
  // Melodic element
  note("<[c4,e4,g4] [d4,f4,a4] [e4,g4,b4] [c4,e4,g4]>")
    .s("square")
    .gain(sig("~sine:4 * 0.3 + 0.3"))
    .cutoff(2000)
    .delay(0.3)
)
.cpm(140)
`;

// Example 9: West Coast Synthesis Style
// Complex modulation routing like a modular synth
`
// Primary oscillator
note("c3")
  .s("sine")
  // Multiple modulation sources
  .gain(sig("~sine:5 * ~tri:0.5 * ~square:13 * 0.8"))
  .speed(sig("~saw:0.2 * 0.3 + 1"))
  .cutoff(sig("~sine:0.3 + ~sine:0.7 + ~sine:1.1").range(200, 3000))
  .room(0.5)
  .slow(4)
`;

// Example 10: Signal Notation Orchestra
// Different "instruments" using various signal combinations
`
const kick = s("bd*4").gain(sig("~sine:8 * 0.3 + 0.7"));
const snare = s("~ sd ~ sd").gain(sig("~env(0.01, 0.05, 0.2, 0.1)"));
const hats = s("hh*8").gain(sig("~tri:4 * 0.5 + 0.5")).pan(sig("~sine:0.5"));
const bass = note("c2 ~ eb2 ~").s("sawtooth")
  .cutoff(sig("~saw:1.range(200, 1000)"))
  .gain(sig("~square:4"));
const lead = note("c4 eb4 g4 bb4".slow(2))
  .s("square")
  .gain(sig("~sine:2 * 0.5 + 0.5"))
  .cutoff(sig("~perlin:1.range(1000, 3000)"));

stack(kick, snare, hats, bass, lead).cpm(125)
`;

// Signal Notation Quick Reference:
/*
Basic signals:
  ~sine    ~saw    ~square    ~tri    ~noise    ~perlin

Frequency:
  ~sine:4  (4 Hz)

Math operations:
  ~sine * 0.5        (scale)
  ~sine + 0.5        (offset)
  ~sine:2 * ~saw:1   (multiply signals)

Range mapping:
  ~sine.range(200, 2000)

Time scaling:
  ~sine.slow(2)
  ~sine.fast(4)

Routing:
  .sig("~sine:4 >> gain")
  .sig("~tri:2 >> pan")

Composite:
  [~sine:1, ~saw:2]      (stack)
  <~sine ~square ~tri>   (alternate)
*/