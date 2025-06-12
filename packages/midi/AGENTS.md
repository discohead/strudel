# AGENTS.md - @strudel/midi

Specialized guidance for AI agents working on the MIDI integration package. This package connects Strudel patterns to hardware and software MIDI devices.

## Quick Start (1 minute validation)

```bash
# From packages/midi directory
pnpm test  # Should pass MIDI-related tests

# Note: Full MIDI testing requires:
# - Browser with Web MIDI support
# - MIDI devices or software
# - User permission grant
```

## MIDI Package Context

### Purpose
Provides Web MIDI API integration for sending patterns to MIDI devices and receiving MIDI input for pattern control.

### Key Files
- `midi.mjs` - Core MIDI output functionality
- `input.mjs` - MIDI input handling
- `index.mjs` - Public exports and pattern methods

### References
- Local: `CLAUDE.md` in this directory
- Global: `/claude/technologies/midi-integration.md`
- Rules: `/.cursor/rules/components/midi-protocol.mdc`

## Common Agent Tasks

### 1. Adding MIDI Control Features (4-6 minutes)

#### Task Checklist
- [ ] Define new MIDI message type
- [ ] Add pattern method
- [ ] Validate MIDI data ranges
- [ ] Handle in MIDI scheduler
- [ ] Test with virtual MIDI
- [ ] Document usage

#### Example: Adding Aftertouch Support
```javascript
// In midi.mjs - add pattern method
export const aftertouch = register('aftertouch', (pressure, pat) => {
  // Validate pressure range (0-127 or 0-1)
  if (pressure <= 1) {
    pressure = Math.round(pressure * 127);
  }
  pressure = Math.max(0, Math.min(127, pressure));
  
  return pat.withHap((hap) => {
    return hap.setContext({
      ...hap.context,
      aftertouch: pressure
    });
  });
});

// In MIDI output handler
const sendMidiMessage = (hap, output, channel) => {
  const { note, velocity = 100, aftertouch } = hap.value;
  
  // Send note on
  output.send([0x90 + channel, note, velocity]);
  
  // Send aftertouch if present
  if (aftertouch !== undefined) {
    // Channel pressure message
    output.send([0xD0 + channel, aftertouch]);
  }
  
  // Schedule note off
  const duration = hap.duration || 0.1;
  setTimeout(() => {
    output.send([0x80 + channel, note, 0]);
  }, duration * 1000);
};

// Usage
note("c3 e3 g3")
  .midi()
  .aftertouch("0.5 0.7 0.9")
```

### 2. Implementing MIDI Learn (5-7 minutes)

#### Task Checklist
- [ ] Create learn mode system
- [ ] Capture incoming MIDI
- [ ] Map to pattern parameters
- [ ] Store/recall mappings
- [ ] Handle multiple devices
- [ ] Provide UI feedback

#### Example: CC Learn System
```javascript
// MIDI learn manager
class MidiLearnManager {
  constructor() {
    this.mappings = new Map();
    this.learning = null;
    this.enabled = false;
  }
  
  startLearn(paramName) {
    this.learning = paramName;
    this.enabled = true;
    
    // Listen for next CC
    return new Promise((resolve) => {
      const handler = (msg) => {
        if (msg[0] >= 0xB0 && msg[0] <= 0xBF) {
          const channel = msg[0] - 0xB0;
          const cc = msg[1];
          
          this.mappings.set(paramName, {
            channel,
            cc,
            min: 0,
            max: 1
          });
          
          this.learning = null;
          this.enabled = false;
          resolve({ channel, cc });
        }
      };
      
      // Temporary handler
      this.tempHandler = handler;
    });
  }
  
  getValue(paramName) {
    const mapping = this.mappings.get(paramName);
    if (!mapping) return null;
    
    // Return current CC value
    return this.ccValues.get(`${mapping.channel}-${mapping.cc}`) || 0;
  }
  
  handleMessage(msg) {
    if (this.tempHandler && this.enabled) {
      this.tempHandler(msg);
      return;
    }
    
    // Update CC values
    if (msg[0] >= 0xB0 && msg[0] <= 0xBF) {
      const channel = msg[0] - 0xB0;
      const cc = msg[1];
      const value = msg[2] / 127;
      
      this.ccValues.set(`${channel}-${cc}`, value);
    }
  }
}

// Pattern integration
const learn = new MidiLearnManager();

// Learn CC for cutoff
await learn.startLearn('cutoff');

// Use in pattern
note("c3 e3 g3")
  .s("sawtooth")
  .cutoff(() => learn.getValue('cutoff') * 2000 || 1000)
```

