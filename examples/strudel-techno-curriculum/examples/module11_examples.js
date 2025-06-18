// Module 11: Modular Thinking - System Design Examples
// Complete patterns demonstrating interconnected pattern networks and emergent behaviors

// Example 1: Basic Modular Voice Architecture
// Shows how to build a complete voice from modular components

// Define basic modules
const lfo1 = sine.range(0, 1).slow(8);
const lfo2 = saw.range(0, 1).slow(3);
const envelope = trigger.adsr(0.01, 0.1, 0.5, 0.2);
const sequencer = choose([0, 3, 5, 7, 10]); // minor pentatonic

// Patch modules together
const basicModularVoice = note("c3")
  .add(sequencer)
  .s("sawtooth")
  .lpf(lfo1.range(200, 2000))
  .resonance(lfo2.range(1, 20))
  .gain(envelope)
  .euclid(5, 8)
  .cpm(130)

// Example 2: Clock Division Network
// Master clock driving multiple synchronized elements

const masterClock = signal("t*16");

// Clock dividers
const div2 = masterClock.mask("t f");
const div3 = masterClock.mask("t f f");
const div4 = masterClock.mask("t f f f");
const div5 = masterClock.mask("t f f f f");
const div7 = masterClock.mask("t f f f f f f");

// Complete clock system
const clockNetwork = stack(
  // Main kick on div4
  sound("bd").mask(div4).gain(0.9),
  
  // Snare on div7 for off-grid feel
  sound("sd").mask(div7).gain(0.7).pan(0.3),
  
  // Hi-hat on div2 
  sound("hh").mask(div2).gain(0.4).pan(0.7),
  
  // Percussion on div3 and div5
  sound("rim").mask(div3).gain(0.5).pan(0.2),
  sound("click").mask(div5).gain(0.3).hpf(1000),
  
  // Melodic element on div5
  note("c3 eb3 g3").mask(div5).s("fm4").gain(0.4)
).cpm(132)

// Example 3: Cross-Modulation System
// Patterns modulating each other bidirectionally

// Pattern A generates rhythm
const rhythmGen = euclid(choose([3, 5, 7]), 16);

// Pattern B generates pitch
const pitchGen = choose([0, 3, 5, 7, 10, 12]);

// Cross-modulation: rhythm affects pitch range
const modulatedPitch = note("c3")
  .add(pitchGen.mul(rhythmGen.fmap(x => x ? 1 : 0.5)))
  .s("square");

// Cross-modulation: pitch affects rhythm density  
const modulatedRhythm = sound("click")
  .euclid(
    pitchGen.fmap(p => 3 + (p % 5)), 
    16
  );

// Combined cross-mod system
const crossModSystem = stack(
  sound("bd*4").gain(0.9),
  modulatedPitch.lpf(800).gain(0.5),
  modulatedRhythm.gain(0.3).pan(rand)
).cpm(130)

// Example 4: Feedback FM Network
// FM operators modulating each other in a feedback loop

const createFeedbackFM = () => {
  let feedback = { op1: 1, op2: 1.5, op3: 2 };
  
  const updateFeedback = (value) => {
    feedback.op1 = 1 + (value % 3);
    feedback.op2 = 1.5 + (value % 5) * 0.5;
    feedback.op3 = 2 + (value % 7) * 0.3;
  };
  
  return stack(
    // Operator 1: modulated by op3
    note("c3").s("fm4")
      .fmh(feedback.op3)
      .fmi(2)
      .gain(0.3)
      .pan(0.2),
      
    // Operator 2: modulated by op1  
    note("c3").s("fm4")
      .fmh(feedback.op1)
      .fmi(3)
      .gain(0.3)
      .pan(0.5)
      .onTrigger(x => updateFeedback(x.value.note)),
      
    // Operator 3: modulated by op2
    note("c3").s("fm4")
      .fmh(feedback.op2)
      .fmi(4)
      .gain(0.3)
      .pan(0.8)
  );
};

const feedbackFM = createFeedbackFM()
  .add(choose([0, 3, 5, 7]))
  .struct("t ~ t t ~ t ~ t")
  .cpm(130)

// Example 5: Surgeon-Style Modular Patch
// Industrial techno through complex routing

