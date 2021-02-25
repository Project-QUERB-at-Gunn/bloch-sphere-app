addEventListener("load", () => {
  window.rotations = {
    rx: 0.0,
    ry: 0.0,
    rz: 0.0
  };

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

    var z = Math.cos(rotations.rx);
    var radius = Math.sin(rotations.rx);

    var x = radius*Math.cos(rotations.rz);
  //   var y = radius*Math.sin(rotations.rz);

    rotations.ry = Math.atan2(x, z); // ZX plane
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
    var z = Math.cos(rotations.ry);
    var radius = Math.sin(rotations.ry);

  //   var x = radius*Math.cos(rotations.rz);
    var y = radius*Math.sin(rotations.rz);

    rotations.rx = Math.atan2(y, z); // ZY plane
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
  
  function pi(val) {
    return (val == 1 ? "" : val) + ((val == 0.0) ? "" : "π");
  }
});