### 3. Adding MIDI File Export (6-8 minutes)

#### Task Checklist
- [ ] Query pattern for events
- [ ] Convert to MIDI format
- [ ] Calculate timing/tempo
- [ ] Generate valid MIDI file
- [ ] Handle multiple tracks
- [ ] Test with DAWs

#### Example: Basic MIDI File Export
```javascript
// MIDI file generator
class MidiFileWriter {
  constructor() {
    this.tracks = [];
    this.ticksPerQuarter = 480;
  }
  
  addTrack() {
    const track = [];
    this.tracks.push(track);
    return track;
  }
  
  writeVarLength(value) {
    const buffer = [];
    let byte = value & 0x7F;
    value >>= 7;
    
    while (value > 0) {
      buffer.unshift(byte | 0x80);
      byte = value & 0x7F;
      value >>= 7;
    }
    
    buffer.push(byte);
    return buffer;
  }
  
  addNoteOn(track, tick, channel, note, velocity) {
    track.push({
      tick,
      data: [0x90 + channel, note, velocity]
    });
  }
  
  addNoteOff(track, tick, channel, note) {
    track.push({
      tick,
      data: [0x80 + channel, note, 0]
    });
  }
  
  patternToMidi(pattern, duration = 4) {
    const track = this.addTrack();
    const events = pattern.queryArc(0, duration);
    
    events.forEach(hap => {
      const { note = 60, velocity = 100, channel = 0 } = hap.value;
      const startTick = Math.round(hap.whole.begin * this.ticksPerQuarter * 4);
      const endTick = Math.round(hap.whole.end * this.ticksPerQuarter * 4);
      
      this.addNoteOn(track, startTick, channel, note, velocity);
      this.addNoteOff(track, endTick, channel, note);
    });
    
    return this.toBytes();
  }
  
  toBytes() {
    const header = [
      0x4D, 0x54, 0x68, 0x64, // "MThd"
      0x00, 0x00, 0x00, 0x06, // Header length
      0x00, 0x01,             // Format 1
      0x00, this.tracks.length, // Track count
      (this.ticksPerQuarter >> 8) & 0xFF,
      this.ticksPerQuarter & 0xFF
    ];
    
    // Build file...
    return new Uint8Array(header);
  }
}

// Export pattern
const exporter = new MidiFileWriter();
const midiData = exporter.patternToMidi(
  note("c3 e3 g3 c4").slow(2),
  8 // 8 beats
);

// Download file
const blob = new Blob([midiData], { type: 'audio/midi' });
const url = URL.createObjectURL(blob);
downloadFile(url, 'pattern.mid');
```

### 4. Improving MIDI Timing (4-5 minutes)

#### Task Checklist
- [ ] Analyze timing jitter
- [ ] Implement timestamp scheduling
- [ ] Add latency compensation
- [ ] Test with various devices
- [ ] Document timing settings

#### Example: Precision MIDI Scheduling
```javascript
// Enhanced MIDI scheduler with timestamps
class PrecisionMidiScheduler {
  constructor(output, latency = 0) {
    this.output = output;
    this.latency = latency;
    this.scheduled = new Map();
  }
  
  schedule(events, baseTime) {
    const now = performance.now() / 1000;
    
    events.forEach(event => {
      const scheduledTime = baseTime + event.whole.begin.valueOf();
      const timestamp = (scheduledTime - now + this.latency) * 1000;
      
      if (timestamp > 0) {
        // Future event - use timestamp
        this.scheduleWithTimestamp(event, timestamp);
      } else {
        // Immediate event
        this.sendNow(event);
      }
    });
  }
  
  scheduleWithTimestamp(event, timestamp) {
    const { note, velocity = 100, channel = 0 } = event.value;
    const duration = event.duration * 1000;
    
    // Note on with timestamp
    this.output.send(
      [0x90 + channel, note, velocity],
      performance.now() + timestamp
    );
    
    // Note off with timestamp
    this.output.send(
      [0x80 + channel, note, 0],
      performance.now() + timestamp + duration
    );
  }
  
  sendNow(event) {
    const { note, velocity = 100, channel = 0 } = event.value;
    
    // Send immediately
    this.output.send([0x90 + channel, note, velocity]);
    
    // Schedule note off
    setTimeout(() => {
      this.output.send([0x80 + channel, note, 0]);
    }, event.duration * 1000);
  }
}

// Use precision scheduler
const scheduler = new PrecisionMidiScheduler(midiOutput, 0.005);
scheduler.schedule(pattern.queryArc(0, 1), audioContext.currentTime);
```

