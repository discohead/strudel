# AGENTS.md - @strudel/osc

Quick reference for AI agents working with the OSC package.

## Quick Start

```javascript
// Validation steps:
// 1. Start OSC bridge server
// Run: pnpm osc

// 2. Test basic OSC output
s("bd sd").osc()  // Should send to SuperDirt

// 3. Check connection
// Look for WebSocket connection logs

// 4. Verify message format
s("bd").osc().log()  // Check OSC messages
```

## Package Context

**Purpose**: OSC communication for Strudel patterns
- Send events via OSC protocol
- Bridge to SuperCollider/SuperDirt
- WebSocket-based transport
- Custom message formatting

**Key Files**:
- `osc.mjs` - Main OSC output implementation
- `server.mjs` - Node.js OSC bridge server
- `test/*.test.mjs` - Message formatting tests

**References**:
- [CLAUDE.md](./CLAUDE.md) - Full package guide
- [OSC Protocol](https://opensoundcontrol.stanford.edu/) - OSC specification
- [SuperDirt Params](https://github.com/musikinformatik/SuperDirt) - Parameter reference

## Common Agent Tasks

### 1. Fix OSC Connection Issues
```javascript
// Problem: "OSC not connected" errors
// Solution: Ensure bridge is running and reconnect

// Start bridge server first
// Terminal: pnpm osc

// Add connection handling
const pattern = s("bd sd")
  .osc({
    onError: (err) => console.warn('OSC error:', err),
    reconnect: true
  });

// Test with simple pattern
s("bd").osc()  // Should hear in SuperCollider
```

### 2. Add Custom OSC Parameter
```javascript
// Add new parameter to OSC messages
// Example: Adding a custom 'texture' parameter

// In osc.mjs, modify formatMessage:
function formatMessage(event) {
  const params = [];
  
  // Existing params
  if (event.value.s) params.push('s', event.value.s);
  if (event.value.n) params.push('n', event.value.n);
  
  // Add new parameter
  if (event.value.texture) params.push('texture', event.value.texture);
  
  return {
    address: '/play2',
    args: params
  };
}

// Usage:
s("bd").texture(0.5).osc()
```

### 3. Implement Custom OSC Target
```javascript
// Send to non-SuperDirt software
// Example: Control Max/MSP patch

note("c3 e3 g3 c4")
  .osc({
    port: 8000,  // Max/MSP port
    format: (event) => ({
      address: '/synth/note',
      args: [
        { type: 'i', value: event.value.note || 60 },
        { type: 'f', value: event.value.velocity || 0.8 },
        { type: 'f', value: event.whole.duration }
      ]
    })
  });

// For multiple parameters
pattern.osc({
  format: (event) => [
    { address: '/filter/cutoff', args: [event.value.cutoff || 1000] },
    { address: '/filter/res', args: [event.value.resonance || 0] }
  ]
});
```

### 4. Debug OSC Message Flow
```javascript
// Add logging to debug OSC messages
// In osc.mjs:

export function osc(options = {}) {
  return this.withHap((hap) => {
    const msg = formatMessage(hap);
    
    // Debug logging
    if (options.debug) {
      console.log('OSC Message:', {
        address: msg.address,
        args: msg.args,
        time: hap.whole.begin.valueOf()
      });
    }
    
    sendOSC(msg);
    return hap;
  });
}

// Usage:
s("bd sd").osc({ debug: true })
```

## Testing Strategies

```javascript
// Test message formatting
test('formats SuperDirt messages correctly', () => {
  const event = {
    value: { s: 'bd', n: 0, gain: 0.8 }
  };
  
  const msg = formatMessage(event);
  
  expect(msg.address).toBe('/play2');
  expect(msg.args).toEqual(['s', 'bd', 'n', 0, 'gain', 0.8]);
});

// Test WebSocket mock
test('handles reconnection', async () => {
  const mockWS = {
    readyState: WebSocket.OPEN,
    send: jest.fn(),
    close: jest.fn()
  };
  
  const client = new OSCClient({ ws: mockWS });
  mockWS.readyState = WebSocket.CLOSED;
  
  await client.reconnect();
  expect(client.connected).toBe(true);
});

// Test timing accuracy
test('sends bundles with correct timestamps', () => {
  const events = pattern.queryArc(0, 1);
  const bundle = createBundle(events, 0.1); // 100ms latency
  
  bundle.messages.forEach((msg, i) => {
    expect(msg.time).toBeGreaterThan(events[i].whole.begin);
  });
});
```

## Common Validation Errors

### Connection Errors
```javascript
// Error: WebSocket connection failed
// Fix: Start OSC bridge server
// Run: pnpm osc

// Error: ECONNREFUSED 127.0.0.1:57120
// Fix: Start SuperCollider/SuperDirt
// In SuperCollider: SuperDirt.start

// Error: WebSocket not supported
// Fix: Use modern browser or Node.js
```

### Message Format Errors
```javascript
// Error: Invalid OSC argument type
// Fix: Use correct types
{ type: 'f', value: 1.5 }    // Float
{ type: 'i', value: 42 }      // Integer
{ type: 's', value: 'text' }  // String

// Error: Unknown parameter 'myParam'
// Fix: Use SuperDirt parameters or add to SynthDef
// Valid: s, n, gain, pan, speed, room, etc.
```

### Timing Issues
```javascript
// Problem: Events arrive late
// Fix: Use bundles with latency
.osc({ 
  bundle: true, 
  latency: 0.2  // 200ms lookahead
})

// Problem: Jittery timing
// Fix: Increase latency buffer
.osc({ latency: 0.3 })
```

## Performance Considerations

### Message Batching
```javascript
// Batch multiple events per cycle
// Reduces network overhead

// Instead of individual messages:
s("bd").osc()
s("sd").osc()

// Use stack for single output:
stack(
  s("bd"),
  s("sd")
).osc()
```

### Connection Pooling
```javascript
// Reuse WebSocket connections
const oscClient = new OSCClient();

// Share client across patterns
pattern1.osc({ client: oscClient });
pattern2.osc({ client: oscClient });
```

### Message Size
```javascript
// Keep messages small
// Avoid sending large arrays

// Bad: Sending waveform data
.osc({ waveform: new Float32Array(44100) })

// Good: Send reference
.osc({ waveformId: 'sine' })
```

## Integration Points

### With SuperDirt
```javascript
// Standard integration
s("bd sd cp sd")
  .speed(1.5)
  .room(0.5)
  .osc()

// Multiple orbits
stack(
  s("bd*4").orbit(0),
  s("hh*8").orbit(1)
).osc()
```

### With Custom Software
```javascript
// Processing sketch
pattern.osc({
  port: 12000,
  format: (e) => ({
    address: '/visual/trigger',
    args: [e.value.s, e.value.gain]
  })
});

// Max/MSP patch
note("c3 e3 g3").osc({
  port: 7400,
  address: '/note'
});
```

### With MIDI (Hybrid Setup)
```javascript
// OSC for audio, MIDI for control
stack(
  s("bd sd").osc(),           // To SuperDirt
  cc(74, sine).midi()         // To MIDI device
);
```

## Quick Debug Commands

```bash
# Check if OSC bridge is running
ps aux | grep "osc"

# Test OSC bridge directly
echo '{"address":"/test","args":[1,2,3]}' | websocat ws://localhost:8080

# Monitor OSC traffic (requires oscdump)
oscdump 57120

# Debug mode bridge
DEBUG=* pnpm osc

# Custom ports
OSC_PORT=9999 WS_PORT=8081 pnpm osc
```

## When to Escalate

Escalate to package maintainers when:

1. **Protocol Issues**: Need to support OSC 1.1 features or binary blobs
2. **Transport Changes**: Adding TCP support or native UDP (browser limitation)
3. **Bridge Architecture**: Major changes to Node.js bridge design
4. **Performance**: Latency issues that can't be fixed with buffering
5. **New Targets**: Adding built-in support for specific software (Ableton Link, etc.)

For pattern-related issues, check @strudel/core first.
For effect parameters, check with SuperDirt documentation.