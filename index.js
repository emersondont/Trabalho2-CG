const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');

const vertexShaderSource = document.getElementById('vertexShader').text;
const fragmentShaderSource = document.getElementById('fragmentShader').text;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
gl.viewport(0, 0, canvas.width, canvas.height);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

//daqui p baixo

const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
const u_xCam = gl.getUniformLocation(program, 'u_xCam');
const u_yCam = gl.getUniformLocation(program, 'u_yCam');
const u_zCam = gl.getUniformLocation(program, 'u_zCam');
const u_k = gl.getUniformLocation(program, 'u_k');

var time = 0
var xCam = 0.0
var yCam = 0.0
var zCam = 10.0
var animate = true
var k = 5.0
var vel = 0.1

const inputsmooth = document.getElementById('inputsmooth')
const inputvel = document.getElementById('inputvel')

inputsmooth.addEventListener("input", function (e) {
    console.log(e.target.value)
    k = parseFloat(e.target.value)
})

inputvel.addEventListener("input", function (e) {
    console.log(e.target.value)
    vel = parseFloat(e.target.value)
})

document.addEventListener("keydown", function (event) {
    console.log(event.key)
    if(event.key === 'w') {
        zCam -= 0.5
    }
    else if(event.key === 's') {
        zCam += 0.5
    }
    else if(event.key === 'a') {
        xCam -= 0.1
    }
    else if(event.key === 'd') {
        xCam += 0.1
    }
    else if(event.key === 'Shift') {
        yCam += 0.2
    }
    else if(event.key === 'Control') {
        yCam -= 0.2
    }
    else if(event.key === ' ') {
        animate =! animate
    }
});

function render() {
    if(animate)
        time += vel;
    
    gl.uniform1f(timeUniformLocation, time);
    gl.uniform1f(u_xCam, xCam);
    gl.uniform1f(u_yCam, yCam);
    gl.uniform1f(u_zCam, zCam);
    gl.uniform1f(u_k, k);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    requestAnimationFrame(render);
}

requestAnimationFrame(render);