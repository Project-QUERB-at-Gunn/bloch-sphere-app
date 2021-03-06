import * as mat4 from "./glmatrix/mat4.js";
import * as vec4 from "./glmatrix/vec4.js";

export var ppvec, rotations;

addEventListener("load", () => {
  rotations = {
    rx: 0.0,
    ry: 0.0,
    rz: 0.0
  };
  
  var deltas = {
    rx: 0.0,
    ry: 0.0,
    rz: 0.0
  };
  
//   pointposition = {
//     x: 0.0,
//     y: 1.0,
//     z: 0.0
//   }
  
  ppvec = vec4.fromValues(0.0, 0.0, 1.0, 1.0);
  
  if (localStorage.rotations && localStorage.ppvec) {
    rotations = JSON.parse(localStorage.rotations);
    ppvec = vec4.fromValues.apply(vec4, JSON.parse(localStorage.ppvec));
  }

  let sliders = {
    rx: document.getElementById("rx"),
    ry: document.getElementById("ry"),
    rz: document.getElementById("rz")
  }
  
  let displays = {
    rx: document.getElementById("dispX"),
    ry: document.getElementById("dispY"),
    rz: document.getElementById("dispZ")
  }

  const sliderScale = 1/12; // multiply Math.PI later.

  document.getElementById("rx").addEventListener("change", () => {
    deltas.rx = -(rotations.rx - sliders.rx.value*sliderScale);
    rotations.rx = sliders.rx.value * sliderScale;

    if (deltas.rx == 2)
        return updateDisplay();

    var rot = mat4.create();
    mat4.fromXRotation(rot, deltas.rx*Math.PI);
//     mat4.rotateZ(rot, rot, rotations.rz*Math.PI)
    
//     var vec = vec4.create();
    vec4.transformMat4(ppvec, ppvec, rot);
    let x = ppvec[0],
        y = ppvec[1],
        z = ppvec[2];
    
//     pointposition.x = y;
//     pointposition.y = z;
//     pointposition.z = x;

    rotations.ry = Math.atan2(x,z)/Math.PI; // ZX plane
    updateDisplay();
  });

  document.getElementById("ry").addEventListener("change", () => {
    deltas.ry = -(rotations.ry - sliders.ry.value*sliderScale);
    rotations.ry = sliders.ry.value * sliderScale;
    deltas.ry == 2 ? updateDisplay() : updateRx();
  });

  document.getElementById("rz").addEventListener("change", () => {
    deltas.rz = -(rotations.rz - sliders.rz.value*sliderScale);
    rotations.rz = sliders.rz.value * sliderScale;
    deltas.rz == 2 ? updateDisplay() : updateRx();
  });

  function updateRx() {
    var rot = mat4.create();
    mat4.fromYRotation(rot, deltas.ry*Math.PI);
    mat4.rotateZ(rot, rot, deltas.rz*Math.PI)
    
//     var vec = vec4.fromValues(0.0, 0.0, 1.0, 1.0);
    vec4.transformMat4(ppvec, ppvec, rot);
    let x = ppvec[0],
        y = ppvec[1],
        z = ppvec[2];
    
//     pointposition.x = y;
//     pointposition.y = z;
//     pointposition.z = x;

    rotations.rx = Math.atan2(y,z)/Math.PI; // ZY plane
    updateDisplay();
  }

  function updateDisplay() {
    rotations.rx = (rotations.rx + 2)%2;
    rotations.ry = (rotations.ry + 2)%2;
    rotations.rz = (rotations.rz + 2)%2;
    
    displays.rx.innerHTML = pi(rotations.rx);
    displays.ry.innerHTML = pi(rotations.ry);
    displays.rz.innerHTML = pi(rotations.rz);
    
    sliders.rx.value = rotations.rx / sliderScale;
    sliders.ry.value = rotations.ry / sliderScale;
    sliders.rz.value = rotations.rz / sliderScale;
    
    deltas.rx = 0.0;
    deltas.ry = 0.0;
    deltas.rz = 0.0;
    
    console.log(rotations);
    console.log(ppvec);

    localStorage.rotations = JSON.stringify(rotations);
    localStorage.ppvec = JSON.stringify([ppvec[0], ppvec[1], ppvec[2], ppvec[3]]);
  }
  
  const pivals = [
    "0",
    "π/12",
    "π/6",
    "π/4",
    "π/3",
    "5π/12",
    "π/2",
    "7π/12",
    "2π/3",
    "3π/4",
    "5π/6",
    "11π/12",
    "π",
    "13π/12",
    "7π/6",
    "5π/4",
    "4π/3",
    "17π/12",
    "3π/2",
    "19π/12",
    "5π/3",
    "7π/4",
    "11π/6",
    "23π/12",
    "2π"
  ];
  
  function pi(val) {
//     return (val == 1 ? "" : val) + ((val == 0.0) ? "" : "π");
    return pivals[Math.round(val/sliderScale)];
  }
  
  rotations.rx = sliders.rx.value * sliderScale;
  rotations.ry = sliders.ry.value * sliderScale;
  rotations.rz = sliders.rz.value * sliderScale;
  updateDisplay();
                             
                             document.getElementById("reset").onclick = function() {
                             rotations.rx = 0;
                             rotations.ry = 0;
                             rotations.rz = 0;
                             
                             ppvec[0] = 0.0;
                             ppvec[1] = 0.0;
                             ppvec[2] = 1.0;
                             ppvec[3] = 1.0;
                             
                             updateDisplay();
                             }
                     
});
