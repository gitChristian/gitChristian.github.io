var A=vec3(0,0,0);
var B=vec3(-0.340,0,0.810);
var C=vec3(-0.340,0,0.859);
var D=vec3(-0.300,0,0.900);
var E=vec3(-0.140,0,0.707);
var F=vec3(-0.130,0,0.745);
var G=vec3(0.000,0.000,0.900);
var H=vec3(0.130,0.000,0.745);
var I=vec3(0.140,0.000,0.707);
var J=vec3(0.300,0.000,0.900);
var K=vec3(0.340,0.000,0.859);
var L=vec3(0.340,0.000,0.810);

var Z1=vec3(0,0.111,0.229);
var Z2=vec3(0.106,0,0.265);
var Z3=vec3(0.140,0,0.451);
var Z4=vec3(-0.106,0,0.265);
var Z5=vec3(-0.140,0,0.451);

var A0=vec3(0,0,0.113);
var A2=vec3(-0.028,0,0.069);
var A3=vec3(0.028,0,0.069);

var Y1=vec3(-0.024,0.027,0.751);
var Y2=vec3(-0.095,0.100,0.967);
var Y3=vec3(-0.092,0.100,1.066);
var Y4=vec3(0.092,0.100,1.066);
var Y5=vec3(0.095,0.100,0.967);
var Y6=vec3(0.024,0.027,0.751);

//data is visualized in the plane model pdf

var vertices[
    A, A2, A0, A3,
  //0   1   2   3
    //front part
    Z1, A2, Z4, Z5, E,
  //4   5   6   7   8
    //left front armor
    Z4, B, C, D, E, Z5,
  //9   10 11 12 13 14
    //left wring 
    F, Z1, H, G, 
  //15 16 17 18 
    //back
    Y1, Y2, Y3, G,
  //19  20  21  22
    //back left wing
    Y6, Y5, Y4, G,
  //23  24  25  26
    //back right wing
    I, J, K, L, Z2, Z3,
  //27 28 29 30 31  32
    //right wing
    H, Z1,A3,Z2,Z3
  //33 34 35 36 37
    //right armor
    A, B, C, D, E, F, G, H, I, J, K, L
  //38 39 40 41 42 43 44 45 46 47 48 49 
    //BOTTOM
    ]
var Indices = [
            0, 1, 2,      0, 2, 3,    // Front face
            4, 5, 6,      4, 6, 7,    4,7,8,   // left front armor
            9,10,11,      9,11,14,    11,12,14,   12,13,14, //left wing
            15,16,18,      16,17,18, //back
            27,28,29,      27,29,30,    27,30,32,   30,31,32,//right wing
            33,34,37,      34,36,37,    34,35,36//right armor
            38,39,40,      38,40,41,    38,41,42,   38,42,43,   38,43,44,   38,44,45,   
            38,45,46,      38,46,47,    38,47,48,   38,48,49, //bottom

        ];

var gl;
function initGL(canvas) {
        try {
            gl = canvas.getContext("experimental-webgl");
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        } catch (e) {
        }
        if (!gl) {
            alert("Could not initialise WebGL, sorry :-(");
        }
    }


    function getShader(gl, id) {
        var shaderScript = document.getElementById(id);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3) {
                str += k.textContent;
            }
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }


    var shaderProgram;

    function initShaders() {
        var fragmentShader = getShader(gl, "shader-fs");
        var vertexShader = getShader(gl, "shader-vs");

        shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
        gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
    }


    var mvMatrix = mat4.create();
    var mvMatrixStack = [];
    var pMatrix = mat4.create();

    function mvPushMatrix() {
        var copy = mat4.create();
        mat4.set(mvMatrix, copy);
        mvMatrixStack.push(copy);
    }

    function mvPopMatrix() {
        if (mvMatrixStack.length == 0) {
            throw "Invalid popMatrix!";
        }
        mvMatrix = mvMatrixStack.pop();
    }


    function setMatrixUniforms() {
        gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
        gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
    }


    function degToRad(degrees) {
        return degrees * Math.PI / 180;
    }


    
    var VertexPositionBuffer;
    var VertexColorBuffer;
    var VertexIndexBuffer;
    function initBuffers() {
       

        VertexPositionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        VertexColorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBuffer);
        colors = [];

        
            for (var j=0; j < 49; j++) {
               colors.push(vec4(0.0,0.0,0.0,1.0));
            
        }//black first
 gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
        VertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VertexIndexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(VertexIndices), gl.STATIC_DRAW);
      }
var rCube=0;

function drawScene(){
   gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

        mat4.identity(mvMatrix);

        //mat4.translate(mvMatrix, [0.0, -1.0, -8.0]);

        mvPushMatrix();
        //mat4.rotate(mvMatrix, degToRad(rCube), [1, 1, 1]);

        gl.bindBuffer(gl.ARRAY_BUFFER, VertexPositionBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, VertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, VertexColorBuffer);
        gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, VertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VertexIndexBuffer);
        setMatrixUniforms();
        gl.drawElements(gl.TRIANGLES, 3, gl.UNSIGNED_SHORT, 0);

        mvPopMatrix();

}
  var lastTime = 0;

    function animate() {
        var timeNow = new Date().getTime();
        if (lastTime != 0) {
            var elapsed = timeNow - lastTime;

           
            rCube -= (75 * elapsed) / 1000.0;
        }
        lastTime = timeNow;
    }


    function tick() {
        requestAnimFrame(tick);
        drawScene();
        animate();
    }


    function webGLStart() {
        var canvas = document.getElementById("lesson04-canvas");
        initGL(canvas);
        initShaders()
        initBuffers();

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);

        tick();
    }
