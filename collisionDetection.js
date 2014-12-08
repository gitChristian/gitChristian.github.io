//---------------------------------------------------------------------------------------------------
// I suppose that the buildings are created by transforming a unit cube, thus the bounding box can be 
// created in the same way (transforming a unit bounding box)

// cross(u, v) only works for vec3
// translate() and scale() create 4x4 matrices

// Need to include MV.js
//---------------------------------------------------------------------------------------------------
var AABBminArray = [];
var AABBmaxArray = [];
var planeAABBmin = vec4();
var planeAABBmax = vec4();
var buildingCheckBuffer = [];
var planeCheckBuffer = [];

// Given a transformation matrix (transformation from object coordinate to world coordinate), create
// the corresponding Axis-Aligned Bounding Box and push it to the array.
function addAABB(ctm, buffer) {
	var points = applyTransformation( ctm, buffer );
	for (var i = 0; i < points.length; ++i)
		buildingCheckBuffer.push( vec4(points[i][0], points[i][1], points[i][2], points[i][3]) );
	var temp = createAABB( points );
	var AABBmin = vec4( temp[0][0], temp[0][1], temp[0][2], temp[0][3] );
	var AABBmax = vec4( temp[1][0], temp[1][1], temp[1][2], temp[1][3] );
	AABBminArray.push( AABBmin );
	AABBmaxArray.push( AABBmax );
}

// Clear the buffer at the beginning of every render(), since buildings are translated to new positions
// during the procedure thus we need to create new buffer every time.
function clearAABB() {
	AABBminArray = [];
	AABBmaxArray = [];
	buildingCheckBuffer = [];
	planeCheckBuffer = [];
}

// Take the vertices buffer of the plane as a input, create an Axis-Aligned Bounding Box for the plane
function createAABB(buffer) {
	var result = [];
	var AABBmax = vec4();
	var AABBmin = vec4();
	for (var k = 0; k < 3; ++k)
	{
		AABBmax[k] = buffer[0][k];
		AABBmin[k] = buffer[0][k];
	}
	for (var i = 1; i < buffer.length; ++i)
	{
		for (var j = 0; j < 3; ++j)
		{
			AABBmax[j] = Math.max( AABBmax[j], buffer[i][j] );
			AABBmin[j] = Math.min( AABBmin[j], buffer[i][j] );
		}
	}
	result.push(AABBmin);
	result.push(AABBmax);
	return result;
}

function updatePlaneAABB(ctm, buffer) {
	var points = applyTransformation( ctm, buffer );
	for (var i = 0; i < points.length; ++i)
		planeCheckBuffer.push( vec4(points[i][0], points[i][1], points[i][2], points[i][3]) );
	var temp = createAABB( points );
	planeAABBmin = vec4( temp[0][0], temp[0][1], temp[0][2], temp[0][3] );
	planeAABBmax = vec4( temp[1][0], temp[1][1], temp[1][2], temp[1][3] );
}

// Return true if collision detected
function detectCollision() {
	var tempBuffer;
	for (var i = 0; i < AABBmaxArray.length; ++i)
	{
		if (singleCheck(i))
		{
			// Potential collision detected, return true or perform precise check
			// The plane is potentially colliding with the building #i, I need to retrieve all vertices 
			// of this building and plane, then check intersection between all triangles on plane with 
			// all triangles on the building.
			tempBuffer = [];
			for ( var j = i * 36; j < (i+1) * 36; ++j)
				tempBuffer.push( vec4(buildingCheckBuffer[j][0], buildingCheckBuffer[j][1], buildingCheckBuffer[j][2], buildingCheckBuffer[j][3]) );
			if (intersect_primitive_primitive(planeCheckBuffer, tempBuffer))
				return true;
		}
	}
	return false;
}


function applyTransformation ( ctm , buffer ) {
	var result = [];
	var temp;
	for (var i = 0; i < buffer.length; ++i)
	{
		temp = vec4( buffer[i][0], buffer[i][1], buffer[i][2], buffer[i][3] );
		result.push( matMultVec( ctm, temp ) );
	}
	return result;
}


//---------------------------------------------------------------------------------------------------
// Utility functions: 
//---------------------------------------------------------------------------------------------------
// Perform matrix and vector multiplication (A - matrix, v - vector)
function matMultVec (A, v) {
	var result = [];
	
	for ( var i = 0; i < A.length; ++i ) {
			var sum = 0.0;
            for ( var j = 0; j < v.length; ++j ) {   
				sum += A[i][j] * v[j];
            }
			result.push( sum );
        }
		return result;
}

