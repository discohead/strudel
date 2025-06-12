# Pattern Engine Deep Dive

## Core Concepts

### Pattern Class
The Pattern class is the fundamental building block of Strudel. It encapsulates a query function that maps time to events.

```javascript
export class Pattern {
  constructor(query, steps = undefined) {
    this.query = query;        // (State) => Hap[]
    this._Pattern = true;      // Type detection
    this._steps = steps;       // Steps per cycle
  }
}
```

### Query Function
The query function is the heart of a pattern:
```javascript
const query = (state) => {
  // state contains:
  // - span: TimeSpan to query
  // - controls: Map of control values
  
  // Return array of Haps (events)
  return haps;
};
```

### Hap (Happening)
A Hap represents a single event with timing information:
```javascript
class Hap {
  constructor(whole, part, value, context = {}) {
    this.whole = whole;    // Logical timespan
    this.part = part;      // Audible portion
    this.value = value;    // Event data
    this.context = context; // Metadata
  }
}
```

## Pattern Constructors

### Pure (Constant Pattern)
```javascript
export const pure = (value) => 
  new Pattern((state) => 
    state.span.spanCycles.map(subspan => 
      new Hap(subspan, subspan, value)
    )
  );

// Usage: pure(60) - plays 60 continuously
```

### Sequence
```javascript
export const sequence = (...args) => {
  const pats = args.map(reify);
  const dur = Fraction(1).div(pats.length);
  
  return new Pattern((state) => {
    const cycle = state.span.begin.cyclePos();
    const index = Math.floor(cycle.mul(pats.length));
    const pat = pats[index % pats.length];
    
    return pat.withTime(t => t.sub(index).mul(pats.length))
              .query(state);
  });
};

// Usage: sequence("c", "d", "e")
```

### Stack (Parallel Composition)
```javascript
export const stack = (...pats) => 
  new Pattern((state) => 
    pats.flatMap(pat => pat.query(state))
  );

// Usage: stack("c3", "e3", "g3") - chord
```

## Pattern Transformations

### Time Transformations
```javascript
// Fast - compress time
fast(factor) {
  return this.withTime(t => t.mul(factor));
}

// Slow - expand time
slow(factor) {
  return this.fast(Fraction(1).div(factor));
}

// Rev - reverse pattern
rev() {
  return this.withTime(t => Fraction(1).sub(t.cyclePos()));
}
```

### Value Transformations
```javascript
// Apply function to values
withValue(func) {
  return new Pattern((state) => 
    this.query(state).map(hap => 
      hap.withValue(func)
    )
  );
}

// Add numerical value
add(value) {
  return this.withValue(v => v + value);
}
```

### Structure Transformations
```javascript
// Euclidean rhythms
euclid(pulses, steps, rotation = 0) {
  const bitmap = generateEuclidean(pulses, steps);
  return this.struct(bitmap.rotate(rotation));
}

// Apply structure of one pattern to another
struct(binary) {
  return this.appLeft(binary.mask(1));
}
```

## Advanced Patterns

### Applicative Operations
```javascript
// Apply pattern of functions to pattern of values
appLeft(patVal) {
  const patFunc = this;
  return new Pattern((state) => {
    const haps = [];
    for (const hapFunc of patFunc.query(state)) {
      const hapVals = patVal.query(state.setSpan(hapFunc.wholeOrPart()));
      for (const hapVal of hapVals) {
        if (intersection = hapFunc.part.intersection(hapVal.part)) {
          haps.push(new Hap(
            hapFunc.whole,
            intersection,
            hapFunc.value(hapVal.value),
            hapVal.combineContext(hapFunc)
          ));
        }
      }
    }
    return haps;
  });
}
```

### Pattern Alignment
```javascript
// Different alignment strategies
stackLeft([p1, p2, p3])    // Align to first pattern
stackRight([p1, p2, p3])   // Align to last pattern  
stackCentre([p1, p2, p3])  // Center alignment
```

## Performance Optimizations

### Step Tracking
Patterns track their step count for efficient alignment:
```javascript
// Sequence of 3 elements = 3 steps
const pat = sequence("a", "b", "c");
pat._steps; // Fraction(3)

// Stack uses LCM of children
const stacked = stack(
  sequence("a", "b"),      // 2 steps
  sequence("x", "y", "z")  // 3 steps
);
stacked._steps; // Fraction(6) - LCM(2,3)
```

### Query Optimization
```javascript
// Only evaluate patterns for requested timespan
queryArc(begin, end) {
  const state = new State(new TimeSpan(begin, end));
  return this.query(state);
}

// Split queries by cycle for efficiency
span.spanCycles.forEach(cycleSpan => {
  // Process each cycle independently
});
```

## Integration Points

### With Mini Notation
```javascript
// String parser integration
import { mini } from '@strudel/mini';
Pattern.prototype.define('mini', mini);

// Now strings become patterns
"c3 e3 g3".fast(2)
```

### With Controls
```javascript
// Control parameters
n(60).s("piano").gain(0.8)

// Controls are merged into hap values
{
  n: 60,
  s: "piano", 
  gain: 0.8
}
```

### With Scheduling
```javascript
// Patterns provide events, scheduler handles timing
const haps = pattern.queryArc(0, 4);
haps.forEach(hap => {
  scheduler.schedule(hap.part.begin, () => {
    output(hap.value);
  });
});
```

## Common Patterns

### Polyrhythm
```javascript
// Different rhythms playing together
pr(
  "c3 e3 g3",     // 3 notes
  "c4 d4 e4 f4"   // 4 notes  
) // Creates 3-against-4 polyrhythm
```

### Random Patterns
```javascript
// Random choice each cycle
choose("c", "e", "g")

// Random with seed
chooseWith(seed, ["c", "e", "g"])

// Weighted random
wchoose([
  [2, "c"],  // 2x weight
  [1, "e"],  // 1x weight
  [1, "g"]   // 1x weight
])
```

### Pattern Modulation
```javascript
// Use one pattern to modulate another
sine.range(0, 1)         // LFO
  .fast(4)               // 4Hz
  .mul(pattern.gain())   // Modulate gain
```