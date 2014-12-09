//stores building coordinates in storeArray and by scaling
//cubeVerticies by scaleMatrix. Stores texcoordinates in texArray
//only scale by y coordinate
function makeBuilding(storeArray, texArray, scaleMatrix, depth, count)
{
	//empties arrays
	while(storeArray.length > 0)
		{storeArray.pop();}
	while(texArray.length > 0)
		{texArray.pop();}
	
	var yFactor = scaleMatrix[1][1];
	var temp;
	var randX = Math.floor((random() * 3) + count);
	var randY = Math.floor((random() * 3) + count);
	
	for(var i =0; i <18; i++)
	{
		temp = (multChris(scaleMatrix, cubeArray[i]));
		storeArray.push( multChris( translate(randX, 0, depth ), temp ) );
		texArray.push( vec2(cubeTexCoordsArray[i][0], cubeTexCoordsArray[i][1] * yFactor) );
		
	}
	for(i =18; i <24; i++)
	{
		temp = (multChris(scaleMatrix, cubeArray[i]));
		storeArray.push( multChris( translate(randX, 0, depth ), temp ) );
		texArray.push( cubeTexCoordsArray[i] );
	}
	for(i =24; i <36; i++)
	{
		temp = (multChris(scaleMatrix, cubeArray[i]));
		storeArray.push( multChris( translate(randX, 0, depth ), temp ) );
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
    quad( 6, 5, 1, 2 ); //roof part
    quad( 6, 7, 4, 5 );
    quad( 5, 4, 0, 1 );
}

//only can call once,
//makes the world cube
function makeWorld()
{
	for(var i=0; i <36; i++)
	{
		worldArray.push( (multChris(scale(160,40,100), cubeArray[i])) ); 
		worldTexCoords.push( ( vec2(cubeTexCoordsArray[i][0] *80, cubeTexCoordsArray[i][1] * 20) ) );
		worldTexCoordsFar.push( ( vec2(cubeTexCoordsArray[i][0] *1, cubeTexCoordsArray[i][1] * .5) ) );
	}
}

//also binds plane buffer here
function createBuffers()
{
	
	//START GEOMETRY BUFFERS
	buildingGeoBuffer1= gl.createBuffer();
	buildingTexBuffer1 = gl.createBuffer();
	
	buildingGeoBuffer2= gl.createBuffer();
	buildingTexBuffer2 = gl.createBuffer();
	
	buildingGeoBuffer3= gl.createBuffer();
	buildingTexBuffer3 = gl.createBuffer();
	
	buildingGeoBuffer4= gl.createBuffer();
	buildingTexBuffer4 = gl.createBuffer();
	
	buildingGeoBuffer5= gl.createBuffer();
	buildingTexBuffer5 = gl.createBuffer();
	
	geoRoofBuffer = gl.createBuffer();
	roofTexCoordsBuffer = gl.createBuffer();
	
	worldBuffer= gl.createBuffer();
	
	mainGeoBuffer= gl.createBuffer();
	mainTexCoordsBuffer= gl.createBuffer();
	
	//START TEXTURE COORDINATE BUFFERS
	
	floorTexBuffer = gl.createBuffer();
	
	farTexBuffer = gl.createBuffer();
	
	//plane geometry
	planeBuffer = gl.createBuffer();
	
	//plane normals
	normalBuffer = gl.createBuffer();
	
}



function loadTextures()
{ 	//make textures

	//building1
	buildingTex1 = gl.createTexture();
	buildingTex1.image = new Image();
    buildingTex1.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, buildingTex1);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildingTex1.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	buildingTex1.image.src = "images/buildings/1.jpg";
	
	//building2
	buildingTex2 = gl.createTexture();
	buildingTex2.image = new Image();
    buildingTex2.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, buildingTex2);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildingTex2.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	buildingTex2.image.src = "images/buildings/2.jpg";
	
	
	//building3
	buildingTex3 = gl.createTexture();
	buildingTex3.image = new Image();
    buildingTex3.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, buildingTex3);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildingTex3.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	buildingTex3.image.src = "images/buildings/3.jpg";
	
	//building4
	buildingTex4 = gl.createTexture();
	buildingTex4.image = new Image();
    buildingTex4.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, buildingTex4);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildingTex4.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	buildingTex4.image.src = "images/buildings/4.jpg";
	
	//building5
	buildingTex5 = gl.createTexture();
	buildingTex5.image = new Image();
    buildingTex5.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, buildingTex5);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, buildingTex5.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	buildingTex5.image.src = "images/buildings/5.jpg";
	
	//building roof
	roofTex = gl.createTexture();
	roofTex.image = new Image();
    roofTex.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, roofTex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, roofTex.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	roofTex.image.src = "images/roof.jpg";
	
	//world floor
	floorTex = gl.createTexture();
	floorTex.image = new Image();
    floorTex.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, floorTex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, floorTex.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	floorTex.image.src = "images/Asphalt.jpg";
	
	//world sky
	skyTex = gl.createTexture();
	skyTex.image = new Image();
    skyTex.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, skyTex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, skyTex.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	skyTex.image.src = "images/space.bmp";
	
	
	farTex = gl.createTexture();
	farTex.image = new Image();
    farTex.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, farTex);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, farTex.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	farTex.image.src = "images/skybox/negx.jpg";
	
	//bump map
	groundBump = gl.createTexture();
	groundBump.image = new Image();
    groundBump.image.onload = function(){
	gl.bindTexture(gl.TEXTURE_2D, groundBump);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, groundBump.image);
	gl.generateMipmap(gl.TEXTURE_2D);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    }
	groundBump.image.src = "images/Asphalt.jpg";

}

