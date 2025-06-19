# CLAUDE.md - Examples Directory

## Example Code Organization

This directory contains working code examples for the Strudel Techno Curriculum. Each file represents complete, runnable patterns that demonstrate specific techniques from the modules.

## Current Examples

### module1_examples.js
- Pattern evolution from simple to complex
- Genre-specific kick patterns (Detroit, Birmingham, Berlin)
- Advanced layering techniques
- Synthesized kicks
- Dynamic programming examples
- Polyrhythmic experiments
- Performance-ready patterns

## Example Code Standards

### Structure Template
```javascript
// Example N: Descriptive Title
// Description of what this example demonstrates

// Simple version
const simple = /* pattern */;

// Complex version
const complex = /* pattern */;

// Variations
const variation1 = /* pattern */;
const variation2 = /* pattern */;

// Full context example
stack(
  /* complete musical context */
).cpm(130)
```

### Quality Requirements
1. **Validated first** - Must pass `node ../../../packages/transpiler/validate.mjs`
2. **Every example must run** - No syntax errors
3. **Musical output** - Must sound good at specified tempo
4. **Clear progression** - Simple → Complex
5. **Well commented** - Explain the "why"
6. **Techno appropriate** - Fits the aesthetic

### Validation Process
**CRITICAL**: Validate all code before inclusion:
```bash
# From this examples directory
node ../../../packages/transpiler/validate.mjs 's("bd*4").gain(0.9)'
# Should output: ✓ Valid Strudel code
```

## Creating New Examples

### File Naming Convention
```
moduleN_examples.js          // Main examples for module N
moduleN_exercises.js         // Exercise solutions
moduleN_performance.js       // Performance templates
moduleN_variations.js        // Additional variations
```

### Example Categories

#### 1. Foundation Examples
Basic patterns that introduce concepts:
```javascript
// Basic kick pattern
sound("bd*4").gain(0.9).cpm(130)
```

#### 2. Evolution Examples
Show progression of complexity:
```javascript
// Step 1: Basic
const basic = sound("bd*4");

// Step 2: Add variation
const varied = sound("bd ~ bd bd ~ bd bd ~");

// Step 3: Layer complexity
const complex = stack(basic, varied.gain(0.5));
```

#### 3. Style Examples
Demonstrate specific artist approaches:
```javascript
// Jeff Mills style - minimal, powerful
const millsStyle = sound("bd*4")
  .gain(0.95)
  .shape(0.1)
  .cpm(135);
```

#### 4. Integration Examples
Show how elements work together:
```javascript
// Full groove example
stack(
  kick,
  bass,
  hats,
  effects
).cpm(130)
```

## Planned Examples

### Module 2-10 Examples (To Create)
Each module needs:
- 5-10 foundation examples
- 3-5 style studies
- 2-3 integration examples
- 1-2 performance templates

### Special Collections

#### genrepack_detroit.js
```javascript
// Collection of Detroit techno patterns
export const detroit = {
  kicks: { /* patterns */ },
  bass: { /* patterns */ },
  leads: { /* patterns */ },
  full: { /* complete tracks */ }
};
```

#### genrepack_berlin.js
```javascript
// Collection of Berlin techno patterns
export const berlin = {
  industrial: { /* patterns */ },
  minimal: { /* patterns */ },
  driving: { /* patterns */ },
  dub: { /* patterns */ }
};
```

#### performance_templates.js
```javascript
// Ready-to-use performance setups
export const templates = {
  minimal: { /* setup */ },
  maximal: { /* setup */ },
  experimental: { /* setup */ }
};
```

## Example Development Workflow

### 1. Research Phase
- Listen to reference tracks
- Identify key patterns
- Note tempo and structure
- Analyze sound design

### 2. Prototype Phase
```javascript
// Quick sketches
"bd*4" // Does this work?
"bd ~ bd bd" // Better?
"bd ~ bd bd ~ bd ~ bd" // Getting there
```

### 3. Refinement Phase
```javascript
// Add musical details
sound("bd ~ bd bd ~ bd ~ bd")
  .gain("0.9 0 0.85 0.9 0 0.8 0 0.85")
  .shape(0.1)
  .cpm(132)
```

