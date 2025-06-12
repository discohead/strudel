# Mini Notation Deep Dive

## Overview
Mini notation is a domain-specific language for creating rhythmic patterns, inspired by TidalCycles. It provides a concise syntax for complex musical patterns.

## Parser Architecture

### PEG Grammar
Mini notation uses a PEG (Parsing Expression Grammar) parser generated from `krill.pegjs`:

```javascript
// Grammar excerpt
pattern = _ sequence:sequence _ { return sequence; }
sequence = first:element rest:(_ element)* { 
  return [first, ...rest.map(r => r[1])]; 
}
element = group / atom / rest
```

### AST Structure
The parser produces an Abstract Syntax Tree (AST):
```javascript
{
  type_: 'pattern',
  source_: [
    {
      type_: 'atom',
      value_: 'c3',
      location_: { start: 0, end: 2 }
    },
    {
      type_: 'group', 
      source_: [...],
      arguments_: { alignment: 'sequence' }
    }
  ],
  arguments_: { alignment: 'sequence' }
}
```

## Basic Syntax

### Atoms (Single Elements)
```javascript
"c3"      // Note
"bd"      // Sample name  
"0.5"     // Number
"~"       // Rest (silence)
```

### Sequences
```javascript
"c3 e3 g3"           // Sequential notes
"bd sd hh sd"        // Drum pattern
"1 2 3 4"            // Numbers
```

### Groups
```javascript
"[c3 e3] g3"         // Group as single step
"c3 [e3 g3 b3]"      // Subpattern
"[[c3 d3] [e3 f3]]"  // Nested groups
```

## Advanced Syntax

### Alternation (Choose)
```javascript
"<c3 e3 g3>"         // Cycle through values
"bd <sd cp> hh"      // Alternate 2nd element
```

### Parallel (Comma)
```javascript  
"[c3, e3, g3]"       // Play simultaneously
"[bd sd, hh hh hh]"  // Polyrhythm
```

### Multiplication/Division
```javascript
"c3*4"               // Repeat 4 times
"[c3 e3]/2"          // Span 2 cycles
"bd*3 sd"            // 3 kicks, 1 snare
```

### Euclidean Rhythms
```javascript
"c3(3,8)"            // 3 pulses in 8 steps
"bd(5,8)"            // Classic euclidean
"sd(3,8,2)"          // With rotation
```

## Operators

### Replication (@)
```javascript
"c3 e3 g3"@3         // Repeat 3 times
"[bd sd]"@2          // Duplicate group
```

### Speed (*, /)
```javascript
"c3 e3 g3"*2         // Fast (double speed)
"bd sd hh"/3         // Slow (third speed)
```

### Euclidean Shorthand
```javascript
"c3"(3,8)            // = c3.euclid(3,8)
"bd"(5,8,1)          // With rotation
```

### Degradation (?)
```javascript
"c3? e3 g3"          // 50% chance
"bd sd? hh?"         // Multiple ?s
"c3?0.8"             // 80% chance
```

## Pattern Transformation

### Range (..)
```javascript
"0 .. 7"             // Numbers 0 to 7
"c3 .. g3"           // Note range
"0 .. 100"/8         // Smooth ramp
```

### Tail (:)
```javascript
"c3:e3:g3"           // Build chord
"0:12:24"            // Octave stack
```

### Weight (|)
```javascript
"bd|2 sd"            // bd twice as long
"c3|3 e3|1 g3|2"     // Weighted durations
```

## Implementation Details

### Pattern Generation
The AST is converted to Pattern objects:
```javascript
function patternifyAST(ast, code, onEnter, offset = 0) {
  switch (ast.type_) {
    case 'pattern':
      const children = ast.source_.map(child => enter(child));
      return sequence(...children);
      
    case 'atom':
      return pure(parseValue(ast.value_));
      
    case 'group':
      const alignment = ast.arguments_.alignment;
      if (alignment === 'parallel') {
        return stack(...children);
      }
      return sequence(...children);
  }
}
```

### Operator Application
Operators are applied after pattern creation:
```javascript
const applyOptions = (parent, enter) => (pat, i) => {
  const ast = parent.source_[i];
  const ops = ast.options_?.ops;
  
  for (const op of ops) {
    switch (op.type_) {
      case 'stretch':
        pat = pat[op.arguments_.type](enter(op.arguments_.amount));
        break;
        
      case 'replicate':
        const { amount } = op.arguments_;
        pat = pat._repeatCycles(amount)._fast(amount);
        break;
        
      case 'bjorklund':
        pat = pat.euclid(
          enter(op.arguments_.pulse),
          enter(op.arguments_.step),
          enter(op.arguments_.rotation)
        );
        break;
    }
  }
  return pat;
};
```

## Integration with Pattern System

### String Parsing Hook
```javascript
// Set parser globally
setStringParser(mini);

// Now all strings are parsed
const pattern = reify("c3 e3 g3");
```

### Location Tracking
Mini notation tracks source locations for error reporting and highlighting:
```javascript
{
  value_: 'c3',
  location_: {
    start: 0,
    end: 2,
    source: '"c3 e3 g3"'
  }
}
```

### Pattern Methods
Mini patterns support all pattern methods:
```javascript
"c3 e3 g3"
  .fast(2)
  .rev()
  .euclid(5, 8)
  .s("piano")
```

## Common Patterns

### Drum Patterns
```javascript
// Basic rock beat
"bd sd bd sd"

// With hi-hats
"[bd, hh*8] sd ~ sd"

// Breakbeat
"bd ~ ~ bd ~ ~ sd ~"

// Euclidean techno
"bd(3,8) sd(5,8) hh(7,8)"
```

### Melodic Patterns
```javascript
// Arpeggio
"c3 e3 g3 e3"

// With octaves
"[c3,c4] [e3,e4] [g3,g4]"

// Chord progression
"<[c3,e3,g3] [f3,a3,c4]>"
```

### Polyrhythmic Patterns
```javascript
// 3 against 4
"[c3 e3 g3, d4 f4 a4 c5]"

// Complex polyrhythm
"[[bd*3, sd*4], hh*7]"
```

## Error Handling

### Parse Errors
```javascript
try {
  mini("c3 [e3"); // Unclosed bracket
} catch (e) {
  // "Expected ']' but end of input found"
}
```

### Location Information
Errors include location for debugging:
```javascript
{
  message: "Unexpected character",
  location: {
    start: 5,
    end: 6,
    line: 1,
    column: 6
  }
}
```