function loadBuildings(depth)
{
	//produces integer 1-5
	var r1 = Math.floor((random() * 5) + 1);
	var r2 = Math.floor((random() * 5) + 1);
	var r3 = Math.floor((random() * 5) + 1);
	var r4 = Math.floor((random() * 5) + 1);
	var r5 = Math.floor((random() * 5) + 1);
	
	
	//make 5 buildings
	makeBuilding(buildingPointsArray1,buildingTexCoordsArray1, scale(1,r1,1), depth , 1 ); //1-3
	makeBuilding(buildingPointsArray2,buildingTexCoordsArray2, scale(1,r2,1), depth , -2 ); // -2-0
	makeBuilding(buildingPointsArray3,buildingTexCoordsArray3, scale(1,r3,1), depth , 4 ); //4-6
	makeBuilding(buildingPointsArray4,buildingTexCoordsArray4, scale(1,r4,1), depth , -5 ); //-5- -2
	makeBuilding(buildingPointsArray5,buildingTexCoordsArray5, scale(1,r5,1), depth , 7 ); //7-9
	
	//sorry for the inelegance
	for(var i=0; i<36; i++)
	{
		mainGeoArray.push(buildingPointsArray1[i] );
		mainTexCoordsArray.push( buildingTexCoordsArray1[i] );
		
		if( (i >= 18) && (i <=23) )
		{
			mainGeoRoofArray.push(buildingPointsArray1[i] );
			mainRoofTexCoordsArray.push(buildingTexCoordsArray1[i] );
		}
	}
	for(var i=0; i<36; i++)
	{
		mainGeoArray.push(buildingPointsArray2[i] );
		mainTexCoordsArray.push( buildingTexCoordsArray2[i] );
	
		if( (i >= 18) && (i <=23) )
		{
			mainGeoRoofArray.push(buildingPointsArray2[i] );
			mainRoofTexCoordsArray.push(buildingTexCoordsArray2[i] );
		}
	
	}
	for(var i=0; i<36; i++)
	{
		mainGeoArray.push(buildingPointsArray3[i] );
		mainTexCoordsArray.push( buildingTexCoordsArray3[i] );
		
		if( (i >= 18) && (i <=23) )
		{
			mainGeoRoofArray.push(buildingPointsArray3[i] );
			mainRoofTexCoordsArray.push(buildingTexCoordsArray3[i] );
		}
	}
	for(var i=0; i<36; i++)
	{
		mainGeoArray.push(buildingPointsArray4[i] );
		mainTexCoordsArray.push( buildingTexCoordsArray4[i] );
		
		if( (i >= 18) && (i <=23) )
		{
			mainGeoRoofArray.push(buildingPointsArray4[i] );
			mainRoofTexCoordsArray.push(buildingTexCoordsArray4[i] );
		}
	}
	for(var i=0; i<36; i++)
	{
		mainGeoArray.push(buildingPointsArray5[i] );
		mainTexCoordsArray.push( buildingTexCoordsArray5[i] );
		
		if( (i >= 18) && (i <=23) )
		{
			mainGeoRoofArray.push(buildingPointsArray5[i] );
			mainRoofTexCoordsArray.push(buildingTexCoordsArray5[i] );
		}
	}
	
}


function shuffleArray()
{
	var remainingBuildings = buildIter * 5;
	var tempArray1=[], tempArray2 = [];
	
	for(var i =0; i < buildIter*5; i++)
	{
		var chooseBuilding = Math.floor((random() * remainingBuildings) );
		tempArray1 = mainGeoArray.splice(chooseBuilding*36,36);
		tempArray2 = mainTexCoordsArray.splice(chooseBuilding*36,36);
		for(var j=0; j<36;j++)
		{
			suffledGeoArray.push(tempArray1[j]);
			suffledTexCoordsArray.push(tempArray2[j]);
		}
		tempArray1.splice(0,36);
		tempArray2.splice(0,36);
		remainingBuildings--;
	}
	
}
function loadBuffers()
{

	//Geometry and Textutre Coordinates of buildings
	shuffleArray();
	
	gl.bindBuffer( gl.ARRAY_BUFFER, mainGeoBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(suffledGeoArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, mainTexCoordsBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(suffledTexCoordsArray), gl.STATIC_DRAW );
	
	//roof
	gl.bindBuffer( gl.ARRAY_BUFFER, geoRoofBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(mainGeoRoofArray), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, roofTexCoordsBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(mainRoofTexCoordsArray), gl.STATIC_DRAW );

	
	//world
	gl.bindBuffer( gl.ARRAY_BUFFER, worldBuffer );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(worldArray), gl.STATIC_DRAW );
	
	//floor
    gl.bindBuffer( gl.ARRAY_BUFFER, floorTexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(worldTexCoords), gl.STATIC_DRAW );
    
    //far wall
    gl.bindBuffer( gl.ARRAY_BUFFER, farTexBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(worldTexCoordsFar), gl.STATIC_DRAW );
	
	//plane buffer
    gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(Indices), gl.STATIC_DRAW );
	
	//plane normals
	gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(planeNormalsArray), gl.STATIC_DRAW );
	
}