### 4. Context Phase
```javascript
// Place in full pattern
stack(
  // Refined kick
  kick,
  // Supporting elements
  bass,
  hats
).cpm(132)
```

### 5. Documentation Phase
```javascript
// Example X: Syncopated Techno Kick
// Demonstrates off-beat emphasis common in UK techno
// Note the rest on beat 2 creating forward momentum
```

### 6. Validation Phase
```bash
# Always validate before committing
node ../../../packages/transpiler/validate.mjs 'sound("bd ~ bd bd ~ bd ~ bd").gain("0.9 0 0.85 0.9 0 0.8 0 0.85").shape(0.1).cpm(132)'
```

## Testing Examples

### Checklist for Each Example
- [ ] **Validated with transpiler/validate.mjs**
- [ ] Runs without errors
- [ ] Sounds good at intended BPM
- [ ] Demonstrates intended concept
- [ ] Has clear comments
- [ ] Follows code style
- [ ] Is musically useful

### Validation Commands
```bash
# Validate simple patterns
node ../../../packages/transpiler/validate.mjs 's("bd*4")'

# Validate complex stacks
node ../../../packages/transpiler/validate.mjs 'stack(s("bd*4"), s("hh*8").euclid(11,16)).cpm(130)'

# Validate with effects
node ../../../packages/transpiler/validate.mjs 'note("c1*8").s("bass").lpf(400).release(0.1)'
```

### Performance Testing
```javascript
// Test at different tempos
[125, 130, 135, 140].forEach(bpm => {
  console.log(`Testing at ${bpm} BPM`);
  pattern.cpm(bpm);
});

// Test CPU usage
console.time('pattern');
pattern.cpm(130);
console.timeEnd('pattern');
```

## Example Libraries

### Building Reusable Libraries
```javascript
// techno-tools.js
export const tools = {
  // Utility functions
  sidechain: (pattern) => /* implementation */,
  humanize: (pattern) => /* implementation */,
  
  // Common patterns
  fourFloor: () => sound("bd*4").gain(0.9),
  offBeat: () => sound("~ cp ~ cp").gain(0.7),
  
  // Effect chains
  dubDelay: (p) => p.delay(0.8).delaytime(0.375),
  warehouse: (p) => p.room(0.4).lpf(5000)
};
```

### Pattern Banks
```javascript
// pattern-bank.js
export const bank = {
  kicks: [
    "bd*4",
    "bd ~ bd bd ~ bd ~ bd",
    "bd bd ~ bd ~ ~ bd ~"
  ],
  
  bass: [
    "c1*8",
    "c1 ~ c1 c1 ~ c1 ~ c1",
    "c1 ~ ~ c1 ~ c1 ~ ~"
  ],
  
  // Generate combinations
  randomGroove: () => stack(
    sound(choose(bank.kicks)),
    note(choose(bank.bass)).s("bass")
  )
};
```

## Contribution Guidelines

### Adding Examples
1. Follow existing structure
2. **Validate with transpiler/validate.mjs**
3. Test thoroughly
4. Include performance notes
5. Reference source inspiration
6. Keep under 50 lines per example

### Example Validation Workflow
```bash
# Write your example
const myPattern = 'stack(s("bd*4"), s("hh*8")).cpm(130)';

# Validate it
node ../../../packages/transpiler/validate.mjs 'stack(s("bd*4"), s("hh*8")).cpm(130)'

# Only add to file if validation passes
```

### Improving Examples
1. Preserve original intent
2. Add variations, not replacements
3. Document improvements
4. Test backwards compatibility
5. Update related documentation

## Future Example Sets

### Advanced Techniques
- Live sampling examples
- Network collaboration patterns
- AI-assisted generation
- Visual synchronization

### Genre Studies
- Classic track recreations
- Regional style collections
- Historical period examples
- Future speculation patterns

### Educational Sets
- Common mistakes to avoid
- Debugging practice examples
- Performance disaster recovery
- Style transformation exercises

## Remember

Good examples should:
1. **Inspire** - Make people want to code
2. **Educate** - Teach specific techniques
3. **Sound Good** - Be musically valid
4. **Work** - Run without modification
5. **Build** - Connect to larger concepts

The best example is one that a student modifies to create something new.