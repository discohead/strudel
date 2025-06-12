# New Pattern Function Prompt Template

Create a new Strudel pattern function with the following specification:

## Function: [FUNCTION_NAME]

**Purpose**: [Describe what the function does]

**Parameters**:
- `param1` (type): [Description]
- `pat` (Pattern): The pattern to transform

**Behavior**: [Detailed explanation of how it transforms the pattern]

**Examples**:
```javascript
// Example 1
[FUNCTION_NAME](value, "c3 e3 g3")
// Expected output: [describe result]

// Example 2  
"bd sd hh cp".FUNCTION_NAME(0.5)
// Expected output: [describe result]
```

## Requirements:

1. Follow the standard pattern function template:
   - Use `register()` to make it globally available
   - Add as method to Pattern.prototype
   - Call `reify()` on pattern inputs
   - Convert numeric parameters to Fraction

2. Include complete JSDoc with:
   - Description
   - @param annotations with types
   - @returns description
   - @example section with working examples

3. Implement in the appropriate location:
   - Time transformations → `packages/core/pattern.mjs`
   - Value transformations → `packages/core/pattern.mjs`
   - Musical functions → `packages/tonal/tonal.mjs`
   - New combinators → `packages/core/pattern.mjs`

4. Write comprehensive tests:
   - Basic functionality test with snapshot
   - Edge cases (empty pattern, zero values)
   - Integration with other pattern methods
   - Error conditions if applicable

5. Ensure the function:
   - Returns a new Pattern (immutable)
   - Uses Fraction for time values
   - Has no side effects
   - Handles undefined/null gracefully

## Implementation Template:

```javascript
/**
 * [Description]
 * @param {[type]} param - [Description]
 * @param {Pattern} pat - Pattern to transform
 * @returns {Pattern} [Description]
 * @example
 * [FUNCTION_NAME](value, "a b c") // => "result"
 */
export const [FUNCTION_NAME] = register('[FUNCTION_NAME]', (param, pat) => {
  pat = reify(pat);
  // Convert numeric params to Fraction if needed
  
  return new Pattern((state) => {
    // Implementation
  });
});

Pattern.prototype.[FUNCTION_NAME] = function(param) {
  return [FUNCTION_NAME](param, this);
};
```

## Test Template:

```javascript
describe('[FUNCTION_NAME]', () => {
  it('basic functionality', () => {
    const result = [FUNCTION_NAME](param, "a b c");
    expect(result.firstCycle()).toMatchSnapshot();
  });
  
  it('edge cases', () => {
    // Test with empty pattern, zero values, etc.
  });
  
  it('works with method chaining', () => {
    const result = "a b c".[FUNCTION_NAME](param).fast(2);
    expect(result.firstCycle()).toMatchSnapshot();
  });
});
```