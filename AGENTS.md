# AGENTS.md - Strudel AI Agent Guidelines

This document provides guidance for AI agents working with the Strudel codebase. It synthesizes knowledge from multiple AI systems and defines clear workflows for autonomous task execution.

## Knowledge Sources

### Primary References
- **CLAUDE.md** - Project overview and common commands
- **claude/** - Detailed technical documentation
  - `codebase-map.md` - Repository structure
  - `architecture/` - System design patterns
  - `technologies/` - Deep dives into core systems
  - `workflows/` - Step-by-step procedures
- **Package-specific CLAUDE.md** - Package-level guidance in:
  - `packages/core/CLAUDE.md`
  - `packages/mini/CLAUDE.md`
  - `packages/transpiler/CLAUDE.md`
  - And others...

### Behavioral Guidelines
- **.cursor/rules/** - MDC rules for patterns and conventions
  - `always/` - Universal rules (core conventions, architecture, quality)
  - `components/` - Component-specific patterns
  - `features/` - Domain-specific rules
  - `workflows/` - Multi-step procedures

### Style Consistency
- **.github/copilot-instructions.md** - Code style and examples
- **CONTRIBUTING.md** - PR process and contribution guidelines

## Environment Setup and Validation

### Initial Setup (3-5 minutes)
```bash
# 1. Verify environment
node --version  # Should be >= 18
pnpm --version  # Should be installed

# 2. Install dependencies
pnpm i

# 3. Validate setup
pnpm test --run packages/core/test/pattern.test.mjs  # Quick test
pnpm dev  # Start dev server (optional, takes longer)
```

### Environment Validation Checklist
- [ ] Node.js >= 18 installed
- [ ] pnpm package manager available
- [ ] All dependencies installed (`pnpm i` successful)
- [ ] Core tests passing
- [ ] No TypeScript errors in packages

## Task Categories

### ✅ Suitable for Autonomous Agents (3-8 min tasks)

#### 1. Pattern Function Implementation
- Adding new pattern transformations to `packages/core`
- Implementing pattern methods with tests
- Creating musical utility functions in `packages/tonal`
- **Validation**: Tests pass, snapshots updated

#### 2. Mini Notation Features
- Adding operators to mini notation parser
- Implementing new syntax features
- **Validation**: Parser regenerated, tests pass

#### 3. Bug Fixes
- Fixing reported issues with clear reproduction steps
- Addressing test failures
- Correcting documentation errors
- **Validation**: Issue resolved, tests pass

#### 4. Test Writing
- Adding missing test coverage
- Creating snapshot tests for patterns
- Writing edge case tests
- **Validation**: Coverage improved, all tests green

#### 5. Documentation Updates
- Updating JSDoc comments
- Fixing documentation inconsistencies
- Adding code examples
- **Validation**: Docs build successfully

### ❌ NOT Suitable for Autonomous Agents

#### 1. Architecture Changes
- Modifying core FRP principles
- Changing package structure
- Altering public APIs
- **Reason**: Requires team discussion

#### 2. Complex Audio Features
- Web Audio API integrations
- DSP algorithm implementation
- Audio scheduling changes
- **Reason**: Requires testing with audio hardware

#### 3. UI/UX Changes
- Website redesigns
- REPL interface modifications
- Visual component updates
- **Reason**: Requires design review

#### 4. Breaking Changes
- API modifications
- Pattern behavior changes
- Dependency updates
- **Reason**: Requires migration planning

## Task Execution Workflow

### 1. Task Understanding (1 minute)
```bash
# Read relevant documentation
cat CLAUDE.md  # Overview
cat claude/technologies/pattern-engine.md  # If working on patterns
cat packages/core/CLAUDE.md  # If working on core

# Check existing code
rg "functionName" packages/  # Find similar implementations
```

### 2. Implementation (3-5 minutes)
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes following patterns from:
# - .cursor/rules/core-conventions.mdc
# - .github/copilot-instructions.md

# Run tests frequently
pnpm test --run packages/core/test/*.test.mjs
```

### 3. Validation (1-2 minutes)
```bash
# Format code
pnpm codeformat

# Run all checks
pnpm check  # Includes format-check, lint, and tests

# Update snapshots if needed
pnpm snapshot
```

### 4. PR Preparation
```bash
# Stage changes
git add -A

# Commit with conventional format
git commit -m "feat(core): add newFunction for pattern transformation

- Implements newFunction as discussed in #issue
- Adds comprehensive tests with snapshots
- Updates JSDoc documentation

🤖 Generated with Claude Code
Co-Authored-By: Claude <noreply@anthropic.com>"

# Push and create PR
git push -u origin feature/your-feature
gh pr create --title "feat(core): add newFunction" --body "$(cat <<'EOF'
## Summary
- Adds newFunction for pattern transformation
- Includes tests and documentation

## Test Plan
- [x] Unit tests added
- [x] Snapshot tests updated
- [x] Manual testing in REPL
- [x] No breaking changes

🤖 Generated with Claude Code
EOF
)"
```

## Pattern Implementation Template

When implementing a new pattern function:

```javascript
// 1. In packages/core/pattern.mjs
/**
 * Brief description following copilot-instructions.md style
 * @param {number} param - Parameter description
 * @param {Pattern} pat - Pattern to transform
 * @returns {Pattern} Transformed pattern
 * @example
 * myFunction(2, "a b c") // Returns modified pattern
 */
