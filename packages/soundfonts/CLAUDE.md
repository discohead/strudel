# CLAUDE.md - @strudel/soundfonts

This package provides SoundFont support for Strudel, enabling high-quality sampled instruments through both General MIDI soundfonts and custom SoundFont files.

## Package Overview

The `@strudel/soundfonts` package integrates SoundFont technology into Strudel's pattern system, allowing users to:
- Access a large collection of General MIDI instruments
- Load and use custom SoundFont files
- Play sampled instruments with full envelope and modulation support

## Key Components

### Main Exports (index.mjs)
- `loadSoundfont(url)` - Load a custom SoundFont file
- `setSoundfontUrl(url)` - Configure the base URL for soundfont data
- `registerSoundfonts()` - Initialize General MIDI soundfonts
- `getFontBufferSource()` - Low-level audio buffer access
- `soundfontList` - Array of available GM soundfont names

### General MIDI Collection (gm.mjs)
Contains a comprehensive list of General MIDI instruments organized by category:
- Piano instruments (acoustic, electric, harpsichord, etc.)
- Chromatic percussion (vibraphone, marimba, xylophone, etc.)
- Organ variations
- Guitar types (acoustic, electric, distorted, etc.)
- Bass instruments
- String sections
- Brass and woodwinds
- Synth leads and pads
- Ethnic instruments
- Percussion and drum kits

## Usage Patterns

### Basic General MIDI Usage
```javascript
// First, register soundfonts (typically done once at startup)
import { registerSoundfonts } from '@strudel/soundfonts';
await registerSoundfonts();

// Use GM instruments in patterns
note("c3 e3 g3 c4").s("gm_piano")
note("c2 e2 g2").s("gm_acoustic_bass")

// Access different variants with :n suffix
note("c3").s("gm_piano:1")  // Alternative piano sound
```

### Loading Custom SoundFonts
```javascript
import { loadSoundfont } from '@strudel/soundfonts';

// Load from URL
const mySoundfont = await loadSoundfont('https://example.com/my-instrument.sf2');

// Use in a pattern with soundfont() method
note("c3 e3 g3").soundfont(mySoundfont)

// Specify preset index (default is 0)
note("c3 e3 g3").soundfont(mySoundfont, 1)
```

### Configuring SoundFont Source
```javascript
import { setSoundfontUrl } from '@strudel/soundfonts';

// Change the base URL for GM soundfonts
setSoundfontUrl('https://my-server.com/soundfonts');

// Must be called before registerSoundfonts()
```

## Technical Details

### SoundFont Format
- Default GM soundfonts use a JavaScript-based format (not standard .sf2)
- Custom soundfonts can be standard .sf2 files
- Files are parsed using the `sfumato` library

### Audio Implementation
- Uses Web Audio API BufferSource nodes
- Supports sample-accurate timing
- Handles pitch bending and frequency modulation
- Integrates with Strudel's envelope system (ADSR)

### Caching Strategy
- SoundFonts are cached after first load
- Individual note buffers are cached by MIDI note number
- Reduces memory usage and improves performance

## Common Use Cases

### 1. Realistic Piano
```javascript
note("c3 e3 g3 c4")
  .s("gm_piano")
  .velocity(0.8)
  .sustain(0.5)
```

### 2. Bass Line
```javascript
note("c2 [e2 g2] c3 g2")
  .s("gm_acoustic_bass")
  .gain(0.7)
```

### 3. String Section
```javascript
chord("<C F G C>")
  .voicing()
  .s("gm_string_ensemble_1")
  .attack(0.2)
  .release(1)
```

### 4. Drum Kit
```javascript
stack(
  s("gm_standard_kit:35"), // Kick
  s("~ gm_standard_kit:38"), // Snare
  s("gm_standard_kit:42*8") // Hi-hat
)
```

## Integration with Other Packages

### With @strudel/tonal
```javascript
note("0 2 4 5")
  .scale("C:minor")
  .s("gm_piano")
```

### With @strudel/webaudio
```javascript
note("c3 e3 g3")
  .s("gm_piano")
  .room(0.5)      // Reverb from webaudio
  .delay(0.125)   // Delay effect
```

## Performance Considerations

1. **Initial Load Time**: GM soundfonts require network download on first use
2. **Memory Usage**: Large soundfonts can consume significant memory
3. **CORS Requirements**: Custom soundfonts need proper CORS headers
4. **Browser Limits**: Some browsers limit audio buffer sizes

## Troubleshooting

### SoundFont Not Playing
```javascript
// Ensure soundfonts are registered
await registerSoundfonts();

// Check if specific soundfont is loaded
console.log(soundfontList); // List available soundfonts
```

### Custom SoundFont Issues
```javascript
// Handle loading errors
try {
  const sf = await loadSoundfont('url/to/soundfont.sf2');
} catch (error) {
  console.error('Failed to load soundfont:', error);
}
```

### Performance Issues
```javascript
// For better performance with many notes
note("c3 e3 g3").s("gm_piano").clip(0.5) // Limit note duration
```

## Advanced Features

### Working with Presets
```javascript
// Load soundfont and access specific preset
const sf = await loadSoundfont('multi-preset.sf2');
note("c3").soundfont(sf, 0)  // Piano preset
note("c3").soundfont(sf, 40) // Violin preset
```

### Pitch Modulation
```javascript
note("c3")
  .s("gm_piano")
  .vib(4)        // Vibrato frequency
  .vibmod(0.1)   // Vibrato depth
```

## Best Practices

1. **Initialize Once**: Call `registerSoundfonts()` once at startup
2. **Cache References**: Store loaded soundfonts in variables
3. **Use Appropriate Sounds**: Match instrument to musical context
4. **Manage Memory**: Unload unused custom soundfonts when possible
5. **Test Cross-Browser**: SoundFont support may vary by browser

## Common Patterns

### Layered Instruments
```javascript
stack(
  note("c3 e3 g3").s("gm_piano"),
  note("c4 e4 g4").s("gm_glockenspiel").gain(0.3)
)
```

### Dynamic Instrument Selection
```javascript
note("c3 e3 g3 c4")
  .s("gm_piano gm_epiano1 gm_harpsichord".fast(0.5))
```

### Humanized Playing
```javascript
note("c3 e3 g3 c4")
  .s("gm_piano")
  .velocity(rand.range(0.6, 0.8))  // Velocity variation
  .late(rand.range(0, 0.002))      // Subtle timing variation
```