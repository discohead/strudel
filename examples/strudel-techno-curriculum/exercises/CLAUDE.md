# CLAUDE.md - Exercises Directory

## Exercise Development Framework

This directory contains hands-on exercises for students to practice techno production techniques in Strudel. Exercises progress from guided tutorials to open-ended challenges.

## Exercise Structure

### Basic Template
```javascript
// Exercise M.N: Title
// Module: M - Exercise: N
// Difficulty: Beginner | Intermediate | Advanced
// Time: Estimated completion time
// Prerequisites: What student should know

/*
GOAL: What student will achieve

INSTRUCTIONS:
1. Step one
2. Step two
3. Step three

REQUIREMENTS:
- Requirement 1
- Requirement 2
- Requirement 3

BONUS CHALLENGES:
- Extra challenge 1
- Extra challenge 2
*/

// STARTER CODE
const pattern = /* partial code */;

// YOUR CODE HERE
// ...

// VALIDATION
// The result should:
// - Sound like X
// - Include Y elements
// - Run at Z BPM
```

## Exercise Types

### 1. Completion Exercises
Student completes partial code:
```javascript
// Complete this kick pattern
const kick = sound("bd*4").gain(/* YOUR VALUE */);
const bass = note(/* YOUR PATTERN */).s("bass");

stack(kick, bass).cpm(/* YOUR BPM */);
```

### 2. Modification Exercises
Transform existing patterns:
```javascript
// Given pattern
const original = sound("bd*4").gain(0.9);

// Transform it to:
// - Add swing
// - Make it more complex
// - Add variation every 4 bars
const transformed = /* YOUR CODE */;
```

### 3. Creation Exercises
Build from specifications:
```javascript
// Create a pattern that:
// - Uses Euclidean rhythms
// - Has exactly 3 elements
// - Evolves over 16 bars
// - Sounds like Robert Hood

// YOUR CODE HERE
```

### 4. Debug Exercises
Fix broken patterns:
```javascript
// This pattern has 3 errors. Fix them.
stak(  // Error 1
  sound("bd*4").gain(1.5),  // Error 2
  note("c1*8").s("bass")  // Error 3
).cpm("130")  // Error 4
```

### 5. Analysis Exercises
Recreate by listening:
```javascript
// Listen to: reference_track.mp3
// Recreate the:
// - Kick pattern
// - Hi-hat rhythm
// - Bass movement

// YOUR RECREATION
```

## Planned Exercise Sets

### Module 1: Foundation Exercises
```
exercise_1_1_basic_kick.js
exercise_1_2_kick_variations.js
exercise_1_3_layered_kicks.js
exercise_1_4_genre_kicks.js
exercise_1_5_performance_kick.js
```

### Module 2: Groove Exercises
```
exercise_2_1_euclidean_basics.js
exercise_2_2_hihat_patterns.js
exercise_2_3_groove_building.js
exercise_2_4_spatial_percussion.js
exercise_2_5_complete_drums.js
```

### Module 3: Polyrhythm Exercises
```
exercise_3_1_simple_polyrhythm.js
exercise_3_2_complex_layers.js
exercise_3_3_polymetric_patterns.js
exercise_3_4_hypnotic_percussion.js
exercise_3_5_full_polyrhythmic_groove.js
```

### Performance Challenges
```
challenge_5min_set.js
challenge_live_remix.js
challenge_crowd_response.js
challenge_technical_recovery.js
challenge_style_morph.js
```

## Difficulty Progression

### Beginner Exercises
- Clear instructions
- Partial code provided
- Single concept focus
- Immediate feedback
- 5-10 minute completion

### Intermediate Exercises
- General guidelines
- Minimal starter code
- Multiple concepts
- Creative freedom
- 15-30 minute completion

### Advanced Exercises
- Open-ended goals
- No starter code
- Complex integration
- Performance focus
- 30+ minute completion

## Assessment Rubrics

