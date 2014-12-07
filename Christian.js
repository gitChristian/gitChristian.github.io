var mvMatrix;


window.onload = function init() {


    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 0, 1.0 );
    gl.enable(gl.DEPTH_TEST);
	
	//  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	createBuffers();
	loadTextures();
	makeCube();
	makeWorld();

	normalBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW );

	//get locations in shader and enable variables
	vPosition = gl.getAttribLocation( program, "vPosition" );
	vBuildTexCoord = gl.getAttribLocation( program, "vBuildTexCoord" );
	ATTRIBUTE_normal = gl.getAttribLocation( program, "vNormal" );
	
	gl.enableVertexAttribArray( vPosition );
	gl.enableVertexAttribArray( vBuildTexCoord );
	//gl.enableVertexAttribArray( ATTRIBUTE_normal );
	
	
	samplerLoc = gl.getUniformLocation(program, "texture");
	
	UNIFORM_ambientProduct = gl.getUniformLocation(program, "ambientProduct");
    UNIFORM_diffuseProduct = gl.getUniformLocation(program, "diffuseProduct");
    UNIFORM_specularProduct = gl.getUniformLocation(program, "specularProduct");
    UNIFORM_lightPosition = gl.getUniformLocation(program, "lightPosition");
    UNIFORM_shininess = gl.getUniformLocation(program, "shininess");

	//group code
	mvMatrixLoc = gl.getUniformLocation( program, "mvMatrix" );
    pMatrixLoc = gl.getUniformLocation( program, "pMatrix" );
	changeColorLoc = gl.getUniformLocation( program, "colorChange" );
	gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
    gl.uniform3fv(UNIFORM_lightPosition,  flatten(lightPosition));
    gl.uniform1f(UNIFORM_shininess,  shininess);
	
	gl.uniform1f(changeColorLoc, 0.0);
	
	 mvMatrix =mat4();
	//mvMatrix = mult( rotate(50, [5,0,0]  ), mvMatrix);
	
	mvMatrix = mult( translate(-3,0,-12), mvMatrix);
	mvMatrix = mult( rotate(0, [0,0,1]  ), mvMatrix);
	var pMatrix = perspective( 70, canvas.width/canvas.height, 1, 500);
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(pMatrixLoc, false, flatten(pMatrix));
    
	//end group code
	window.onkeypress   = function(event) {
		var key = String.fromCharCode(event.keyCode);
		switch(key) {
			case 'o': //closer
				mvMatrix = mult( translate(0,0,-0.1), mvMatrix);
				break;
			case 'i': //away
				mvMatrix = mult( translate(0,0,0.2), mvMatrix);
				break;
			case 'w': //up
				mvMatrix = mult( translate(0,-0.1,0), mvMatrix);
				break;
			case 's': //down
				mvMatrix = mult( translate(0,0.1,0), mvMatrix);
				break;
			case 'a': //left
				mvMatrix = mult( translate(0.1,0,0), mvMatrix);
				break;
			case 'd': //right
				mvMatrix = mult( translate(-0.1,0,0), mvMatrix);
				break;
		}
	};
	
	createPlaneAABB(cubeArray);
    render();
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
	clearAABB();
	updatePlaneAABB( translate(-mvMatrix[0][3], -mvMatrix[1][3], -mvMatrix[2][3]) );
	
	
	for(var i = 0; i >-20; i--)
	{
		loadBuildings(i);
		loadBuffers();
		populateBuildings();
	}	
	seed=1;
	populateWorld();
	
	gl.uniform1f(changeColorLoc, 1.0);
	
	var ctm = mat4();
	
	//ctm = mult(ctm, mvMatrix);
	ctm = mult(ctm, translate(vec3(0,-1,-3.8)));
	ctm = mult(ctm, scale(vec3(1.5,1.5,1.5)));
	
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(ctm));


	gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.drawArrays( gl.TRIANGLES, 0,  36);
	
	gl.uniform1f(changeColorLoc, 0.0);
	
	document.getElementById('collision').innerHTML = detectCollision();
	
	window.requestAnimFrame( render );
}