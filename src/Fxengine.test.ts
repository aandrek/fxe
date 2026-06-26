import Fxengine from '../src/Fxengine';
import { Clock } from 'three';

describe('Fxengine', () => {
  let fxe: Fxengine;
  let clock: Clock;

  beforeEach(() => {
    clock = new Clock();
    fxe = new Fxengine(clock, 120);
  });

  describe('Constructor', () => {
    it('should create an instance with default values', () => {
      const fxeDefault = new Fxengine();
      expect(fxeDefault).toBeInstanceOf(Fxengine);
      expect(fxeDefault.bpm).toBe(120);
      expect(fxeDefault.clock).toBeDefined();
    });

    it('should create an instance with custom BPM', () => {
      expect(fxe.bpm).toBe(120);
      expect(fxe.effectWindow).toBe(0.5); // 60/120 = 0.5 seconds
    });

    it('should create an instance with custom clock', () => {
      expect(fxe.clock).toBe(clock);
    });

    it('should initialize constants correctly', () => {
      expect(fxe.DEG2RAD).toBeCloseTo(Math.PI / 180);
      expect(fxe.speeds).toEqual([4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 1 / 16]);
    });
  });

  describe('setEffectWindow', () => {
    it('should calculate effect window based on BPM', () => {
      fxe.bpm = 60;
      fxe.setEffectWindow();
      expect(fxe.effectWindow).toBe(1); // 60/60 = 1 second

      fxe.bpm = 120;
      fxe.setEffectWindow();
      expect(fxe.effectWindow).toBe(0.5); // 60/120 = 0.5 seconds

      fxe.bpm = 240;
      fxe.setEffectWindow();
      expect(fxe.effectWindow).toBe(0.25); // 60/240 = 0.25 seconds
    });
  });

  describe('fxPercentInterpolation', () => {
    it('should interpolate between min and max values', () => {
      expect(fxe.fxPercentInterpolation(0, 100, 0)).toBe(0);
      expect(fxe.fxPercentInterpolation(0, 100, 0.5)).toBe(50);
      expect(fxe.fxPercentInterpolation(0, 100, 1)).toBe(100);
    });

    it('should work with negative ranges', () => {
      expect(fxe.fxPercentInterpolation(-100, 100, 0)).toBe(-100);
      expect(fxe.fxPercentInterpolation(-100, 100, 0.5)).toBe(0);
      expect(fxe.fxPercentInterpolation(-100, 100, 1)).toBe(100);
    });

    it('should work with decimal percentages', () => {
      expect(fxe.fxPercentInterpolation(0, 10, 0.25)).toBe(2.5);
      expect(fxe.fxPercentInterpolation(0, 10, 0.75)).toBe(7.5);
    });
  });

  describe('fxMidiInterpolation', () => {
    it('should interpolate MIDI values (0-127) to custom range', () => {
      expect(fxe.fxMidiInterpolation(0, 100, 0)).toBe(0);
      expect(fxe.fxMidiInterpolation(0, 100, 127)).toBe(100);
      expect(fxe.fxMidiInterpolation(0, 100, 63.5)).toBeCloseTo(50, 1);
    });

    it('should handle negative ranges', () => {
      expect(fxe.fxMidiInterpolation(-100, 100, 0)).toBe(-100);
      expect(fxe.fxMidiInterpolation(-100, 100, 127)).toBe(100);
    });

    it('should return 0 for middle MIDI value (64) in symmetric ranges', () => {
      expect(fxe.fxMidiInterpolation(-100, 100, 64)).toBe(0);
      expect(fxe.fxMidiInterpolation(-50, 50, 64)).toBe(0);
    });
  });

  describe('fxBPMWaveInterpolation', () => {
    it('should return values within min and max range', () => {
      const result = fxe.fxBPMWaveInterpolation(0, 100, 0, 1);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });

    it('should work with negative ranges', () => {
      const result = fxe.fxBPMWaveInterpolation(-50, 50, 0, 1);
      expect(result).toBeGreaterThanOrEqual(-50);
      expect(result).toBeLessThanOrEqual(50);
    });

    it('should accept custom easing functions', () => {
      const linearEasing = (v: number) => v;
      const result = fxe.fxBPMWaveInterpolation(0, 100, 0, 1, linearEasing);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(100);
    });
  });

  describe('fxStrobe', () => {
    it('should toggle between two values', () => {
      const result = fxe.fxStrobe('red', 'blue', 0, 1);
      expect(['red', 'blue']).toContain(result);
    });

    it('should work with numeric values', () => {
      const result = fxe.fxStrobe(0, 1, 0, 1);
      expect([0, 1]).toContain(result);
    });

    it('should work with objects', () => {
      const obj1 = { color: 'red' };
      const obj2 = { color: 'blue' };
      const result = fxe.fxStrobe(obj1, obj2, 0, 1);
      expect([obj1, obj2]).toContain(result);
    });
  });

  describe('fxBPMArrayValue', () => {
    it('should return a value from the array', () => {
      const values = [1, 2, 3, 4, 5];
      const result = fxe.fxBPMArrayValue(values, 0, 1);
      expect(values).toContain(result);
    });

    it('should work with string arrays', () => {
      const colors = ['red', 'green', 'blue', 'yellow'];
      const result = fxe.fxBPMArrayValue(colors, 0, 1);
      expect(colors).toContain(result);
    });

    it('should handle single element arrays', () => {
      const result = fxe.fxBPMArrayValue([42], 0, 1);
      expect(result).toBe(42);
    });
  });

  describe('getCurrentFxWindowPercent', () => {
    it('should return a value between 0 and 1 when looping', () => {
      clock.start();
      const result = fxe.getCurrentFxWindowPercent(0, 1, true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    it('should handle offset percentage', () => {
      clock.start();
      const result = fxe.getCurrentFxWindowPercent(0.5, 1, true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });

    it('should handle beat measure multiplier', () => {
      clock.start();
      const result = fxe.getCurrentFxWindowPercent(0, 2, true);
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThanOrEqual(1);
    });
  });

  describe('getCurrentWindowIdentifier', () => {
    it('should return an integer identifier', () => {
      clock.start();
      const id = fxe.getCurrentWindowIdentifier(0, 1);
      expect(Number.isInteger(id)).toBe(true);
      expect(id).toBeGreaterThanOrEqual(0);
    });

    it('should return consistent IDs within the same window', () => {
      clock.start();
      const id1 = fxe.getCurrentWindowIdentifier(0, 1);
      const id2 = fxe.getCurrentWindowIdentifier(0, 1);
      expect(id1).toBe(id2);
    });
  });

  describe('fxBPMCallFn', () => {
    it('should call function when window identifier changes', () => {
      const mockFn = jest.fn();

      // First call in initial window
      fxe.fxBPMCallFn(mockFn, 0, 1);
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Same window, should not call again
      fxe.fxBPMCallFn(mockFn, 0, 1);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('should handle different offset and beat measure parameters', () => {
      const mockFn = jest.fn();

      // Different parameters should be treated as different windows
      fxe.fxBPMCallFn(mockFn, 0, 1);
      fxe.fxBPMCallFn(mockFn, 0.5, 1);
      fxe.fxBPMCallFn(mockFn, 0, 2);

      expect(mockFn).toHaveBeenCalledTimes(3);
    });

    it('should not call non-function arguments', () => {
      // @ts-expect-error - testing edge case with non-function
      expect(() => fxe.fxBPMCallFn(null, 0, 1)).not.toThrow();
      // @ts-expect-error - testing edge case with non-function
      expect(() => fxe.fxBPMCallFn(undefined, 0, 1)).not.toThrow();
    });
  });

  describe('getClock', () => {
    it('should return the clock instance', () => {
      const clockInstance = fxe.getClock();
      expect(clockInstance).toBe(clock);
      expect(clockInstance).toBeInstanceOf(Clock);
    });
  });
});