## Testing Strategies

### Unit Test Patterns
```javascript
describe('midi', () => {
  let mockOutput;
  
  beforeEach(() => {
    mockOutput = {
      send: jest.fn(),
      name: 'Mock MIDI'
    };
  });
  
  it('sends correct note messages', () => {
    const events = note("c3").midi().queryArc(0, 1);
    sendMidiEvent(events[0], mockOutput, 0);
    
    expect(mockOutput.send).toHaveBeenCalledWith([0x90, 60, 100]);
  });
  
  it('respects MIDI channel', () => {
    const events = note("c3").midi().midichan(10).queryArc(0, 1);
    sendMidiEvent(events[0], mockOutput, 9); // Channel 10 = index 9
    
    expect(mockOutput.send).toHaveBeenCalledWith([0x99, 60, 100]);
  });
});
```

### Integration Testing
```javascript
// Test with virtual MIDI
it('sends to correct device', async () => {
  const devices = await WebMidiOut.outputs();
  const virtualDevice = devices.find(d => d.name.includes('Virtual'));
  
  if (virtualDevice) {
    const pattern = note("c3 e3 g3").midi(virtualDevice.name);
    // Monitor virtual device for messages
  }
});
```

## Common Validation Errors

### 1. No MIDI Access
```
Error: navigator.requestMIDIAccess is not a function
Fix: Check browser support, use HTTPS
```

### 2. Device Not Found
```
Error: MIDI output 'My Device' not found
Fix: List available devices, check connections
```

### 3. Invalid MIDI Data
```
Error: Invalid MIDI message
Fix: Validate data ranges (0-127), message format
```

### 4. Permission Denied
```
Error: DOMException: Permission denied
Fix: Handle permission flow, show user instructions
```

## Performance Considerations

### Message Optimization
1. **Batch Messages**: Group simultaneous events
2. **Reuse Connections**: Don't reconnect per event
3. **Throttle CCs**: Limit continuous controller rate
4. **Buffer Management**: Clear old scheduled events

### Timing Optimization
```javascript
// Efficient MIDI scheduling
const batchMidiEvents = (events) => {
  // Group by time
  const batches = events.reduce((acc, event) => {
    const time = event.whole.begin.valueOf();
    (acc[time] = acc[time] || []).push(event);
    return acc;
  }, {});
  
  // Send batches
  Object.entries(batches).forEach(([time, batch]) => {
    scheduleBatch(batch, parseFloat(time));
  });
};
```

## Integration Points

### With Pattern Engine
```javascript
// Pattern provides MIDI events
const pattern = note("c3 e3 g3")
  .midi()
  .midichan(1)
  .velocity("80 100 120");

// MIDI package sends them
pattern.queryArc(0, 1).forEach(sendMidiEvent);
```

### With Audio Output
```javascript
// Combine MIDI and audio
stack(
  // Hardware synth via MIDI
  note("c2 c2").midi('Bass Station'),
  
  // Software synth via WebAudio
  note("c4 e4 g4").s("sawtooth")
)
```

## Quick Debug Commands

```bash
# List MIDI devices (in browser console)
navigator.requestMIDIAccess().then(access => {
  access.outputs.forEach(output => console.log(output.name));
});

# Test MIDI output
# Send test note to first device
const access = await navigator.requestMIDIAccess();
const output = access.outputs.values().next().value;
output.send([0x90, 60, 100]); // Note on
setTimeout(() => output.send([0x80, 60, 0]), 1000); // Note off

# Monitor MIDI input
access.inputs.forEach(input => {
  input.onmidimessage = (msg) => console.log(msg.data);
});
```

## When to Escalate

Escalate to human review if:
- Web MIDI API changes needed
- Complex MIDI protocol features
- Timing precision issues
- Cross-platform compatibility
- Hardware-specific problems

Remember: MIDI is about precise timing and correct protocol implementation. Test with real devices whenever possible!