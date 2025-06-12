# Code Generation Instructions for Strudel

## Pattern Function Generation

When creating new pattern functions, follow this template:

```javascript
/**
 * [Describe what the function does in one line]
 * @param {Type} param - [Parameter description]
 * @param {Pattern} pat - Pattern to transform
 * @returns {Pattern} [Describe output]
 * @example
 * funcName(value, "c3 e3 g3") // => "result pattern"
 */
export const funcName = register('funcName', (param, pat) => {
  // 1. Reify pattern (convert strings/values to Pattern)
  pat = reify(pat);
  
  // 2. Convert numeric params to Fraction
  if (typeof param === 'number') {
    param = Fraction(param);
  }
  
  // 3. Return new Pattern with transformation
  return new Pattern((state) => {
    // Transform the query state
    const newState = state.setSpan(/* transformed span */);
    
    // Query original pattern and transform results
    return pat.query(newState).map(hap => 
      hap.withValue(v => /* transform value */)
    );
  });
});

// Add as method on Pattern prototype
Pattern.prototype.funcName = function(param) {
  return funcName(param, this);
};
```

## Common Pattern Transformations

### Time Transformations
```javascript
// Speed up by factor
return pat.withTime(t => t.div(factor));

// Shift time
return pat.withTime(t => t.add(offset));

// Time function transformation
return pat.withQueryTime(t => transform(t));
```

### Value Transformations
```javascript
// Simple value mapping
return pat.withValue(v => v * 2);

// Conditional transformation
return pat.withValue(v => {
  if (condition(v)) return transform(v);
  return v;
});

// Object value updates
return pat.withValue(v => ({ ...v, key: newValue }));
```

### Structure Transformations
```javascript
// Apply rhythm structure
return pat.struct(rhythmPattern);

// Filter events
return pat.filterHaps(hap => hap.value > threshold);

// Split pattern
return pat.splitQueries();
```

## Mini Notation Extensions

### Grammar Addition (krill.pegjs)
```pegjs
// Add to operator list
operator = existing / newOperator

// Define operator
newOperator = "symbol" _ arg:type {
  return {
    type_: 'newOperator',
    arguments_: { arg }
  };
}
```

### Implementation (mini.mjs)
```javascript
case 'newOperator': {
  const { arg } = op.arguments_;
  pat = strudel.reify(pat).methodName(enter(arg));
  break;
}
```

## Pattern Combinator Templates

### Binary Combinator
```javascript
export const combine = register('combine', (other, pat) => {
  other = reify(other);
  pat = reify(pat);
  
  return new Pattern((state) => {
    const haps1 = pat.query(state);
    const haps2 = other.query(state);
    
    // Combine haps according to logic
    return combineHaps(haps1, haps2);
  });
});
```

### Applicative Pattern
```javascript
export const app = register('app', (funcPat, valPat) => {
  return funcPat.fmap(func => 
    valPat.fmap(val => func(val))
  ).innerJoin();
});
```

## Control Parameter Generation

```javascript
/**
 * Sets the [parameter name] control
 * @param {Type} value - [Description]
 * @example
 * s("bd").paramName(0.5)
 */
export const paramName = register('paramName', (value, pat) => {
  return pat.set({ paramName: value });
});

// Or with processing
export const paramName = register('paramName', (value, pat) => {
  // Validate/transform value
  const processed = clamp(0, 1, value);
  
  return pat.withValue(v => ({
    ...v,
    paramName: processed
  }));
});
```

## Pattern Query Implementation

```javascript
const customQuery = new Pattern((state) => {
  // 1. Get the time span
  const span = state.span;
  
  // 2. Calculate which cycles are active
  const startCycle = span.begin.floor();
  const endCycle = span.end.ceil();
  
  // 3. Generate haps for each cycle
  const haps = [];
  for (let cycle = startCycle; cycle < endCycle; cycle++) {
    const whole = new TimeSpan(cycle, cycle.add(1));
    const part = span.intersection(whole);
    
    if (part) {
      haps.push(new Hap(whole, part, value, context));
    }
  }
  
  return haps;
});
```

## Curried Function Pattern

```javascript
// For functions used in transformations
export const transformer = curry((config, func, pat) => {
  return pat.fmap(v => func(v, config));
});

// Usage enables partial application
const doubler = transformer(2, (v, factor) => v * factor);
```

## Registration and Export

```javascript
// 1. Define function
const funcName = (arg, pat) => { /* ... */ };

// 2. Register for global use
export const funcNameExport = register('funcName', funcName);

// 3. Add to Pattern prototype
Pattern.prototype.funcName = function(arg) {
  return funcName(arg, this);
};

// 4. Export from package index
export { funcNameExport as funcName } from './module.mjs';
```

## Performance Considerations

- Reuse Fraction constants: `const ZERO = Fraction(0)`
- Avoid creating patterns in loops
- Use early returns for edge cases
- Cache expensive calculations outside query function
- Prefer `map` over `flatMap` when possible

## Common Pitfalls to Avoid

1. **Don't mutate patterns**: Always return new instances
2. **Don't use JavaScript numbers for time**: Use Fraction
3. **Don't forget reify()**: Converts inputs to patterns
4. **Don't create side effects**: Keep queries pure
5. **Don't assume defined values**: Check for null/undefined