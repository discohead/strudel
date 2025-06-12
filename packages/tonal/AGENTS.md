# AGENTS.md - @strudel/tonal

Quick reference for AI agents working with the musical theory package.

## Quick Start

```javascript
// Validation steps:
// 1. Test scale generation
import { scale } from '@strudel/tonal';

note(scale('C:major')); // Should give C D E F G A B

// 2. Test chord functions
chord("C").note(); // Should give C E G

// 3. Test voicing
chord("<C F G>").voicing();
// Should create smooth voice leading

// 4. Test scale transposition
n("0 2 4").scale("D:minor");
// Should give D F A
```

## Package Context

**Purpose**: Musical theory functions for Strudel
- Scale and chord generation
- Note parsing and manipulation
- Voice leading algorithms
- Key and mode functions
- Integration with tonal.js
- iReal Pro chart parsing

**Key Files**:
- `tonal.mjs` - Main exports and Pattern methods
- `voicing.mjs` - Voice leading algorithms
- `ireal.mjs` - iReal Pro parser
- `scales.mjs` - Scale definitions
- `chords.mjs` - Chord parsing

**References**:
- [CLAUDE.md](./CLAUDE.md) - Full package guide
- [Tonal.js Docs](https://github.com/tonaljs/tonal) - Theory library
- [Music Theory](https://www.musictheory.net/) - Theory reference

## Common Agent Tasks

### 1. Add Custom Scale
```javascript
// Add a new scale type to Strudel
// Example: Hungarian minor scale

import { Scale } from 'tonal';
import { register } from '@strudel/core';

// Define the scale intervals
const hungarianMinor = {
  name: 'hungarian minor',
  intervals: ['1P', '2M', '3m', '4A', '5P', '6m', '7M'],
  aliases: ['hungarian', 'gypsy'],
  chroma: '101101101011'
};

// Register with tonal.js
Scale.add(hungarianMinor);

// Add to Strudel's scale function
export const hungarianScale = register('hungarianScale', (pat) => {
  return pat.scale('hungarian minor');
});

// Usage:
note("0 1 2 3 4 5 6 7").scale("C:hungarian minor");
// Or after adding to scale list:
note(scale("C:hungarian minor"));

// Test the scale
const notes = Scale.get("C hungarian minor").notes;
console.log(notes); // C D Eb F# G Ab B
```

### 2. Implement Chord Inversion Function
```javascript
// Add function to get specific chord inversions
// Useful for bass lines and voice leading

export const inversion = register('inversion', (n, pat) => {
  return pat.withValue((value) => {
    // Parse the chord
    const chordNotes = Chord.get(value).notes;
    if (!chordNotes.length) return value;
    
    // Calculate inversion (0 = root position)
    const inversionNum = Math.abs(n) % chordNotes.length;
    
    // Rotate notes
    const inverted = [];
    for (let i = 0; i < chordNotes.length; i++) {
      const idx = (i + inversionNum) % chordNotes.length;
      let note = chordNotes[idx];
      
      // Adjust octave for proper inversion
      if (i < inversionNum) {
        note = Note.transpose(note, '8P');
      }
      inverted.push(note);
    }
    
    return inverted;
  });
});

// Usage:
chord("C").inversion(0).note(); // C E G (root position)
chord("C").inversion(1).note(); // E G C (1st inversion)
chord("C").inversion(2).note(); // G C E (2nd inversion)

// With progression:
chord("<C F G>").inversion("<0 1 0>").voicing();
```

### 3. Create Chord Progression Generator
```javascript
// Generate chord progressions in different styles
// Based on common patterns

export const progression = register('progression', (style, key, pat) => {
  const progressions = {
    pop: ['I', 'V', 'vi', 'IV'],        // C G Am F
    jazz: ['IIM7', 'V7', 'IM7'],        // Dm7 G7 Cmaj7
    blues: ['I7', 'I7', 'I7', 'I7',     // 12-bar blues
            'IV7', 'IV7', 'I7', 'I7',
            'V7', 'IV7', 'I7', 'V7'],
    folk: ['I', 'IV', 'I', 'V'],        // C F C G
    rock: ['I', 'bVII', 'IV', 'I'],     // C Bb F C
    minor: ['i', 'iv', 'v', 'i']        // Cm Fm Gm Cm
  };
  
  const pattern = progressions[style];
  if (!pattern) throw new Error(`Unknown progression style: ${style}`);
  
  return pat.withValue(() => {
    // Convert Roman numerals to chords in key
    const chords = RomanNumeral.progressionInKey(key, pattern);
    return sequence(...chords.map(c => c.symbol));
  });
});

// Usage:
chord("").progression('pop', 'C'); // C G Am F
chord("").progression('jazz', 'G'); // Am7 D7 Gmaj7
chord("").progression('blues', 'E'); // Full 12-bar blues in E

// With rhythm:
chord("").progression('pop', 'C')
  .struct("t(3,8)")
  .voicing()
  .s("piano");
```

### 4. Fix Voice Leading Issues
```javascript
// Improve voice leading algorithm for smoother transitions
// Minimizes movement between chord voices

import { Voicing } from 'tonal';

export const smoothVoicing = register('smoothVoicing', (options = {}, pat) => {
  let lastVoicing = null;
  
  return pat.withValue((value) => {
    const chord = Chord.get(value);
    if (!chord.notes.length) return value;
    
    const {
      range = ['C3', 'C5'],
      anchor = null,
      voices = 4
    } = options;
    
    // Get possible voicings
    const voicings = Voicing.search(chord.symbol, range);
    
    if (!lastVoicing) {
      // First chord - pick closest to middle of range
      const middle = (Note.midi(range[0]) + Note.midi(range[1])) / 2;
      lastVoicing = voicings.reduce((best, v) => {
        const vMidi = v.reduce((sum, n) => sum + Note.midi(n), 0) / v.length;
        const bMidi = best.reduce((sum, n) => sum + Note.midi(n), 0) / best.length;
        return Math.abs(vMidi - middle) < Math.abs(bMidi - middle) ? v : best;
      });
    } else {
      // Find voicing with minimum movement
      lastVoicing = voicings.reduce((best, v) => {
        const movement = v.reduce((sum, note, i) => {
          const lastNote = lastVoicing[i] || lastVoicing[0];
          return sum + Math.abs(Note.midi(note) - Note.midi(lastNote));
        }, 0);
        
        const bestMovement = best.reduce((sum, note, i) => {
          const lastNote = lastVoicing[i] || lastVoicing[0];
          return sum + Math.abs(Note.midi(note) - Note.midi(lastNote));
        }, 0);
        
        return movement < bestMovement ? v : best;
      });
    }
    
    return lastVoicing;
  });
});

// Usage:
chord("<C Am F G>").smoothVoicing({
  range: ['C3', 'G4'],
  voices: 4
}).note().s("piano");
```

## Testing Strategies

```javascript
// Test scale generation
test('generates correct scale notes', () => {
  const major = scale('C:major');
  expect(major).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
  
  const minor = scale('A:minor');
  expect(minor).toEqual(['A', 'B', 'C', 'D', 'E', 'F', 'G']);
});

// Test chord parsing
test('parses chord symbols', () => {
  const c = chord('Cmaj7');
  expect(c.firstCycle()[0].value).toEqual(['C', 'E', 'G', 'B']);
  
  const d = chord('Dm7b5');
  expect(d.firstCycle()[0].value).toEqual(['D', 'F', 'Ab', 'C']);
});

// Test voicing movement
test('minimizes voice movement', () => {
  const progression = chord("<C F G>").voicing();
  const events = progression.firstCycle();
  
  // Calculate total movement
  let totalMovement = 0;
  for (let i = 1; i < events.length; i++) {
    const prev = events[i-1].value.map(Note.midi);
    const curr = events[i].value.map(Note.midi);
    
    curr.forEach((note, j) => {
      if (prev[j]) {
        totalMovement += Math.abs(note - prev[j]);
      }
    });
  }
  
  expect(totalMovement).toBeLessThan(24); // Reasonable threshold
});

// Test scale transposition
test('transposes scale degrees', () => {
  const pattern = n("0 2 4").scale("D:dorian");
  const notes = pattern.firstCycle().map(e => e.value);
  
  expect(notes).toEqual([
    Note.get('D3').midi,
    Note.get('F3').midi,
    Note.get('G3').midi
  ]);
});
```

## Common Validation Errors

### Scale Errors
```javascript
// Error: Unknown scale
// Fix: Check scale name format
scale("C major");     // Wrong - missing colon
scale("C:major");     // Correct

// Error: Invalid root note
scale("c:major");     // Wrong - lowercase
scale("C:major");     // Correct
scale("C#:major");    // Correct
scale("Db:major");    // Also correct

// Error: Scale not found
// Fix: Check available scales
console.log(Scale.names()); // List all scales
```

### Chord Errors
```javascript
// Error: Invalid chord symbol
// Fix: Use standard notation
chord("CMajor7");     // Wrong
chord("Cmaj7");       // Correct

// Error: No notes in chord
// Fix: Check chord validity
const c = Chord.get("Xyz");
if (!c.notes.length) {
  console.error("Invalid chord");
}
```

### Voicing Errors
```javascript
// Error: No valid voicing found
// Fix: Adjust constraints
.voicing({ range: ["C4", "E4"] }); // Too narrow
.voicing({ range: ["C3", "C5"] }); // Better

// Error: Too many notes for range
chord("C13#11").voicing({ notes: 7, range: ["C4", "C5"] });
// Fix: Reduce notes or expand range
```

## Performance Considerations

### Scale Caching
```javascript
// Cache generated scales
const scaleCache = new Map();

function getCachedScale(name) {
  if (!scaleCache.has(name)) {
    scaleCache.set(name, Scale.get(name).notes);
  }
  return scaleCache.get(name);
}
```

### Voicing Optimization
```javascript
// Pre-calculate voicings for common chords
const voicingCache = new Map();

function getVoicing(chord, lastVoicing) {
  const key = `${chord}-${lastVoicing?.join(',')}`;
  
  if (!voicingCache.has(key)) {
    const voicing = calculateVoicing(chord, lastVoicing);
    voicingCache.set(key, voicing);
  }
  
  return voicingCache.get(key);
}
```

### Batch Processing
```javascript
// Process multiple notes at once
function batchTranspose(notes, interval) {
  return notes.map(n => Note.transpose(n, interval));
}

// Instead of individual calls
pattern.withValue(v => batchTranspose(v, '3M'));
```

## Integration Points

### With Pattern System
```javascript
// Tonal functions return values
// Pattern system handles timing

note(scale("C:major"))  // Notes at default time
  .struct("t(5,8)")     // Apply rhythm
  .slow(2);             // Stretch timing

// Chord patterns
chord("<C F G>")        // Chord sequence
  .voicing()            // Apply voicing
  .arpeggiate(4);       // Break into notes
```

### With MIDI Output
```javascript
// Convert note names to MIDI
note(scale("C:major"))
  .withValue(n => Note.midi(n + "4")) // Add octave
  .midi();

// Chord to MIDI notes
chord("Cmaj7")
  .voicing({ range: ["C3", "C5"] })
  .note()
  .midi();
```

### With Synthesis
```javascript
// Musical patterns to synthesis
note(scale("C:minor pentatonic"))
  .s("sawtooth")
  .cutoff(perlin.range(500, 2000))
  .resonance(10);

// Chord pads
chord("<Cm7 Fm7 Gm7>")
  .voicing()
  .s("pad")
  .attack(0.5)
  .release(2);
```

## Quick Debug Commands

```javascript
// List available scales
console.log(Scale.names());

// Check scale notes
console.log(Scale.get("C:lydian"));

// List chord types
console.log(ChordType.names());

// Analyze chord
console.log(Chord.get("C7#11"));

// Test note parsing
console.log(Note.get("C#4"));

// Check intervals
console.log(Interval.distance("C", "G")); // 5P

// Debug voicing
const voicing = Voicing.get("Cmaj7");
console.log(voicing);
```

## When to Escalate

Escalate to package maintainers when:

1. **Theory Errors**: Incorrect scale/chord definitions in tonal.js
2. **Algorithm Issues**: Voice leading produces bad results
3. **Performance**: Theory calculations cause noticeable lag
4. **New Features**: Adding microtonal support or non-Western scales
5. **Integration**: Breaking changes in tonal.js updates

For pattern-related issues, check @strudel/core first.
For playback issues, verify with @strudel/webaudio or @strudel/midi.