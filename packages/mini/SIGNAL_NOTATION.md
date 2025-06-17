# Signal Mini Notation for Strudel

This document describes the signal notation extension to Strudel's mini notation, enabling concise expression of continuous signals and modulations.

## Overview

Signal notation extends mini notation to continuous signals, using the `~` prefix to denote signals. This allows for expressive modulation, synthesis, and signal processing within the familiar mini notation syntax.

## Basic Syntax

### Signal Types

```javascript
~sine    // Sine wave (0 to 1)
~saw     // Sawtooth wave (0 to 1)
~square  // Square wave (0 to 1)
~tri     // Triangle wave (0 to 1)
~noise   // White noise (0 to 1)
~pink    // Pink noise (0 to 1)
~perlin  // Perlin noise (0 to 1)
```

### Frequency Control

```javascript
~sine:4      // 4 Hz (4 cycles per pattern cycle)
~saw:0.5     // 0.5 Hz (half cycle per pattern cycle)
~square:8    // 8 Hz
```

### Signal Expressions

Mathematical operations on signals:

```javascript
~sine * 0.5           // Scale amplitude by 0.5
~sine + 0.5           // Add DC offset
~sine * 0.5 + 0.5     // LFO from 0.5 to 1.0

// Complex expressions
~sine:2 + ~sine:3     // Additive synthesis
~sine:100 * ~sine:1   // Amplitude modulation
~sine:2 * ~saw:1      // Ring modulation
```

### Signal Operations

```javascript
~sine.range(200, 2000)   // Map to specific range
~sine.slow(2)            // Slow down by factor of 2
~sine.fast(4)            // Speed up by factor of 4
```

### Composite Patterns

```javascript
[~sine:1, ~saw:2]        // Stack signals
<~sine ~square ~tri>     // Alternate signals per cycle
```

## Integration with Patterns

### Using sig() Function

```javascript
import { sig } from '@strudel/mini';

// Basic usage
note("c3 e3 g3")
  .gain(sig("~sine:2 * 0.5 + 0.5"))
  .cutoff(sig("~saw:0.5.range(200, 2000)"))

// Multiple modulations
s("bd*4")
  .gain(sig("~sine:8"))
  .speed(sig("~tri:0.25 * 0.2 + 0.9"))
```

### Signal Routing

Route signals directly to parameters:

```javascript
note("c3 e3 g3")
  .sig("~sine:4 >> gain")      // Route to gain
  .sig("~tri:2 >> pan")        // Route to pan
  .sig("~saw:0.5 >> cutoff")   // Route to cutoff
```

## Advanced Features

### Envelopes

```javascript
~env(0.01, 0.1, 0.7, 0.2)   // ADSR envelope
~env(0.5, 0.5, 0.8, 1)      // Custom ADSR
```

### Ramp Functions

```javascript
~ramp(1)    // Linear ramp (same as ~saw)
~ramp(2)    // Exponential ramp (squared)
~ramp(0.5)  // Logarithmic ramp (square root)
```

## Examples

### LFO Modulation
```javascript
// Volume tremolo
note("c3").gain(sig("~sine:4 * 0.3 + 0.7"))

// Filter wobble
s("bass:1").cutoff(sig("~sine:0.5.range(200, 2000)"))

// Vibrato
note("c3").speed(sig("~sine:6 * 0.05 + 1"))
```

### AM/FM Synthesis
```javascript
// Amplitude modulation
note("c3")
  .s("sine")
  .gain(sig("~sine:200 * ~sine:1"))

// Frequency modulation (using speed as proxy)
note("c3")
  .s("sine")
  .speed(sig("~sine:10 * 0.5 + 1"))
```

### Rhythmic Effects
```javascript
// Gated hi-hats
s("hh*16").gain(sig("~square:8"))

// Rhythmic filter
s("bass:1*8").cutoff(sig("~square:4.range(200, 2000)"))
```

### Complex Modulations
```javascript
// Multiple LFOs
stack(
  s("bd*4"),
  s("hh*8").gain(sig("~sine:8 * ~sine:0.5")),
  note("c3 e3").cutoff(sig("(~sine:1 + ~saw:2) * 1000 + 500"))
)

// Polyrhythmic modulation
s("pad:1")
  .gain(sig("[~sine:3, ~sine:4] * 0.5 + 0.5"))
  .cutoff(sig("~perlin:0.5.range(500, 2000)"))
```

### Generative Patterns
```javascript
// Signal-controlled euclidean rhythms
s("bd").euclid(sig("~sine:0.25 * 3 + 5"), 8)

// Morphing oscillator
note("c3").gain(sig("<~sine ~square ~tri>:4"))
```

## Implementation Notes

### Parser
The signal notation is parsed using a PEG (Parsing Expression Grammar) parser that extends the mini notation concepts. The parser handles:
- Signal type recognition
- Parameter parsing
- Expression evaluation with proper precedence
- Operation chaining

### Pattern Integration
Signals are converted to Strudel Pattern objects, allowing them to:
- Integrate seamlessly with existing pattern methods
- Be used as continuous control sources
- Maintain precise timing through the FRP system

### Performance
- Signals are evaluated lazily during pattern queries
- Expression trees are built at parse time
- Mathematical operations use Pattern arithmetic methods

## Future Possibilities

### Additional Signal Types
- `~phasor` - Raw phase accumulator
- `~chaos` - Chaotic attractors
- `~sample` - Sample-and-hold
- `~smooth` - Smoothed/filtered signals

### Advanced Operations
- `~sine.phase(0.25)` - Phase offset
- `~sine.curve(2)` - Waveshaping
- `~sine.quantize(8)` - Value quantization
- `~sine.slew(0.1)` - Slew limiting

### Signal Processors
- `~lpf(signal, freq)` - Low-pass filter
- `~hpf(signal, freq)` - High-pass filter
- `~delay(signal, time, feedback)`
- `~reverb(signal, size, damp)`

### Visual Feedback
Integration with visualization tools to display signal shapes and modulation in real-time.

## Conclusion

Signal mini notation brings the expressiveness of modular synthesis to Strudel's pattern system, enabling complex modulations and synthesis techniques with minimal syntax. It maintains the live coding philosophy while opening new sonic possibilities.