const surgeonPatch = () => {
  // Oscillator bank with slight detuning
  const osc1 = note("c2").s("sawtooth");
  const osc2 = note("c2").add(0.07).s("square");
  const osc3 = note("c2").sub(0.05).s("triangle");
  
  // LFO bank for modulation
  const lfo1 = sine.slow(4);
  const lfo2 = saw.slow(7);
  const lfo3 = square.slow(3);
  
  // Filter routing matrix
  const route1 = osc1
    .lpf(lfo1.range(200, 1500))
    .resonance(15)
    .hpf(lfo2.range(50, 200));
    
  const route2 = osc2
    .hpf(lfo2.range(100, 800))
    .bpf(lfo3.range(400, 1200))
    .bpq(8);
    
  const route3 = osc3
    .bpf(lfo3.range(300, 1000))
    .bpq(10)
    .lpf(lfo1.range(500, 2000));
  
  // Mix and process
  return stack(route1, route2, route3)
    .add(perlin.range(-0.1, 0.1)) // slight pitch instability
    .distort(0.4)
    .shape(0.3)
    .gain(0.7);
};

// Full Surgeon-style pattern
stack(
  sound("bd ~ bd bd ~ bd bd ~").gain(0.9).shape(0.2),
  sound("hh*16").gain(0.3).euclid(11, 16).pan(sine.slow(4)),
  surgeonPatch().struct("t ~ t t ~ ~ t ~")
).cpm(140)

// Example 6: Generative Sequencer Network
// Multiple sequencers influencing each other

const generativeNetwork = () => {
  // Three interconnected sequencers
  const seq1 = shuffle([0, 3, 5, 7]);
  const seq2 = shuffle([0, 2, 4, 7]);
  const seq3 = shuffle([0, 1, 5, 8]);
  
  // Cross-influence functions
  const influence = {
    // Seq1 affects Seq2's octave
    s1_to_s2: (note) => seq1.fmap(n => n > 5 ? note + 12 : note),
    
    // Seq2 affects Seq3's rhythm
    s2_to_s3: (pattern) => pattern.euclid(
      seq2.fmap(n => 3 + (n % 4)), 
      16
    ),
    
    // Seq3 affects Seq1's filter
    s3_to_s1: (pattern) => pattern.lpf(
      seq3.fmap(n => 200 + (n * 200))
    )
  };
  
  // Build the network
  return stack(
    note("c3").add(seq1)
      .s("sawtooth")
      .chain(influence.s3_to_s1)
      .gain(0.5)
      .pan(0.2),
      
    note("c3").add(seq2)
      .chain(influence.s1_to_s2)
      .s("square")
      .gain(0.4)
      .pan(0.5),
      
    note("c3").add(seq3)
      .s("triangle")
      .chain(influence.s2_to_s3)
      .gain(0.3)
      .pan(0.8)
  );
};

const genNet = generativeNetwork()
  .delay(0.2)
  .delayfeedback(0.4)
  .room(0.2)
  .cpm(130)

// Example 7: Blawan-Style Kick Synthesis
// Complex modular kick with multiple modulation sources

const blawanKick = () => {
  // Core modules
  const pitchEnv = trigger.exp(0.05).range(80, 20);
  const ampEnv = trigger.adsr(0.001, 0.05, 0.1, 0.1);
  const clickEnv = trigger.exp(0.001).range(1, 0);
  
  // Modulation sources
  const harmonicMod = sine.fast(7).range(1, 3);
  const feedbackMod = saw.slow(16).range(0, 8);
  const distortionMod = square.slow(32).range(0.3, 0.8);
  
  // Build the kick
  const kick = note("c1")
    .s("fm4")
    .fmh(harmonicMod)
    .fmi(feedbackMod)
    .freq(pitchEnv)
    .gain(ampEnv)
    .distort(distortionMod)
    .shape(0.4)
    .lpf(150);
    
  // Add click layer
  const click = s("click")
    .gain(clickEnv.mul(0.5))
    .hpf(3000)
    .pan(0.5);
  
  return stack(kick, click);
};

// Blawan-style pattern
stack(
  blawanKick().struct("t ~ ~ t ~ ~ t ~").gain(0.9),
  blawanKick()
    .struct("~ ~ t ~ ~ t ~ ~")
    .gain(0.6)
    .hpf(200)
    .delay(0.01),
  sound("metal")
    .n(irand(10))
    .struct("~ t ~ ~ t ~ ~ ~")
    .speed(2)
    .hpf(4000)
    .gain(0.3)
).cpm(135)

// Example 8: Evolving System with Memory
// Pattern that develops based on its own history

