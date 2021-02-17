import * as mat4 from "./glmatrix/mat4.js";

const vsSource = `#version 300 es
    in vec4 aVertexPosition;
    out vec4 sharePos;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    
    void main() {
        sharePos = aVertexPosition;
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

const fsSource = `#version 300 es
    precision highp float;
    
    in vec4 sharePos;
    out vec4 colour;
    
    uniform vec4 origin;
    
    void main() {
        colour = (sharePos == origin) ? vec4(1.0, 1.0, 0.0, 1.0) : vec4(0.5, 0.5, 0.0, 1.0);
    }
`;

function loadShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Failed to compile shaders: " + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    
    return shader;
}

window.onload = () => {
    const canvas = document.querySelector("#canvas");
    const gl = canvas.getContext("webgl2");
    
    if (gl === null) {
        alert("Your browser does not support WebGL2. Please update to the latest version of Firefox to use it.");
        return;
    }
    
    window.gl = gl;
    
    const vertexShader = loadShader(gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fsSource);
    
    const masterShader = gl.createProgram();
    gl.attachShader(masterShader, vertexShader);
    gl.attachShader(masterShader, fragmentShader);
    gl.linkProgram(masterShader);
    
    if (!gl.getProgramParameter(masterShader, gl.LINK_STATUS)) {
        alert("Failed to link shaders: " + gl.getProgramInfoLog(masterShader));
        return;
    }
    
    window.programInfo = {
        program: masterShader,
        
        attribLocations: {
            vertexPosition: gl.getAttribLocation(masterShader, 'aVertexPosition'),
        },
        
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(masterShader, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(masterShader, 'uModelViewMatrix'),
            origin: gl.getAttribLocation(masterShader, 'origin'),
        },
    };
    
    console.log(programInfo);
    
    drawFrame();
}

function drawFrame() {
    //var mat4 = gl.mat4;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const radius = 100;    
    const numComponents = Math.floor(radius/2 + 5);
    
    /*const positions = [
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0
    ];*/
    
    let positions = [0, 0];
    
//    var x = 0;
  //  var y = 0;
    
    for (var i = 0; i < Math.PI*2; i += Math.PI*2/numComponents) {
        positions.push(Math.cos(i)*radius); positions.push(Math.sin(i)*radius);
        positions.push(Math.cos(i+Math.PI*2/numComponents)*radius); positions.push(Math.sin(i+Math.PI*2/numComponents)*radius);
    }
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var buffers = {position: positionBuffer};
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
   // alert(0);
    
    const fov = Math.PI/4;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    
    alert(30);
    
    const projection = mat4.create();
    alert(20);
    mat4.perspective(projection, fov, aspect, zNear, zFar);
    
   // alert(1);
    
    const modelView = mat4.create();
    mat4.translate(modelView, modelView, [0.0, 0.0, -6.0]);
    
    {
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    
    //alert(2);
    
    gl.useProgram(programInfo.program);
    gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projection);
    gl.uniformMatrix4fv(programInfo.uniformLocations.modelViewMatrix, false, modelView);
    gl.uniform4f(programInfo.uniformLocations.origin, 0.0, 0.0, -6.0, 1);
    
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_FAN, offset, vertexCount);
    
    //alert(3);
    
    console.log("drawing done");
    requestAnimationFrame(drawFrame);
}















