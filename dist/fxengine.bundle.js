!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Fxengine=t():e.Fxengine=t()}(self,()=>(()=>{"use strict";var n={d:(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},e={};n.r(e),n.d(e,{default:()=>t});class t{DEG2RAD=Math.PI/180;speeds=[4,2,1,.5,.25,1/8,1/16];clock=null;bpm=60;effectWindow=null;cache=[];lastWindowIdentifier=0;cacheWindowIdentifiers=[];constructor(e,t){this.clock=e,this.bpm=t,this.setEffectWindow()}fxBPMCallFn(e,t,i){var n=this.getCurrentWindowIdentifier(t=t??0,i=i??1);void 0!==this.cacheWindowIdentifiers[t+"-"+i]&&this.cacheWindowIdentifiers[t+"-"+i]==n||(this.cacheWindowIdentifiers[t+"-"+i]=n,"function"==typeof e&&e())}fxMidiInterpolation(e,t,i){return e==-1*t&&64==i?0:e+ +i*(t-e)/127}fxPercentInterpolation(e,t,i){return e+i*(t-e)}fxBPMInterpolation(e,t,i,n,o,r){return void 0===r&&(r=!0),void 0!==i&&!_.isNull(i)||(i=0),void 0!==n&&!_.isNull(n)||(n=1),e+(t-e)*(o=void 0!==o&&!_.isNull(o)?o:e=>e)(this.getCurrentFxWindowPercent(i,n,r))}fxBPMWaveInterpolation(e,t,i,n,o){void 0!==i&&!_.isNull(i)||(i=0),void 0!==n&&!_.isNull(n)||(n=2);o=360*(o=void 0!==o&&!_.isNull(o)?o:e=>e)(this.getCurrentFxWindowPercent(i,n)),i=(Math.cos(o*this.DEG2RAD)+1)/2;return this.fxPercentInterpolation(e,t,i)}fxStrobe(e,t,i,n){return this.getCurrentFxWindowPercent(0,n)<.5?e:t}fxBPMArrayValue(e,t,i){var i=this.getCurrentFxWindowPercent(0,i),n=e.length;return e[Math.floor(n*i)]}getCurrentFxWindowPercent(e,t,i){var n=this.effectWindow,t=(0<(t=t??1)&&(n=4*t*this.effectWindow),this.clock.elapsedTime+n*(e=e??0));return 1==(i=void 0===i?!0:i)||this.clock.elapsedTime%this.effectWindow<this.effectWindow?t%n/n:1}getCurrentWindowIdentifier(e,t){e=e??0;var i=this.effectWindow,t=(0<(t=t??1)&&(i=t*this.effectWindow),Math.round(1e3*this.clock.elapsedTime)/1e3);return t+=i*e,Math.floor(t/i)}setEffectWindow(){this.effectWindow=60/this.bpm}}return e})());