export const myFunction = register('myFunction', 
  curry((param, pat) => {
    pat = reify(pat);  // Convert strings to patterns
    param = Fraction(param);  // Ensure time precision
    
    // Implementation following FRP principles from .cursor/rules/
    return pat.withValue(v => transform(v, param));
  })
);

// 2. Add prototype method
Pattern.prototype.myFunction = function(param) {
  return myFunction(param, this);
};

// 3. Export from packages/core/index.mjs
export { myFunction } from './pattern.mjs';

// 4. Add tests in packages/core/test/pattern.test.mjs
describe('myFunction', () => {
  it('basic usage', () => {
    expect(myFunction(2, "a b c").firstCycle()).toMatchSnapshot();
  });
  
  it('edge cases', () => {
    expect(myFunction(0, "a").firstCycle()).toEqual([]);
  });
});
```

## Testing Requirements

### Before ANY PR Submission
1. **Unit Tests**: All new functions must have tests
2. **Snapshots**: Update with `pnpm snapshot` if output changes
3. **Edge Cases**: Test with empty patterns, zero values, fractions
4. **Integration**: Test with mini notation strings
5. **Performance**: No significant regression in benchmarks

### Test Commands
```bash
# Run all tests
pnpm test

# Run specific package tests
pnpm test packages/core

# Run single test file
pnpm vitest run packages/core/test/pattern.test.mjs

# Update snapshots
pnpm snapshot

# Run with UI for debugging
pnpm test-ui
```

## Common Pitfalls to Avoid

### 1. Time Precision
```javascript
// ❌ WRONG - Loses precision
const time = 1/3;

// ✅ CORRECT - From .cursor/rules/architecture-principles.mdc
const time = Fraction(1, 3);
```

### 2. Pattern Immutability
```javascript
// ❌ WRONG - Mutates pattern
pattern.value = newValue;

// ✅ CORRECT - Returns new pattern
const newPattern = pattern.withValue(v => newValue);
```

### 3. Missing Reification
```javascript
// ❌ WRONG - Assumes pat is Pattern
export const myFunc = (pat) => pat.fast(2);

// ✅ CORRECT - Handles strings too
export const myFunc = (pat) => reify(pat).fast(2);
```

### 4. Synchronous Assumptions
```javascript
// ❌ WRONG - Pattern evaluation is lazy
const result = pattern.getValue();

// ✅ CORRECT - Query for specific time
const events = pattern.queryArc(0, 1);
```

## Quick Reference

### Essential Imports
```javascript
import { Pattern, register, reify, curry, Fraction } from '@strudel/core';
import { describe, it, expect } from 'vitest';
```

### Pattern Creation
```javascript
pure(value)                    // Constant pattern
sequence('a', 'b', 'c')       // Sequential
stack(pat1, pat2)             // Parallel
"a b c".fast(2)               // Mini notation
```

### Common Transformations
```javascript
pattern.fast(2)               // Speed up
pattern.slow(0.5)            // Slow down
pattern.rev()                // Reverse
pattern.struct("t f t f")    // Apply rhythm
pattern.every(4, rev)        // Conditional transform
```

### Testing Helpers
```javascript
pattern.firstCycle()         // Get first cycle events
pattern.queryArc(0, 1)       // Query time range
expect(...).toMatchSnapshot() // Snapshot test
```

## Delegation Decision Tree

Ask yourself:
1. **Can I complete this in 3-8 minutes?** → If no, delegate to human
2. **Do I need audio hardware testing?** → If yes, delegate to human
3. **Does this change core architecture?** → If yes, delegate to human
4. **Do I have clear test criteria?** → If no, ask for clarification
5. **Are all dependencies available?** → If no, note blockers

## Success Metrics

A successful autonomous task:
- ✅ Completes in under 8 minutes
- ✅ All tests pass
- ✅ Code is properly formatted
- ✅ Follows established patterns
- ✅ Has appropriate test coverage
- ✅ PR is ready for review
- ✅ No breaking changes introduced

## Additional Resources

- **Pattern Cookbook**: `claude/technologies/pattern-engine.md`
- **Mini Notation Guide**: `claude/technologies/mini-notation.md`
- **Testing Patterns**: `claude/workflows/testing-patterns.md`
- **Audio Integration**: `claude/technologies/webaudio-integration.md`

Remember: When in doubt, refer to existing code patterns and test thoroughly!