var canvas;
var gl;
var program;

var time = 0;
var timer = new Timer();

var rotate;

var numVertices  = 36;

var texSize = 64;

var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];
var texCoordsArray2 = [];

var texture;
var scaler;
var scalerLoc;

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];    

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = 0;

var rotateLoc;
var thetaLoc;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);
var ctm;

var iKey, oKey, rKey;

var z = 0;

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
         
    //generate a mipMap
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]); 


     pointsArray.push(vertices[b]); 
     colorsArray.push(vertexColors[a]);


     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);

   
     pointsArray.push(vertices[a]); 
     colorsArray.push(vertexColors[a]);

     pointsArray.push(vertices[c]); 
     colorsArray.push(vertexColors[a]);


     pointsArray.push(vertices[d]); 
     colorsArray.push(vertexColors[a]);  

}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

	//Buffer for holding vertex color 
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    //linked shader variable for color
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

	//Buffer for holding the different vertices
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    //linked shader variable for position
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    

	modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

	//rotateLoc = gl.getUniformLocation( program, "rotate" );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
       
    render();
 
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  
    eye = vec3(0,0,0);

    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(100, 1, 0.001, 1000);  

    //Draw the first cube
    ctm = mat4();
    ctm = mult(ctm, modelViewMatrix);

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(ctm) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) ); 

    gl.drawArrays( gl.TRIANGLES, 0, numVertices );

    
    requestAnimFrame(render);
}