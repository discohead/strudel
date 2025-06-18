# Strudel Techno Quick Reference

## Essential Pattern Functions

### Rhythm & Time
```javascript
// Basic patterns
sound("bd*4")              // Four kicks per cycle
sound("bd ~ bd ~")         // Kicks with rests
sound("[bd cp]*2")         // Faster subdivision

// Euclidean rhythms
.euclid(3, 8)             // 3 hits over 8 steps
.euclidRot(5, 8, 2)       // Rotated pattern

// Time manipulation
.fast(2)                  // Double speed
.slow(0.5)                // Half speed
.late(0.125)              // Delay by 1/8
```

### Sound & Synthesis
```javascript
// Sound selection
sound("bd")               // Sample
note("c3").s("saw")       // Synth note

// Synthesis parameters
.attack(0.01)             // Envelope attack
.release(0.1)             // Envelope release
.lpf(1000)                // Low-pass filter
.resonance(10)            // Filter resonance
.distort(0.3)             // Distortion amount
```

### Pattern Combination
```javascript
// Layering
stack(pattern1, pattern2)  // Play together
cat(pattern1, pattern2)    // Play sequentially

// Polyrhythm
polyrhythm(
  sound("bd*3"),
  sound("~*4")
)
```

### Effects
```javascript
// Spatial effects
.pan(0.7)                 // Stereo position
.room(0.3)                // Reverb amount
.delay(0.5)               // Delay mix
.delaytime(0.375)         // Delay time

// Modulation
.shape(0.3)               // Waveshaping
.crush(8)                 // Bit crushing
```

### Probability & Variation
```javascript
// Random choices
choose(["bd", "cp", "hh"])  // Random selection
sometimes(x => x.rev())     // 50% chance
degrade()                   // Random dropout

// Conditional
every(4, x => x.fast(2))    // Every 4 cycles
when(x => x.cycle > 8)      // After 8 cycles
```

## Techno Pattern Templates

### Basic Groove
```javascript
stack(
  sound("bd*4").gain(0.9),
  sound("~ cp ~ cp").gain(0.7),
  sound("hh*16").euclid(11, 16).gain(0.4)
).cpm(130)
```

### Minimal Bassline
```javascript
note("c1 ~ c1 c1 ~ c1 ~ c1")
  .s("saw")
  .lpf(400)
  .release(0.1)
  .gain(0.7)
```

### Hypnotic Lead
```javascript
note("<c4 eb4 g4>")
  .s("fm4")
  .sometimes(x => x.add(12))
  .release(0.1)
  .delay(0.3)
```

### Dub Techno Stab
```javascript
note("cm7")
  .s("supersaw")
  .release(0.1)
  .delay(0.8)
  .delaytime("3/8")
  .delayfeedback(0.7)
  .lpf(800)
```

## Common BPM Ranges

- **Deep/Dub Techno**: 120-128 BPM
- **Classic Techno**: 128-135 BPM  
- **Driving Techno**: 135-140 BPM
- **Hard Techno**: 140-150 BPM
- **Industrial**: 145-155 BPM

## Keyboard Shortcuts

- **Run Code**: Ctrl+Enter (Cmd+Enter on Mac)
- **Stop All**: Ctrl+. (Cmd+. on Mac)
- **Comment Line**: Ctrl+/
- **Format Code**: Shift+Alt+F

## Performance Tips

1. **Start Minimal**: Begin with kick and one element
2. **Build Gradually**: Add elements every 4-8 bars
3. **Use Comments**: `//` to quickly mute lines
4. **Prepare Variations**: Have alternate patterns ready
5. **Control Dynamics**: Adjust gain values live
6. **Create Breaks**: Use `hush()` for silence

## Sound Banks

### Drums
- `bd` - Kick drums
- `sd` - Snare drums
- `cp` - Claps
- `hh` - Hi-hats (closed)
- `oh` - Open hi-hats
- `rim` - Rimshots
- `mt` - Mid toms
- `lt` - Low toms

### Synths
- `sine` - Pure tone
- `saw` - Bright/buzzy
- `square` - Hollow/pure
- `tri` - Mellow
- `fm4` - Complex FM
- `supersaw` - Detuned saws

### Effects Ranges
- **gain**: 0-1 (volume)
- **pan**: 0-1 (L-R)
- **lpf**: 20-20000 (Hz)
- **resonance**: 0-40
- **room**: 0-1 (reverb)
- **delay**: 0-1 (mix)
- **distort**: 0-1

## Module 11: Modular Concepts

### Pattern as Module
```javascript
// Define reusable modules
const lfo = sine.range(0, 1).slow(8);
const env = trigger.adsr(0.01, 0.1, 0.5, 0.2);
const seq = choose([0, 3, 5, 7, 10]);

// Connect modules
note("c3").add(seq).lpf(lfo.range(200, 2000)).gain(env)
```

### Cross-Modulation
```javascript
// Patterns modulating each other
const rhythmGen = euclid(5, 8);
const pitchGen = choose([0, 3, 5, 7]);

// Rhythm affects pitch
const modPitch = pitchGen.mask(rhythmGen);

// Pitch affects rhythm
const modRhythm = sound("click")
  .euclid(pitchGen.fmap(p => 3 + (p % 4)), 16);
```

### Feedback Systems
```javascript
// Create feedback loops
let feedback = 0;
note("c3")
  .add(() => feedback)
  .onTrigger(x => {
    feedback = (x.value.note % 12) * 0.5;
  })
```

## Troubleshooting

**No sound?**
- Check browser audio permissions
- Ensure speakers/headphones connected
- Try refreshing the page

**Timing issues?**
- Use `.hush()` to reset
- Check for syntax errors
- Ensure all brackets match

**CPU overload?**
- Reduce number of layers
- Lower effect usage
- Simplify patterns