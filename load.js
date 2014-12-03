//stores building coordinates in storeArray and by scaling
//cubeVerticies by scaleMatrix. Stores texcoordinates in texArray
//only scale by y coordinate
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

}

function loadBuildings()
{
	
	//building1
	makeBuilding(buildingPointsArray1,buildingTexCoordsArray1, scale(1,5,1) );
	makeBuilding(buildingPointsArray2,buildingTexCoordsArray2, scale(1,4,1) );
	makeBuilding(buildingPointsArray3,buildingTexCoordsArray3, scale(1,3,1) );
	makeBuilding(buildingPointsArray4,buildingTexCoordsArray4, scale(1,2,1) );
	makeBuilding(buildingPointsArray5,buildingTexCoordsArray5, scale(1,1,1) );
}

function loadBuffers()
{
	//building1
	buildingGeoBuffer1= gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingGeoBuffer1 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingPointsArray1), gl.STATIC_DRAW );
	buildingTexBuffer1 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buildingTexBuffer1 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingTexCoordsArray1), gl.STATIC_DRAW );

	//building2
	buildingGeoBuffer2= gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingGeoBuffer2 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingPointsArray2), gl.STATIC_DRAW );
	buildingTexBuffer2 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buildingTexBuffer2 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingTexCoordsArray2), gl.STATIC_DRAW );
	
	//building3
	buildingGeoBuffer3= gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingGeoBuffer3 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingPointsArray3), gl.STATIC_DRAW );
    
	buildingTexBuffer3 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buildingTexBuffer3 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingTexCoordsArray3), gl.STATIC_DRAW );
	
	//building4
	buildingGeoBuffer4= gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingGeoBuffer4 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingPointsArray4), gl.STATIC_DRAW );
    
	buildingTexBuffer4 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buildingTexBuffer4 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingTexCoordsArray4), gl.STATIC_DRAW );
	
	//building5
	buildingGeoBuffer5= gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, buildingGeoBuffer5 );
	gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingPointsArray5), gl.STATIC_DRAW );
    
	buildingTexBuffer5 = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, buildingTexBuffer5 );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(buildingTexCoordsArray5), gl.STATIC_DRAW );

}

