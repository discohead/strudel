# CLAUDE.md - @strudel/mini

This file provides deep guidance to Claude Code for AI-human collaborative music composition using the mini notation parser.

## AI Composition Philosophy

Mini notation is the bridge between musical intent and pattern generation. As an AI composer, your role is to translate natural language musical ideas into syntactically valid and musically effective mini notation patterns. This requires understanding both the technical parser mechanics and the musical semantics of the notation.

## Parser Mechanics Deep Dive

### AST Node Types and Pattern Transformations

The mini notation parser generates an Abstract Syntax Tree (AST) that is transformed into Pattern objects through the `patternifyAST` function:

```javascript
// AST Node Types → Pattern Transformations
{
  'pattern': {
    alignment: 'fastcat' → sequence(...children)
    alignment: 'stack' → stack(...children)
    alignment: 'polymeter' → polymeter with step calculation
    alignment: 'rand' → chooseInWith(rand, children)
    alignment: 'feet' → fastcat(...children)
  },
  'element': → pass through to source with options applied,
  'atom': → pure(value) with location tracking,
  'stretch': → slow/fast transformation
}
```

### Operator Application Flow

Options are applied via `applyOptions` in a specific order:

1. **stretch** (`*` `/`): Modifies time base
2. **replicate** (`!`): Creates copies and adjusts weight
3. **bjorklund** (`(n,m)`): Applies euclidean rhythm
4. **degradeBy** (`?`): Adds probability-based silence
5. **tail** (`:`): Appends values to create lists
6. **range** (`..'): Generates numeric sequences

### Parsing Precedence (Highest to Lowest)

```pegjs
// 1. Atomic values and groups
atom / sub_cycle / polymeter / slow_sequence

// 2. Modifiers (right-associative)
slice_op = op_weight / op_bjorklund / op_slow / op_fast / op_replicate / op_degrade

// 3. Element with operations
slice_with_ops = slice ops:slice_op*

// 4. Sequences (space-separated)
sequence = _steps:'^'? s:(slice_with_ops)+

// 5. Stack/Choose/Dot operations
stack_tail = tail:(comma @sequence)+
choose_tail = tail:(pipe @sequence)+
dot_tail = tail:(dot @sequence)+
```

### Weight and Step Calculations

The parser tracks two important metrics:
- `__weight`: Duration weight for polymeter alignment
- `_steps`: Number of steps for grid alignment

```javascript
// Weight calculation example
"a@3 b" // a has weight 3, b has weight 1
// Total weight: 4, a plays for 3/4, b for 1/4

// Steps marking with ^
"^[a b c]" // Explicitly marks this as having 3 steps
"[^a b] [c d]" // First group has 2 steps, affects whole pattern
```

## Natural Language Translation Guide

### Comprehensive Mapping Table

| Musical Intent | Mini Notation | Code Example | Pattern Result |
|---------------|---------------|--------------|----------------|
| **Tempo/Speed** |
| Make it faster | `*n` | `"bd sd"*2` | Doubles the speed |
| Speed up gradually | `*<1 2 3 4>` | Pattern accelerates |
| Make it slower | `/n` | `"bd sd"/2` | Halves the speed |
| Double time feel | `.fast(2)` | Applied after mini |
| Half time feel | `.slow(2)` | Applied after mini |
| **Probability/Variation** |
| Sometimes play | `?` | `"bd sd?"` | 50% chance |
| Rarely play | `?0.9` | `"bd?0.9"` | 10% chance |
| Often play | `?0.2` | `"bd?0.2"` | 80% chance |
| **Repetition** |
| Repeat it | `*n` or `!` | `"bd*4"` or `"bd!"` |
| Echo effect | `a a@0.8 a@0.6` | Decaying repeats |
| Stutter | `!n` | `"bd!4"` | Rapid repeats |
| **Layering** |
| Play together | `,` | `"[bd,hh]"` | Simultaneous |
| Add a layer | `, pattern` | `"bd sd, hh*8"` |
| Harmonize | `[note,add(4),add(7)]` | Chord building |
| **Sequencing** |
| Then play | space | `"bd sd"` | Sequential |
| Alternate between | `<>` | `"<bd sd>"` | Per cycle |
| Choose randomly | `|` | `"bd|sd|cp"` | Random choice |
| **Rhythm** |
| Swing feel | `.swing(0.1)` | Applied after |
| Syncopation | `~ a ~` | Off-beat placement |
| Polyrhythm | `{a b, c d e}` | Different lengths |
| Fill every n bars | `.every(n, f)` | Periodic variation |
| **Dynamics** |
| Build up | Progressive complexity | See strategies below |
| Drop out | `~` or silence | `"bd ~ ~ sd"` |
| Accent | `@n` weight | `"bd@3 sd"` |
| Fade in/out | `.gain("0:1")` | Ramp patterns |

### Context-Aware Pattern Suggestions

```javascript
// When user says "make it more interesting"
function makeMoreInteresting(pattern) {
  return pattern
    .sometimes(x => x.fast(2))      // Occasional double-time
    .every(4, x => x.rev())          // Reverse every 4 cycles
    .jux(x => x.fast(1.5))          // Stereo variations
}

// When user says "add groove"
function addGroove(pattern) {
  return pattern
    .swing(0.08)                     // Subtle swing
    .gain("1 0.8 0.9 0.7")          // Dynamic accents
    .sometimes(x => x.off(0.125, x => x.gain(0.6))) // Ghost notes
}

// When user says "make it atmospheric"
function makeAtmospheric(pattern) {
  return pattern
    .slow(4)                         // Slower tempo
    .room(0.8)                       // Reverb
    .delay(0.375)                    // Echo
    .gain(0.6)                       // Quieter
    .pan(sine.slow(8))              // Slow panning
}
```

## AI Composition Patterns

### Building Blocks by Musical Style

#### Electronic/Techno
```javascript
// Basic techno pattern
const techno = stack(
  "bd*4",                            // Four-on-floor
  "[~ cp]*2",                        // Snare on 2&4
  "[hh*2 ho] hh*2",                  // Hi-hat pattern
  "[~ ~ ~ bass:1]*2"                 // Syncopated bass
);

// Progressive build
const build = stack(
  "bd*4",
  "[~ cp]*2".every(4, x => x.append("cp*4")), // Fill
  cat(
    "[hh*2 ho] hh*2",                // Normal
    "[hh*4 ho*2] hh*4",              // Busy
    "[hh*8 ho*4] hh*8"               // Very busy
  ).slow(16)                         // Change every 16 bars
);
```

#### Jazz/Swing
```javascript
// Jazz drums
const jazzDrums = stack(
  "bd ~ bd ~",
  "~ sd ~ sd",
  "hh*8"
).swing(0.15);

// Walking bass pattern
const walkingBass = note(
  "<[c2 e2 g2 e2] [f2 a2 c3 a2] [g2 b2 d3 b2] [c2 e2 g2 e2]>"
).s("bass");
```

#### Ambient/Experimental
```javascript
// Ambient texture
const ambient = stack(
  note("<c3 e3 g3 a3>").s("pad").slow(8),
  "hh?0.8"*16,                       // Sparse hats
  note("c5 ~ e5 ~ g5 ~ ~").s("bell")
    .often(x => x.rev().delay(0.33))
).room(0.9);

// Generative patterns
const generative = note(
  "<0 2 4 5 7 9 11>"
    .add("<0 12 -12 24>")            // Octave shifts
    .scale("C:minor")
).s("marimba")
  .euclidRot("<3 5 7>", 8, "<0 1 2>")
  .gain(perlin.range(0.3, 0.9));
```

### Layering and Complexity Progression

```javascript
// Start simple
let pattern = "bd";

// Layer 1: Add snare
pattern = "bd sd";

// Layer 2: Subdivide time
pattern = "bd [~ sd]";

// Layer 3: Add hi-hats
pattern = stack("bd [~ sd]", "hh*8");

// Layer 4: Variations
pattern = stack(
  "bd [~ sd <~ cp>]",
  "hh*8",
  "[~ ~ ~ bass:1]*2"
);

// Layer 5: Effects and dynamics
pattern = stack(
  "bd [~ sd <~ cp>]",
  "hh*8".gain("0.8 0.6"),
  "[~ ~ ~ bass:1]*2"
).room(0.2).delay(0.125);

// Layer 6: Structural variations
pattern = stack(
  "bd [~ sd <~ cp>]",
  "hh*8".gain("0.8 0.6"),
  "[~ ~ ~ bass:1]*2"
)
.room(0.2)
.delay(0.125)
.every(4, x => x.fast(2))           // Double-time every 4
.every(8, x => x.append("bd*8 sd*8 cp*8")); // Fill
```

### Rhythm and Melody Interaction

```javascript
// Rhythmic melody (drums suggest pitch)
const rhythmicMelody = stack(
  "bd:0 bd:1 bd:2 bd:1",            // Different kick pitches
  note("<c3 e3 g3 e3>").s("bass").struct("t ~ t ~")
);

// Call and response
const callResponse = cat(
  "bd sd bd sd",                     // Call (drums)
  note("c3 e3 g3 c4").s("bass")     // Response (melody)
);

// Polyrhythmic interplay
const polyrhythmic = stack(
  "bd(3,8)",                         // 3 against 8
  note("c3 e3 g3 b3 c4").euclid(5,8) // 5 against 8
);
```

## Syntax Validation Checklist

### Pre-Generation Validation

Before generating mini notation, ensure:

1. **Bracket Balance**
   ```javascript
   function validateBrackets(notation) {
     const counts = {
       '[': 0, ']': 0,
       '<': 0, '>': 0,
       '{': 0, '}': 0,
       '(': 0, ')'
     };
     // Count and verify matching
   }
   ```

2. **Space Handling**
   ```javascript
   // Valid: "a b c", "[a b]", "a*2 b"
   // Invalid: "abc" (unless intended as single value)
   // Special: "sample:name" (colon-joined is valid)
   ```

3. **Modifier Syntax**
   ```javascript
   // Valid modifiers and their arguments:
   const modifiers = {
     '*': /\*\d+/,          // *2, *3, etc.
     '/': /\/\d+/,          // /2, /3, etc.
     '@': /@\d*/,           // @, @2, @3, etc.
     '?': /\?\d*\.?\d*/,    // ?, ?0.5, ?0.8, etc.
     '!': /!+|\!\d+/,       // !, !!, !3, etc.
     ':': /:\w+/,           // :1, :name, etc.
     '(': /\(\d+,\d+,?\d*\)/ // (3,8), (3,8,1)
   };
   ```

4. **Value Types**
   ```javascript
   // Numbers: standalone or in context
   "3" // rhythm step
   "c3" // note with octave
   "0.5" // fractional value
   
   // Strings: letters and symbols
   "bd" // sample name
   "C:minor" // scale notation
   "sample:3" // indexed selection
   ```

### Common Syntax Errors and Fixes

| Error Pattern | Issue | Fix |
|--------------|-------|-----|
| `"[a b c"` | Unclosed bracket | Add `]` |
| `"a*"` | Modifier needs value | Use `"a*2"` or remove |
| `"<a b> c>"` | Mismatched brackets | `"<a b> <c>"` |
| `"a  b"` | Double space | Single space: `"a b"` |
| `"a(3,8,)"` | Trailing comma | `"a(3,8)"` |
| `"~*2"` | Can't modify rest | Use `"~ ~"` instead |

### Pattern Complexity Metrics

```javascript
// Measure pattern complexity for AI decisions
function patternComplexity(notation) {
  return {
    depth: maxNestingDepth(notation),      // Bracket nesting
    elements: countElements(notation),      // Total elements
    modifiers: countModifiers(notation),    // Operator count
    polyrhythm: hasPolyrhythm(notation),   // {a,b} present
    euclidean: hasEuclidean(notation),     // (n,m) present
    alternation: hasAlternation(notation)   // <> present
  };
}

