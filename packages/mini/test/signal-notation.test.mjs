/*
signal-notation.test.mjs - Tests for signal mini notation
*/

import { describe, it, expect } from 'vitest';
import { parseSignal, sig, modulate } from '../signal-notation.mjs';
import { Pattern, pure } from '@strudel/core';

describe('signal notation', () => {
  describe('basic signals', () => {
    it('parses sine wave and generates correct values', () => {
      const signal = parseSignal('~sine');
      expect(signal).toBeInstanceOf(Pattern);
      expect(signal.firstCycle().length).toBe(1);
      
      // Verify unipolar sine wave shape - should start at 0.5, peak at 1, valley at 0
      const points = [];
      for (let i = 0; i <= 8; i++) {
        const events = signal.queryArc(i/8, (i+1)/8);
        if (events.length > 0) points.push(events[0].value);
      }
      
      // Should have smooth transitions
      expect(points[0]).toBeCloseTo(0.5, 1); // Start near 0.5
      expect(Math.max(...points)).toBeCloseTo(1, 1); // Peak near 1
      expect(Math.min(...points)).toBeCloseTo(0, 1); // Valley near 0
    });
    
    it('parses saw wave and generates sawtooth values', () => {
      const signal = parseSignal('~saw');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Verify unipolar sawtooth wave - should ramp from 0 to 1
      const start = signal.queryArc(0, 0.01)[0].value;
      const middle = signal.queryArc(0.5, 0.51)[0].value;
      const nearEnd = signal.queryArc(0.99, 1)[0].value;
      
      expect(start).toBeCloseTo(0, 1);
      expect(middle).toBeCloseTo(0.5, 1);
      expect(nearEnd).toBeCloseTo(1, 1);
    });
    
    it('parses square wave and generates square values', () => {
      const signal = parseSignal('~square');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Verify unipolar square wave - should be 0 or 1
      const firstHalf = signal.queryArc(0.25, 0.26)[0].value;
      const secondHalf = signal.queryArc(0.75, 0.76)[0].value;
      
      expect(firstHalf).toBe(0);
      expect(secondHalf).toBe(1);
    });
    
    it('parses triangle wave and generates triangular values', () => {
      const signal = parseSignal('~tri');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Verify unipolar triangle wave shape - rises then falls
      const start = signal.queryArc(0, 0.01)[0].value;
      const quarter = signal.queryArc(0.25, 0.26)[0].value;
      const half = signal.queryArc(0.5, 0.51)[0].value;
      const threeQuarter = signal.queryArc(0.75, 0.76)[0].value;
      
      expect(start).toBeCloseTo(0, 1);
      expect(quarter).toBeCloseTo(0.5, 1); // Midpoint rising
      expect(half).toBeCloseTo(1, 1); // Peak
      expect(threeQuarter).toBeCloseTo(0.5, 1); // Midpoint falling
    });
  });
  
  describe('frequency control', () => {
    it('parses frequency parameter and completes correct number of cycles', () => {
      const signal = parseSignal('~sine:4');
      expect(signal).toBeInstanceOf(Pattern);
      
      // The signal should complete 4 cycles in one pattern cycle
      // Count peaks to verify frequency
      let peaks = 0;
      let lastValue = null;
      let wasIncreasing = null;
      
      for (let i = 0; i <= 100; i++) {
        const t = i / 100;
        const events = signal.queryArc(t, t + 0.01);
        if (events.length > 0) {
          const value = events[0].value;
          if (lastValue !== null) {
            const isIncreasing = value > lastValue;
            if (wasIncreasing && !isIncreasing && value > 0.9) {
              peaks++;
            }
            wasIncreasing = isIncreasing;
          }
          lastValue = value;
        }
      }
      
      // Should have 4 peaks for 4 cycles
      expect(peaks).toBe(4);
    });
    
    it('handles decimal frequencies for slower oscillation', () => {
      const signal = parseSignal('~saw:0.5');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Should complete only half a cycle in one pattern cycle
      const start = signal.queryArc(0, 0.01)[0].value;
      const end = signal.queryArc(0.99, 1)[0].value;
      
      // For 0.5 frequency, should go from 0 to 0.5 in one cycle
      expect(start).toBeCloseTo(0, 1);
      expect(end).toBeCloseTo(0.5, 1);
    });
    
    it('handles high frequencies correctly', () => {
      const signal = parseSignal('~square:10');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Should have many transitions for high frequency
      let transitions = 0;
      let lastValue = null;
      
      for (let i = 0; i < 100; i++) {
        const t = i / 100;
        const events = signal.queryArc(t, t + 0.01);
        if (events.length > 0) {
          const value = events[0].value;
          if (lastValue !== null && lastValue !== value) {
            transitions++;
          }
          lastValue = value;
        }
      }
      
      // 10 Hz square wave = ~20 transitions (10 cycles * 2 transitions per cycle)
      expect(transitions).toBeGreaterThan(15);
    });
  });
  
  describe('signal expressions', () => {
    it('handles multiplication correctly', () => {
      const signal = parseSignal('~sine * 0.5');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Values should be scaled by 0.5
      const values = [];
      for (let i = 0; i <= 20; i++) {
        const events = signal.queryArc(i/20, (i+1)/20);
        if (events.length > 0) values.push(events[0].value);
      }
      
      // Sine goes from 0 to 1, so * 0.5 should give 0 to 0.5
      expect(Math.max(...values)).toBeLessThanOrEqual(0.5);
      expect(Math.min(...values)).toBeGreaterThanOrEqual(0);
      // Verify it's still a sine shape, just scaled
      expect(values.some(v => v > 0.4)).toBe(true); // Has peaks near 0.5
      expect(values.some(v => v < 0.1)).toBe(true); // Has valleys near 0
    });
    
    it('handles addition to shift range', () => {
      const signal = parseSignal('~sine * 0.5 + 0.5');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Sine (0 to 1) * 0.5 (0 to 0.5) + 0.5 = (0.5 to 1)
      const values = [];
      for (let i = 0; i <= 20; i++) {
        const events = signal.queryArc(i/20, (i+1)/20);
        if (events.length > 0) values.push(events[0].value);
      }
      
      expect(Math.min(...values)).toBeGreaterThanOrEqual(0.5);
      expect(Math.max(...values)).toBeLessThanOrEqual(1);
      // Center should be around 0.75
      const avg = values.reduce((a, b) => a + b) / values.length;
      expect(avg).toBeCloseTo(0.75, 1);
    });
    
    it('handles complex expressions with signal multiplication', () => {
      const signal = parseSignal('~sine:2 * ~saw:1');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Result should be amplitude modulation
      const values = [];
      for (let i = 0; i <= 40; i++) {
        const events = signal.queryArc(i/40, (i+1)/40);
        if (events.length > 0) values.push(events[0].value);
      }
      
      // Should have complex waveform with values between -1 and 1
      expect(Math.max(...values)).toBeLessThanOrEqual(1);
      expect(Math.min(...values)).toBeGreaterThanOrEqual(-1);
      // Should have variety from modulation
      const uniqueValues = new Set(values.map(v => Math.round(v * 100)));
      expect(uniqueValues.size).toBeGreaterThan(10);
    });
    
    it('respects operator precedence', () => {
      const signal1 = parseSignal('~sine + ~saw * 0.5');
      const signal2 = parseSignal('(~sine + ~saw) * 0.5');
      
      // Get values at same point
      const val1 = signal1.queryArc(0.25, 0.26)[0].value;
      const val2 = signal2.queryArc(0.25, 0.26)[0].value;
      
      // These should be different due to precedence
      expect(Math.abs(val1 - val2)).toBeGreaterThan(0.1);
      
      // signal1 should have larger range (sine ± 1 + saw * 0.5 ± 0.5)
      const values1 = [];
      const values2 = [];
      for (let i = 0; i <= 20; i++) {
        const t = i/20;
        values1.push(signal1.queryArc(t, t + 0.01)[0].value);
        values2.push(signal2.queryArc(t, t + 0.01)[0].value);
      }
      
      const range1 = Math.max(...values1) - Math.min(...values1);
      const range2 = Math.max(...values2) - Math.min(...values2);
      expect(range1).toBeGreaterThan(range2);
    });
  });
  
  describe('signal operations', () => {
    it('handles range mapping', () => {
      const signal = parseSignal('~sine.range(200, 2000)');
      expect(signal).toBeInstanceOf(Pattern);
      const values = signal.queryArc(0, 1).map(h => h.value);
      expect(Math.min(...values)).toBeGreaterThanOrEqual(200);
      expect(Math.max(...values)).toBeLessThanOrEqual(2000);
    });
    
    it('handles time scaling', () => {
      const signal = parseSignal('~sine.slow(2)');
      expect(signal).toBeInstanceOf(Pattern);
    });
  });
  
  describe('composite patterns', () => {
    it('handles signal stacks with overlapping events', () => {
      const signal = parseSignal('[~sine:1, ~saw:2]');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Should have overlapping events from both signals
      const events = signal.queryArc(0, 0.1);
      expect(events.length).toBeGreaterThanOrEqual(2); // At least 2 signals
      
      // Verify we have different values (from different waveforms)
      const values = events.map(e => e.value);
      const uniqueValues = new Set(values.map(v => Math.round(v * 1000)));
      expect(uniqueValues.size).toBeGreaterThan(1);
      
      // Check that events overlap in time
      const overlapping = events.some((e1, i) => 
        events.some((e2, j) => i !== j && 
          e1.part.begin.valueOf() < e2.part.end.valueOf() &&
          e2.part.begin.valueOf() < e1.part.end.valueOf()
        )
      );
      expect(overlapping).toBe(true);
    });
    
    it('handles signal alternation between different waveforms', () => {
      const signal = parseSignal('<~sine ~square ~tri>');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Should alternate between signals each cycle
      // Cycle 0: sine
      const cycle0 = signal.queryArc(0.25, 0.26)[0].value;
      // Cycle 1: square
      const cycle1 = signal.queryArc(1.25, 1.26)[0].value;
      // Cycle 2: triangle
      const cycle2 = signal.queryArc(2.25, 2.26)[0].value;
      
      // Sine at 0.25 should be at peak (1)
      expect(cycle0).toBeCloseTo(1, 1);
      
      // Square at 0.25 should be 0 (first half)
      expect(cycle1).toBe(0);
      
      // Triangle at 0.25 should be 0.5 (midpoint rising)
      expect(cycle2).toBeCloseTo(0.5, 1);
      
      // Verify different cycles have different waveforms
      // by checking characteristic points
      const sine75 = signal.queryArc(0.75, 0.76)[0].value; // sine at 3/4
      const square75 = signal.queryArc(1.75, 1.76)[0].value; // square at 3/4
      
      expect(sine75).toBeCloseTo(0, 1); // Sine valley
      expect(square75).toBe(1); // Square high
      
      // But sine should have smooth transition, square should be sharp
      const sine74 = signal.queryArc(0.74, 0.75)[0].value;
      
      // Sine should have gradual change
      expect(Math.abs(sine75 - sine74)).toBeLessThan(0.2);
    });
    
    it('handles nested composite patterns', () => {
      const signal = parseSignal('[[~sine:1, ~saw:2], ~square:0.5]');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Should have multiple overlapping signals
      const events = signal.queryArc(0, 0.1);
      expect(events.length).toBeGreaterThanOrEqual(3); // sine, saw, and square
    });
  });
  
  describe('noise generators', () => {
    it('generates white noise', () => {
      const signal = parseSignal('~noise');
      expect(signal).toBeInstanceOf(Pattern);
      const values = signal.queryArc(0, 1).map(h => h.value);
      // Values should be random between 0 and 1
      expect(values.every(v => v >= 0 && v <= 1)).toBe(true);
      // Should have variation - check we have multiple values
      expect(values.length).toBeGreaterThan(0);
      // Since it's continuous, we might only get one value per arc
      // Let's query multiple points
      const multiValues = [];
      for (let i = 0; i < 10; i++) {
        const v = signal.queryArc(i/10, (i+1)/10);
        if (v.length > 0) multiValues.push(v[0].value);
      }
      expect(new Set(multiValues).size).toBeGreaterThan(1);
    });
    
    it('generates perlin noise', () => {
      const signal = parseSignal('~perlin');
      expect(signal).toBeInstanceOf(Pattern);
      const values = signal.queryArc(0, 0.1).map(h => h.value);
      // Should be smoother than white noise
      expect(values.every(v => v >= 0 && v <= 1)).toBe(true);
    });
  });
  
  describe('envelope generator', () => {
    it('generates ADSR envelope with correct shape', () => {
      const signal = parseSignal('~env(0.1, 0.1, 0.7, 0.2)');
      expect(signal).toBeInstanceOf(Pattern);
      
      // Should start at 0, rise to 1, decay to sustain, release to 0
      // Attack: 0-0.1 (10% of cycle)
      // Decay: 0.1-0.2 (10% of cycle)  
      // Sustain: 0.2-0.8 (until release)
      // Release: 0.8-1.0 (20% of cycle)
      
      // Start of envelope (should be 0)
      const start = signal.queryArc(0, 0.01)[0].value;
      expect(start).toBeCloseTo(0, 2);
      
      // Peak after attack (should be 1)
      const peak = signal.queryArc(0.1, 0.11)[0].value;
      expect(peak).toBeCloseTo(1, 1);
      
      // Sustain level (should be 0.7)
      const sustain = signal.queryArc(0.5, 0.51)[0].value;
      expect(sustain).toBeCloseTo(0.7, 1);
      
      // End of envelope (should be near 0)
      const end = signal.queryArc(0.99, 1)[0].value;
      expect(end).toBeLessThan(0.1);
      
      // Verify attack phase rises
      const attack1 = signal.queryArc(0.05, 0.06)[0].value;
      expect(attack1).toBeGreaterThan(0.3);
      expect(attack1).toBeLessThan(0.7);
      
      // Verify decay phase falls
      const decay1 = signal.queryArc(0.15, 0.16)[0].value;
      expect(decay1).toBeLessThan(1);
      expect(decay1).toBeGreaterThan(0.7);
      
      // Verify release phase falls
      const release1 = signal.queryArc(0.9, 0.91)[0].value;
      expect(release1).toBeLessThan(0.7);
      expect(release1).toBeGreaterThan(0);
    });
    
    it('handles different ADSR parameters', () => {
      // Fast attack, slow release
      const fastAttack = parseSignal('~env(0.01, 0.1, 0.5, 0.5)');
      const attack = fastAttack.queryArc(0.01, 0.02)[0].value;
      expect(attack).toBeCloseTo(1, 1); // Should reach peak quickly
      
      // No sustain (pluck-like)
      const pluck = parseSignal('~env(0.01, 0.89, 0, 0.1)');
      const mid = pluck.queryArc(0.5, 0.51)[0].value;
      expect(mid).toBeLessThan(0.5); // Should be in decay phase
    });
  });
  
  describe('integration with patterns', () => {
    it('can be used with pattern methods', () => {
      const pattern = pure(60);
      const modulated = pattern.mul(sig('~sine:2'));
      expect(modulated).toBeInstanceOf(Pattern);
    });
    
    it('supports the sig pattern method', () => {
      const pattern = pure({ gain: 1 });
      const result = pattern.sig('~sine:4 >> gain');
      expect(result).toBeInstanceOf(Pattern);
    });
  });
  
  describe('error handling', () => {
    it('throws on invalid syntax', () => {
      expect(() => parseSignal('~invalid')).toThrow(/Signal notation parse error/);
    });
    
    it('throws on unknown signal type', () => {
      expect(() => parseSignal('~unknown')).toThrow(/Signal notation parse error/);
    });
    
    it('throws on malformed expressions', () => {
      expect(() => parseSignal('~sine +')).toThrow(/parse error/);
    });
    
    it('throws on incomplete operations', () => {
      expect(() => parseSignal('~sine *')).toThrow(/parse error/);
      expect(() => parseSignal('~sine.range(200)')).toThrow(/parse error/);
      expect(() => parseSignal('~sine >>')).toThrow(/parse error/);
    });
    
    it('throws on invalid brackets', () => {
      expect(() => parseSignal('[~sine')).toThrow(/parse error/);
      expect(() => parseSignal('~sine]')).toThrow(/parse error/);
      expect(() => parseSignal('<~sine ~square')).toThrow(/parse error/);
    });
    
    it('throws on invalid parameters', () => {
      expect(() => parseSignal('~sine:')).toThrow(/parse error/);
      expect(() => parseSignal('~env()')).toThrow(/parse error/);
      // Note: ~env with partial params doesn't throw - it uses defaults
    });
    
    it('throws on nested errors', () => {
      expect(() => parseSignal('[~sine, ~invalid]')).toThrow(/Signal notation parse error/);
      expect(() => parseSignal('~sine * ~unknown')).toThrow(/Signal notation parse error/);
    });
  });
});

