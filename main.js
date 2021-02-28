import * as mat4 from "./glmatrix/mat4.js";

const vsSource = `#version 300 es
    layout (location=0) in vec4 aVertexPosition;
    out vec4 colourIn;
    
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    uniform vec4 origin;
    uniform bool point;
    
    void main() {
        if (!point)
            colourIn = (aVertexPosition == origin) ? vec4(1.0, 1.0, 0.0, 1.0) : vec4(0.5, 0.5, 0.0, 1.0);
        else
            colourIn = vec4(0.0, 0.0, 0.0, 1.0);
        
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
`;

const fsSource = `#version 300 es
    precision highp float;
    
    in vec4 colourIn;
    out vec4 colourOut;
    
    void main() {
        colourOut = colourIn;
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
    
    window.dimensions = {
        width: canvas.width,
        height: canvas.height
    };
    
    dimensions.halfWidth = dimensions.width/2;
    dimensions.halfHeight = dimensions.height/2;
    
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
            vertexPosition: 0 //gl.getAttribLocation(masterShader, 'aVertexPosition'),
        },
        
        uniformLocations: {
            projectionMatrix: gl.getUniformLocation(masterShader, 'uProjectionMatrix'),
            modelViewMatrix: gl.getUniformLocation(masterShader, 'uModelViewMatrix'),
            origin: gl.getUniformLocation(masterShader, 'origin'),
            point: gl.getUniformLocation(masterShader, 'point'),
        },
    };
    
    console.log(programInfo);
    
    drawFrame();
}

function drawFrame() {
    //var mat4 = gl.mat4;
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    const radius = 0.25;
    const vertexCount = Math.floor(radius*300 + 5);
    const numComponents = 4;
    
    /*const 
    = [
        -1.0, 1.0,
        1.0, 1.0,
        -1.0, -1.0,
        1.0, -1.0
    ];*/
    
    let positions = [0.0, 0.0, 0.0, 1.0];
//     let positions = [];
    
//    var x = 0;
  //  var y = 0;
    
    for (var i = 0.0; i < Math.PI*2; i += Math.PI*2/(vertexCount)) {
        positions.push(Math.cos(i)*radius); // x
        positions.push(Math.sin(i)*radius); // y
//         positions.push(Math.cos(i+Math.PI*2/vertexCount)*radius); positions.push(Math.sin(i+Math.PI*2/vertexCount)*radius);
        
        positions.push(0.0); // z=0
        positions.push(1.0); // w=1
    }
    
    // return home
    positions.push(radius);
    positions.push(0);
    positions.push(0.0);
    positions.push(1.0);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    var buffers = {position: positionBuffer};
    
    if (!window.dontClear) {
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.clearDepth(1.0);
    }
    
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
   // alert(0);
    
    const fov = Math.PI/4;
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    
    //alert(30);
    
    const projection = mat4.create();
    //alert(20);
    mat4.perspective(projection, fov, aspect, zNear, zFar);
    
   // alert(1);
    
    const modelView = mat4.create();
    mat4.translate(modelView, modelView, [0.0, 0.0, -2.0]);
    
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
    gl.uniform4f(programInfo.uniformLocations.origin, 0.0, 0.0, 0.0, 1.0);
    gl.uniform1i(programInfo.uniformLocations.point, 0);
    
    const offset = 0;
    gl.drawArrays(gl.TRIANGLE_FAN, offset, positions.length/numComponents);
    
    const rad2 = 0.01;
    const vert2 = Math.floor(rad2*300 + 5);
    let pos2 = [pointposition.x*radius, pointposition.y*radius, pointposition.z, 1.0];
    
    for (var i = 0.0; i < Math.PI*2; i += Math.PI*2/(vertexCount)) {
        pos2.push(Math.cos(i)*rad2 + pointposition.x*radius); // x
        pos2.push(Math.sin(i)*rad2 + pointposition.y*radius); // y
//         positions.push(Math.cos(i+Math.PI*2/vertexCount)*radius); positions.push(Math.sin(i+Math.PI*2/vertexCount)*radius);
        
        pos2.push(pointposition.z); // z=0
        pos2.push(1.0); // w=1
    }
    
    pos2.push(pointposition.x*radius + rad2);
    pos2.push(pointposition.y*radius);
    pos2.push(pointposition.z);
    pos2.push(1.0);
    
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos2), gl.STATIC_DRAW);
    buffers = {position: positionBuffer}
    
    {
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }
    
    gl.uniform1i(programInfo.uniformLocations.point, 1);
    gl.drawArrays(gl.TRIANGLE_FAN, offset, pos2.length/numComponents);
    
    //alert(3);
    
    console.log("drawing done");
    requestAnimationFrame(drawFrame);
}

//window.onerror = alert;
