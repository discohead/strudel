# AGENTS.md - @strudel/soundfonts

## Package Purpose
This package provides SoundFont instrument support for Strudel, enabling high-quality sampled instruments through Web Audio API. It bridges the gap between MIDI-style composition and realistic instrument sounds.

## Core Architecture

### Module Structure
```
soundfonts/
├── index.mjs        # Main exports and API
├── gm.mjs           # General MIDI soundfont definitions
├── soundfont.mjs    # Core soundfont loading and playback
└── package.json     # Package configuration
```

### Key Dependencies
- `sfumato` - SoundFont parsing and zone/sample management
- `soundfont2` - SoundFont file format handling
- `@strudel/core` - Pattern system integration
- `@strudel/webaudio` - Audio output and scheduling

## Implementation Details

### SoundFont Loading Flow
1. **URL Resolution**: Soundfonts loaded from configured base URL or custom URL
2. **Format Detection**: Determines if JavaScript format or standard SF2
3. **Parsing**: Uses sfumato to parse SF2 files into usable format
4. **Caching**: Stores parsed soundfont data in memory
5. **Buffer Creation**: Generates Web Audio buffers for each note on demand

### Audio Playback Architecture
```javascript
// Simplified playback flow
Pattern → getBufferSource() → BufferSourceNode → AudioContext
                ↓
         getFontBufferSource()
                ↓
         sfumato.render()
```

### General MIDI Organization
The `gm.mjs` file contains 300+ instrument variations organized by GM categories:
- Each instrument has multiple variants (e.g., `gm_piano`, `gm_piano:1`, `gm_piano:2`)
- Variants use different sample sources for tonal variety
- All GM sounds are lazy-loaded on first use

## Key Functions

### `loadSoundfont(url)`
- Fetches and parses SoundFont files
- Supports both JS format and standard SF2
- Returns a soundfont object compatible with pattern methods
- Handles CORS and network errors

### `registerSoundfonts()`
- Registers all GM instruments as Strudel sounds
- Sets up the `soundfont()` pattern method
- Must be called during initialization
- Creates `s()` bindings for all GM instruments

### `getFontBufferSource()`
- Low-level function for audio buffer generation
- Handles MIDI note to frequency conversion
- Applies ADSR envelope parameters
- Manages pitch modulation and vibrato

### `setSoundfontUrl(url)`
- Configures base URL for GM soundfont data
- Must be called before `registerSoundfonts()`
- Defaults to GitHub-hosted soundfont collection

## Pattern Integration

### Pattern Method Extension
```javascript
// Added by registerSoundfonts()
Pattern.prototype.soundfont = function(sf, preset = 0) {
  return this.set({ soundfont: sf, sfpreset: preset });
}
```

### Sound Registration
```javascript
// Each GM instrument registered as:
registerSound(instrumentName, (time, hap, ctx) => {
  // Get buffer for specific note
  // Schedule with Web Audio
  // Apply effects and modulation
});
```

## Performance Optimizations

### Caching Strategy
1. **Font Cache**: Parsed soundfonts stored by URL
2. **Buffer Cache**: Rendered audio buffers cached by note number
3. **Zone Cache**: Sfumato zones cached for quick lookup
4. **Memory Management**: Unused buffers can be garbage collected

### Loading Optimization
- Soundfonts loaded asynchronously
- Only requested notes are rendered to buffers
- Lazy initialization of GM instruments
- Parallel loading of multiple soundfonts supported

## Error Handling

### Common Error Scenarios
1. **Network Errors**: Failed soundfont downloads
2. **CORS Issues**: Cross-origin restrictions
3. **Parse Errors**: Invalid soundfont format
4. **Memory Limits**: Browser audio buffer constraints

### Error Recovery
```javascript
// Graceful fallback for missing soundfonts
if (!soundfont) {
  console.warn('Soundfont not loaded, using default sound');
  return getDefaultSound();
}
```

## Testing Approach

### Unit Tests
- Test soundfont loading with mock data
- Verify buffer generation for different notes
- Check envelope parameter application
- Test error handling scenarios

### Integration Tests
- Test with real soundfont files
- Verify pattern integration
- Check audio output scheduling
- Test memory usage with large soundfonts

## Development Guidelines

### Adding New Features
1. Maintain backward compatibility with existing patterns
2. Follow Web Audio API best practices
3. Consider memory usage for mobile devices
4. Document new pattern methods in CLAUDE.md

### Code Style
- Use ES modules consistently
- Async/await for asynchronous operations
- Clear error messages for debugging
- Comment complex audio calculations

## Common Issues and Solutions

### Issue: SoundFont Not Loading
```javascript
// Check network tab for 404/CORS errors
// Verify URL is accessible
// Ensure registerSoundfonts() was called
```

### Issue: Distorted Audio
```javascript
// Check gain levels
// Verify sample rate compatibility
// Look for clipping in buffer data
```

### Issue: Memory Leaks
```javascript
// Ensure buffers are released
// Check for circular references
// Monitor soundfont cache size
```

## Integration Points

### With Core Package
- Extends Pattern prototype
- Uses Strudel's time and scheduling system
- Integrates with value patterns

### With WebAudio Package
- Uses shared AudioContext
- Integrates with effects chain
- Follows gain staging conventions

### With MIDI Package
- Shares MIDI note number conventions
- Can be used alongside MIDI output
- Supports velocity and other MIDI parameters

## Future Considerations

### Potential Improvements
1. Streaming large soundfonts
2. Web Worker processing
3. Compressed soundfont formats
4. Dynamic memory management
5. Preset browsing UI

### API Stability
- Core API (loadSoundfont, registerSoundfonts) is stable
- Internal implementation may change
- GM instrument names are permanent
- Pattern methods follow Strudel conventions