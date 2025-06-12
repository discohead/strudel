# Debug Pattern Prompt Template

Debug the following Strudel pattern issue:

## Problem Description:
[Describe what's going wrong - unexpected output, errors, silent failure, etc.]

## Current Pattern Code:
```javascript
[PASTE PATTERN CODE HERE]
```

## Expected Behavior:
[What should the pattern do?]

## Actual Behavior:
[What is it actually doing?]

## Debugging Steps:

### 1. Pattern Inspection
Use these tools to understand what's happening:

```javascript
// Log all events in first cycle
pattern.log()

// Examine first cycle events
console.log(pattern.firstCycle())

// Check specific time range
console.log(pattern.queryArc(0, 1))

// Visualize pattern
pattern.pianoroll() // Visual representation
```

### 2. Common Issues to Check:

#### ❌ String vs Pattern
```javascript
// Problem: Strings need parsing
"c3 e3 g3".fast(2) // ✅ Works - auto-parsed

'c3 e3 g3'.fast(2) // ❌ Error - single quotes don't parse
// Fix: Use double quotes or mini()
```

#### ❌ Time Precision
```javascript
// Problem: JavaScript numbers lose precision
.late(1/3) // ❌ 0.33333... imprecise

// Fix: Use Fraction
.late(Fraction(1,3)) // ✅ Exact
```

#### ❌ Pattern vs Value
```javascript
// Problem: Some functions expect patterns
stack(60, 62, 64) // ❌ Wrong - expects patterns

// Fix: Convert to patterns
stack(pure(60), pure(62), pure(64)) // ✅
// Or use mini notation
stack("60", "62", "64") // ✅
```

#### ❌ Method Chaining Order
```javascript
// Problem: Order matters for some operations
"c3".add(12).note() // ❌ add() doesn't work on strings

// Fix: Correct order
"c3".note().add(12) // ✅ note() first creates pattern
```

### 3. Debugging Helpers:

#### Event Inspector
```javascript
// Detailed event examination
pattern.firstCycle().forEach(hap => {
  console.log({
    value: hap.value,
    start: hap.part.begin.valueOf(),
    end: hap.part.end.valueOf(),
    duration: hap.part.end.sub(hap.part.begin).valueOf()
  });
});
```

#### Pattern Comparison
```javascript
// Compare two patterns
const expected = sequence('a', 'b', 'c');
const actual = yourPattern;

console.log('Expected:', expected.firstCycle());
console.log('Actual:', actual.firstCycle());
```

#### Transformation Trace
```javascript
// Track transformations step by step
const step1 = "c3 e3 g3";
console.log('Step 1:', step1);

const step2 = step1.fast(2);
console.log('Step 2:', step2.firstCycle());

const step3 = step2.add(12);
console.log('Step 3:', step3.firstCycle());
```

### 4. Common Fixes:

#### Empty Pattern Results
```javascript
// Check if pattern is actually empty
if (pattern.firstCycle().length === 0) {
  console.log('Pattern produces no events!');
  // Check: time span, pattern construction, filters
}
```

#### Timing Issues
```javascript
// Ensure cycles align
pattern._steps // Check step count
pattern.slow(pattern._steps) // Align to one cycle
```

#### Value Transformation Issues
```javascript
// Debug value transformations
pattern.withValue(v => {
  console.log('Input value:', v);
  const result = transform(v);
  console.log('Output value:', result);
  return result;
})
```

### 5. Error Message Analysis:

Common error patterns and fixes:

- `Cannot read property 'fast' of undefined` → Missing reify() or wrong type
- `pat.query is not a function` → Not a valid Pattern object
- `Maximum call stack exceeded` → Infinite recursion in pattern
- `Expected Pattern but got [type]` → Need to convert to Pattern

### 6. Minimal Reproduction:

Create the simplest version that shows the problem:
```javascript
// Reduce to minimal case
const minimal = /* simplest version showing issue */;
console.log(minimal.firstCycle());
```

## Debug Output Format:

Please provide:
1. The specific issue found
2. Why it's happening
3. The fix with explanation
4. Working corrected code

```javascript
// Issue: [What's wrong]
// Cause: [Why it happens]
// Fix: [How to fix it]

// Corrected code:
[WORKING PATTERN CODE]
```