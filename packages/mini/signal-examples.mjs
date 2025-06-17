/*
signal-examples.mjs - Examples of signal notation in use
These examples show how signal mini notation integrates with Strudel patterns
*/

import { sig, modulate } from './signal-notation.mjs';
import { note, stack, s } from '@strudel/core';

// Example 1: Basic LFO modulation
export const lfoExample = () => 
  note("c3 e3 g3 c4")
    .s("sawtooth")
    .gain(sig("~sine:2 * 0.3 + 0.7"))  // LFO on volume: 0.7 to 1.0
    .cutoff(sig("~saw:0.5.range(200, 2000)"));  // Slow filter sweep

// Example 2: Complex AM/FM synthesis
export const synthExample = () =>
  note("c2")
    .s("sine")
    .gain(sig("~sine:100 * ~sine:1"))  // AM synthesis
    .speed(sig("~sine:0.5 * 0.1 + 1")); // Subtle pitch wobble

// Example 3: Rhythmic gating with envelopes
export const gateExample = () =>
  stack(
    s("bd*4"),
    s("hh*16").gain(sig("~square:8 * 0.8")),  // Rhythmic hi-hat gating
    note("c3").s("sawtooth")
      .gain(sig("~env(0.01, 0.1, 0.5, 0.2)"))  // ADSR envelope
      .struct("t ~ t ~ ~ t ~ t")
  );

// Example 4: Ambient texture with multiple signals
export const ambientExample = () =>
  stack(
    // Pad with slow filter movement
    note("<c3 eb3 g3 bb3>").s("sawtooth")
      .gain(0.3)
      .cutoff(sig("~sine:0.1 * ~sine:0.13 * 1000 + 500"))
      .room(0.9),
    
    // Bell-like sounds with perlin noise modulation
    note("c5 g5 c6").s("triangle")
      .gain(sig("~perlin:0.5 * 0.5"))
      .delay(0.33)
      .struct("t ~ ~ t ~ ~ ~ ~"),
    
    // Noise texture
    s("noise")
      .gain(sig("~sine:0.2 * 0.1"))
      .hpf(sig("~tri:0.1.range(1000, 4000)"))
  );

// Example 5: Polyrhythmic modulation
export const polyrhythmicExample = () =>
  stack(
    // 3 against 4 amplitude modulation
    s("bd*3").gain(sig("~sine:4")),
    s("cp*4").gain(sig("~sine:3")),
    
    // Complex filter pattern
    s("bass:1*8")
      .cutoff(sig("[~sine:2, ~saw:3] * 1000 + 500"))
      .resonance(sig("~tri:0.5 * 10 + 5"))
  );

// Example 6: Signal routing and parameter control
export const routingExample = () =>
  note("c3 e3 g3 c4")
    .s("square")
    // Route different signals to different parameters
    .sig("~sine:4 * 0.5 + 0.5 >> gain")
    .sig("~tri:2 >> pan")
    .sig("~saw:0.5.range(200, 4000) >> cutoff");

// Example 7: Generative patterns with signal-controlled density
export const generativeExample = () => {
  // Use signal to control pattern density
  const density = sig("~sine:0.25 * 3 + 5"); // Varies from 2 to 8
  
  return stack(
    s("bd").euclid(density, 8),
    s("hh").euclid(sig("~saw:0.5 * 4 + 4"), 16),
    note("c3 e3 g3").s("bass")
      .sometimes(x => x.add(12))
      .gain(sig("~sine:8 * 0.5 + 0.5"))
  );
};

// Example 8: Morphing oscillator
export const morphingOscExample = () =>
  note("c3")
    .s("sine")
    .gain(sig("<~sine ~square ~tri ~saw>:4 * 0.8"))  // Morphing waveform
    .cutoff(sig("~perlin:1 * 2000 + 500"));

// Example 9: Complex expression showcase
export const complexExpressionExample = () =>
  note("c2 c3")
    .s("sawtooth")
    // Complex nested expression
    .gain(sig("(~sine:2 + ~sine:3) * (~saw:0.5 * 0.25) + 0.5"))
    // Multiple operations chained
    .cutoff(sig("~sine:1.slow(2).range(100, 2000)"));

// Example 10: Live coding friendly patterns
export const liveCodeExample = () => {
  // Short, expressive signal notation for live coding
  return stack(
    "bd*4".gain(sig("~sine:8")),              // Pumping kick
    "hh*8".gain(sig("~saw:4*0.5+0.5")),      // Rhythmic hats
    "bass:1(5,8)".cutoff(sig("~tri:2*2000+500")), // Moving bass filter
    "pad:3".gain(sig("~env(2,1,0.8,4)"))     // Slow pad envelope
  ).cpm(130);
};

// Helper function to play examples
export function playExample(example) {
  return example().play();
}

// Usage in REPL:
/*

// Import and use
import { lfoExample, playExample } from './signal-examples.mjs';

// Play an example
playExample(lfoExample);

// Or use directly
lfoExample().play();

// Modify on the fly
lfoExample()
  .fast(2)
  .sig("~sine:16 >> pan")
  .play();

*/