var mvMatrix = mat4();

var right = false;
var left = false;
var	up = false;
var down = false;

var rightKeyUp = true;
var leftKeyUp = true;
var upKeyUp = true;
var downKeyUp = true;

var leftrotated = false;
var rightrotated = false;
var degree = 0;
var degreeY = 0;

var scrolling = 0;
var scrollIter = 0;

var limit = 0;

var iterL = 0;
var iterR = 0;
var iterU = 0;
var iterD = 0;

var scrollEase = 2.34;

var turnSpeed = .4;

var boundLeft = -10.0;
var boundRight = 10.0;
var boundUp = 0;
var boundDown = 0;

var posX = 0.0;
var posY = 0.0;


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
	for(var i=-20; i>-buildIter*3 - 20; i-=3)
	{
		loadBuildings(i);
	}
	// Make a copy of mainGeoArray used for collision detection
	for (var i = 0; i < mainGeoArray.length; ++i)
		mainGeoArray_copy.push( vec4(mainGeoArray[i][0], mainGeoArray[i][1], mainGeoArray[i][2], mainGeoArray[i][3]) );
	
	
	loadBuffers();

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
	
	mvMatrix = mult( translate(-3,0,-50), mvMatrix);
	
	var pMatrix = perspective( 7, canvas.width/canvas.height, 1, 1000);
	mvMatrix = mult( rotate(0, [0,0,1]  ), mvMatrix);
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
	
    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	//controls
    if(right)
    {
    	if(iterR<=10)
    	{
    		iterR++;
			mvMatrix = mult(rotate(.8,vec3(0,0,1)),mvMatrix);	
			degree+=.8;
		}
		if(posX <= 34)
		{
			posX+=turnSpeed;
			mvMatrix = mult(mvMatrix, translate(vec3(-turnSpeed,0,0)));
		}
		
    }
    if(rightKeyUp)
    {
    	
    	if(iterR>0)
    	{
    		iterR--;
    		mvMatrix = mult(rotate(-0.8,vec3(0,0,1)),mvMatrix);
    		degree-=.8;
    	}
    	  	
    }
    if(left)
    {
    	if(iterL>=-10)
    	{
			iterL--;
			mvMatrix = mult(rotate(-.8,vec3(0,0,1)),mvMatrix);
			degree-=.8;	
		}
		if(posX >=-24)
		{
			posX-=turnSpeed;
			mvMatrix = mult(mvMatrix, translate(vec3(turnSpeed,0,0)));
		}
    }
    
    if(leftKeyUp)
    {
    	if(iterL<0)
    	{
    		mvMatrix = mult(rotate(0.8,vec3(0,0,1)),mvMatrix);
    		iterL++;
    		degree+=.8;
    	}
    } 
    //UP and DOWN
    if(up)
    {
    	if(iterU<=10)
    	{
			iterU++;
			degreeY+=.8;
		}
		if(posY <= 5)
		{
			posY += turnSpeed;
			mvMatrix = mult(mvMatrix, translate(vec3(0,turnSpeed,0)));
			
		}
    }
    if(upKeyUp)
    {
    	
    	if(iterU>0)
    	{
    		iterU--
    		degreeY-=.8;
    	}
    }
    if(down)
    {
    	
    	if(iterD>=-10)
    	{
    		iterD--;
    		degreeY-=.8;
		}
		if(posY >= -10)
		{
			posY -= turnSpeed;
			mvMatrix = mult(mvMatrix, translate(vec3(0,-turnSpeed,0)));
		}
    }
    
    if(downKeyUp)
    {
    	
    	if(iterD < 0)
    	{
    		degreeY+=.8;
    		iterD++;
    	}
    } 
    
  /*  if(right || left || down || up)   //Slow down scrolling when turning
    {
    	//scrolling += .08;
    	//scrollEase = .08;
    }
    else 
    {*/
    	/*if(scrollEase < .24)
    	{	
    		scrollEase += .24;
    	}*/
    	scrolling += scrollEase;
    	scrollIter++;
   // }
    
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));


	var ctm = mat4();
	ctm = mult(ctm, mvMatrix);
	ctm = mult(ctm, translate(vec3(0,0,scrolling)));
	ctm = mult(ctm, scale(vec3(4,4,15)));
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(ctm));
	
	
	
	
	populateBuildings();
	seed=1;
	
	// Create bounding box for each building
	var tempBuffer = [];
	var testPoint;
	for (var i = 0; i < mainGeoArray_copy.length; i += 36)
	{
		testPoint = vec4( mainGeoArray_copy[i][0], mainGeoArray_copy[i][1], mainGeoArray_copy[i][2], mainGeoArray_copy[i][3] );
		if ( Math.abs( planeAABBmin[2] - matMultVec( ctm, testPoint )[2] ) < 24 )
		{
			tempBuffer = [];
			for (var j = 0; j < 36; ++j)
			{
				tempBuffer.push( vec4(mainGeoArray_copy[i+j][0], mainGeoArray_copy[i+j][1], mainGeoArray_copy[i+j][2], mainGeoArray_copy[i+j][3]) );
			}
			addAABB( ctm, tempBuffer );
		}
	}
	
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
	
	
	//populateWorld();
	gl.uniform1f(changeColorLoc, 1.0);
	
	var ctm = mat4();
	
	//ctm = mult(ctm, mvMatrix);
	ctm = mult(ctm, translate(vec3(0,-.9,-21.5)));
	ctm = mult(ctm, scale(vec3(1.3,1.3,1.3)));
	ctm = mult(ctm, rotate(-degree,vec3(0,1,0)));
	ctm = mult(ctm, rotate(-degree,vec3(0,0,1)));
	ctm = mult(ctm, rotate(-degreeY*1.5,vec3(1,0,0)));
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(ctm));

	drawPlane();
	
	updatePlaneAABB( ctm, Indices );	// Update bounding box for the plane
	
	gl.uniform1f(changeColorLoc, 0.0);

	document.getElementById('collision').innerHTML = detectCollision();
	//document.getElementById('collision').innerHTML = suffledGeoArray.length;
	
	window.requestAnimFrame( render );
}

document.addEventListener('keydown', function(event) {
    if (event.keyCode == 37){
        left = true;
        leftKeyUp = false;
    }
    if (event.keyCode == 39){
        right = true;
        rightKeyUp = false;
    }
    if (event.keyCode == 38){
        up = true;
        upKeyUp = false;
    }
    if (event.keyCode == 40){
        down = true;
        downKeyUp = false;
    }
});
function key(e) {
	return e?e.which:event.keyCode;
}

document.addEventListener('keyup', function(event) {
	
	switch(key()){
		case 37:
		{
			leftKeyUp = true;
			left = false;
			break;
		}
		case 39:
		{
			rightKeyUp = true;
			right = false;
			break;
		}
		case 38:
		{
			upKeyUp = true;
			up = false;
			break;
		}
		case 40:
		{
			downKeyUp = true;
			down = false;
			break;
		}
	}

});