// Suggested complexity progression
const complexityLevels = {
  beginner: { depth: 1, elements: 4, modifiers: 1 },
  intermediate: { depth: 2, elements: 8, modifiers: 3 },
  advanced: { depth: 3, elements: 16, modifiers: 5 },
  expert: { depth: 4, elements: 32, modifiers: 8 }
};
```

## Advanced Composition Techniques

### Polyrhythm and Polymeter Construction

```javascript
// Classic polyrhythms
const threeAgainstFour = stack(
  "bd*3",                            // 3 beats
  "hh*4"                             // 4 beats
); // Repeats every 1 cycle

// True polymeter (different cycle lengths)
const polymeter = stack(
  "bd sd cp".slow(3),                // 3-beat cycle
  "hh oh hh oh".slow(4)              // 4-beat cycle
); // Repeats every 12 cycles

// Complex polymeter with notation
const complex = "{bd sd, cp hh oh}%7"; // 7 steps per cycle
```

### Euclidean Rhythm Applications

```javascript
// Musical applications of euclidean rhythms
const rhythms = {
  // Traditional patterns
  tresillo: "bd(3,8)",               // Cuban tresillo
  cinquillo: "bd(5,8)",              // Cuban cinquillo
  
  // Layered euclidean
  complex: stack(
    "bd(3,8)",
    "sd(5,8,2)",                     // Rotated by 2
    "hh(7,8,1)"                      // Rotated by 1
  ),
  
  // Dynamic euclidean
  evolving: "bd(<3 5 7>,8,<0 1 2>)" // Changes each cycle
};

