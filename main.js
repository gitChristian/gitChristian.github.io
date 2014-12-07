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
var limit = 0;

var scrollEase = 0.08;

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
	for(var i=0; i<buildIter; i++)
	{
		loadBuildings(i);
	}
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
	
	mvMatrix = mult( translate(-3,0,-12), mvMatrix);
	
	var pMatrix = perspective( 50, canvas.width/canvas.height, 1, 500);
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
	
	createPlaneAABB(cubeArray);
    render();
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


	//controls
    if(right)
    {
    	if(degree<=10)
    	{
			degree += .8;
			mvMatrix = mult(rotate(.8,vec3(0,0,1)),mvMatrix);	
		}
		if(limit<=40)
		{
			mvMatrix = mult(rotate(.8,vec3(0,1,0)),mvMatrix);
			limit += .8;
		}
		mvMatrix = mult(mvMatrix, translate(vec3(-.05,0,0)));
    }
    if(rightKeyUp)
    {
    	
    	if(degree>0.2)
    	{
    		mvMatrix = mult(rotate(-0.4,vec3(0,0,1)),mvMatrix);
    		degree -= .4;
    		mvMatrix = mult(mvMatrix, translate(vec3(-.04,0,0)));      //Easing back
    		
    	}
    	if(limit>0.2)
    	{
    		mvMatrix = mult(rotate(-0.8,vec3(0,1,0)),mvMatrix);
    		limit -= .8;
    	}
    	
    	
    }
    if(left)
    {
    	if(degree>=-10)
    	{
			degree -= .8;
			mvMatrix = mult(rotate(-.8,vec3(0,0,1)),mvMatrix);	
		}
		if(limit>=-40)
		{
			mvMatrix = mult(rotate(-0.8,vec3(0,1,0)),mvMatrix);
			limit -= .8;
		}
		mvMatrix = mult(mvMatrix, translate(vec3(.05,0,0)));
    }
    
    if(leftKeyUp)
    {
    	if(degree<-0.2)
    	{
    		mvMatrix = mult(rotate(0.4,vec3(0,0,1)),mvMatrix);
    		degree += .4;
    		mvMatrix = mult(mvMatrix, translate(vec3(.04,0,0)));   //Easing back
    	}
    	if(limit<-0.2)
    	{
    		mvMatrix = mult(rotate(0.8,vec3(0,1,0)),mvMatrix);
    		limit += .8;
    	}
    	
    } 
    //UP and DOWN
    if(down)
    {
    	if(degreeY<=10)
    	{
			degreeY += .5;
			mvMatrix = mult(rotate(.5,vec3(1,0,0)),mvMatrix);	
		}
		mvMatrix = mult(mvMatrix, translate(vec3(0,.08,0)));
    }
    if(downKeyUp)
    {
    	
    	if(degreeY>0.2)
    	{
    		mvMatrix = mult(rotate(-0.3,vec3(1,0,0)),mvMatrix);
    		degreeY -= .3;
    		mvMatrix = mult(mvMatrix, translate(vec3(0,.03,0)));
    	}
    }
    if(up)
    {
    	if(degreeY>=-10)
    	{
			degreeY -= .5;
			mvMatrix = mult(rotate(-.5,vec3(1,0,0)),mvMatrix);
		}
		mvMatrix = mult(mvMatrix, translate(vec3(0,-.08,0)));
    }
    
    if(upKeyUp)
    {
    	if(degreeY < -0.2)
    	{
    		mvMatrix = mult(rotate(0.3,vec3(1,0,0)),mvMatrix);
    		degreeY += .3;
    		mvMatrix = mult(mvMatrix, translate(vec3(0,-.02,0)));
    	}
    } 
    
    if(right || left || down || up)   //Slow down scrolling when turning
    {
    	scrolling += .02;
    	scrollEase = .02;
    }
    else 
    {
    	if(scrollEase < .08)
    	{	
    		scrollEase += .008;
    	}
    	scrolling += scrollEase;
    }
    
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
	clearAABB();
	updatePlaneAABB( translate(-mvMatrix[0][3], -mvMatrix[1][3], -mvMatrix[2][3]) );

	var ctm = mat4();
	ctm = mult(ctm, mvMatrix);
	ctm = mult(ctm, translate(vec3(0,0,scrolling)));
	ctm = mult(ctm, scale(vec3(3,3,3)));
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(ctm));
	
	
	
	
	populateBuildings();
	seed=1;
	populateWorld();
	gl.uniform1f(changeColorLoc, 1.0);
	
	var ctm = mat4();
	
	//ctm = mult(ctm, mvMatrix);
	ctm = mult(ctm, translate(vec3(0,-1,-3.8)));
	ctm = mult(ctm, scale(vec3(1.2,1.2,1.2)));
	ctm = mult(ctm, rotate(-degree,vec3(0,1,0)));
	ctm = mult(ctm, rotate(-degree,vec3(0,0,1)));
	ctm = mult(ctm, rotate(-degreeY*1.5,vec3(1,0,0)));
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(ctm));

	drawPlane();
	
	gl.uniform1f(changeColorLoc, 0.0);

	document.getElementById('collision').innerHTML = detectCollision();
	
	
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

