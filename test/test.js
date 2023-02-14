
import Fxengine from "../src/Fxengine";
import { Clock } from "three";

let clock = new Clock();
let fxe = new Fxengine(clock, 60);


let animate = function(){
    clock.getDelta();

fxe.fxBPMCallFn(()=>{
    process.stdout.write('1');
}, 0, 1);

// fxe.fxBPMCallFn(()=>{
//     process.stdout.write('2');
// }, 0, 1/2);


fxe.fxBPMCallFn(()=>{
    process.stdout.write('3');
}, 0, 1/3);

    setTimeout(function(){animate();},1000/30);
};

animate(); // start.