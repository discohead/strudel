# AGENTS.md - Exercises Directory Guide

## Exercise Framework for AI Assistants

This directory contains hands-on exercises for the Strudel Techno Curriculum. This AGENTS.md file helps AI assistants create and evaluate exercises. See CLAUDE.md for additional comprehensive framework details.

## Exercise Structure Template

```javascript
// Exercise M.N: Clear Title
// Module: M - Exercise: N  
// Difficulty: Beginner | Intermediate | Advanced
// Time: 15-30 minutes
// Prerequisites: List what students should know

/*
GOAL: Clear statement of what student will achieve

INSTRUCTIONS:
1. First step with clear action
2. Second step building on first
3. Final step completing the task

REQUIREMENTS:
- Specific requirement 1
- Specific requirement 2  
- Specific requirement 3

BONUS CHALLENGES:
- Optional extra challenge 1
- Optional extra challenge 2

HINTS: (reveal progressively)
- Hint 1: General direction
- Hint 2: More specific guidance
- Hint 3: Near-solution hint
*/

// STARTER CODE
const pattern = /* provide partial code */;

// YOUR CODE HERE
// Student work goes here

// VALIDATION CHECKLIST
// [ ] Runs without errors
// [ ] Meets all requirements
// [ ] Sounds good at specified BPM
// [ ] Follows techno aesthetic
```

## Exercise Types

### 1. Completion Exercises
Student fills in missing parts:
```javascript
// Complete the Euclidean groove
const kick = sound("bd*4").gain(0.9);
const hats = sound("hh*16").euclid(/* ??? */, 16).gain(0.4);
const bass = note(/* ??? */).s("bass").lpf(400);

stack(kick, hats, bass).cpm(/* ??? */);

// Hint: Try euclid(11, 16) for driving hats
// Hint: "c1*8" works well for rolling bass
// Hint: 130 BPM is classic techno tempo
```

### 2. Modification Exercises
Transform existing patterns:
```javascript
// Given: Basic pattern
const original = stack(
  sound("bd*4").gain(0.9),
  sound("hh*8").gain(0.4)
).cpm(130);

// Task: Transform into hypnotic techno by:
// 1. Adding Euclidean rhythm to hats
// 2. Adding minimal bass line
// 3. Adding subtle variation every 4 bars

// YOUR TRANSFORMATION HERE
```

### 3. Creation Exercises
Build from specifications:
```javascript
/*
Create a Robert Hood-style minimal groove that:
- Uses only 4 elements maximum
- Includes syncopated percussion
- Has a hypnotic bassline
- Evolves subtly over 16 bars
- Maintains dancefloor energy
*/

// YOUR PATTERN HERE
```

### 4. Debug Exercises
Fix broken patterns:
```javascript
// This pattern has 4 errors. Find and fix them:
stak(                          // Error 1: Typo
  sound("bd*4").gain(1.5),     // Error 2: Gain too high
  note("c1*8).s("bass"),       // Error 3: Missing quote
  sound("hh*16").euclid(16, 16) // Error 4: No rhythm
).cpm("130");                  // Error 5: String not number

// FIXED VERSION HERE
```

### 5. Analysis Exercises
Study and recreate:
```javascript
/*
Listen to this pattern and recreate it:
[Audio reference or pattern description]

Identify:
- Kick pattern
- Hi-hat rhythm  
- Bass movement
- Any effects used
*/

// YOUR RECREATION HERE
```

## Difficulty Levels

### Beginner (5-15 minutes)
- Single concept focus
- Heavy guidance
- Clear right/wrong answers
- Immediate results

Example:
```javascript
// Add a clap on beats 2 and 4
const pattern = stack(
  sound("bd*4").gain(0.9),
  sound(/* YOUR CODE */).gain(0.7)
).cpm(130);

// Hint: "~ cp ~ cp" creates off-beat claps
```

### Intermediate (15-30 minutes)
- Multiple concepts
- Some creative freedom
- Several valid solutions
- Musical judgment required

Example:
```javascript
/*
Create a evolving hi-hat pattern that:
- Uses Euclidean rhythms
- Changes every 8 bars
- Includes velocity variation
- Works with provided kick
*/
```

### Advanced (30+ minutes)
- Open-ended goals
- Minimal guidance
- Creative problem solving
- Performance considerations

Example:
```javascript
/*
Design a complete 64-bar techno arrangement:
- Intro (16 bars)
- Build (16 bars)
- Main section (16 bars)
- Breakdown (16 bars)

Must be DJ-friendly and maintain energy
*/
```

## Creating Exercises

### Planning Process
1. **Identify skill**: What specific technique?
2. **Set difficulty**: Match to module level
3. **Create context**: Musical goal clear?
4. **Provide scaffold**: Right amount of starter code
5. **Test solutions**: Multiple approaches work?

### Writing Guidelines
- Clear, action-oriented instructions
- Specific requirements (measurable)
- Musical context (why this matters)
- Progressive hints available
- Multiple valid solutions

