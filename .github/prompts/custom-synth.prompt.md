# Custom Synth Prompt Template

Create a new WebAudio synthesizer for the `superdough` engine.

## Synth Name
[NAME]

**Purpose**: [Describe what the instrument should sound like]

**Parameters**:
- `note` or `freq` – base pitch of the synth
- `duration` – note length in seconds
- `[extra]` – [Any additional parameters]

**Implementation Outline**:
1. Register the synth with `registerSound('[NAME]', handler, { type: 'synth', prebake: true })`.
2. Inside `handler(begin, params, onended)` build the WebAudio node graph using helpers such as `getAudioContext()` and `gainNode()`.
3. Shape the amplitude with `getADSRValues` and `getParamADSR`.
4. Return `{ node, stop(when) }` and disconnect all nodes in the cleanup.

**Example Skeleton**:
```javascript
import {
  registerSound,
  getAudioContext,
  gainNode,
  getADSRValues,
  getParamADSR,
  webAudioTimeout
} from 'superdough';

registerSound('[NAME]', (begin, params, onended) => {
  const ac = getAudioContext();
  const { duration } = params;

  // create oscillators and connect them
  const env = gainNode(1);
  const holdEnd = begin + duration;
  const [a, d, s, r] = getADSRValues([
    params.attack,
    params.decay,
    params.sustain,
    params.release
  ], 'linear', [0.01, 0.1, 0.8, 0.3]);
  getParamADSR(env.gain, a, d, s, r, 0, 1, begin, holdEnd, 'linear');

  const timeout = webAudioTimeout(ac, () => {
    // disconnect nodes here
    onended();
  }, begin, holdEnd + r + 0.01);

  return {
    node: env,
    stop(time) {
      timeout.stop(time);
      // stop oscillators
    }
  };
});
```

**Usage**:
```javascript
superdough({ s: '[NAME]', note: 'c4', duration: 1 }, 0);
```
