# CLAUDE.md - @strudel/midi

This file provides guidance to Claude Code when working with the MIDI integration package.

## Package Purpose

`@strudel/midi` provides Web MIDI API integration for Strudel:
- MIDI output to hardware and software devices
- MIDI input for controlling patterns
- MIDI clock synchronization
- Program change and CC automation
- Multi-channel MIDI routing
- MIDI device management

## Key APIs and Functions

### MIDI Output
```javascript
import { enableWebMidi, WebMidiOut } from '@strudel/midi';

// Enable MIDI access
await enableWebMidi();

// Basic MIDI output
note("c3 e3 g3").midi()  // Default MIDI out

// Specific device
note("c3 e3 g3").midi('IAC Driver Bus 1')

// With channel
note("c3 e3 g3").midi(0).midichan(1)  // Channel 1
```

### MIDI Controls
```javascript
// Control change
pattern.cc(74, 64)       // CC 74, value 64
pattern.ccv(0.5)         // CC value 0-1 normalized
pattern.ccn(74)          // CC number

// Program change  
pattern.program(5)       // Program 5
pattern.bank(2)          // Bank select

// Pitch bend
pattern.bend(0.5)        // -1 to 1 range
```

### MIDI Input
```javascript
// MIDI input control
const { triggerMidiIn } = await enableWebMidi();

// Use in patterns
note(midiIn("60 62 64"))  // Triggered by MIDI input

// CC input
ccIn(74).range(200, 2000).cutoff()  // Map CC to cutoff
```

## Common Usage Patterns

### Basic MIDI Output
```javascript
// Simple MIDI sequence
note("c3 e3 g3 c4")
  .midi()           // Send to default output
  .midichan(1)      // MIDI channel 1

// Multi-channel
stack(
  note("c2 c2").midi().midichan(1),    // Bass on ch 1
  note("c4 e4 g4").midi().midichan(2), // Lead on ch 2
  s("hh*8").midi().midichan(10)        // Drums on ch 10
)
```

### MIDI Effects
```javascript
// Filter automation
note("c3")
  .midi()
  .cc(74, sine.range(0, 127).slow(4))  // LFO on CC 74

// Program changes
note("c3 e3 g3")
  .midi()
  .program("<0 8 16 24>")  // Change patches

// Velocity control
note("c3 e3 g3")
  .midi()
  .velocity("0.3 0.6 0.9")
```

### MIDI Device Selection
```javascript
// List available devices
const outputs = await WebMidiOut.outputs();
console.log(outputs.map(o => o.name));

// Use specific device
note("c3 e3")
  .midi('My Synthesizer')
  .midichan(1)

// By device index
note("c3 e3")
  .midi(0)  // First device
```

### MIDI Input Patterns
```javascript
// Note input
await enableWebMidi();
note(midiIn())  // Play any MIDI input

// Filtered input
note(midiIn("60:64"))  // Only C4-E4

// CC control
ccIn(1)  // Mod wheel
  .range(0, 1)
  .gain()  // Control volume
```

## Development Guidelines

### Adding MIDI Features
1. Check Web MIDI API support
2. Handle async device access
3. Validate MIDI data ranges
4. Provide device enumeration
5. Handle connection changes

### MIDI Implementation Pattern
```javascript
// Register MIDI function
export const myMidiFunc = register('myMidiFunc', (value, pat) => {
  return pat.withHap((hap) => {
    return hap.setContext({
      ...hap.context,
      midiFunc: value
    });
  });
});

// Handle in output
if (hap.context.midiFunc) {
  // Send MIDI message
  output.send([status, data1, data2]);
}
```

### Device Management
```javascript
// Monitor device changes
WebMidiOut.enableWebMidi({
  onDeviceChange: (outputs) => {
    console.log('MIDI devices changed:', outputs);
  }
});

// Handle disconnection
if (!output.state === 'connected') {
  console.warn('MIDI device disconnected');
}
```

## Testing Requirements

### Testing Challenges
- Requires MIDI devices/software
- Browser security restrictions
- Async permission flow
- Device-specific behavior

### Mock Testing
```javascript
// Mock MIDI output
const mockOutput = {
  send: jest.fn(),
  name: 'Mock Device'
};

// Test MIDI messages
const events = pattern.midi().queryArc(0, 1);
events.forEach(e => {
  expect(mockOutput.send).toHaveBeenCalledWith(
    expect.arrayContaining([144, 60, 127]) // Note on
  );
});
```

