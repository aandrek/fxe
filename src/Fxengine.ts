import { Clock } from "three";

/**
 * @author: aandrek (aa.ndrek.com)
 */
export default class Fxengine {
  public readonly DEG2RAD = Math.PI / 180;
  public readonly speeds = [4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 1 / 16];
  public clock: Clock;
  public bpm: number;
  public effectWindow: number = 0;
  private cache: any[] = [];
  private lastWindowIdentifier: number = 0;
  private cacheWindowIdentifiers: Record<string, number> = {};

  // ---------------------------------------------------------------------------

  constructor(clock?: Clock, bpm?: number) {
    this.clock = clock ?? new Clock();
    this.bpm = bpm ?? 120;
    this.setEffectWindow();
  }

  getClock(): Clock {
    return this.clock;
  }

  // ---------------------------------------------------------------------------

  /**
   *
   * @param {function} fn Function to get called on sync with BPM
   * @param {int} offsetPercentage Percentage (0-1) of offset to get it called
   * @param {float} beatMeasure Multiplier. For example if beatMeasure is 2, it gets called once every 2 complete. If is 1/2, it gets called twice in a BPM.
   */
  public fxBPMCallFn(
    fn: () => void,
    offsetPercentage: number,
    beatMeasure?: number
  ): void {
    offsetPercentage = offsetPercentage ?? 0;
    beatMeasure = beatMeasure ?? 1;
    const id = this.getCurrentWindowIdentifier(offsetPercentage, beatMeasure);
    const key = `${offsetPercentage}-${beatMeasure}`;
    if (
      this.cacheWindowIdentifiers[key] === undefined ||
      this.cacheWindowIdentifiers[key] !== id
    ) {
      this.cacheWindowIdentifiers[key] = id;
      if (typeof fn === "function") {
        fn();
      }
    }
  }

  // ---------------------------------------------------------------------------

  public fxMidiInterpolation(
    minValue: number,
    maxValue: number,
    midiValue: number
  ): number {
    //y = min a max
    //x = 0 127
    //caso especial: si estamos pasando por ejemplo -100 y 100, querremos que cuando el midivalue esta en medio (63), el valor sea 0:
    if (minValue == -1 * maxValue && midiValue == 64) {
      return 0;
    }
    return minValue + ((midiValue - 0) * (maxValue - minValue)) / 127;
  }

  // ---------------------------------------------------------------------------

  public fxPercentInterpolation(
    minValue: number,
    maxValue: number,
    percent: number
  ): number {
    //y = min a max
    //x = 0 100;
    return minValue + percent * (maxValue - minValue);
  }

  // ---------------------------------------------------------------------------

  public fxBPMInterpolation(
    minValue: number,
    maxValue: number,
    fxOffsetSeed?: number,
    beatMeasure?: number,
    easingFn?: (v: any) => any,
    loop?: boolean
  ) {
    if (loop === undefined) {
      loop = true;
    }

    if (fxOffsetSeed === undefined || fxOffsetSeed === null) {
      fxOffsetSeed = 0;
    }

    if (beatMeasure === undefined || beatMeasure === null) {
      beatMeasure = 1;
    }

    if (easingFn === undefined || easingFn === null) {
      easingFn = (v: any) => {
        return v;
      };
    }

    //calculo el porcentaje de width que le sumaré a mi width
    const posibleInc = maxValue - minValue;
    const res =
      minValue +
      posibleInc *
        easingFn(
          this.getCurrentFxWindowPercent(fxOffsetSeed, beatMeasure, loop)
        );
    return res;
  }

  // ---------------------------------------------------------------------------

  public fxBPMWaveInterpolation(
    minValue: number,
    maxValue: number,
    fxOffsetSeed?: number,
    beatMeasure?: number,
    easingFn?: (v: any) => any
  ): number {
    if (fxOffsetSeed === undefined || fxOffsetSeed === null) {
      fxOffsetSeed = 0;
    }

    if (beatMeasure === undefined || beatMeasure === null) {
      beatMeasure = 1;
    }

    if (easingFn === undefined || easingFn === null) {
      easingFn = (v: any) => {
        return v;
      };
    }

    const degs =
      360 * easingFn(this.getCurrentFxWindowPercent(fxOffsetSeed, beatMeasure));
    const p = (Math.cos(degs * this.DEG2RAD) + 1) / 2;
    return this.fxPercentInterpolation(minValue, maxValue, p);
  }

