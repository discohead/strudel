# Code Review Instructions for Strudel

## Pattern Function Review Checklist

### ✅ Immutability
- [ ] Returns new Pattern instance (never mutates)
- [ ] Uses `withValue`, `withTime`, or `new Pattern`
- [ ] No assignments to pattern properties

```javascript
// ✅ Good
return pat.withValue(v => v * 2);

// ❌ Bad  
pat.value = newValue;
return pat;
```

### ✅ Time Precision
- [ ] Uses `Fraction` for all time values
- [ ] No JavaScript number division for time

```javascript
// ✅ Good
const time = Fraction(1, 3);

// ❌ Bad
const time = 1/3;
```

### ✅ Pattern Reification
- [ ] Calls `reify()` on pattern parameters
- [ ] Handles string inputs via mini notation

```javascript
// ✅ Good
export const func = (arg, pat) => {
  pat = reify(pat); // Converts strings/values to Pattern
  // ...
};
```

### ✅ Documentation
- [ ] Has complete JSDoc comment
- [ ] Includes @param with types
- [ ] Includes @returns description
- [ ] Has @example section
- [ ] Examples are runnable

```javascript
/**
 * Brief description
 * @param {number} factor - What it does
 * @param {Pattern} pat - Pattern to transform
 * @returns {Pattern} What it returns
 * @example
 * func(2, "a b c") // => working example
 */
```

## Testing Review Checklist

### ✅ Test Coverage
- [ ] Tests basic functionality
- [ ] Tests edge cases (empty, null, zero)
- [ ] Tests error conditions
- [ ] Uses snapshots for complex outputs
- [ ] Tests method chaining

### ✅ Test Quality
- [ ] Uses standard test helpers
- [ ] Tests are focused and isolated
- [ ] Descriptive test names
- [ ] No hardcoded expected values for complex patterns

```javascript
// ✅ Good - Snapshot for complex
expect(complexPattern.firstCycle()).toMatchSnapshot();

// ❌ Bad - Hardcoded complex expectation
expect(complexPattern.firstCycle()).toEqual([
  { value: 'a', ... }, // Too brittle
]);
```

## Mini Notation Review

### ✅ Grammar Changes
- [ ] Operator added to operator list
- [ ] Grammar follows existing patterns
- [ ] Parser regenerated after changes

### ✅ Implementation
- [ ] Case added to switch statement
- [ ] Uses `enter()` for nested values
- [ ] Calls appropriate pattern method

```javascript
case 'newOp': {
  const { arg } = op.arguments_;
  pat = strudel.reify(pat).method(enter(arg));
  break;
}
```

## Error Handling Review

### ✅ User Errors
- [ ] Clear, actionable error messages
- [ ] Includes function name in error
- [ ] Shows expected vs actual

```javascript
// ✅ Good
throw new Error(
  `func: expected number between 0-1 but got ${value}`
);

// ❌ Bad
throw new Error('Invalid input');
```

### ✅ Edge Cases
- [ ] Handles undefined/null gracefully
- [ ] Returns sensible defaults
- [ ] Doesn't crash on empty patterns

## Performance Review

### ✅ Query Efficiency
- [ ] Queries only needed time spans
- [ ] Avoids unnecessary iterations
- [ ] Reuses common values

```javascript
// ✅ Good - Reuse constants
const ZERO = Fraction(0);
const ONE = Fraction(1);

// ❌ Bad - Recreate each time
return Fraction(0);
```

### ✅ Pattern Composition
- [ ] Lazy evaluation maintained
- [ ] No eager computation
- [ ] Efficient hap transformations

## Module Structure Review

### ✅ Imports/Exports
- [ ] Uses ES modules (.mjs)
- [ ] Correct import paths
- [ ] Exports match package index
- [ ] Internal deps use workspace:*

### ✅ License Header
- [ ] Has AGPL-3.0 header
- [ ] Copyright notice present
- [ ] GitHub URL included

## Code Style Review

### ✅ Formatting
- [ ] 2-space indentation
- [ ] Single quotes for strings
- [ ] Trailing commas in multiline
- [ ] Semicolons used consistently

### ✅ Naming
- [ ] Functions use camelCase
- [ ] Files use lowercase-hyphen.mjs
- [ ] Clear, descriptive names

## Integration Review

### ✅ Package Boundaries
- [ ] Core has no audio/UI deps
- [ ] Concerns properly separated
- [ ] Dependencies minimal

### ✅ Registration
- [ ] Function registered with `register()`
- [ ] Added to Pattern prototype
- [ ] Exported from package index

```javascript
// Complete integration
export const func = register('func', implementation);
Pattern.prototype.func = function(arg) {
  return func(arg, this);
};
```

## Common Issues to Flag

1. **Mutating patterns** - Any direct property assignment
2. **Missing reify()** - Functions must handle string inputs
3. **Number time values** - Must use Fraction
4. **Side effects in queries** - Keep queries pure
5. **Missing tests** - All public APIs need tests
6. **Poor error messages** - Must be specific and helpful
7. **Missing JSDoc** - All exports need documentation
8. **Eager evaluation** - Patterns must be lazy

## Approval Criteria

PR can be approved when:
- [ ] All checklist items pass
- [ ] Tests pass (`pnpm test`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Format check passes (`pnpm format-check`)
- [ ] Examples in docs work
- [ ] No breaking changes without discussion

## Requesting Changes Template

```
### Issues Found

1. **Missing reify() call**
   ```javascript
   // Line 23
   export const func = (arg, pat) => {
     pat = reify(pat); // Add this
   ```

2. **Using number instead of Fraction**
   ```javascript
   // Line 45
   const time = Fraction(0.5); // Not: 0.5
   ```

3. **Missing test coverage**
   Please add tests for:
   - Empty pattern case
   - Error conditions
   - Integration with .fast()

4. **Documentation incomplete**
   - Add @example to JSDoc
   - Include parameter descriptions
```