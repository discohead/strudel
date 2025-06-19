#!/usr/bin/env node

import * as core from '@strudel/core';
import { mini } from '@strudel/mini';
import { transpiler } from './transpiler.mjs';
import * as tonal from '@strudel/tonal';

// Initialize Strudel globals
const initStrudel = () => {
  const funcs = {
    ...core,
    ...core.controls,
    ...tonal,
    mini,
  };

  // Make functions available globally for eval
  Object.entries(funcs).forEach(([name, func]) => {
    global[name] = func;
  });
  
  // Add shorthand aliases used by transpiler
  global.m = mini;
};

/**
 * Validates Strudel code by transpiling and evaluating it
 * @param {string} code - The Strudel code to validate
 * @returns {Promise<Object>} Validation result object
 */
export const validateStrudel = async (code) => {
  try {
    // Initialize environment
    initStrudel();
    
    // Transpile the code
    const transpiled = await transpiler(code, {
      wrapAsync: true,
      simpleLiterals: true,
      processDoubleQuotes: true
    });
    
    // Create async function wrapper with return
    const wrappedCode = `return (${transpiled.output})`;
    const asyncWrapper = new Function('return (async () => { ' + wrappedCode + ' })()');
    
    // Try to evaluate it
    const result = await asyncWrapper();
    
    // Check if result is a Pattern
    if (result instanceof Pattern) {
      // Try to query first cycle to ensure pattern is valid
      const events = result.firstCycle();
      return {
        valid: true,
        transpiled: transpiled.output,
        eventCount: events.length
      };
    } else {
      return {
        valid: false,
        error: 'Code did not return a Pattern object'
      };
    }
  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

// CLI usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const code = process.argv[2];
  
  if (!code) {
    console.log('Usage: node validate.mjs "<strudel code>"');
    console.log('Example: node validate.mjs "s(\\"bd sd\\")"');
    process.exit(1);
  }
  
  validateStrudel(code).then(result => {
    if (result.valid) {
      console.log('✓ Valid Strudel code');
      console.log(`  Events in first cycle: ${result.eventCount}`);
    } else {
      console.log('✗ Invalid Strudel code');
      console.log(`  Error: ${result.error}`);
    }
    process.exit(result.valid ? 0 : 1);
  });
}