// Euclidean melody generation
const euclideanMelody = note("0 2 4 5 7")
  .euclid(7, 12)
  .scale("C:minor")
  .add("<0 12 -12>");
```

### Dynamic Pattern Evolution

```javascript
// Gradual transformation
const evolution = cat(
  "bd",                              // Cycle 1: minimal
  "bd sd",                           // Cycle 2: add snare
  "bd [~ sd]",                       // Cycle 3: syncopate
  "bd [~ sd] . bd sd cp sd"         // Cycle 4: fill
).slow(4);

// Probabilistic evolution
const probabilistic = "bd sd"
  .every(2, x => x.fast(2))          // Sometimes faster
  .sometimes(x => x.rev())           // Sometimes reversed
  .rarely(x => x.silence())          // Rarely drop out
  .often(x => x.loud());             // Often louder

// Structural development
const structure = arrangement(
  ['intro', 4, "bd"],
  ['buildup', 8, "bd sd, hh*<4 8 16>"],
  ['drop', 16, stack(
    "bd*4",
    "[~ cp]*2",
    "bass:1*8"
  )],
  ['breakdown', 8, "bd ~ ~ sd, hh?"],
  ['outro', 4, "bd".slow(2)]
);
```

### Musical Expression Techniques

```javascript
// Humanization
const humanized = "bd sd hh sd"
  .vel("0.9 0.7 0.6 0.8")            // Velocity variation
  .nudge("0 0.01 -0.01 0")           // Timing shifts
  .gain(perlin.range(0.8, 1));       // Organic dynamics

