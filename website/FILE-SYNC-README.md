# File Sync Feature for Strudel REPL

The main Strudel REPL now includes bidirectional file synchronization, enabling collaboration between Claude Code and your local REPL.

## How It Works

1. **Automatic Saving**: When you evaluate code (Ctrl+Enter), the current pattern is saved to `website/current-pattern.js`

2. **File Polling**: The REPL polls the file every second for external changes and automatically loads them into the editor

3. **Claude Code Integration**: Claude Code can read and modify `current-pattern.js` to collaborate on patterns

## Usage

### Starting the REPL
```bash
# From the strudel root directory
pnpm dev
```

Then open http://localhost:4321/ in your browser.

### Collaboration Workflow

1. **You edit in the REPL**: Make changes and press Ctrl+Enter to evaluate and save
2. **Claude reads the file**: Claude Code reads `website/current-pattern.js` to see your current pattern
3. **Claude makes changes**: Claude Code modifies the file with improvements or variations
4. **REPL auto-loads**: Your editor automatically updates with Claude's changes (within 1 second)
5. **You review and evaluate**: Press Ctrl+Enter to run the updated pattern

### Visual Feedback

A status indicator appears in the bottom-right corner showing:
- "Pattern saved to file" (green) - when you evaluate
- "Pattern loaded from file" (blue) - when external changes are detected
- "Failed to save pattern" (red) - if there's an error

### File Location

The pattern file is saved as `current-pattern.js` in the website directory. This file is gitignored to prevent accidental commits of work-in-progress patterns.

## Implementation Details

- **API Endpoint**: Uses Astro's API routes at `/api/pattern` for file operations
- **Polling**: Checks for file changes every second (non-blocking)
- **Debouncing**: File changes are debounced (300ms) to prevent rapid updates
- **Load Priority**: On startup, checks file first, then URL hash, then last session, then random tune
- **Error handling**: Gracefully handles file read/write errors

## Tips

- The file always contains the last evaluated pattern
- You can manually edit `current-pattern.js` with any text editor
- Delete `current-pattern.js` to reset to default loading behavior
- The file persists between sessions, preserving your work
- File sync works alongside all existing REPL features