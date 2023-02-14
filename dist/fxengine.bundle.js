(()=>{"use strict";var i={474:(e,t,i)=>{e=i.hmd(e);const o=Math.PI/180;e.exports=class{speeds=[4,2,1,.5,.25,1/8,1/16];clock=null;bpm=60;effectWindow=null;cache=[];lastWindowIdentifier=0;cacheWindowIdentifiers=[];constructor(e,t){this.clock=e,this.bpm=t,this.setEffectWindow()}fxBPMCallFn(e,t,i){var r=this.getCurrentWindowIdentifier(t=t??0,i=i??1);void 0!==this.cacheWindowIdentifiers[t+"-"+i]&&this.cacheWindowIdentifiers[t+"-"+i]==r||(this.cacheWindowIdentifiers[t+"-"+i]=r,"function"==typeof e&&e())}fxMidiInterpolation(e,t,i){return e==-1*t&&64==i?0:e+ +i*(t-e)/127}fxPercentInterpolation(e,t,i){return e+i*(t-e)}fxBPMInterpolation(e,t,i,r,n,o){return void 0===o&&(o=!0),void 0!==i&&!_.isNull(i)||(i=0),void 0!==r&&!_.isNull(r)||(r=1),e+(t-e)*(n=void 0!==n&&!_.isNull(n)?n:e=>e)(this.getCurrentFxWindowPercent(i,r,o))}fxBPMWaveInterpolation(e,t,i,r,n){void 0!==i&&!_.isNull(i)||(i=0),void 0!==r&&!_.isNull(r)||(r=2);n=360*(n=void 0!==n&&!_.isNull(n)?n:e=>e)(this.getCurrentFxWindowPercent(i,r)),i=(Math.cos(n*o)+1)/2;return this.fxPercentInterpolation(e,t,i)}fxStrobe(e,t,i,r){return this.getCurrentFxWindowPercent(0,r)<.5?e:t}fxBPMArrayValue(e,t,i){var i=this.getCurrentFxWindowPercent(0,i),r=e.length;return e[Math.floor(r*i)]}getCurrentFxWindowPercent(e,t,i){var r=this.effectWindow,t=(0<(t=t??1)&&(r=4*t*this.effectWindow),this.clock.elapsedTime+r*(e=e??0));return 1==(i=void 0===i?!0:i)||this.clock.elapsedTime%this.effectWindow<this.effectWindow?t%r/r:1}getCurrentWindowIdentifier(e,t){e=e??0;var i=this.effectWindow,t=(0<(t=t??1)&&(i=t*this.effectWindow),Math.round(1e3*this.clock.elapsedTime)/1e3);return t+=i*e,Math.floor(t/i)}setEffectWindow(){this.effectWindow=60/this.bpm}}}},r={};function n(e){var t=r[e];return void 0!==t||(t=r[e]={id:e,loaded:!1,exports:{}},i[e](t,t.exports,n),t.loaded=!0),t.exports}n.d=(e,t)=>{for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.hmd=e=>((e=Object.create(e)).children||(e.children=[]),Object.defineProperty(e,"exports",{enumerable:!0,set:()=>{throw new Error("ES Modules may not assign module.exports or exports.*, Use ESM export syntax, instead: "+e.id)}}),e),n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t);n(474)})();