// Emotional patterns
const emotions = {
  happy: note("c e g c5")
    .scale("C:major")
    .fast(2)
    .gain(0.9),
    
  sad: note("c eb g bb")
    .scale("C:minor")
    .slow(2)
    .gain(0.6)
    .room(0.8),
    
  tense: note("c db e f")
    .fast("<1 1.5 2 3>")
    .gain(saw.range(0.3, 0.9))
    .pan(square.fast(8)),
    
  peaceful: note("<c e g a>")
    .slow(8)
    .gain(0.4)
    .room(0.95)
    .delay(0.66)
};
```

## Parser Implementation Details

### AST to Pattern Transformation

```javascript
// Simplified patternifyAST logic
function patternifyAST(ast, code, onEnter, offset = 0) {
  switch (ast.type_) {
    case 'pattern':
      const children = ast.source_.map(child => 
        patternifyAST(child, code, onEnter, offset)
      ).map(applyOptions(ast, enter));
      
      switch (ast.arguments_.alignment) {
        case 'stack': return stack(...children);
        case 'fastcat': return sequence(...children);
        case 'polymeter': return polymeterPattern(children, ast);
        case 'rand': return randomChoice(children, ast);
      }
      
    case 'atom':
      if (ast.source_ === '~') return silence;
      return pure(parseValue(ast.source_))
        .withLoc(getLocation(code, ast, offset));
      
    case 'element':
      return patternifyAST(ast.source_, code, onEnter, offset);
  }
}
```

### Location Tracking for Error Reporting

```javascript
// Location tracking enables precise error messages
const getLeafLocation = (code, leaf, globalOffset = 0) => {
  const { start, end } = leaf.location_;
  const actual = code.slice(start.offset, end.offset);
  
  // Trim whitespace from location
  const trimmed = actual.trim();
  const offsetStart = actual.indexOf(trimmed);
  const offsetEnd = actual.length - actual.lastIndexOf(trimmed) - trimmed.length;
  
  return [
    start.offset + offsetStart + globalOffset,
    end.offset - offsetEnd + globalOffset
  ];
};
```

## Best Practices for AI Composers

### 1. Start Simple, Build Complexity
Always begin with the simplest valid pattern and incrementally add complexity. This ensures syntactic validity and musical coherence.

### 2. Validate Before Generation
Run mental validation checks before outputting patterns. Consider bracket matching, operator precedence, and semantic validity.

### 3. Use Musical Context
Consider the genre, tempo, and emotional context when generating patterns. A techno pattern differs vastly from a jazz pattern.

### 4. Leverage Pattern Memory
Reuse and transform successful patterns rather than generating from scratch each time.

### 5. Test Edge Cases
When creating complex patterns, consider how they'll behave over multiple cycles, with different tempos, and in combination with other patterns.

### 6. Document Intent
When generating complex patterns, include comments explaining the musical intent:

```javascript
// Four-bar techno loop with tension and release
stack(
  "bd*4",                            // Driving kick
  "[~ cp]*2",                        // Backbeat snare
  "[hh*4 ho] hh*3".every(4, rev),   // Hi-hat variation
  "[~ ~ ~ bass:1]*2"                 // Syncopated bass
).every(8, x => x.fast(2))           // Double-time climax
```

Remember: Mini notation is not just syntax—it's a musical language. Master both its technical rules and its expressive possibilities for effective AI-human music collaboration.