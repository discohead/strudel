/*
signal-notation.mjs - Signal notation implementation for Strudel
Parses and interprets signal mini notation into Strudel patterns
*/

import { signal, sine, saw, square, tri, sine2, saw2 } from '@strudel/core/signal.mjs';
import { Pattern, pure, stack, slowcat, fast, slow } from '@strudel/core/pattern.mjs';
import * as signalParser from './signal-parser.js'; // Generated from signal-mini.pegjs

// Parse signal notation string
export function parseSignal(notation) {
  try {
    const ast = signalParser.parse(notation);
    return signalToPattern(ast);
  } catch (error) {
    throw new Error(`Signal notation parse error: ${error.message}`);
  }
}

// Convert AST to Pattern
function signalToPattern(ast) {
  switch (ast.type_) {
    case 'signal':
      return createSignal(ast);
    
    case 'signal_expr':
      return signalExpression(ast);
    
    case 'signal_stack':
      return stack(...ast.signals.map(signalToPattern));
    
    case 'signal_alt':
      return slowcat(...ast.signals.map(signalToPattern));
    
    default:
      if (typeof ast === 'number') {
        return pure(ast);
      }
      throw new Error(`Unknown signal AST type: ${ast.type_}`);
  }
}

// Create basic signal from type and parameters
function createSignal(ast) {
  let sig;
  
  // Create base signal
  switch (ast.signal_type) {
    case 'sine':
    case 'sin':
      sig = sine;
      break;
    
    case 'saw':
    case 'sawtooth':
      sig = saw;
      break;
    
    case 'square':
    case 'sqr':
      sig = square;
      break;
    
    case 'tri':
    case 'triangle':
      sig = tri;
      break;
    
    case 'noise':
    case 'white':
      // Generate unique random value for each time point
      sig = signal(t => {
        // Use time as seed to ensure different values
        const seed = (t * 1000000) % 1;
        return Math.random();
      });
      break;
    
    case 'pink':
      // Simple pink noise approximation
      let b0 = 0, b1 = 0, b2 = 0;
      sig = signal(t => {
        const white = Math.random();
        b0 = 0.99765 * b0 + white * 0.0990460;
        b1 = 0.96300 * b1 + white * 0.2965164;
        b2 = 0.57000 * b2 + white * 1.0526913;
        const pink = (b0 + b1 + b2 + white * 0.1848) / 4;
        return pink;
      });
      break;
    
    case 'perlin':
      // Simplified perlin-like noise
      sig = signal(t => {
        const x = t * 10;
        return (Math.sin(x) + Math.sin(x * 2.1) * 0.5 + Math.sin(x * 4.3) * 0.25) / 1.75 * 0.5 + 0.5;
      });
      break;
    
    case 'env':
      // ADSR envelope (simplified - would need proper implementation)
      const { attack = 0.01, decay = 0.1, sustain = 0.7, release = 0.2 } = ast.parameters;
      sig = signal(t => {
        const cyclePos = t % 1;
        if (cyclePos < attack) {
          return cyclePos / attack;
        } else if (cyclePos < attack + decay) {
          const decayPos = (cyclePos - attack) / decay;
          return 1 - decayPos * (1 - sustain);
        } else if (cyclePos < 1 - release) {
          return sustain;
        } else {
          const releasePos = (cyclePos - (1 - release)) / release;
          return sustain * (1 - releasePos);
        }
      });
      break;
    
    case 'ramp':
      const exp = ast.parameters.params?.[0] || 1;
      sig = signal(t => Math.pow(t % 1, exp));
      break;
    
    default:
      throw new Error(`Unknown signal type: ${ast.signal_type}`);
  }
  
  // Apply frequency parameter
  if (ast.parameters.frequency) {
    sig = sig.fast(ast.parameters.frequency);
  }
  
  // Apply operations
  ast.operations.forEach(op => {
    sig = applySignalOp(sig, op);
  });
  
  return sig;
}

// Apply signal operations
function applySignalOp(sig, op) {
  switch (op.type) {
    case 'range':
      return sig.range(op.value.min, op.value.max);
    
    case 'slow':
      return sig.slow(op.value);
    
    case 'fast':
      return sig.fast(op.value);
    
    case 'modulate':
      // This would need integration with the parameter system
      // For now, just tag it
      sig._modulationTarget = op.value;
      return sig;
    
    case 'route':
      // Tag for routing
      sig._routeTarget = op.value;
      return sig;
    
    default:
      throw new Error(`Unknown signal operation: ${op.type}`);
  }
}

// Handle signal expressions (math operations)
function signalExpression(ast) {
  const left = signalToPattern(ast.left);
  const right = signalToPattern(ast.right);
  
  switch (ast.operator) {
    case '+':
      return left.add(right);
    
    case '-':
      return left.sub(right);
    
    case '*':
      return left.mul(right);
    
    case '/':
      return left.div(right);
    
    case '&':
      // Ring modulation (multiply signals)
      return left.appLeft(right);
    
    default:
      throw new Error(`Unknown signal operator: ${ast.operator}`);
  }
}

// Convenience function to use in patterns
export function sig(notation) {
  return parseSignal(notation);
}

// Register as a pattern method
Pattern.prototype.sig = function(notation) {
  const sigPattern = parseSignal(notation);
  
  // If signal has routing information, apply it
  if (sigPattern._routeTarget) {
    // Use the set method with parameter name
    return this.set({[sigPattern._routeTarget]: sigPattern});
  }
  
  // Otherwise multiply with the signal
  return this.mul(sigPattern);
};

// Helper to create modulated patterns
export function modulate(param, signalNotation) {
  const sigPattern = parseSignal(signalNotation);
  return (pat) => pat.set[param](sigPattern);
}

// Examples of usage:
/*

// Basic waveform
sig("~sine:4") // 4Hz sine wave

// With operations
sig("~sine:2 * 0.5 + 0.5") // LFO from 0 to 1

// Complex expression
sig("~sine:100 * ~sine:1") // AM synthesis

// Using with patterns
note("c3 e3 g3")
  .gain(sig("~sine:2 * 0.5 + 0.5"))
  .cutoff(sig("~saw:0.5.range(200, 2000)"))

// Routing
note("c3 e3 g3")
  .sig("~sine:4 >> gain")
  .sig("~tri:0.5 >> pan")

*/