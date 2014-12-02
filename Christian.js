//stores building coordinates in storeArray and by scaling
//cubeVerticies by scaleMatrix
function makeBuilding(storeArray, texArray, scaleMatrix)
{
	//empties arrays
	while(storeArray.length > 0)
		{storeArray.pop();}
	while(texArray.length > 0)
		{texArray.pop();}
	
	var yFactor = scaleMatrix[1][1];
	
	for(var i =0; i <36; i++)
	{
		storeArray.push(multChris(scaleMatrix, cubeArray[i]));
		texArray.push( vec2(cubeTexCoordsArray[i][0], cubeTexCoordsArray[i][1] * yFactor) );
	}
}

function quad(a, b, c, d) {
     cubeArray.push(cubeVerticies[a]); 
     cubeTexCoordsArray.push(buildingTexCoord[0]);

     cubeArray.push(cubeVerticies[b]); 
     cubeTexCoordsArray.push(buildingTexCoord[1]); 

     cubeArray.push(cubeVerticies[c]); 
     cubeTexCoordsArray.push(buildingTexCoord[2]); 
   
     cubeArray.push(cubeVerticies[a]); 
     cubeTexCoordsArray.push(buildingTexCoord[0]); 

     cubeArray.push(cubeVerticies[c]); 
     cubeTexCoordsArray.push(buildingTexCoord[2]); 

     cubeArray.push(cubeVerticies[d]); 
     cubeTexCoordsArray.push(buildingTexCoord[3]);   
}

function makeCube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 6, 7, 4, 5 );
    quad( 5, 4, 0, 1 );
}


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
	
	
	//make textures
	buildingTex1 = gl.createTexture();
	buildingTex1.image = new Image();
    buildingTex1.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, buildingTex1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildingTex1.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	//buildingTex1.image.src = "images/buildings/3.jpg";
	buildingTex1.image.src = "3.jpg";
	
	
	
	//Load buildings in buffers
	makeCube();
	
	//building1
	makeBuilding(buildingPointsArray,buildingTexCoordsArray, scale(1,5,1) );
	
	buildingGeoBuffer1= gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingGeoBuffer1 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingPointsArray), gl.STATIC_DRAW );
    
	buildingTexBuffer1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buildingTexBuffer1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingTexCoordsArray), gl.STATIC_DRAW );
    
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
	mvMatrix = mult( translate(0,0,-5), mvMatrix);
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