const evolvingSystem = () => {
  let memory = [0, 3, 5, 7]; // initial state
  let position = 0;
  let generation = 0;
  
  return note("c3")
    .add(x => {
      const current = memory[position % memory.length];
      position++;
      
      // Evolution rules
      if (position % 8 === 0) {
        generation++;
        
        // Rule 1: Add interval of last two notes
        const interval = memory[memory.length - 1] - memory[memory.length - 2];
        const newNote = (current + interval + 12) % 12;
        
        // Rule 2: Sometimes mutate
        const mutated = generation % 4 === 0 
          ? (newNote + choose([1, -1, 2, -2])) % 12
          : newNote;
          
        memory.push(mutated);
        
        // Keep memory bounded
        if (memory.length > 16) {
          memory = memory.slice(-16);
        }
      }
      
      return current;
    })
    .s("fm4")
    .fmi(x => (x.value.note % 12) * 0.4)
    .fmh(x => 1 + (x.value.note % 7))
    .sometimes(x => x.add(12))
    .release(0.1);
};

// Full evolving composition
stack(
  sound("bd*4").gain(0.9),
  sound("hh*8").euclid(7, 8).gain(0.3),
  evolvingSystem().euclid(5, 8).gain(0.5),
  evolvingSystem().slow(2).add(7).gain(0.3).pan(0.7)
).cpm(130)

// Example 9: Chaos-Driven Modulation
// Using mathematical chaos for organic modulation

const chaoticModulation = () => {
  // Simplified logistic map for chaos
  let x = 0.5;
  const r = 3.9; // chaos parameter
  
  const logisticMap = () => {
    x = r * x * (1 - x);
    return x;
  };
  
  // Henon map for 2D chaos
  let hx = 0.1, hy = 0.1;
  const henonMap = () => {
    const a = 1.4, b = 0.3;
    const newX = 1 - a * hx * hx + hy;
    const newY = b * hx;
    hx = newX;
    hy = newY;
    return { x: hx, y: hy };
  };
  
  return stack(
    // Logistic map controls filter
    note("c3 eb3 g3")
      .s("sawtooth")
      .lpf(() => 200 + logisticMap() * 1800)
      .gain(0.5),
      
    // Henon map controls FM parameters
    note("c4")
      .s("fm4")
      .fmi(() => {
        const h = henonMap();
        return Math.abs(h.x) * 5;
      })
      .fmh(() => Math.abs(hy) * 4 + 1)
      .struct("t ~ t t ~ ~ t ~")
      .gain(0.4)
  );
};

stack(
  sound("bd*4").gain(0.9),
  chaoticModulation()
).cpm(132)

// Example 10: Complete Modular Live Set
// Performance-ready modular system with multiple interacting parts

const modularLiveSet = () => {
  // Global modulation bus
  const globalLFO = sine.slow(64);
  const globalFilter = globalLFO.range(200, 2000);
  
  // Kick synthesis module
  const kickModule = note("c1")
    .s("fm4")
    .fmi(2)
    .attack(0.001)
    .release(0.1)
    .lpf(100)
    .distort(0.4)
    .struct("t ~ ~ t ~ ~ t ~");
    
  // Bass module influenced by kick
  const bassModule = note("<c1 c1 eb1 f1>")
    .s("sawtooth")
    .lpf(globalFilter.mul(0.5))
    .resonance(10)
    .struct("~ t ~ t t ~ t ~")
    .mask(kickModule.inv()); // duck when kick plays
    
  // Lead module with self-feedback
  let leadFeedback = 0;
  const leadModule = note("c4")
    .add(choose([0, 3, 5, 7, 10]))
    .add(() => leadFeedback)
    .s("square")
    .lpf(globalFilter)
    .onTrigger(x => {
      leadFeedback = (x.value.note % 12) * 0.3;
    })
    .struct("t ~ ~ t ~ t ~ ~")
    .sometimes(x => x.fast(2));
    
  // Percussion module with euclidean variations
  const percModule = stack(
    sound("hh").euclid(11, 16).gain(0.3),
    sound("rim").euclid(5, 12).gain(0.4),
    sound("click").euclid(7, 16).gain(0.2).hpf(2000)
  );
  
  // Master mix with send effects
  return stack(
    kickModule.gain(0.9),
    bassModule.gain(0.7),
    leadModule.gain(0.5).delay(0.3).delayfeedback(0.4),
    percModule.room(0.1)
  );
};

modularLiveSet().cpm(132)