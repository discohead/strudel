# CLAUDE.md - @strudel/osc

This file provides guidance to Claude Code when working with the OSC (Open Sound Control) package.

## Package Purpose

`@strudel/osc` provides OSC communication for Strudel:
- Send pattern events via OSC protocol
- Bridge to SuperCollider/SuperDirt
- Network communication with other software
- Custom OSC message formatting
- WebSocket-based OSC transport
- Tidal compatibility mode

## Key APIs and Functions

### OSC Output
```javascript
import { osc } from '@strudel/osc';

// Send to default SuperDirt
sound("bd sd").osc()

// Custom OSC target
pattern.osc({
  port: 57120,
  host: 'localhost',
  protocol: 'ws'  // WebSocket
})

// Custom message format
pattern.osc({
  format: (event) => ({
    address: '/play',
    args: [event.value.s, event.value.n]
  })
})
```

### SuperDirt Integration
```javascript
// Standard SuperDirt output
s("bd sd cp sd")
  .speed(1.5)
  .room(0.5)
  .osc()  // Sends to SuperDirt

// All SuperDirt effects work
pattern
  .crush(4)
  .delay(0.5)
  .pan(sine.range(0, 1))
  .osc()
```

### OSC Server
```javascript
// Start OSC bridge server
// npm run osc

// Receives WebSocket → forwards UDP
// Default: ws://localhost:8080 → osc://localhost:57120
```

## Common Usage Patterns

### Basic SuperDirt
```javascript
// Simple drums
s("bd*4 [sd cp]").osc()

// With effects
s("bd sd")
  .speed("<1 2 0.5>")
  .room(0.5)
  .delay(0.25)
  .osc()

// Multiple orbits
stack(
  s("bd*4").orbit(0),
  s("arpy*8").orbit(1).delay(0.5),
  s("cp").orbit(2).room(0.9)
).osc()
```

### Custom OSC Messages
```javascript
// Custom formatting
pattern.osc({
  format: (event) => {
    const { value, whole } = event;
    return {
      address: '/trigger',
      args: [
        value.note || 60,
        value.velocity || 100,
        whole.duration
      ]
    };
  }
});

// Multiple addresses
pattern.osc({
  format: (event) => [
    { address: '/note', args: [event.value.note] },
    { address: '/amp', args: [event.value.gain] }
  ]
});
```

### OSC Bundles
```javascript
// Time-tagged bundles
pattern.osc({
  bundle: true,
  latency: 0.1  // 100ms lookahead
});

// Ensures accurate timing
// for network transmission
```

## Development Guidelines

### Adding OSC Features
1. Define message format
2. Handle WebSocket connection
3. Implement reconnection logic
4. Support both UDP and WebSocket
5. Test with common OSC software

### OSC Implementation Pattern
```javascript
// Create OSC client
class OSCClient {
  constructor(options) {
    this.port = options.port || 57120;
    this.host = options.host || 'localhost';
    this.ws = null;
    this.connect();
  }
  
  connect() {
    this.ws = new WebSocket(`ws://${this.host}:8080`);
    this.ws.on('open', () => this.onConnect());
    this.ws.on('close', () => this.reconnect());
  }
  
  send(address, args) {
    const msg = { address, args };
    this.ws.send(JSON.stringify(msg));
  }
}
```

### Message Format
```javascript
// Standard OSC message
{
  address: '/play2',  // SuperDirt address
  args: [
    's', 'bd',        // String args
    'n', 0,           // Numeric args
    'gain', 0.8,
    'pan', 0.5
  ]
}

// Flattened for SuperDirt
['/play2', 's', 'bd', 'n', 0, 'gain', 0.8]
```

## Testing Requirements

### Testing Approach
- Mock WebSocket connections
- Test message formatting
- Verify argument types
- Check timing accuracy

### Test Examples
```javascript
// Test message format
test('formats SuperDirt message', () => {
  const event = { value: { s: 'bd', n: 0 } };
  const msg = formatMessage(event);
  expect(msg.address).toBe('/play2');
  expect(msg.args).toContain('bd');
});

