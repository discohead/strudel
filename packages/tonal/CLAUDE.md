# CLAUDE.md - @strudel/tonal

This file provides guidance to Claude Code when working with the musical theory package.

## Package Purpose

`@strudel/tonal` provides musical functions for Strudel:
- Scale and chord generation
- Note name parsing and manipulation
- Voicing algorithms for realistic chord inversions
- Key and mode functions
- Interval calculations
- Integration with tonal.js library
- iReal Pro chord chart parsing

## Key APIs and Functions

### Scale Functions
```javascript
import { scale, scaleTranspose } from '@strudel/tonal';

// Generate scale pattern
note(scale('C major'))          // C D E F G A B
note(scale('D dorian'))         // D E F G A Bb C
note(scale('G mixolydian'))     // G A B C D E F

// Scale transposition
n("0 2 4 7").scaleTranspose("C:major")  // I III V VII degrees
```

### Chord Functions
```javascript
import { chord, voicing } from '@strudel/tonal';

// Basic chords
note(chord('C'))          // C major triad
note(chord('Dm7'))        // D minor 7th
note(chord('G7b9'))       // G dominant 7 flat 9

// Chord voicings
chord("C").voicing()      // Smart voice leading
voicing("C E G")          // Specific voicing
```

### Note Functions
```javascript
// Note name manipulation
note("c").add(12)         // Up octave
note("c").transpose(7)    // Up perfect 5th

// Note parsing
parseNote("C#4")          // { pc: "C#", oct: 4 }
toMidi("C4")              // 60
```

### Progression Functions
```javascript
// Chord progressions
progression("C", ["I", "vi", "IV", "V"])  // C Am F G

// Mode progressions
progression("C:minor", ["i", "iv", "v"])  // Cm Fm Gm
```

## Common Usage Patterns

### Scale Patterns
```javascript
// Basic scale usage
note(scale("C:major")).slow(2)

// Scale modes
note(scale("C:dorian"))
note(scale("C:phrygian"))
note(scale("C:lydian"))

// Exotic scales
note(scale("C:melodic minor"))
note(scale("C:harmonic minor"))
note(scale("C:whole tone"))
```

### Chord Progressions
```javascript
// Common progressions
chord("<C Am F G>")           // I-vi-IV-V
chord("<Dm7 G7 Cmaj7>")      // ii-V-I

// With voicings
chord("<C Am F G>").voicing()  // Smooth voice leading

// Jazz changes
chord("<Cmaj7 A7 Dm7 G7>").voicing()
```

### Melodic Patterns
```javascript
// Scale degrees
n("0 2 4 5 7").scale("C:major")     // C E G A B
n("0 2 4 5 7").scale("C:minor")     // C Eb G Ab B

// Arpeggios  
n("0 2 4").chord("Cmaj7")            // C E G
n("0 2 4 6").chord("Dm7")            // D F A C
```

### Voice Leading
```javascript
// Automatic voice leading
chord("<C F G C>")
  .voicing()           // Smooth transitions
  .note()             // Convert to notes
  .s("piano")

// Custom voicing constraints
chord("C").voicing({
  anchor: "C4",        // Keep C4 as bass
  range: ["C3", "C5"], // Note range
  notes: 4             // Number of notes
})
```

## Development Guidelines

### Adding Musical Functions
1. Use tonal.js for theory calculations
2. Register function with Pattern prototype
3. Support both note names and numbers
4. Handle octave information properly
5. Document scale/chord names

### Function Template
```javascript
// Add new scale type
export const myScale = register('myScale', (scale, pat) => {
  return pat.withValue(v => {
    const intervals = getMyScaleIntervals(scale);
    const root = parseNote(v);
    return intervals.map(i => transpose(root, i));
  });
});
```

### Integration Pattern
```javascript
// Wrap tonal.js functions
import { Scale } from 'tonal';

export const strudelScale = (name) => {
  const scale = Scale.get(name);
  if (!scale.intervals.length) {
    throw new Error(`Unknown scale: ${name}`);
  }
  return scale.intervals;
};
```

## Testing Requirements

