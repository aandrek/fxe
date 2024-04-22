// fxengine.d.ts

import { Clock } from "three";

declare class Fxengine {
  public DEG2RAD: number;
  public speeds: number[];
  public clock: Clock;
  public bpm: number;
  public effectWindow: number;
  public cache: any[];
  public lastWindowIdentifier: number;
  public cacheWindowIdentifiers: any[];

  constructor(clock: Clock, bpm: number);

  public getClock(): Clock;

  public fxBPMCallFn(
    fn: () => void,
    offsetPercentage: number,
    beatMeasure?: number
  ): void;

  public fxMidiInterpolation(
    minValue: number,
    maxValue: number,
    midiValue: number
  ): number;

  public fxPercentInterpolation(
    minValue: number,
    maxValue: number,
    percent: number
  ): number;

  public fxBPMInterpolation(
    minValue: number,
    maxValue: number,
    fxOffsetSeed?: number,
    beatMeasure?: number,
    easingFn?: (v: any) => any,
    loop?: boolean
  ): number;

  public fxBPMWaveInterpolation(
    minValue: number,
    maxValue: number,
    fxOffsetSeed?: number,
    beatMeasure?: number,
    easingFn?: (v: any) => any
  ): number;

  public fxStrobe(
    value1: any,
    value2: any,
    fxOffset?: number,
    beatMeasure?: number
  ): any;

  public fxBPMArrayValue(
    valuearray: any[],
    fxOffset?: number,
    beatMeasure?: number
  ): any;

  public getCurrentFxWindowPercent(
    offsetPercentage?: number,
    beatMeasure?: number,
    loop?: boolean
  ): number;

  public getCurrentWindowIdentifier(
    offsetPercentage?: number,
    beatMeasure?: number
  ): number;

  public setEffectWindow(): void;
}

export default Fxengine;