// Test connection handling
test('reconnects on disconnect', async () => {
  const client = new OSCClient();
  client.ws.close();
  await sleep(1000);
  expect(client.ws.readyState).toBe(WebSocket.OPEN);
});
```

## Dependencies and Relationships

### Server Component
- Node.js OSC bridge server
- Converts WebSocket to UDP
- Required for SuperDirt

### Dependencies
- `ws` - WebSocket client
- `osc` - OSC protocol (server)
- No browser dependencies

### Integration Points
- Works with any OSC software
- Primary target: SuperDirt
- Can control: Max/MSP, PD, etc.

## Common Pitfalls

### Connection Issues
```javascript
// Must start OSC bridge
// Run: npm run osc

// Check connection
if (!oscClient.connected) {
  console.warn('OSC not connected');
}

// Handle reconnection
oscClient.on('disconnect', () => {
  setTimeout(() => oscClient.connect(), 1000);
});
```

### Message Timing
```javascript
// OSC doesn't guarantee timing
// Use bundles for accuracy

// Without bundles - may drift
.osc()

// With bundles - better timing
.osc({ bundle: true, latency: 0.2 })
```

### Argument Types
```javascript
// OSC is typed - be careful
{ 
  address: '/test',
  args: [
    { type: 'f', value: 1.5 },    // Float
    { type: 'i', value: 42 },      // Integer
    { type: 's', value: 'hello' }  // String
  ]
}

// Auto-detection usually works
// But explicit types are safer
```

### SuperDirt Compatibility
```javascript
// SuperDirt expects specific format
// Parameter names must match

// Good - SuperDirt understands
.s('bd').n(0).gain(0.8)

// Bad - unknown parameter
.s('bd').myParam(5)  // Ignored by SuperDirt

// Add to SuperDirt with custom SynthDef
```

## Integration Examples

### With SuperCollider
```javascript
// Basic SuperDirt setup
s("bd sd hh cp")
  .sometimes(fast(2))
  .speed("<1 2 0.5>")
  .room(0.3)
  .osc()

// Live coding pattern
stack(
  s("bd*4").gain(0.9),
  s("~ sd ~ sd").delay(0.5),
  s("hh*8").gain(0.6).pan(sine)
).osc()
```

### Custom Synth Control
```javascript
// Control custom SuperCollider synth
note("c3 e3 g3")
  .osc({
    format: (event) => ({
      address: '/MySynth/play',
      args: {
        freq: midiToFreq(event.value.note),
        amp: event.value.gain || 0.5,
        dur: event.duration
      }
    })
  })
```

### Multi-Software Setup
```javascript
// Send to multiple targets
const targets = [
  { port: 57120 }, // SuperDirt
  { port: 8000 },  // Processing
  { port: 9000 }   // Max/MSP
];

pattern.forEach(target => 
  pattern.osc(target)
);
```

## OSC Bridge Reference

### Starting the Bridge
```bash
# Default settings
pnpm run osc

# Custom ports
OSC_PORT=9999 WS_PORT=8081 pnpm run osc

# Verbose logging
DEBUG=* pnpm run osc
```

### Bridge Configuration
```javascript
// Default bridge settings
{
  wsPort: 8080,      // WebSocket port
  oscPort: 57120,    // UDP OSC port  
  oscHost: '127.0.0.1',
  reconnect: true,
  reconnectInterval: 1000
}
```

### Message Flow
```
Browser → WebSocket → Bridge → UDP → SuperDirt
  ↓         ↓           ↓        ↓        ↓
Pattern   Port 8080   Node.js  Port 57120  SC
```

## SuperDirt Parameters

### Sound Control
- `s` - Sound/sample name
- `n` - Sample number/variant
- `gain` - Volume (0-1)
- `pan` - Stereo position (0-1)
- `speed` - Playback rate
- `begin` - Sample start (0-1)
- `end` - Sample end (0-1)

### Effects
- `room` - Reverb amount
- `size` - Reverb size
- `delay` - Delay send
- `delaytime` - Delay time
- `delayfeedback` - Delay feedback
- `crush` - Bit crushing
- `coarse` - Sample rate reduction
- `lpf` - Low-pass filter
- `hpf` - High-pass filter
- `vowel` - Vowel filter

### Envelopes
- `attack` - Attack time
- `release` - Release time
- `hold` - Hold time
- `tremolo` - Tremolo depth
- `vibrato` - Vibrato depth

### Control
- `orbit` - Effect bus (0-11)
- `cut` - Cut group
- `unit` - Time unit (c/s/r)