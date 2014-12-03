
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
	loadBuildings();
	loadBuffers();
	
	//get locations in shader and enable variables
	vPosition = gl.getAttribLocation( program, "vPosition" );
	vBuildTexCoord = gl.getAttribLocation( program, "vBuildTexCoord" );
	gl.enableVertexAttribArray( vPosition );
	gl.enableVertexAttribArray( vBuildTexCoord );
	samplerLoc = gl.getUniformLocation(program, "texture");
	
	
	//group code
	mvMatrixLoc = gl.getUniformLocation( program, "mvMatrix" );
    pMatrixLoc = gl.getUniformLocation( program, "pMatrix" );
	
	var mvMatrix =mat4();
	mvMatrix = mult( rotate(40, [1,0,0]  ), mvMatrix);
	mvMatrix = mult( translate(0,-2,-3), mvMatrix);
	var pMatrix = perspective( 90, 1, 1, 100);
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(pMatrixLoc, false, flatten(pMatrix));
	//end group code
	
    render();
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingGeoBuffer1 );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingTexBuffer1 );
	gl.vertexAttribPointer( vBuildTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.bindTexture(gl.TEXTURE_2D, buildingTex1);
	gl.uniform1i(samplerLoc, 0);
	
	gl.drawArrays( gl.TRIANGLES, 0, 36 );
	
	window.requestAnimFrame( render );
}