function populateBuildings()
{
	var numVert = buildIter*5*36;
	var buildPerTex = buildIter*36;
	
	//draw roofs
	gl.bindBuffer( gl.ARRAY_BUFFER, geoRoofBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer( gl.ARRAY_BUFFER, roofTexCoordsBuffer );
	gl.vertexAttribPointer( vBuildTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.bindTexture(gl.TEXTURE_2D, roofTex);
	gl.drawArrays( gl.TRIANGLES, 0, 30*buildIter );
	
	
	//draw buildings
	gl.bindBuffer( gl.ARRAY_BUFFER, mainGeoBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer( gl.ARRAY_BUFFER, mainTexCoordsBuffer );
	gl.vertexAttribPointer( vBuildTexCoord, 2, gl.FLOAT, false, 0, 0 );
	gl.bindTexture(gl.TEXTURE_2D, buildingTex1);
	gl.drawArrays( gl.TRIANGLES, 0, buildPerTex );
	
	gl.bindTexture(gl.TEXTURE_2D, buildingTex2);
	gl.drawArrays( gl.TRIANGLES, buildPerTex , buildPerTex );
	
	gl.bindTexture(gl.TEXTURE_2D, buildingTex3);
	gl.drawArrays( gl.TRIANGLES, buildPerTex*2 , buildPerTex );
	
	gl.bindTexture(gl.TEXTURE_2D, buildingTex4);
	gl.drawArrays( gl.TRIANGLES, buildPerTex*3 , buildPerTex );
	
	gl.bindTexture(gl.TEXTURE_2D, buildingTex5);
	gl.drawArrays( gl.TRIANGLES, buildPerTex*4 , buildPerTex );

}

function populateWorld()
{
	gl.bindBuffer( gl.ARRAY_BUFFER, worldBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, floorTexBuffer );
	gl.vertexAttribPointer( vBuildTexCoord, 2, gl.FLOAT, false, 0, 0 );
	
	gl.uniform4fv(UNIFORM_ambientProduct,  flatten(vec4(1,1,1,1)));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(vec4(1,1,1,1)));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(vec4(1,1,1,1)));
	
	//draw floor
	gl.uniform1f(changeColorLoc, 2.0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, floorTex);
	gl.uniform1i(samplerLoc,0);
	
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, groundBump);
	gl.uniform1i(samplerLoc2,1);
	gl.drawArrays( gl.TRIANGLES, 12, 6 );
	
	gl.uniform4fv(UNIFORM_ambientProduct,  flatten(ambientProduct));
    gl.uniform4fv(UNIFORM_diffuseProduct,  flatten(diffuseProduct));
    gl.uniform4fv(UNIFORM_specularProduct, flatten(specularProduct));
	
	//draw sky
	gl.uniform1f(changeColorLoc, 0.0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, skyTex);
	gl.uniform1i(samplerLoc,0);
	
	gl.drawArrays( gl.TRIANGLES, 18, 6 );	

	//gl.drawArrays( gl.TRIANGLES, 24, 6 );
	
}
function drawPlane()
{
	gl.enableVertexAttribArray( ATTRIBUTE_normal );
	gl.disableVertexAttribArray( vBuildTexCoord );
	
	gl.bindBuffer( gl.ARRAY_BUFFER, planeBuffer );
	gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
	gl.bindBuffer( gl.ARRAY_BUFFER, normalBuffer );
	gl.vertexAttribPointer( ATTRIBUTE_normal, 3, gl.FLOAT, false, 0, 0 );
	
	gl.drawArrays( gl.TRIANGLES, 0,  102);
}

//loads normals into plane array
function loadPlaneNormals()
{
	var temp = generateNormals(Indices);
	for(var i =0; i< temp.length; i++)
	{
		planeNormalsArray.push(temp[i]);
	}
	for (var j = 15; j < 27; ++j)
		planeNormalsArray[j] = negate( planeNormalsArray[j] );
	for (var k = 27; k < 39; ++k)
		planeNormalsArray[k] = negate( planeNormalsArray[k] );
	for (var l = 42; l < 54; ++l)
		planeNormalsArray[l] = negate( planeNormalsArray[l] );
}