  // ---------------------------------------------------------------------------

  /**
   * Devuelve value1 o value2 dependiendo de en que parte de la window estemos:
   * @param {} value1
   * @param {*} value2
   * @param {*} beatMeasure
   */
  public fxStrobe(
    value1: any,
    value2: any,
    fxOffset?: number,
    beatMeasure?: number
  ): any {
    //TODO, refinar...

    fxOffset = fxOffset ?? 0;

    const perc = this.getCurrentFxWindowPercent(fxOffset, beatMeasure);
    if (perc < 0.5) {
      return value1;
    } else {
      return value2;
    }
  }

  // ---------------------------------------------------------------------------

  /**
   * Devuelve el value del array en el que estemos.
   * @param {} value1
   * @param {*} value2
   * @param {*} beatMeasure
   */
  public fxBPMArrayValue(
    valuearray: any[],
    fxOffset?: number,
    beatMeasure?: number
  ) {
    fxOffset = fxOffset ?? 0;
    const perc = this.getCurrentFxWindowPercent(fxOffset, beatMeasure);
    return valuearray[Math.floor(valuearray.length * perc)];
  }

  // ---------------------------------------------------------------------------

  /**
   * devuelve el porcentaje del efecto a aplicar dado un BPM y el tiempo transcurrido actual.
   *
   * Por ejemplo, si estamos en el segundo 3.35 y tenemos un BPM de 60 (un beat por minuto), obtendremos que tenemos que aplicar un 35% del efecto, y esta funcion
   * devolvera 0.35
   *
   * Si le pasamos un offset percentage, por ejemplo de 0.3 , el efecto comenzra en el 30% del recorrido
   *
   * Si le pasamos un beatMeasure, el efecto alcanzará el 100% cuando la ventana mida windowMultiplier * window
   */
  public getCurrentFxWindowPercent(
    offsetPercentage?: number,
    beatMeasure?: number,
    loop?: boolean
  ): number {
    offsetPercentage = offsetPercentage ?? 0;
    beatMeasure = beatMeasure ?? 1;

    if (loop == undefined) {
      loop = true;
    }

    //La duracion del efecto es la misma que lo que dura cada beat.

    let effectWindow = this.effectWindow;
    if (beatMeasure > 0) {
      effectWindow = 4 * beatMeasure * this.effectWindow;
    }

    //elapsed time para ver cual es el tiempo global..hay que dividir este tiempo en trozos del tamaño "effectWindow"
    const elapsedTime = this.clock.elapsedTime + effectWindow * offsetPercentage;
    if (loop === true) {
      //porcentaje del effectWindow que llevamos con el elapsed time actual:
      return (elapsedTime % effectWindow) / effectWindow;
    } else {
      const resttimes = this.clock.elapsedTime % this.effectWindow;
      if (resttimes < this.effectWindow) {
        return (elapsedTime % effectWindow) / effectWindow;
      } else {
        return 1;
      }
    }
  }

  public getCurrentWindowIdentifier(
    offsetPercentage?: number,
    beatMeasure?: number
  ): number {
    offsetPercentage = offsetPercentage ?? 0;
    beatMeasure = beatMeasure ?? 1;
    let effectWindow = this.effectWindow;
    if (beatMeasure > 0) {
      effectWindow = beatMeasure * this.effectWindow;
    }

    let elapsedTime = Math.round(this.clock.elapsedTime * 1000) / 1000;
    elapsedTime = elapsedTime + effectWindow * offsetPercentage;
    return Math.floor(elapsedTime / effectWindow);
  }

  public setEffectWindow(): void {
    this.effectWindow = 60 / this.bpm;
  }
}
