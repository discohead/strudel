// Module 1: Foundation Examples
// Complete patterns demonstrating various techno kick techniques

// Example 1: Evolution of a Kick Pattern
// Shows how to develop from simple to complex

// Start simple
sound("bd*4").gain(0.9).cpm(130)

// Add ghost notes for rolling feel
stack(
  sound("bd*4").gain(0.9),
  sound("bd*8").gain(0.25).pan(0.6)
).cpm(130)

// Add variation with rests
stack(
  sound("bd ~ bd bd ~ bd bd ~").gain(0.9),
  sound("bd*16").gain(0.15).pan(0.6).hpf(200)
).cpm(130)

// Full pattern with dynamics
stack(
  sound("bd ~ bd bd ~ bd bd ~").gain("0.9 0 0.85 0.9 0 0.8 0.85 0"),
  sound("bd*16").gain(0.15).pan(sine.range(0.4, 0.6).slow(4)).hpf(200),
  sound("bd:2*4").gain(0.3).lpf(60) // Sub reinforcement
).cpm(130)

// Example 2: Genre-Specific Kick Patterns

// Detroit Techno (Jeff Mills "The Bells" style)
// Minimal, relentless, hypnotic
const detroitKick = stack(
  sound("bd*4").gain(0.95).shape(0.1),
  // Occasional variation every 8 bars
  sound("bd bd ~ bd").gain(0.9).every(8, x => x)
).cpm(135)

// Birmingham Techno (Surgeon style)
// Industrial, distorted, aggressive
const surgeonKick = stack(
  sound("bd*4")
    .gain(0.9)
    .distort(0.4)
    .shape(0.3)
    .lpf(300)
    .room(0.1),
  // Add metallic click
  sound("click*4")
    .gain(0.4)
    .hpf(3000)
    .delay(0.01)
).cpm(140)

// Hypnotic Minimal (Donato Dozzy style)
// Subtle variations, deep, meditative
const dozzyKick = stack(
  sound("bd*4")
    .gain(sine.range(0.85, 0.9).slow(16))
    .lpf(sine.range(80, 120).slow(32))
    .nudge(sine.range(-0.005, 0.005).fast(4)),
  // Subtle room tone
  sound("bd*4")
    .gain(0.2)
    .room(0.3)
    .delay(0.02)
).cpm(125)

// Example 3: Advanced Layering Techniques

// Professional club-ready kick
const clubKick = stack(
  // Layer 1: Sub (20-60Hz)
  sound("bd*4")
    .gain(0.9)
    .lpf(60)
    .n("c1"),
  
  // Layer 2: Body (60-200Hz)
  sound("bd:1*4")
    .gain(0.7)
    .hpf(60)
    .lpf(200)
    .shape(0.2),
  
  // Layer 3: Punch (200-1000Hz)
  sound("bd:2*4")
    .gain(0.5)
    .hpf(200)
    .lpf(1000)
    .attack(0.001),
  
  // Layer 4: Click (1000Hz+)
  sound("click*4")
    .gain(0.3)
    .hpf(1000)
    .pan(0.5)
).cpm(132)

// Example 4: Synthesized Kicks

// Classic 909-style synthesized kick
const synthKick = note("c1*4")
  .s("sine")
  .attack(0.001)
  .decay(0.05)
  .sustain(0)
  .release(0.2)
  .lpf(200)
  .distort(0.2)
  .gain(0.8)

// Pitched kick for tonal techno
const tonalKick = note("<c1 c1 c1 f0>*4")
  .s("sine")
  .attack(0.001)
  .decay(0.08)
  .sustain(0)
  .release(0.15)
  .lpf(150)
  .gain(0.85)

// Example 5: Dynamic Programming

// Building energy over 16 bars
const buildingKick = stack(
  // Main kick fades in
  sound("bd*4")
    .gain(slow(16, line(0.5, 0.95))),
  
  // Ghost notes appear after 8 bars
  sound("bd*8")
    .gain(0.2)
    .when(x => x.cycleCount >= 8, x => x),
  
  // Additional layer after 12 bars
  sound("bd:2*4")
    .gain(0.4)
    .lpf(80)
    .when(x => x.cycleCount >= 12, x => x)
).cpm(130)

// Example 6: Polyrhythmic Experiments

// 3 over 4 polyrhythm
const polyKick = polyrhythm(
  sound("bd*3").gain(0.9).pan(0.4),
  sound("bd:1*4").gain(0.7).pan(0.6)
).cpm(130)

// Complex polymetric pattern
const complexPoly = stack(
  sound("bd*4").gain(0.9),           // Main 4/4
  sound("bd:1").euclid(3, 8).gain(0.6),  // 3 over 8
  sound("bd:2").euclid(5, 16).gain(0.4)  // 5 over 16
).cpm(132)

// Example 7: Performance Variations

// Live performance kick with comments for real-time editing
const liveKick = stack(
  // Main kick - adjust gain for drops
  sound("bd*4").gain(0.9), // <-- Change to 0 for breakdown
  
  // Rolling layer - comment out for minimal sections
  sound("bd*8").gain(0.2).pan(0.6),
  
  // Sub reinforcement - boost for heavy sections
  sound("bd:3*4").gain(0.3).lpf(60) // <-- Increase gain to 0.6 for bass drops
).cpm(130)

// Kick with automation ready for performance
const performanceKick = stack(
  sound("bd*4")
    .gain(0.9) // <-- Automate this during performance
    .lpf(200)  // <-- Sweep this for filter effects
    .room(0)   // <-- Add reverb for atmospheric breaks
).cpm(132)