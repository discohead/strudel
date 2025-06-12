# Refactor to Pattern Style Prompt Template

Refactor the following imperative/procedural code to Strudel's functional reactive pattern style:

## Original Code:
```javascript
[PASTE IMPERATIVE CODE HERE]
```

## Refactoring Goals:

Convert this code to use Strudel's pattern system following these principles:

1. **Replace loops with pattern generation**:
   - For loops → `sequence()`, `cat()`, or pattern generators
   - Iterations → Pattern transformations
   - Conditionals → `when()`, `sometimesBy()`, or `mask()`

2. **Replace mutable state with pattern transformations**:
   - Variable updates → Pattern methods like `withValue()`
   - Arrays → Pattern sequences
   - Time-based changes → Pattern time functions

3. **Replace imperative scheduling with pattern time**:
   - setTimeout → Pattern scheduling via `.early()/.late()`
   - Intervals → Pattern cycles
   - Sequential execution → Pattern sequences

## Common Refactoring Patterns:

### Loop to Sequence:
```javascript
// Imperative
for (let i = 0; i < 4; i++) {
  playNote(60 + i);
}

// Pattern style
sequence(60, 61, 62, 63).note()
```

### Conditional to Pattern:
```javascript
// Imperative
if (Math.random() > 0.5) {
  playDrum('bd');
} else {
  playDrum('sd');
}

// Pattern style
"<bd sd>".s() // Alternates each cycle
// or
"bd".sometimesBy(0.5, _ => "sd".s()) // Random choice
```

### Time-based to Pattern:
```javascript
// Imperative
setTimeout(() => playNote(60), 1000);
setTimeout(() => playNote(64), 2000);

// Pattern style
cat(
  note(60),
  silence(),
  note(64)
)
```

### Array manipulation to Pattern:
```javascript
// Imperative
const notes = [60, 62, 64];
const doubled = notes.map(n => n * 2);

// Pattern style  
sequence(60, 62, 64).mul(2)
```

### State machine to Pattern:
```javascript
// Imperative
let state = 0;
function tick() {
  if (state === 0) play('bd');
  else if (state === 1) play('sd');
  state = (state + 1) % 3;
}

// Pattern style
"bd sd ~".s() // ~ is silence
```

## Refactoring Checklist:

- [ ] All loops converted to pattern sequences
- [ ] No mutable variables - use pattern transformations
- [ ] Time handled via pattern cycles, not setTimeout
- [ ] Randomness via `rand`, `choose`, `sometimesBy`
- [ ] Conditionals converted to pattern masks or choices
- [ ] Side effects moved outside pattern definition
- [ ] Result is composable with other patterns

## Expected Output Format:

```javascript
// Refactored pattern version
const pattern = [PATTERN_EXPRESSION];

// If needed, with explanation:
// - sequence() creates a pattern from the array values
// - .fast(2) doubles the speed
// - .sometimes(rev) randomly reverses
```

## Additional Considerations:

1. **Preserve musical intent** - The pattern should produce similar musical output
2. **Maintain timing relationships** - Use appropriate cycle lengths
3. **Keep it idiomatic** - Use Strudel's built-in functions where possible
4. **Document non-obvious transformations** - Explain complex refactorings