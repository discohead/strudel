// Headless Strudel Pattern
// Edit this file to change the pattern
// The pattern will auto-reload on save

// A groovy minimal techno pattern
stack(
  // Kick drum - four on the floor
  s('bd:2*4').gain(0.9),

  // Snare with delay
  s('~ sd ~ sd').delay(0.5).delaytime(0.125).gain(0.8),

  // Hi-hats with velocity pattern
  s('hh*16')
    .gain(sequence(0.6, 0.3, 0.4, 0.3).fast(4))
    .pan(sine.range(0.4, 0.6)),

  // Bassline
  note('<c1 c1 eb1 g1>').struct('t(7,16)').s('sawtooth').lpf(800).lpq(10).gain(0.7),

  // Atmospheric pad
  note('<c3 eb3 g3 bb3>').s('square').lpf(sine.range(400, 2000).slow(16)).lpq(5).gain(0.2).room(0.9),
);
