# Strudel MDC Rules

This directory contains MDC (Model Development Convention) rules for the Strudel codebase. These rules help AI assistants understand and follow Strudel's patterns and conventions.

## Structure

### always/ - Universal Rules (< 500 lines total)
- **core-conventions.mdc** - Module structure, licensing, imports/exports
- **architecture-principles.mdc** - FRP patterns, immutability, lazy evaluation
- **code-quality.mdc** - Testing standards, documentation, error handling

### components/ - Component-Specific Rules
- **pattern-functions.mdc** - Creating and transforming patterns
- **mini-notation.mdc** - Mini notation syntax and parsing
- **web-audio.mdc** - Audio scheduling and parameter mapping

### features/ - Domain-Specific Rules
- **transpiler.mdc** - Code transformation and syntax sugar
- **visualization.mdc** - Canvas drawing and animation
- **midi-osc.mdc** - MIDI and OSC integration

### workflows/ - Multi-Step Procedures
- **adding-patterns.mdc** - Complete workflow for adding pattern functions
- **testing-patterns.mdc** - Comprehensive testing strategies
- **debugging.mdc** - Debugging tools and techniques

## Key Principles

1. **Functional Reactive Programming (FRP)**
   - Patterns are immutable functions of time
   - Lazy evaluation until query time
   - Pure functions without side effects

2. **Time Precision**
   - Always use Fraction for time values
   - Never use JavaScript numbers for precise time

3. **Pattern Immutability**
   - Methods return new Pattern instances
   - Never mutate existing patterns

4. **Testing First**
   - Snapshot tests for complex outputs
   - Edge case coverage
   - Performance benchmarks

## Quick Reference

### Creating a Pattern Function
```javascript
export const myFunction = register('myFunction', 
  curry((param, pat) => {
    pat = reify(pat);
    // Transform pattern
    return pat.withValue(v => transform(v, param));
  })
);

Pattern.prototype.myFunction = function(param) {
  return myFunction(param, this);
};
```

### Testing a Pattern
```javascript
describe('myFunction', () => {
  it('basic test', () => {
    const result = myFunction(0.5, "a b c");
    expect(result.firstCycle()).toMatchSnapshot();
  });
});
```

### Mini Notation Integration
Strings automatically parse as mini notation:
```javascript
"c3 e3 g3".fast(2).rev()
// Equivalent to:
mini("c3 e3 g3").fast(2).rev()
```

## File Patterns

These rules apply to files matching these patterns:
- `packages/**/*.mjs` - ES modules with AGPL headers
- `packages/*/test/*.test.mjs` - Vitest test files
- `packages/core/**/*.mjs` - Core pattern engine
- `packages/mini/**/*.mjs` - Mini notation parser
- `packages/transpiler/**/*.mjs` - Code transformation
- `packages/webaudio/**/*.mjs` - Audio output
- `bench/**/*.bench.mjs` - Performance benchmarks

## Usage

These rules are designed for AI assistants to:
1. Understand Strudel's architecture and patterns
2. Write code that follows established conventions
3. Avoid common pitfalls and anti-patterns
4. Maintain consistency across the codebase

When in doubt, refer to existing code examples and test patterns for guidance.