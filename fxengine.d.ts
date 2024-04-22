// fxengine.d.ts

declare class Fxengine {
  DEG2RAD: number;
  speeds: number[];
  clock: any; // Aquí deberías definir el tipo correcto para Clock si lo conoces
  bpm: number;
  effectWindow: any; // Deberías definir el tipo correcto para effectWindow si lo conoces
  cache: any[];
  lastWindowIdentifier: number;
  cacheWindowIdentifiers: any[];

  constructor(clock?: any, bpm?: number);

  getClock(): any;

  fxBPMCallFn(fn: () => void, offsetPercentage?: number, beatMeasure?: number): void;

  fxMidiInterpolation(minValue: number, maxValue: number, midiValue: number): number;

  fxPercentInterpolation(minValue: number, maxValue: number, percent: number): number;

  fxBPMInterpolation(minValue: number, maxValue: number, fxOffsetSeed: any, beatMeasure: number, easingFn: (v: number) => number, loop?: boolean): number;

  fxBPMWaveInterpolation(minValue: number, maxValue: number, fxOffsetSeed: any, beatMeasure: number, easingFn: (v: number) => number): number;

  fxStrobe(value1: any, value2: any, fxOffset: number, beatMeasure: number): any;

  fxBPMArrayValue(valuearray: any[], fxOffset: number, beatMeasure: number): any;

  getCurrentFxWindowPercent(offsetPercentage: number, beatMeasure: number, loop?: boolean): number;

  getCurrentWindowIdentifier(offsetPercentage: number, beatMeasure: number): number;

  setEffectWindow(): void;
}

export default Fxengine;