### Basic Rubric
```javascript
// Exercise Assessment
const rubric = {
  technical: {
    runsWithoutErrors: 10,
    correctSyntax: 10,
    efficientCode: 10
  },
  musical: {
    soundsGood: 20,
    appropriateTempo: 10,
    genreAuthentic: 20
  },
  creative: {
    originalApproach: 10,
    goesBeeyondRequirements: 10
  }
};
```

### Detailed Feedback Template
```javascript
/*
EXERCISE FEEDBACK

Technical: X/30
- ✓ Code runs correctly
- ✓ Good use of functions
- ⚠ Consider more efficient approach for...

Musical: X/50
- ✓ Great groove feel
- ✓ Appropriate sound selection
- ⚠ Bass could use more movement

Creative: X/20
- ✓ Interesting variation technique
- 💡 Try exploring...

Overall: X/100
Great work! Focus on...
*/
```

## Solution Guidelines

### Solution Format
```javascript
// SOLUTION: Exercise M.N
// Multiple approaches shown

// Approach 1: Minimal
const minimal = /* solution */;

// Approach 2: Standard
const standard = /* solution */;

// Approach 3: Advanced
const advanced = /* solution */;

// KEY CONCEPTS:
// - Concept 1 explanation
// - Concept 2 explanation
// - Common mistakes to avoid
```

### Solution Principles
1. Show multiple valid approaches
2. Explain the thinking process
3. Highlight key learning points
4. Include common pitfalls
5. Suggest further exploration

## Interactive Exercises

### Self-Checking Exercises
```javascript
// Exercise with built-in validation
const exercise = () => {
  const userPattern = /* user code */;
  
  // Automatic checks
  const checks = {
    hasFourKicks: userPattern.includes("*4"),
    correctTempo: userPattern.includes("130"),
    hasGain: userPattern.includes("gain")
  };
  
  console.log("Exercise validation:", checks);
};
```

### Progressive Hints
```javascript
// Hint system
const hints = [
  "Hint 1: Consider using Euclidean rhythms",
  "Hint 2: Try sound('hh').euclid(?, 16)",
  "Hint 3: euclid(11, 16) creates a driving pattern",
  "Solution: sound('hh*16').euclid(11, 16).gain(0.4)"
];

// Reveal hints progressively
```

## Exercise Categories

### Technical Skill Exercises
- Syntax mastery
- Function usage
- Pattern combination
- Effect application
- Performance optimization

### Musical Skill Exercises
- Groove creation
- Tension building
- Sound design
- Arrangement flow
- Style mimicry

### Creative Challenges
- Genre fusion
- Constraint-based creation
- Improvisation prompts
- Collaboration exercises
- Experimental techniques

### Performance Preparation
- Speed coding
- Error recovery
- Live remixing
- Crowd reading
- Set building

## Future Exercise Ideas

### Gamified Exercises
- Pattern matching games
- Rhythm puzzles
- Sound design challenges
- Speed competitions
- Collaborative builds

### Real-World Scenarios
- "Fix this broken set"
- "Rescue this performance"
- "Match this reference"
- "Prepare for this venue"
- "Collaborate with this style"

### Certification Path
- Module completion tests
- Skill demonstrations
- Performance assessments
- Portfolio projects
- Final examination

## Exercise Development Checklist

For each new exercise:
- [ ] Clear learning objective
- [ ] Appropriate difficulty level
- [ ] Starter code tested
- [ ] Solution(s) prepared
- [ ] Validation criteria defined
- [ ] Time estimate accurate
- [ ] Musical output quality
- [ ] Connected to module content
- [ ] Bonus challenges included
- [ ] Assessment rubric created

## Remember

Great exercises:
1. **Challenge appropriately** - Not too easy, not too hard
2. **Teach by doing** - Hands-on learning
3. **Sound musical** - Results should be club-ready
4. **Build confidence** - Success should feel earned
5. **Inspire exploration** - Lead to personal discovery

The best exercise is one that students want to expand beyond the requirements.