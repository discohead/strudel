# Headless Strudel Environment

A Node.js-based Strudel composition environment that runs entirely in the terminal, designed for use with VS Code/Cursor and Claude Code.

## Features

- **No Browser Required**: Runs entirely in Node.js
- **File-Based Workflow**: Edit patterns in your favorite editor
- **Hot Reload**: Patterns reload automatically on save
- **Web Audio Support**: Full audio output via headless browser
- **OSC Output**: Send to SuperDirt or other OSC targets
- **Pattern Visualization**: ASCII visualization of patterns
- **VS Code Integration**: Commands for easy control
- **Event Logging**: All pattern events logged to file

## Setup

1. Install dependencies:
```bash
cd examples/headless-strudel
pnpm install
```

2. Choose your output method:

### Option A: Web Audio Output (Recommended)
```bash
# Uses headless browser for real audio output
pnpm run audio
# or
node audio-runner.js
```

### Option B: OSC Output
```bash
# Sends to SuperDirt/SuperCollider
pnpm run pattern
# or
node pattern-runner.js
```

3. Edit `current-pattern.js` to compose your patterns

## Usage

### Basic Workflow

1. **Edit Pattern**: Modify `current-pattern.js` in your editor
2. **Auto-Reload**: Pattern reloads automatically on save
3. **Control Playback**: Use command files or VS Code integration

### Control Commands

Create a `.commands` file with one of these commands:
- `play` - Start playing the pattern
- `stop` - Stop playback
- `restart` - Restart the pattern

Example:
```bash
echo "play" > .commands
```

### VS Code Integration

Use the integration script for easier control:

```bash
# Start/stop playback
node vscode-integration.js play
node vscode-integration.js stop

# Load a template
node vscode-integration.js template melodic

# Check status
node vscode-integration.js status

# Follow output
node vscode-integration.js tail
```

### Pattern Files

- `current-pattern.js` - Your active pattern (edit this)
- `.pattern-state.json` - Current state and errors
- `pattern-output.log` - Event output stream
- `.commands` - Command interface

## Examples

### Basic Drum Pattern
```javascript
s("bd sd bd sd")
```

### Polyrhythmic Pattern
```javascript
stack(
  s("bd*4"),
  s("cp(3,8)"),
  s("hh*7")
)
```

### Melodic Pattern
```javascript
stack(
  note("c3 eb3 g3 bb3").s("bass").struct("t(5,8)"),
  note("<c4 eb4 g4 bb4>").s("piano").slow(2),
  s("hh*8").gain(0.3)
)
```

## VS Code Tasks

Add to `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Strudel: Start Runner",
      "type": "shell",
      "command": "node",
      "args": ["pattern-runner.js"],
      "options": {
        "cwd": "${workspaceFolder}/examples/headless-strudel"
      },
      "problemMatcher": []
    },
    {
      "label": "Strudel: Play",
      "type": "shell",
      "command": "node",
      "args": ["vscode-integration.js", "play"],
      "options": {
        "cwd": "${workspaceFolder}/examples/headless-strudel"
      }
    },
    {
      "label": "Strudel: Stop",
      "type": "shell",
      "command": "node",
      "args": ["vscode-integration.js", "stop"],
      "options": {
        "cwd": "${workspaceFolder}/examples/headless-strudel"
      }
    }
  ]
}
```

## Keyboard Shortcuts

Add to `keybindings.json`:

```json
[
  {
    "key": "ctrl+alt+p",
    "command": "workbench.action.tasks.runTask",
    "args": "Strudel: Play"
  },
  {
    "key": "ctrl+alt+s",
    "command": "workbench.action.tasks.runTask",
    "args": "Strudel: Stop"
  }
]
```

## OSC Integration

To send patterns to SuperDirt:

1. Start SuperCollider with SuperDirt
2. Run the OSC bridge: `pnpm run osc` (from main Strudel directory)
3. Patterns will automatically send to SuperDirt

## Pattern Development with Claude Code

This environment is designed for collaborative composition with Claude Code:

1. Claude can read and edit `current-pattern.js`
2. Pattern automatically reloads when Claude saves changes
3. Claude can check `.pattern-state.json` for errors
4. Claude can analyze `pattern-output.log` for timing

### Example Workflow with Claude

```
User: "Create a generative drum pattern"
Claude: *edits current-pattern.js*
User: *sees pattern auto-reload and play*
User: "Add some melodic elements"
Claude: *updates the pattern file*
```

## Architecture

### Audio Runner (Web Audio)
```
┌─────────────────┐
│ current-pattern │ ← Edit this file
└────────┬────────┘
         │ File watch
         ↓
┌─────────────────┐
│  audio-runner   │ ← Node.js process
├─────────────────┤
│ - HTTP Server   │
│ - Puppeteer     │
│ - Pattern Watch │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│ Headless Chrome │ ← Invisible browser
├─────────────────┤
│ - Web Audio API │
│ - Superdough    │
│ - Strudel Web   │
└────────┬────────┘
         │
         ↓
    🔊 Audio Output
```

### Pattern Runner (OSC)
```
┌─────────────────┐
│ current-pattern │ ← Edit this file
└────────┬────────┘
         │ File watch
         ↓
┌─────────────────┐
│ pattern-runner  │ ← Node.js process
├─────────────────┤
│ - Transpiler    │
│ - Evaluator     │
│ - Query Loop    │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌────────┐ ┌────────┐
│  OSC   │ │  Log   │
│ Output │ │ Output │
└────────┘ └────────┘
```

## Limitations

### Audio Runner
- Requires Puppeteer/Chrome to be installed
- Slight overhead from running headless browser
- Visual features (scope/pianoroll) not visible in headless mode

### Pattern Runner  
- No direct audio output (requires OSC bridge)
- No visual scope/pianoroll (ASCII visualization only)
- Pattern must return a valid Pattern object
- Some browser-specific features unavailable

## Future Enhancements

- [ ] MIDI output support
- [ ] Better error messages
- [ ] Pattern history/undo
- [ ] Multi-file pattern support
- [ ] Built-in pattern library
- [ ] Terminal UI with blessed/ink
- [ ] Direct audio output via node-speaker