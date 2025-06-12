# Strudel System Architecture

## Overview

Strudel implements a Functional Reactive Programming (FRP) pattern system inspired by TidalCycles. The architecture is designed around composable patterns that represent musical events over time.

## Core Architecture Components

### 1. Pattern System (FRP Core)

```
┌─────────────────────────────────────────────────────────┐
│                    Pattern Engine                        │
├─────────────────────────────────────────────────────────┤
│  Pattern { query: (State) => Hap[] }                    │
│     ↓                                                   │
│  State { span: TimeSpan, controls: Map }               │
│     ↓                                                   │
│  Hap { whole: TimeSpan, part: TimeSpan, value: any }  │
└─────────────────────────────────────────────────────────┘
```

**Key Concepts:**
- **Pattern**: A function from time to events (Haps)
- **State**: Query context with time span and controls
- **Hap**: A musical event with timing and value
- **TimeSpan**: Time interval using fractional beats

### 2. Evaluation Pipeline

```
User Code → Transpiler → Pattern Creation → Query → Scheduling → Audio Output
    ↓           ↓              ↓              ↓         ↓            ↓
"c3 e3 g3"   Add syntax    mini parser    Pattern    Cyclist    WebAudio
             sugar         to Pattern      query     scheduler   or OSC
```

**Steps:**
1. **Transpilation**: Convert syntax sugar (strings, sliders) to valid JS
2. **Pattern Creation**: Parse mini notation or create patterns programmatically
3. **Query**: Evaluate patterns for specific time spans
4. **Scheduling**: Use Cyclist to schedule events accurately
5. **Output**: Send to audio engine or external systems

### 3. Time Model

```
Cycles (beats):  0         1         2         3
                 |---------|---------|---------|
Events:          [--A--]   [--A--]   [--A--]     pattern "A"
                 [-B-][-C-][-B-][-C-][-B-][-C-]  pattern "B C"
                 
Fractional time: 0    0.5    1    1.5    2    2.5
```

- Time is measured in **cycles** (musical bars)
- Events have **whole** span (logical duration) and **part** span (audible portion)
- Patterns repeat infinitely by default

### 4. Pattern Composition

```javascript
// Vertical composition (polyphony)
stack(
  "c3 e3 g3",    // Pattern 1
  "c4 e4 g4"     // Pattern 2
)

// Horizontal composition (sequence)
cat(
  "c3 e3",       // First cycle
  "g3 b3"        // Second cycle
)

// Time manipulation
"c3 e3 g3"
  .fast(2)       // Double speed
  .slow(3)       // Triple duration
  .rev()         // Reverse
```

### 5. Module Architecture

```
┌─────────────────────────────────────────────────┐
│                 User Interface                   │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │   REPL   │ │   Docs   │ │ Visualization  │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
├─────────────────────────────────────────────────┤
│              Language Layer                      │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │Transpiler│ │   Mini   │ │     Tonal      │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
├─────────────────────────────────────────────────┤
│              Pattern Engine                      │
│  ┌──────────────────────────────────────────┐  │
│  │            @strudel/core                  │  │
│  └──────────────────────────────────────────┘  │
├─────────────────────────────────────────────────┤
│              Output Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌────────────────┐  │
│  │ WebAudio │ │   OSC    │ │     MIDI       │  │
│  └──────────┘ └──────────┘ └────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Key Design Patterns

### 1. Immutable Patterns
```javascript
// Patterns are immutable - methods return new patterns
const p1 = sequence("c", "d", "e");
const p2 = p1.fast(2); // p1 is unchanged
```

### 2. Lazy Evaluation
```javascript
// Patterns are not evaluated until queried
const pattern = stack(
  expensive_pattern_1,
  expensive_pattern_2
); // No computation yet

// Evaluation happens here
const events = pattern.queryArc(0, 1);
```

### 3. Function Composition
```javascript
// Patterns are functions that can be composed
const addOctave = pat => pat.add(12);
const doubleSpeed = pat => pat.fast(2);

const transformed = flow(
  addOctave,
  doubleSpeed
)(pattern);
```

### 4. Context Threading
```javascript
// Context flows through pattern transformations
const hap = new Hap(whole, part, value, {
  color: 'blue',
  velocity: 0.8
});

// Context is preserved through transformations
pattern.withContext({color: 'red'})
```

## State Management

### 1. Global State
- Audio context and scheduler state
- Pattern registration
- Control buses

### 2. Local State
- Pattern-specific state (steps, weight)
- Query state (current span, controls)
- Hap context (metadata)

### 3. Stateless Evaluation
- Pattern queries are pure functions
- Same input (time span) produces same output
- Side effects isolated to output layer

## Performance Considerations

### 1. Query Optimization
- Patterns only evaluated for requested time spans
- Efficient cycle splitting and intersection
- Minimal object allocation in hot paths

### 2. Scheduling Strategy
- Look-ahead scheduling for accurate timing
- Web Audio clock for precise event timing
- Worker thread for pattern evaluation

### 3. Memory Management
- Haps are transient (created per query)
- Patterns are lightweight function closures
- Garbage collection friendly design

## Extension Points

### 1. Custom Patterns
```javascript
const customPattern = new Pattern((state) => {
  // Custom query logic
  return [/* haps */];
});
```

### 2. Output Targets
- Implement custom output by consuming Haps
- Examples: DMX lights, visual systems, robotics

### 3. Control Sources
- MIDI input
- OSC messages
- Sensor data
- UI widgets

## Error Handling Strategy

1. **Parse Errors**: Clear messages with location info
2. **Runtime Errors**: Graceful degradation, continue playing
3. **Audio Errors**: Fallback to safe defaults
4. **User Errors**: Educational error messages

## Security Considerations

- Code evaluation in sandboxed context
- No file system access in web version
- Network access limited to audio samples
- AGPL license ensures freedom