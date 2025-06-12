# Custom Synth Workflow

This workflow shows how to extend **superdough** with your own synthesiser implementations. The example below registers a simple additive `organ` synth.

## 1. Load Built-in Waveforms
```javascript
import { registerSynthSounds } from 'superdough';
registerSynthSounds(); // sine, square, sawtooth, triangle
```

## 2. Implement and Register Your Synth
Use `registerSound(name, handler[, options])` to add a sound. The handler
receives `(begin, params, onended)` and must return `{ node, stop(time) }`.

```javascript
import {
  registerSound,
  getAudioContext,
  gainNode,
  getADSRValues,
  getParamADSR,
  webAudioTimeout,
  midiToFreq
} from 'superdough';

registerSound('organ', (begin, params, onended) => {
  const ac = getAudioContext();
  const { duration, harmonics = [1, 0.5, 0.25, 0.125] } = params;
  const frequency = midiToFreq(params.note || 60);

  // mix sums partials; envGain controls the ADSR envelope
  const mix = gainNode(1);
  const envGain = gainNode(1);
  mix.connect(envGain);

  // create sine oscillators for each harmonic partial
  const voices = harmonics.map((amp, i) => {
    const osc = ac.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = frequency * (i + 1);
    osc.connect(gainNode(amp)).connect(mix);
    osc.start(begin);
    return osc;
  });

  const [attack, decay, sustain, release] = getADSRValues(
    [params.attack, params.decay, params.sustain, params.release],
    'linear',
    [0.01, 0.1, 0.8, 0.3]
  );
  const holdEnd = begin + duration;
  const end = holdEnd + release + 0.01;
  getParamADSR(envGain.gain, attack, decay, sustain, release, 0, 1, begin, holdEnd, 'linear');

  const timeout = webAudioTimeout(ac, () => {
    voices.forEach(o => o.disconnect());
    mix.disconnect();
    envGain.disconnect();
    onended();
  }, begin, end);

  return {
    node: envGain,
    stop: (when) => {
      timeout.stop(when);
      voices.forEach(o => o.stop(when));
    }
  };
}, { prebake: true, type: 'synth' });
```

## 3. Trigger the Synth

Once registered the instrument can be used like any other sound:

```javascript
superdough({ s: 'organ', note: 'c4', duration: 1 }, 0);

// via patterns
note('c3 e3 g3').s('organ');
```