### Solution Examples
```javascript
// SOLUTION: Exercise 2.3 - Euclidean Groove

// Approach 1: Minimal
const minimal = stack(
  sound("bd*4").gain(0.9),
  sound("hh*16").euclid(9, 16).gain(0.3),
  sound("rim").euclid(3, 8).gain(0.5)
).cpm(130);

// Approach 2: Complex
const complex = stack(
  sound("bd*4").gain(0.9),
  sound("hh*16").euclid(11, 16).gain(0.4),
  sound("oh").euclid(5, 16).gain(0.3),
  sound("rim").euclid(7, 12).gain(0.5)
).cpm(130);

// KEY LEARNING:
// - Euclidean rhythms create interest
// - Prime numbers avoid repetition
// - Layer different patterns for complexity
```

## Assessment Guidelines

### Evaluation Criteria
```javascript
const rubric = {
  technical: {
    syntaxCorrect: 10,
    runsWithoutErrors: 10,
    efficientCode: 10
  },
  musical: {
    soundsGood: 20,
    meetsRequirements: 20,
    appropriateStyle: 10
  },
  creative: {
    originalApproach: 10,
    goesEeyondMinimum: 10
  }
};
```

### Feedback Templates
```javascript
// EXERCISE FEEDBACK

/* STRENGTHS:
- Great use of Euclidean rhythms
- Effective layering technique
- Good musical judgment

IMPROVEMENTS:
- Consider adding velocity variation
- Try different filter settings
- Experiment with spatial placement

SCORE: 85/100
Excellent work! Focus on dynamics next. */
```

## Exercise Progressions

### Module-Based Sequences
```
Module 1: Foundation
├── 1.1: Basic kick patterns
├── 1.2: Kick variations
├── 1.3: Layering techniques
├── 1.4: Genre-specific kicks
└── 1.5: Performance practice

Module 2: Groove Engine
├── 2.1: Euclidean basics
├── 2.2: Hi-hat patterns
├── 2.3: Complete grooves
├── 2.4: Spatial design
└── 2.5: Groove variations
```

### Skill Building Paths
- **Rhythm Path**: 1.1 → 2.1 → 3.1 → 6.1
- **Synthesis Path**: 4.1 → 5.1 → 9.1
- **Effects Path**: 5.3 → 7.1 → 8.2
- **Performance Path**: All .5 exercises → Module 10

## Interactive Features

### Self-Checking Code
```javascript
// Exercise with validation
const validateExercise = (pattern) => {
  const checks = {
    hasKick: pattern.includes("bd"),
    hasBass: pattern.includes("bass"),
    correctTempo: pattern.includes("130"),
    usesEuclid: pattern.includes("euclid")
  };
  
  console.log("Exercise validation:", checks);
  return Object.values(checks).every(v => v);
};
```

### Progressive Hints
```javascript
const hints = {
  exercise_2_3: [
    "Think about using Euclidean rhythms",
    "Try euclid(11, 16) for hi-hats",
    "Add euclid(3, 8) for a cross-rhythm",
    "Complete: sound('hh*16').euclid(11, 16)"
  ]
};

// Reveal based on attempts
```

## Common Exercise Patterns

### Pattern Building
Start simple, add complexity:
```javascript
// Stage 1: Rhythm only
// Stage 2: Add pitch
// Stage 3: Add effects
// Stage 4: Add variation
// Stage 5: Performance ready
```

### Constraint Exercises
Limitations spark creativity:
```javascript
/*
Create a pattern using:
- Only 3 sounds
- No effects
- Single note (C)
- Must be hypnotic
*/
```

### Style Mimicry
Learn by imitation:
```javascript
/*
Create a pattern in the style of:
- Jeff Mills: Minimal, relentless
- Robert Hood: Funky, stripped down
- Surgeon: Industrial, aggressive
*/
```

## Tips for AI Assistants

### Creating Exercises
1. **Clear objectives** - What skill exactly?
2. **Appropriate difficulty** - Match module level
3. **Musical relevance** - Why does this matter?
4. **Testable outcomes** - Can success be measured?
5. **Multiple solutions** - Allow creativity

### Common Pitfalls
- Too abstract (no musical context)
- Too specific (only one solution)
- Too complex (multiple skills at once)
- Too simple (no challenge)

### Quality Checklist
- [ ] Clear instructions
- [ ] Runnable starter code
- [ ] Achievable in time estimate
- [ ] Musical end result
- [ ] Connects to module content
- [ ] Includes validation criteria
- [ ] Has progressive hints
- [ ] Multiple valid solutions

## Remember

Great exercises:
1. **Challenge appropriately** - Not frustrating
2. **Teach through doing** - Active learning
3. **Sound musical** - Always about the music
4. **Build confidence** - Success feels good
5. **Inspire exploration** - Lead to experimentation

The best exercise leaves students wanting to do more.