// Test intersection between a triangle and a line segment
function intersect_segment_triangle (P0, P1, V0, V1, V2) {
	var SMALL_NUM = 0.00000001
	var u = subtract(V1, V0);
	var v = subtract(V2, V0);
	var n3 = cross( vec3(u[0], u[1], u[2]), vec3(v[0], v[1], v[2]));
	var n = vec4(n3[0], n3[1], n3[2], 0);
	var dir = subtract(P1, P0);
	var w0 = subtract(P0, V0);
	var a = -dot(n, w0);
	var b = dot(n, dir);
	if (Math.abs(b) < SMALL_NUM)		// Segment is parallel to the plane
		return false;
	var r = a / b;
	if (r < 0.0 || r > 1.0)
		return false;
	var I = add(P0, scale1(r, dir));	// Intersection point of the segment and the plane
	// Is I inside the triangle?
	var uu = dot(u, u);
	var uv = dot(u, v);
	var vv = dot(v, v);
	var w = subtract(I, V0);
	var wu = dot(w, u);
	var wv = dot(w, v);
	var D = uv * uv - uu * vv;
	// get and test parametric coordinates
	var s = (uv * wv - vv * wu) / D;
	if (s < 0.0 || s > 1.0)
		return false;
	var t = (uv * wu - uu * wv) / D;
	if (t < 0.0 || (s + t) > 1.0)
		return false;
	return true;
}

// Test intersection between two triangles
function intersect_triangle_triangle (V0, V1, V2, W0, W1, W2) {
	if ( intersect_segment_triangle (W0, W1, V0, V1, V2) )
		return true;
	if ( intersect_segment_triangle (W0, W2, V0, V1, V2) )
		return true;
	if ( intersect_segment_triangle (W1, W2, V0, V1, V2) )
		return true;
	if ( intersect_segment_triangle (V0, V1, W0, W1, W2) )
		return true;
	if ( intersect_segment_triangle (V0, V2, W0, W1, W2) )
		return true;
	if ( intersect_segment_triangle (V1, V2, W0, W1, W2) )
		return true;
	return false;
}

// Test intersection between two primitives 
function intersect_primitive_primitive (buffer1, buffer2) {
	for (var i = 0; i < buffer1.length; i += 3)
	{
		for (var j = 0; j < buffer2.length; j += 3)
		{
			if ( intersect_triangle_triangle(buffer1[i], buffer1[i+1], buffer1[i+2], buffer2[j], buffer2[j+1], buffer2[j+2]) )
				return true;
		}
	}
	return false;
}

// Check collision between two Axis-Aligned Bounding Boxes
function singleCheck(i) {
	if (planeAABBmax[0] < AABBminArray[i][0] || planeAABBmin[0] > AABBmaxArray[i][0])
		return false;
	if (planeAABBmax[1] < AABBminArray[i][1] || planeAABBmin[1] > AABBmaxArray[i][1])
		return false;
	if (planeAABBmax[2] < AABBminArray[i][2] || planeAABBmin[2] > AABBmaxArray[i][2])
		return false;
	return true;
}


// A function to take an array of points as input and generate corresponding normals for flat shading.
// Returned result is an array containing normals in vec3, and normal vectors are already normalized. 
function generateNormals (points) {
	var result = [];
	var centroid = vec3();
	var u = vec3();
	var v = vec3();
	var w = vec3();
	var normal = vec3();
	for (var i = 0; i < points.length; ++i)
	{
		centroid = add( centroid, vec3(points[i][0], points[i][1], points[i][2]) );
	}
	centroid = scale1( 1/points.length, centroid );
	for (var j = 0; j < points.length; j += 3)
	{
		u = subtract( vec3(points[j+1][0], points[j+1][1], points[j+1][2]), vec3(points[j][0], points[j][1], points[j][2]) );
		v = subtract( vec3(points[j+2][0], points[j+2][1], points[j+2][2]), vec3(points[j][0], points[j][1], points[j][2]) );
		w = subtract( vec3(points[j][0], points[j][1], points[j][2]), centroid );
		normal = cross( u, v );
		normal = normalize( normal, 0 );
		if ( dot(normal, w) < 0 )
			normal = negate(normal);
		result.push(normal);
		result.push(normal);
		result.push(normal);
	}
	return result;
}