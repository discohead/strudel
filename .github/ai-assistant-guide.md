# AI Assistant Guide for Strudel

This guide explains how the four-part AI assistant ecosystem works together to enhance development on the Strudel codebase.

## Overview

The Strudel project uses a comprehensive AI assistant configuration consisting of:

1. **Claude Code** - Knowledge repository and context architecture
2. **Cursor** - Active behavioral rules during coding
3. **GitHub Copilot** - Persistent inline coding assistance
4. **OpenAI Codex** - Cloud-based autonomous task execution

Each system serves a specific purpose and they work together to provide progressive enhancement.

## System Components

### Claude Code (Knowledge Base)
- **Location**: `CLAUDE.md`, `claude/` directory, package-specific `CLAUDE.md` files
- **Purpose**: Comprehensive documentation and context for deep understanding
- **Use When**: 
  - Learning about the codebase architecture
  - Understanding complex patterns
  - Researching implementation details
  - Planning major features

### Cursor (Behavioral Rules)
- **Location**: `.cursor/rules/` directory with MDC files
- **Purpose**: Active guidance and rule enforcement during coding
- **Use When**:
  - Writing new code
  - Refactoring existing code
  - Following project conventions
  - Implementing patterns correctly

### GitHub Copilot (Inline Assistance)
- **Location**: `.github/copilot-instructions.md` and specialized instructions
- **Purpose**: Quick, context-aware code suggestions
- **Use When**:
  - Auto-completing code
  - Writing tests
  - Following basic patterns
  - Quick transformations

### OpenAI Codex (Cloud Agents)
- **Location**: `AGENTS.md` files throughout the project
- **Purpose**: Autonomous task execution for well-defined work
- **Use When**:
  - Adding comprehensive test coverage
  - Systematic refactoring
  - Documentation generation
  - Repetitive tasks across files

## New Developer Setup

### Prerequisites
- Install Claude Code, Cursor, and GitHub Copilot extensions
- Have a GitHub account for Codex access
- Node.js >= 18 and pnpm installed

### Initial Setup (First Time)
1. Clone the repository
2. Run `pnpm i` to install dependencies
3. Review `CLAUDE.md` for project overview
4. Explore `claude/` directory for deep dives
5. Check `.cursor/rules/README.md` for rule overview
6. Read `.github/copilot-instructions.md` for style guide
7. Review `AGENTS.md` for task delegation guidance

### Using the AI Ecosystem

#### Research Phase (Claude Code)
```bash
# Ask Claude Code about architecture
"Explain the FRP pattern system in Strudel"
# Claude will reference claude/architecture/system-design.md

# Learn about specific packages
"How does the mini notation parser work?"
# Claude will reference packages/mini/CLAUDE.md
```

#### Active Development (Cursor + Copilot)
```javascript
// Start typing a new pattern function
// Copilot suggests basic structure
// Cursor enforces proper patterns via MDC rules

export const myPattern = register('myPattern', (param, pat) => {
  // Cursor ensures you follow pattern-functions.mdc rules
  // Copilot autocompletes based on similar functions
});
```

#### Task Delegation (Codex)
```markdown
# In chatgpt.com/codex, reference AGENTS.md:
"Following the Strudel AGENTS.md guidelines, please add comprehensive 
snapshot tests for the new `myPattern` function in packages/core"

# Codex will:
1. Read AGENTS.md for context
2. Follow testing patterns
3. Create PR-ready changes
```

## Common Workflows

### Adding a New Pattern Function
1. **Research** with Claude Code: Ask about similar patterns
2. **Implement** with Cursor/Copilot: Follow enforced rules
3. **Test** with Codex: Delegate comprehensive test generation
4. **Document** with Claude Code: Update relevant docs

### Debugging Complex Issues
1. **Understand** with Claude Code: Deep system knowledge
2. **Investigate** with Cursor: Follow debugging.mdc workflow
3. **Fix** with Copilot: Quick code corrections
4. **Verify** with Codex: Systematic testing across files

### Refactoring Legacy Code
1. **Analyze** with Claude Code: Understand current patterns
2. **Plan** with Cursor rules: Identify target patterns
3. **Execute** with Codex: Systematic refactoring
4. **Review** with all systems: Ensure consistency

## Best Practices

### Task Delegation Guidelines

#### Good for Codex (Cloud)
- Adding test coverage (follow AGENTS.md)
- Systematic refactoring across files
- Documentation generation
- Implementing well-defined features

#### Keep Local (Cursor/Copilot)
- Exploratory coding
- UI/UX decisions
- Performance optimization
- Architecture decisions

### Maintenance Schedule

The AI configuration should be maintained regularly:

- **Weekly**: Note any pattern drift during development
- **Monthly**: Quick updates if actively developing
- **Quarterly**: Full ecosystem maintenance with `/user:ai-ecosystem-maintenance`
- **Annually**: Complete regeneration and optimization

### Quality Metrics

Track effectiveness by monitoring:
- Code review comments about conventions
- Time spent explaining patterns
- Frequency of pattern corrections
- Success rate of delegated tasks
- Developer satisfaction scores

## Troubleshooting

### "AI suggestions don't match our patterns"
Run `/user:ai-ecosystem-maintenance` for full synchronization

### "Codex PRs don't follow standards"
Check that AGENTS.md properly references other systems

### "Too many false positives from Cursor"
Review and refine glob patterns in MDC rules

### "Copilot ignoring important patterns"
Run maintenance to promote patterns to core instructions

## Integration Tips

### Progressive Enhancement
1. Start with Copilot for basic suggestions
2. Add Cursor context for better patterns
3. Research with Claude for deep understanding
4. Delegate to Codex for systematic work

### Context Stacking
- Each system builds on the previous
- More context = better suggestions
- But avoid context overload

### Feedback Loop
- Note when AI gets things wrong
- Update configuration during maintenance
- Share improvements with team

## Command Reference

### Setup Commands
- `/user:ai-ecosystem-setup` - Initial complete setup
- `/user:context` - Generate Claude Code context
- `/user:cursor` - Generate Cursor rules
- `/user:copilot` - Generate Copilot instructions
- `/user:agents` - Generate AGENTS.md files

### Maintenance Commands
- `/user:ai-ecosystem-maintenance` - Complete maintenance
- `/user:context-update` - Update Claude context
- `/user:rules-sync` - Sync Cursor rules
- `/user:instructions-optimize` - Optimize Copilot
- `/user:agents-sync` - Update AGENTS.md

## Conclusion

The four-part AI ecosystem provides comprehensive coverage from inline suggestions to autonomous cloud development. Each system has its strengths, and together they create a development environment where AI truly understands and enhances your workflow.

Remember: This is living documentation. As the codebase evolves, so should the AI configuration. Regular maintenance ensures the AI assistance remains helpful and accurate.