### Test Cases
```javascript
// Scale generation
test('major scale', () => {
  const notes = scale('C major');
  expect(notes).toEqual(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
});

// Chord voicing
test('voice leading', () => {
  const voiced = voicing(['C', 'E', 'G']);
  // Should minimize movement
});

// Transposition
test('scale transpose', () => {
  const pattern = n("0 2 4").scaleTranspose("D:dorian");
  expect(pattern.firstCycle()).toContainNotes(['D', 'F', 'G']);
});
```

## Dependencies and Relationships

### External Dependencies
- `tonal` - Music theory library
- Provides scale/chord definitions
- Handles interval calculations

### Internal Integration
- `@strudel/core` - Pattern engine
- Extends Pattern prototype
- Works with note/n functions

### Used By
- User patterns for musical content
- Educational examples
- Musical applications

## Common Pitfalls

### Octave Handling
```javascript
// Note names need octave for MIDI
note("C")        // Needs octave: "C4"
note("C4")       // Correct: MIDI 60

// Scale returns note names without octaves
scale("C major") // ["C", "D", "E", ...]
// Must add octave for playback
note(scale("C major").add(48))  // C4 scale
```

### Scale Name Format
```javascript
// Correct formats
scale("C:major")      // Root:quality
scale("D:dorian")     // Root:mode
scale("Eb:minor")     // Flats ok

// Common mistakes
scale("C major")      // Missing colon
scale("Cmajor")       // No separator
scale("c:major")      // Lowercase root
```

### Voicing Constraints
```javascript
// Voicings have limits
chord("C13#11").voicing()  // Many notes!
// May need to constrain:
.voicing({ notes: 4 })     // Limit voices

// Range matters
.voicing({ range: ["C3", "C5"] })
// Too narrow = repeated notes
// Too wide = unnatural spacing
```

## Integration Examples

### With Patterns
```javascript
// Melodic sequence
n("0 2 4 5 4 2 0")
  .scale("C:minor")
  .s("piano")

// Chord rhythm
chord("<C Am F G>")
  .voicing()
  .struct("t(5,8)")
  .s("piano")
```

### With Mini Notation
```javascript
// After registration
"0 2 4".scale("C:major")
"<C Am F G>".voicing()

// In sequences
stack(
  "0 2 4 5".scale("C:major").s("piano"),
  "<C F G>".voicing().s("strings")
)
```

### Jazz Example
```javascript
// Jazz standard changes
chord("<Dm7 G7 Cmaj7 %> <Em7 A7 Dm7 G7>")
  .voicing({ 
    anchor: "C3",
    range: ["C3", "C5"]
  })
  .s("epiano")
  .room(0.3)
```

## Musical Reference

### Available Scales
```javascript
// Common scales
"major", "minor", "melodic minor", "harmonic minor"
"dorian", "phrygian", "lydian", "mixolydian", "locrian"
"whole tone", "diminished", "augmented"
"pentatonic", "blues", "bebop"

// Format: "root:scale"
"C:major", "D:dorian", "Eb:blues"
```

### Chord Symbols
```javascript
// Triads
"C", "Cm", "Cdim", "Caug"

// 7th chords  
"Cmaj7", "C7", "Cm7", "Cm7b5", "Cdim7"

// Extensions
"C9", "C11", "C13"
"Cmaj9", "Cmaj11", "Cmaj13"

// Alterations
"C7b9", "C7#9", "C7b13", "C7#11"
```

### Voicing Options
```javascript
{
  anchor: "C4",           // Fixed bass note
  range: ["C3", "C6"],   // Note range
  notes: 4,              // Voice count
  rootless: false,       // Include root
  topNote: "E5",         // Fixed top note
  bottomNote: "C3",      // Fixed bottom
  inversions: 1,         // Specific inversion
}
```

## iReal Pro Integration

### Parsing Charts
```javascript
import { parseIreal } from '@strudel/tonal/ireal';

// Parse iReal Pro URL
const chart = parseIreal(iRealURL);
const { chords, title, composer } = chart;

// Play chord changes
chord(chords).voicing()
```

### Chart Format
```javascript
// iReal uses special notation
"[C^7|A-7|D-7|G7]"  // 4 bars
"[C^7|%]"           // Repeat sign
"{C^7|A-7"          // Repeat start
"D-7|G7}"           // Repeat end
```