describe('sig helper function', () => {
  it('provides convenient access to signal notation', () => {
    const signal = sig('~sine:2 * 0.5 + 0.5');
    expect(signal).toBeInstanceOf(Pattern);
  });
});

describe('modulate helper function', () => {
  it('creates modulation functions', () => {
    const modGain = modulate('gain', '~sine:4 * 0.5 + 0.5');
    expect(modGain).toBeInstanceOf(Function);
  });
});

describe('additional signal features', () => {
  it('supports multiple signal types with aliases', () => {
    // Test signal type aliases
    const sin = parseSignal('~sin');
    const sine = parseSignal('~sine');
    expect(sin.queryArc(0.25, 0.26)[0].value).toBeCloseTo(sine.queryArc(0.25, 0.26)[0].value, 5);
    
    const sqr = parseSignal('~sqr');
    const square = parseSignal('~square');
    expect(sqr.queryArc(0.25, 0.26)[0].value).toBe(square.queryArc(0.25, 0.26)[0].value);
  });
  
  it('handles chained operations', () => {
    const signal = parseSignal('~sine:2.slow(2).range(100, 200)');
    expect(signal).toBeInstanceOf(Pattern);
    
    // Should be slowed down and in range
    const values = [];
    for (let i = 0; i < 10; i++) {
      const events = signal.queryArc(i/10, (i+1)/10);
      if (events.length > 0) values.push(events[0].value);
    }
    
    expect(Math.min(...values)).toBeGreaterThanOrEqual(100);
    expect(Math.max(...values)).toBeLessThanOrEqual(200);
  });
  
  it('handles time scaling operations', () => {
    const fast = parseSignal('~sine.fast(2)');
    const slow = parseSignal('~sine.slow(2)');
    const normal = parseSignal('~sine');
    
    // Compare specific points to verify scaling
    // At t=0.25, normal sine should be at peak (1)
    const normalAt025 = normal.queryArc(0.25, 0.26)[0].value;
    // Fast(2) should reach same point at t=0.125
    const fastAt0125 = fast.queryArc(0.125, 0.126)[0].value;
    // Slow(2) should reach same point at t=0.5
    const slowAt05 = slow.queryArc(0.5, 0.51)[0].value;
    
    expect(normalAt025).toBeCloseTo(1, 1);
    expect(fastAt0125).toBeCloseTo(1, 1);
    expect(slowAt05).toBeCloseTo(1, 1);
  });
  
  it('supports routing notation', () => {
    const signal = parseSignal('~sine:2 >> cutoff');
    expect(signal).toBeInstanceOf(Pattern);
    expect(signal._routeTarget).toBe('cutoff');
  });
  
  it('handles parentheses in expressions', () => {
    const signal1 = parseSignal('(~sine + ~saw) * 0.5');
    const signal2 = parseSignal('~sine + ~saw * 0.5');
    
    // These should produce different results
    const val1 = signal1.queryArc(0.3, 0.31)[0].value;
    const val2 = signal2.queryArc(0.3, 0.31)[0].value;
    
    expect(Math.abs(val1 - val2)).toBeGreaterThan(0.01);
  });
  
  it('handles edge cases for noise generators', () => {
    // White noise alias
    const white = parseSignal('~white');
    expect(white).toBeInstanceOf(Pattern);
    
    // Pink noise
    const pink = parseSignal('~pink');
    expect(pink).toBeInstanceOf(Pattern);
    const pinkVal = pink.queryArc(0.5, 0.51)[0].value;
    expect(pinkVal).toBeGreaterThanOrEqual(0);
    expect(pinkVal).toBeLessThanOrEqual(1);
  });
});