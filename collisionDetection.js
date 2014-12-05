//---------------------------------------------------------------------------------------------------
// I suppose that the buildings are created by transforming a unit cube, thus the bounding box can be 
// created in the same way (transforming a unit bounding box)

// cross(u, v) only works for vec3
// translate() and scale() create 4x4 matrices

// Need to include MV.js
//---------------------------------------------------------------------------------------------------
var unitAABBmin = vec4(-0.5, -0.5, -0.5, 1);
var unitAABBmax = vec4(0.5, 0.5, 0.5, 1);
var AABBminArray = [];
var AABBmaxArray = [];
var planeAABBmin = vec4();
var planeAABBmax = vec4();
var currPlaneAABBmin = vec4();
var currPlaneAABBmax = vec4();

// Given a transformation matrix (transformation from object coordinate to world coordinate), create
// the corresponding Axis-Aligned Bounding Box and push it to the array.
function addAABB(ctm) {
	AABBmaxArray.push( matMultVec(ctm, unitAABBmax) );
	AABBminArray.push( matMultVec(ctm, unitAABBmin) );
}

// Clear the buffer at the beginning of every render(), since buildings are translated to new positions
// during the procedure thus we need to create new buffer every time.
function clearAABB() {
	AABBminArray = [];
	AABBmaxArray = [];
	currPlaneAABBmin = [];
	currPlaneAABBmax = [];
}

// Take the vertices buffer of the plane as a input, create an Axis-Aligned Bounding Box for the plane
function createPlaneAABB(buffer) {
	for (var k = 0; k < 3; ++k)
	{
		planeAABBmax[k] = buffer[0][k];
		planeAABBmin[k] = buffer[0][k];
	}
	for (var i = 1; i < buffer.length; ++i)
	{
		for (var j = 0; j < 3; ++j)
		{
			planeAABBmax[j] = Math.max( planeAABBmax[j], buffer[i][j] );
			planeAABBmin[j] = Math.min( planeAABBmin[j], buffer[i][j] );
		}
	}
}

// Return true if collision detected
function detectCollision() {
	for (var i = 0; i < AABBmaxArray.length; ++i)
	{
		if (singleCheck(i))
		{
			// Potential collision detected, return true or perform precise check
			// The plane is potentially colliding with the building #i, I need to retrieve all vertices 
			// of this building and plane, then check intersection between all triangles on plane with 
			// all triangles on the building.
			/*
			if (intersect_primitive_primitive(planeVertices, building#iVertices))
			*/
			return true;
		}
	}
	return false;
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
	var n = cross(u, v);
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
	if (currPlaneAABBmax[0] < AABBminArray[i][0] || currPlaneAABBmin[0] > AABBmaxArray[i][0])
		return false;
	if (currPlaneAABBmax[1] < AABBminArray[i][1] || currPlaneAABBmin[1] > AABBmaxArray[i][1])
		return false;
	if (currPlaneAABBmax[2] < AABBminArray[i][2] || currPlaneAABBmin[2] > AABBmaxArray[i][2])
		return false;
	return true;
}

