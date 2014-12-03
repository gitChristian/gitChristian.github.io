var canvas;
var gl;
var program;
var change;
var image1;
var image2;
var scrollLoc;
var scroll = 0;
var tBuffer;

var length = 1;
var time = 0.0;
var timer = new Timer();
var omega = 40;

var UNIFORM_specularProduct;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;

var positionBuffer; 
var normalBuffer;

var viewMatrix;
var projectionMatrix;
var mvpMatrix;

/*
///  Lighting Stuff
*/
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var materialAmbient = vec4(0.0, 0.0, 1.0, 1.0);
var ambientProduct = mult(lightAmbient, materialAmbient);

var lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var materialDiffuse = vec4(0.0, 0.6, 0.6, 1.0);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);

var lightSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var specularProduct = mult(lightSpecular, materialSpecular);

var shininess = 50;
var lightPosition = vec3(-9.0, 7.0, -2.0);

//perspective variables
var eye = vec3(0, 0.0, 10.0);
var at = vec3(0, 0, 0);
var up = vec3(0, 1, 0);

//texture variables
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var texCoordsArray = [];

z = 0;

var iKey, jKey, kKey,lKey,rKey, upKey, downKey, leftKey, rightKey, cKey, nKey,wKey;

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
function configureTexture2( image2 ) {
    texture2 = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture2 );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image2 );
         
    //generate a mipMap
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
   // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	//gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.uniform1i(gl.getUniformLocation(program, "texture2"), 0);
}

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    vertices = [
        vec3(  length,   length, length ), //vertex 0
        vec3(  length,  -length, length ), //vertex 1
        vec3( -length,   length, length  ), //vertex 2
        vec3( -length,  -length, length ),  //vertex 3 
        vec3(  length,   length, -length), //vertex 4
        vec3(  length,  -length, -length), //vertex 5
        vec3( -length,   length, -length), //vertex 6
        vec3( -length,  -length, -length)  //vertex 7   
    ];

    var points = [];
    var normals = [];
    
    Cube(vertices, points, normals);

	console.log(points);
	
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );
    
    //buffer for holding the texture
    tBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    //buffer for holding the texture
    var tBuffer2 = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    //linked shader variable for texture
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
    gl.enableVertexAttribArray( ATTRIBUTE_normal );

    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );

    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );

    UNIFORM_mvMatrix = gl.getUniformLocation(program, "mvMatrix");
    UNIFORM_pMatrix = gl.getUniformLocation(program, "pMatrix");
    UNIFORM_ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    UNIFORM_diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    UNIFORM_specularProduct = gl.getUniformLocation(program, "specularProduct");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");
    
    change = gl.getUniformLocation(program, "colorChange");


	scrollLoc = gl.getUniformLocation(program, "scroll");
	//Alternate between texture mapping and coloring.

	gl.uniform1f(change,  0.0);

    viewMatrix = lookAt(eye, at, up);
    projectionMatrix = perspective(100, 2, 0.001, 70);

	image1 = new Image();
    	image1.src = "rock_texture.jpg";
    	image1.onload = function() { 
        configureTexture( image1 );
    }
    image2 = new Image();
    	image2.src = "brick.jpg";
    	image2.onload = function() { 
        configureTexture2( image2 );
    }

    timer.reset();
    gl.enable(gl.DEPTH_TEST);

    render();
}

function Cube(vertices, points, normals){
    Quad(vertices, points, normals, 0, 1, 2, 3, vec3(0, 0, 1));
    Quad(vertices, points, normals, 4, 0, 6, 2, vec3(0, 1, 0));
    Quad(vertices, points, normals, 4, 5, 0, 1, vec3(1, 0, 0));
    Quad(vertices, points, normals, 2, 3, 6, 7, vec3(1, 0, 1));
    Quad(vertices, points, normals, 6, 7, 4, 5, vec3(0, 1, 1));
    Quad(vertices, points, normals, 1, 5, 3, 7, vec3(1, 1, 0 ));
}

function Quad( vertices, points, normals, v1, v2, v3, v4, normal){

    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);
    normals.push(normal);

    points.push(vertices[v1]);
    texCoordsArray.push(vec2(texCoord[0][0]*75, texCoord[0][1]*22) );
    points.push(vertices[v3]);
    texCoordsArray.push(vec2(texCoord[1][0]*75, texCoord[1][1]*22) );
    points.push(vertices[v4]);
    texCoordsArray.push(vec2(texCoord[2][0]*75, texCoord[2][1]*22) );
    points.push(vertices[v1]);
    texCoordsArray.push(vec2(texCoord[0][0]*75, texCoord[0][1]*22) );
    points.push(vertices[v4]);
    texCoordsArray.push(vec2(texCoord[2][0]*75, texCoord[2][1]*22) );
    points.push(vertices[v2]);
    texCoordsArray.push(vec2(texCoord[3][0]*75, texCoord[3][1]*22) );
}


function render()
{
	scroll += .08;
	gl.uniform1f(scrollLoc,  scroll);
    
    tBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    time += timer.getElapsedTime() / 1000;
    mvMatrix = mult(viewMatrix, rotate(0, [1, 0, 0]));

	gl.uniform1f(change,  0.0);

    var ctm = mat4();
	ctm = mult(ctm, mvMatrix);
	ctm = mult(ctm, scale(vec3(75,22,65)));
	
	
	z+=.08;

    gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
    gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));

    gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
    
    gl.drawArrays( gl.TRIANGLES, 30, 6);
    
	var off = 0;
	
    gl.uniform1f(change,  0.0);
    

    
    tBuffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    for(var i =0; i<150; i++)
    {
		ctm = mat4();
		ctm = mult(ctm, mvMatrix);
		ctm = mult(ctm, scale(vec3(2,30,2)));
		ctm = mult(ctm, translate(vec3((-36),0,(-8 + off + z))));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
	
		gl.drawArrays( gl.TRIANGLES, 0, 36);
		
		off-=3;
	}
	
	off=0;
	
	for(var i =0; i<150; i++)
    {
		ctm = mat4();
		ctm = mult(ctm, mvMatrix);
		ctm = mult(ctm, scale(vec3(2,30,2)));
		ctm = mult(ctm, translate(vec3((+36),0,(-8 + off + z))));

		gl.uniformMatrix4fv(UNIFORM_mvMatrix, false, flatten(ctm));
		gl.uniformMatrix4fv(UNIFORM_pMatrix, false, flatten(projectionMatrix));
	
		gl.drawArrays( gl.TRIANGLES, 0, 36);
		
		off-=3;
	}


    window.requestAnimFrame( render );
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 73){
        iKey = true;
    }
    if (event.keyCode == 74){
        jKey = true;
    }
    if (event.keyCode == 75){
        kKey = true;
    }
    if (event.keyCode == 76){
        lKey = true;
    }
    if (event.keyCode == 82){
        rKey = true;
    }
    if (event.keyCode == 38){
        upKey = true;
    }
    if (event.keyCode == 40){
        downKey = true;
    }
    if (event.keyCode == 37){
        leftKey = true;
    }
    if (event.keyCode == 39){
        rightKey = true;
    }
	if (event.keyCode == 67){
        cKey = true;
    }
    if(event.keyCode==78){
    	nKey = true;
    }
    if(event.keyCode==87){
    	wKey = true;
    }
    
    
});