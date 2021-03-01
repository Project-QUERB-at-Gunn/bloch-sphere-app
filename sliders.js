import * as mat4 from "./glmatrix/mat4.js";
import * as vec4 from "./glmatrix/vec4.js";

addEventListener("load", () => {
  window.rotations = {
    rx: 0.0,
    ry: 0.0,
    rz: 0.0
  };
  
  window.pointposition = {
    x: 0.0,
    y: 1.0,
    z: 0.0
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
    rotations.rx = sliders.rx.value * sliderScale;

    var rot = mat4.create();
    mat4.fromXRotation(rot, rotations.rx*Math.PI);
    mat4.rotateZ(rot, rot, rotations.rz*Math.PI)
    
    var vec = vec4.fromValues(0.0, 0.0, 1.0, 1.0);
    vec4.transformMat4(vec, vec, rot);
    let x = vec[0],
        y = vec[1],
        z = vec[2];
    
    pointposition.x = y;
    pointposition.y = z;
    pointposition.z = x;

    rotations.ry = Math.atan2(x,z)/Math.PI; // ZX plane
    updateDisplay();
  });

  document.getElementById("ry").addEventListener("change", () => {
    rotations.ry = sliders.ry.value * sliderScale;
    updateRx();
  });

  document.getElementById("rz").addEventListener("change", () => {
    rotations.rz = sliders.rz.value * sliderScale;
    updateRx();
  });

  function updateRx() {
    var rot = mat4.create();
    mat4.fromYRotation(rot, rotations.ry*Math.PI);
    mat4.rotateZ(rot, rot, rotations.rz*Math.PI)
    
    var vec = vec4.fromValues(0.0, 0.0, 1.0, 1.0);
    vec4.transformMat4(vec, vec, rot);
    let x = vec[0],
        y = vec[1],
        z = vec[2];

    rotations.rx = Math.atan2(y,z)/Math.PI; // ZY plane
    updateDisplay();
  }

  function updateDisplay() {
    displays.rx.innerHTML = pi(rotations.rx);
    displays.ry.innerHTML = pi(rotations.ry);
    displays.rz.innerHTML = pi(rotations.rz);
    
    sliders.rx.value = rotations.rx / sliderScale;
    sliders.ry.value = rotations.ry / sliderScale;
    sliders.rz.value = rotations.rz / sliderScale;
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
});
