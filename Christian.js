var mvMatrix;

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0, 0, 1, 1.0 );
    gl.enable(gl.DEPTH_TEST);
	
	//  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
	
	loadTextures();
	makeCube();

	
	//get locations in shader and enable variables
	vPosition = gl.getAttribLocation( program, "vPosition" );
	vBuildTexCoord = gl.getAttribLocation( program, "vBuildTexCoord" );
	gl.enableVertexAttribArray( vPosition );
	gl.enableVertexAttribArray( vBuildTexCoord );
	samplerLoc = gl.getUniformLocation(program, "texture");
	

	//group code
	mvMatrixLoc = gl.getUniformLocation( program, "mvMatrix" );
    pMatrixLoc = gl.getUniformLocation( program, "pMatrix" );
	
	 mvMatrix =mat4();
	//mvMatrix = mult( rotate(50, [5,0,0]  ), mvMatrix);
	//mvMatrix = mult( rotate(10, [0,1,0]  ), mvMatrix);
	mvMatrix = mult( translate(-3,0,-5), mvMatrix);
	
	var pMatrix = perspective( 90, 2, 1, 500);
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
	
	
    render();
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
	
	for(var i =0; i >-50; i--)
	{
		loadBuildings(i);
		loadBuffers();
		populateBuildings();
	}	
	seed=1;
	
	window.requestAnimFrame( render );
}