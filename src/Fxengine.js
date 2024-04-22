import { Clock } from "three";

/**
 * @author: aandrek (aa.ndrek.com)
 */
export default class Fxengine {
  DEG2RAD = Math.PI / 180;
  speeds = [4, 2, 1, 1 / 2, 1 / 4, 1 / 8, 1 / 16];
  clock = null; //referencia al clock main.
  bpm = 60;
  effectWindow = null;
  cache = [];
  lastWindowIdentifier = 0;
  cacheWindowIdentifiers = [];

  // ---------------------------------------------------------------------------

  constructor(clock, bpm) {
    if (clock !== undefined) this.clock = clock;
    else this.clock = new Clock();
    this.bpm = bpm ?? 120;
    this.setEffectWindow();
  }

  getClock() {
    return this.clock;
  }

  // ---------------------------------------------------------------------------

  /**
   *
   * @param {function} fn Function to get called on sync with BPM
   * @param {int} offsetPercentage Percentage (0-1) of offset to get it called
   * @param {float} beatMeasure Multiplier. For example if beatMeasure is 2, it gets called once every 2 complete. If is 1/2, it gets called twice in a BPM.
   */
  fxBPMCallFn(fn, offsetPercentage, beatMeasure) {
    offsetPercentage = offsetPercentage ?? 0;
    beatMeasure = beatMeasure ?? 1;
    var id = this.getCurrentWindowIdentifier(offsetPercentage, beatMeasure);
    if (
      typeof this.cacheWindowIdentifiers[
        offsetPercentage + "-" + beatMeasure
      ] == "undefined" ||
      this.cacheWindowIdentifiers[offsetPercentage + "-" + beatMeasure] != id
    ) {
      this.cacheWindowIdentifiers[offsetPercentage + "-" + beatMeasure] = id;
      if (typeof fn == "function") {
        fn();
      }
    }
  }

  // ---------------------------------------------------------------------------

  fxMidiInterpolation(minValue, maxValue, midiValue) {
    //y = min a max
    //x = 0 127
    //caso especial: si estamos pasando por ejemplo -100 y 100, querremos que cuando el midivalue esta en medio (63), el valor sea 0:
    if (minValue == -1 * maxValue && midiValue == 64) {
      return 0;
    }
    return minValue + ((midiValue - 0) * (maxValue - minValue)) / 127;
  }

  // ---------------------------------------------------------------------------

  fxPercentInterpolation(minValue, maxValue, percent) {
    //y = min a max
    //x = 0 100;
    return minValue + percent * (maxValue - minValue);
  }

  // ---------------------------------------------------------------------------

  fxBPMInterpolation(
    minValue,
    maxValue,
    fxOffsetSeed,
    beatMeasure,
    easingFn,
    loop
  ) {
    if (typeof loop == "undefined") {
      loop = true;
    }

    if (typeof fxOffsetSeed == "undefined" || _.isNull(fxOffsetSeed)) {
      fxOffsetSeed = 0;
    }

    if (typeof beatMeasure == "undefined" || _.isNull(beatMeasure)) {
      beatMeasure = 1;
    }

    if (typeof easingFn == "undefined" || _.isNull(easingFn)) {
      easingFn = (v) => {
        return v;
      };
    }

    //calculo el porcentaje de width que le sumaré a mi width
    var posibleInc = maxValue - minValue;
    let res =
      minValue +
      posibleInc *
        easingFn(
          this.getCurrentFxWindowPercent(fxOffsetSeed, beatMeasure, loop)
        );
    return res;
  }

  // ---------------------------------------------------------------------------

  fxBPMWaveInterpolation(
    minValue,
    maxValue,
    fxOffsetSeed,
    beatMeasure,
    easingFn
  ) {
    if (typeof fxOffsetSeed == "undefined" || _.isNull(fxOffsetSeed)) {
      fxOffsetSeed = 0;
    }

    if (typeof beatMeasure == "undefined" || _.isNull(beatMeasure)) {
      beatMeasure = 2;
    }

    if (typeof easingFn == "undefined" || _.isNull(easingFn)) {
      easingFn = (v) => {
        return v;
      };
    }

    let degs =
      360 * easingFn(this.getCurrentFxWindowPercent(fxOffsetSeed, beatMeasure));
    let p = (Math.cos(degs * this.DEG2RAD) + 1) / 2;
    return this.fxPercentInterpolation(minValue, maxValue, p);
  }

  // ---------------------------------------------------------------------------

  /**
   * Devuelve value1 o value2 dependiendo de en que parte de la window estemos:
   * @param {} value1
   * @param {*} value2
   * @param {*} beatMeasure
   */
  fxStrobe(value1, value2, fxOffset, beatMeasure) {
    //TODO, refinar...

    var fxOffset = 0;

    let perc = this.getCurrentFxWindowPercent(fxOffset, beatMeasure);
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
  fxBPMArrayValue(valuearray, fxOffset, beatMeasure) {
    var fxOffset = 0;

    let perc = this.getCurrentFxWindowPercent(fxOffset, beatMeasure);

    let arrsize = valuearray.length;

    let index = Math.floor(arrsize * perc);
    return valuearray[index];
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
  getCurrentFxWindowPercent(offsetPercentage, beatMeasure, loop) {
    offsetPercentage = offsetPercentage ?? 0;
    beatMeasure = beatMeasure ?? 1;

    if (typeof loop == "undefined") {
      loop = true;
    }

    //La duracion del efecto es la misma que lo que dura cada beat.

    var effectWindow = this.effectWindow;
    if (beatMeasure > 0) {
      effectWindow = 4 * beatMeasure * this.effectWindow;
    }

    //elapsed time para ver cual es el tiempo global..hay que dividir este tiempo en trozos del tamaño "effectWindow"
    var elapsedTime = this.clock.elapsedTime + effectWindow * offsetPercentage;
    if (loop == true) {
      //porcentaje del effectWindow que llevamos con el elapsed time actual:
      return (elapsedTime % effectWindow) / effectWindow;
    } else {
      var resttimes = this.clock.elapsedTime % this.effectWindow;
      if (resttimes < this.effectWindow) {
        return (elapsedTime % effectWindow) / effectWindow;
      } else {
        return 1;
      }
    }
  }

  getCurrentWindowIdentifier(offsetPercentage, beatMeasure) {
    offsetPercentage = offsetPercentage ?? 0;
    beatMeasure = beatMeasure ?? 1;
    var effectWindow = this.effectWindow;
    if (beatMeasure > 0) {
      effectWindow = beatMeasure * this.effectWindow;
    }

    var elapsedTime = Math.round(this.clock.elapsedTime * 1000) / 1000;
    elapsedTime = elapsedTime + effectWindow * offsetPercentage;
    return Math.floor(elapsedTime / effectWindow);
  }

  setEffectWindow() {
    this.effectWindow = 60 / this.bpm;
  }
}