## Dependencies and Relationships

### External Dependencies
- Web MIDI API (browser)
- No npm dependencies

### Integration Points
- `@strudel/core` - Pattern engine
- `@strudel/webaudio` - Can combine with audio
- Works alongside audio output

### Browser Requirements
- Requires secure context (HTTPS)
- User permission needed
- Not available in all browsers

## Common Pitfalls

### Permission Handling
```javascript
// Must handle permission request
try {
  await enableWebMidi();
} catch (err) {
  if (err.name === 'SecurityError') {
    console.log('MIDI permission denied');
  }
}

// Check if MIDI available
if (!navigator.requestMIDIAccess) {
  console.log('Web MIDI not supported');
}
```

### Channel Numbers
```javascript
// MIDI channels are 1-16 in UI
// But 0-15 in implementation
.midichan(1)  // Shows as channel 1
// Sends as channel 0 internally

// Drums typically on channel 10
.midichan(10)  // Channel 10 (index 9)
```

### Timing Precision
```javascript
// MIDI has lower timing precision than audio
// Use scheduler lookahead appropriately

// Good for MIDI
const lookahead = 0.1;  // 100ms

// Too tight for MIDI
const lookahead = 0.01; // 10ms might cause timing issues
```

### Value Ranges
```javascript
// MIDI uses 0-127 for most values
.cc(74, 64)       // CC value 0-127
.velocity(100)    // Velocity 0-127
.program(0)       // Program 0-127

// Normalized versions (0-1)
.ccv(0.5)         // Converts to 64
.gain(0.8)        // Converts to velocity 102
```

## Integration Examples

### With Audio Output
```javascript
// Layer MIDI and audio
stack(
  // MIDI to hardware
  note("c3 e3 g3").midi('Prophet'),
  
  // Audio synthesis
  note("c5 e5").s("sawtooth").cutoff(800)
)
```

### Live Performance
```javascript
// MIDI keyboard input
const keyboard = await midiIn();

// Process input
keyboard
  .note()           // Use as notes
  .scale("C:minor") // Quantize to scale
  .s("piano")       // Play with audio
```

### MIDI Looper
```javascript
// Record MIDI input
let recording = [];
midiIn.record(recording);

// Playback loop
const loop = sequence(...recording)
  .midi()
  .midichan(1);
```

## MIDI Message Reference

### Note Messages
```javascript
// Note On: [144 + channel, note, velocity]
[144, 60, 127]  // C4 on, full velocity, channel 1

// Note Off: [128 + channel, note, velocity]  
[128, 60, 64]   // C4 off, release velocity

// Handled automatically by .midi()
```

### Control Changes
```javascript
// CC: [176 + channel, controller, value]
[176, 1, 64]    // Mod wheel to middle

// Common CCs:
1   - Modulation
7   - Volume  
10  - Pan
11  - Expression
64  - Sustain pedal
74  - Filter cutoff
```

### Program/Bank
```javascript
// Program Change: [192 + channel, program]
[192, 0]        // Program 1 on channel 1

// Bank Select requires two CCs:
[176, 0, 0]     // Bank MSB
[176, 32, 1]    // Bank LSB  
[192, 0]        // Then program change
```

### System Messages
```javascript
// MIDI Clock: [248]
// Start: [250]
// Stop: [252]
// Continue: [251]

// Not directly used in patterns
// But useful for synchronization
```

## Advanced Features

### MIDI Clock Sync
```javascript
// Sync to external MIDI clock
enableWebMidi({
  syncToClock: true,
  clockInput: 'My MIDI Interface'
});
```

### Sysex Support
```javascript
// System exclusive messages
pattern.sysex([0xF0, 0x43, 0x12, 0x00, 0xF7])

// Device-specific control
pattern.sysex(yamahaParam(5, 127))
```

### MPE (MIDI Polyphonic Expression)
```javascript
// Per-note expression
note("c3 e3 g3")
  .midi()
  .mpe({
    slide: sine.slow(4),     // Pitch slide
    pressure: 0.5,           // Aftertouch
    timbre: saw.range(0, 1)  // Y-axis/CC74
  })
```