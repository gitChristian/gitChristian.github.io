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
	
	loadTextures();
	makeCube();
	makeWorld();

	//get locations in shader and enable variables
	vPosition = gl.getAttribLocation( program, "vPosition" );
	vBuildTexCoord = gl.getAttribLocation( program, "vBuildTexCoord" );
	gl.enableVertexAttribArray( vPosition );
	gl.enableVertexAttribArray( vBuildTexCoord );
	samplerLoc = gl.getUniformLocation(program, "texture");
	

	//group code
	mvMatrixLoc = gl.getUniformLocation( program, "mvMatrix" );
    pMatrixLoc = gl.getUniformLocation( program, "pMatrix" );
	changeColorLoc = gl.getUniformLocation( program, "colorChange" );
	
	gl.uniform1f(changeColorLoc, 0.0);
	
	 mvMatrix =mat4();
	//mvMatrix = mult( rotate(50, [5,0,0]  ), mvMatrix);
	//mvMatrix = mult( rotate(10, [0,1,0]  ), mvMatrix);
	mvMatrix = mult( translate(-3,0,-12), mvMatrix);

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
				mvMatrix = mult( translate(0,0,0.1), mvMatrix);
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
	
	
	for(var i =0; i >-10; i--)
	{
		loadBuildings(i);
		loadBuffers();
		populateBuildings();
	}	
	seed=1;
	populateWorld();
	
	gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.uniform1f(changeColorLoc, 1.0);
	
	var ctm = mat4();
	
	//ctm = mult(ctm, mvMatrix);
	ctm = mult(ctm, translate(vec3(0,-1,-3.5)));
	ctm = mult(ctm, scale(vec3(2,2,2)));
	
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(ctm));
	
	gl.drawArrays( gl.TRIANGLES, 0,  36);
	
	gl.uniform1f(changeColorLoc, 0.0);
	
	document.getElementById('collision').innerHTML = detectCollision();
	
	window.requestAnimFrame( render );
}