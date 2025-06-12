/*
euclid.test.mjs - Tests for Euclidean rhythm functions
Copyright (C) 2023 Strudel contributors - see <https://github.com/tidalcycles/strudel/blob/main/packages/core/test/euclid.test.mjs>
This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU Affero General Public License for more details. You should have received a copy of the GNU Affero General Public License along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

import { describe, it, expect } from 'vitest';
import { bjork, euclid, euclidRot, euclidLegato, euclidLegatoRot, euclidRotPad, euclidLegatoRotPad } from '../euclid.mjs';
import { pure } from '../pattern.mjs';

describe('bjork', () => {
  it('generates correct euclidean patterns', () => {
    expect(bjork(3, 8)).toEqual([1, 0, 0, 1, 0, 0, 1, 0]);
    expect(bjork(2, 5)).toEqual([1, 0, 1, 0, 0]);
    expect(bjork(3, 4)).toEqual([1, 1, 1, 0]);
    expect(bjork(3, 5)).toEqual([1, 0, 1, 0, 1]);
    expect(bjork(3, 7)).toEqual([1, 0, 1, 0, 1, 0, 0]);
    expect(bjork(4, 7)).toEqual([1, 0, 1, 0, 1, 0, 1]);
    expect(bjork(4, 9)).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 0]);
    expect(bjork(4, 11)).toEqual([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
    expect(bjork(5, 6)).toEqual([1, 1, 1, 1, 1, 0]);
    expect(bjork(5, 7)).toEqual([1, 0, 1, 1, 0, 1, 1]);
    expect(bjork(5, 8)).toEqual([1, 0, 1, 1, 0, 1, 1, 0]);
    expect(bjork(5, 9)).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1]);
    expect(bjork(5, 11)).toEqual([1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0]);
    expect(bjork(5, 12)).toEqual([1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0]);
    expect(bjork(5, 16)).toEqual([1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0]);
    expect(bjork(7, 8)).toEqual([1, 1, 1, 1, 1, 1, 1, 0]);
    expect(bjork(7, 12)).toEqual([1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]);
    expect(bjork(7, 16)).toEqual([1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]);
    expect(bjork(9, 16)).toEqual([1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0]);
    expect(bjork(11, 24)).toEqual([1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
    expect(bjork(13, 24)).toEqual([1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0]);
  });

  it('handles edge cases', () => {
    expect(bjork(0, 8)).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    expect(bjork(8, 8)).toEqual([1, 1, 1, 1, 1, 1, 1, 1]);
    expect(bjork(1, 1)).toEqual([1]);
    expect(bjork(0, 1)).toEqual([0]);
    expect(bjork(1, 2)).toEqual([1, 0]);
  });

  it('handles negative pulses (inverted patterns)', () => {
    expect(bjork(-3, 8)).toEqual([0, 1, 1, 0, 1, 1, 0, 1]);
    expect(bjork(-2, 5)).toEqual([0, 1, 0, 1, 1]);
  });
});

describe('euclid', () => {
  it('creates euclidean patterns with Pattern', () => {
    const pattern = pure('x').euclid(3, 8);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    expect(events[0].part.begin.valueOf()).toBe(0);
    expect(events[1].part.begin.valueOf()).toBe(3/8);
    expect(events[2].part.begin.valueOf()).toBe(6/8);
  });

  it('handles various euclidean patterns', () => {
    const pattern1 = pure('x').euclid(2, 5);
    const events1 = pattern1.firstCycle();
    expect(events1.length).toBe(2);

    const pattern2 = pure('x').euclid(5, 8);
    const events2 = pattern2.firstCycle();
    expect(events2.length).toBe(5);
  });

  it('handles edge cases', () => {
    const pattern1 = pure('x').euclid(0, 8);
    const events1 = pattern1.firstCycle();
    expect(events1.length).toBe(0);

    const pattern2 = pure('x').euclid(8, 8);
    const events2 = pattern2.firstCycle();
    expect(events2.length).toBe(8);
  });
});

describe('euclidRot', () => {
  it('creates rotated euclidean patterns', () => {
    const pattern = pure('x').euclidRot(3, 8, 1);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    // After rotation by 1, pattern shifts: [1,0,0,1,0,0,1,0] -> [0,1,0,0,1,0,0,1]
    expect(events[0].part.begin.valueOf()).toBe(1/8);
    expect(events[1].part.begin.valueOf()).toBe(4/8);
    expect(events[2].part.begin.valueOf()).toBe(7/8);
  });

  it('handles rotation of 0 (same as euclid)', () => {
    const pattern1 = pure('x').euclidRot(3, 8, 0);
    const pattern2 = pure('x').euclid(3, 8);
    const events1 = pattern1.firstCycle();
    const events2 = pattern2.firstCycle();
    
    expect(events1.length).toBe(events2.length);
    events1.forEach((e, i) => {
      expect(e.part.begin.valueOf()).toBe(events2[i].part.begin.valueOf());
    });
  });

  it('handles large rotations', () => {
    const pattern = pure('x').euclidRot(3, 8, 8);
    const events = pattern.firstCycle();
    // Rotation by 8 should be same as rotation by 0 (full cycle)
    expect(events[0].part.begin.valueOf()).toBe(0);
  });

  it('handles negative rotation', () => {
    const pattern = pure('x').euclidRot(3, 8, -1);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    // Negative rotation goes the other way
    expect(events[0].part.begin.valueOf()).toBe(2/8);
    expect(events[1].part.begin.valueOf()).toBe(5/8);
    expect(events[2].part.begin.valueOf()).toBe(7/8);
  });
});

describe('euclidLegato', () => {
  it('creates legato euclidean patterns', () => {
    const pattern = pure('x').euclidLegato(3, 8);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    
    // Each event should last until the next one
    expect(events[0].part.begin.valueOf()).toBe(0);
    expect(events[0].part.end.valueOf()).toBe(3/8);
    expect(events[1].part.begin.valueOf()).toBe(3/8);
    expect(events[1].part.end.valueOf()).toBe(6/8);
    expect(events[2].part.begin.valueOf()).toBe(6/8);
    expect(events[2].part.end.valueOf()).toBe(1);
  });

  it('handles patterns with consecutive pulses', () => {
    const pattern = pure('x').euclidLegato(3, 4);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    
    // Pattern is [1,1,1,0], so durations are different
    expect(events[0].part.begin.valueOf()).toBe(0);
    expect(events[0].part.end.valueOf()).toBe(1/4);
    expect(events[1].part.begin.valueOf()).toBe(1/4);
    expect(events[1].part.end.valueOf()).toBe(2/4);
    expect(events[2].part.begin.valueOf()).toBe(2/4);
    expect(events[2].part.end.valueOf()).toBe(1);
  });

  it('handles edge cases', () => {
    const pattern1 = pure('x').euclidLegato(0, 8);
    const events1 = pattern1.firstCycle();
    expect(events1.length).toBe(0);

    const pattern2 = pure('x').euclidLegato(1, 8);
    const events2 = pattern2.firstCycle();
    expect(events2.length).toBe(1);
    expect(events2[0].part.begin.valueOf()).toBe(0);
    expect(events2[0].part.end.valueOf()).toBe(1);
  });
});

describe('euclidLegatoRot', () => {
  it('creates rotated legato euclidean patterns', () => {
    const pattern = pure('x').euclidLegatoRot(3, 8, 3);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    
    // After rotation by 3, pattern starts at different position
    // Original: [1,0,0,1,0,0,1,0] rotated by 3 becomes [1,0,0,1,0,1,0,0]
    const firstBegin = events[0].part.begin.valueOf();
    expect(firstBegin).toBe(0);
  });

  it('handles rotation of 0 (same as euclidLegato)', () => {
    const pattern1 = pure('x').euclidLegatoRot(3, 8, 0);
    const pattern2 = pure('x').euclidLegato(3, 8);
    const events1 = pattern1.firstCycle();
    const events2 = pattern2.firstCycle();
    
    expect(events1.length).toBe(events2.length);
    events1.forEach((e, i) => {
      expect(e.part.begin.valueOf()).toBe(events2[i].part.begin.valueOf());
      expect(e.part.end.valueOf()).toBe(events2[i].part.end.valueOf());
    });
  });
});

describe('euclidRotPad', () => {
  it('creates padded euclidean patterns', () => {
    const pattern = pure('x').euclidRotPad(3, 8, 0, 2, 0);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    
    // Pattern has 10 steps total (8 + 2 padding)
    // Original pattern: [1,0,0,1,0,0,1,0] + [0,0] = [1,0,0,1,0,0,1,0,0,0]
    expect(events[0].part.begin.valueOf()).toBe(0);
    expect(events[1].part.begin.valueOf()).toBe(3/10);
    expect(events[2].part.begin.valueOf()).toBe(6/10);
  });

  it('creates padded and rotated patterns', () => {
    const pattern = pure('x').euclidRotPad(3, 8, 2, 2, 0);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    
    // Rotation happens after padding
    const firstBegin = events[0].part.begin.valueOf();
    expect(firstBegin).not.toBe(0);
  });

  it('handles custom pad values', () => {
    const pattern = pure('x').euclidRotPad(3, 8, 0, 2, 1);
    const events = pattern.firstCycle();
    // With padValue=1, we should get 5 events total (3 from pattern + 2 from padding)
    expect(events.length).toBe(5);
  });

  it('handles string pad values', () => {
    const pattern = pure('bd').euclidRotPad(3, 8, 0, 2, 'hh');
    const events = pattern.firstCycle();
    // When padValue is a non-zero value, it adds additional events
    expect(events.length).toBe(5);
    
    // All events have the original value 'bd' because struct applies structure to the pattern value
    expect(events[0].value).toBe('bd');
    expect(events[1].value).toBe('bd');
    expect(events[2].value).toBe('bd');
    expect(events[3].value).toBe('bd');
    expect(events[4].value).toBe('bd');
  });

  it('handles no padding', () => {
    const pattern1 = pure('x').euclidRotPad(3, 8, 1, 0, 0);
    const pattern2 = pure('x').euclidRot(3, 8, 1);
    const events1 = pattern1.firstCycle();
    const events2 = pattern2.firstCycle();
    
    expect(events1.length).toBe(events2.length);
    events1.forEach((e, i) => {
      expect(e.part.begin.valueOf()).toBeCloseTo(events2[i].part.begin.valueOf(), 10);
    });
  });
});

describe('euclidLegatoRotPad', () => {
  it('creates padded legato euclidean patterns', () => {
    const pattern = pure('x').euclidLegatoRotPad(3, 8, 0, 2, 0);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    
    // Each event extends to the next, with 10 total steps
    expect(events[0].part.begin.valueOf()).toBe(0);
    expect(events[0].part.end.valueOf()).toBe(3/10);
    expect(events[1].part.begin.valueOf()).toBe(3/10);
    expect(events[1].part.end.valueOf()).toBe(6/10);
    expect(events[2].part.begin.valueOf()).toBe(6/10);
    expect(events[2].part.end.valueOf()).toBe(1);
  });

  it('creates padded and rotated legato patterns', () => {
    const pattern = pure('x').euclidLegatoRotPad(3, 8, 3, 2, 0);
    const events = pattern.firstCycle();
    expect(events.length).toBe(3);
    
    // Just verify that we get 3 events with legato behavior
    // All events should connect without gaps
    for (let i = 0; i < events.length - 1; i++) {
      expect(events[i].part.end.valueOf()).toBeCloseTo(events[i + 1].part.begin.valueOf(), 10);
    }
    // Last event should end at cycle boundary
    expect(events[events.length - 1].part.end.valueOf()).toBe(1);
  });

  it('handles custom pad values in legato mode', () => {
    const pattern = pure('x').euclidLegatoRotPad(3, 8, 0, 2, 1);
    const events = pattern.firstCycle();
    // With padValue=1, we get 5 legato events
    expect(events.length).toBe(5);
    
    // All events should connect without gaps
    for (let i = 0; i < events.length - 1; i++) {
      expect(events[i].part.end.valueOf()).toBeCloseTo(events[i + 1].part.begin.valueOf(), 10);
    }
  });

  it('handles string pad values in legato mode', () => {
    const pattern = pure('bd').euclidLegatoRotPad(3, 8, 0, 2, 'hh');
    const events = pattern.firstCycle();
    // struct only applies timing, not values
    expect(events.length).toBe(3);
    
    // Check values - all should be 'bd'
    expect(events[0].value).toBe('bd');
    expect(events[1].value).toBe('bd');
    expect(events[2].value).toBe('bd');
  });

  it('handles no padding', () => {
    const pattern1 = pure('x').euclidLegatoRotPad(3, 8, 1, 0, 0);
    const pattern2 = pure('x').euclidLegatoRot(3, 8, 1);
    const events1 = pattern1.firstCycle();
    const events2 = pattern2.firstCycle();
    
    expect(events1.length).toBe(events2.length);
    events1.forEach((e, i) => {
      expect(e.part.begin.valueOf()).toBeCloseTo(events2[i].part.begin.valueOf(), 10);
      expect(e.part.end.valueOf()).toBeCloseTo(events2[i].part.end.valueOf(), 10);
    });
  });

  it('handles edge case with 0 pulses', () => {
    const pattern = pure('x').euclidLegatoRotPad(0, 8, 0, 2, 0);
    const events = pattern.firstCycle();
    expect(events.length).toBe(0);
  });
});

describe('internal helper functions', () => {
  it('left and right functions balance distribution correctly', () => {
    // The bjork algorithm should distribute pulses evenly
    // This is tested implicitly through the bjork tests above
    
    // Test that patterns are maximally even
    const pattern = bjork(5, 13);
    let gaps = [];
    let lastOne = -1;
    
    for (let i = 0; i < pattern.length; i++) {
      if (pattern[i] === 1) {
        if (lastOne !== -1) {
          gaps.push(i - lastOne);
        }
        lastOne = i;
      }
    }
    
    // In a maximally even distribution, gap sizes differ by at most 1
    const uniqueGaps = [...new Set(gaps)];
    expect(uniqueGaps.length).toBeLessThanOrEqual(2);
    if (uniqueGaps.length === 2) {
      expect(Math.abs(uniqueGaps[0] - uniqueGaps[1])).toBe(1);
    }
  });
});