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


const sphereColor = gl.getUniformLocation(program, 'u_sphereColor');
const cubeColor = gl.getUniformLocation(program, 'u_cubeColor');
const obstacleColor = gl.getUniformLocation(program, 'u_obstacleColor');

gl.uniform3f(sphereColor, 1.0, 0.0, 0.0); // vermelho
gl.uniform3f(cubeColor, 0.0, 0.0, 1.0); // azul
gl.uniform3f(obstacleColor, 0.0, 1.0, 0.0); // verde

const u_y = gl.getUniformLocation(program, 'u_y');
gl.uniform1f(u_y, 0.0);

function fract(x) {
    return x - Math.floor(x);
}
const xObstacle = gl.getUniformLocation(program, 'u_xObstacle');

var jumping = false;

const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
const random = gl.getUniformLocation(program, 'u_random');
var time = 0
var time_jump = 0
var x = 8.0;
var vel = 0.2

document.addEventListener("keydown", function (event) {
    if (event.key === ' ') { // Tecla espaço
        if (!jumping)
            time_jump = 0
        jumping = true
    }
});

function render() {
    time += 0.01;
    time_jump += 0.015;

    let y = -10.0 * fract(time_jump*2) * (fract(time_jump*2) - 1.0);
    if (jumping) {
        gl.uniform1f(u_y, y);
    }
    if (y <= 0.1) {
        jumping = false
    }

    
    //vel += vel/1000

    x -= vel

    if(x <= -5.0)
        x = 8.0

    gl.uniform1f(xObstacle, x);

    gl.uniform1f(timeUniformLocation, time);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);