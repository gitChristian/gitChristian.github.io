var canvas;
var gl;
var program;

//
var buildingPointsArray1 = [], buildingPointsArray2 = [], buildingPointsArray3 = [], 
	buildingPointsArray4 = [], buildingPointsArray5 = [];
var buildingTexCoordsArray1 = [], buildingTexCoordsArray2 = [],buildingTexCoordsArray3 = [],
	buildingTexCoordsArray4 = [], buildingTexCoordsArray5 = [];
var cubeTexCoordsArray = [];
var cubeArray = [];

//location in shaders
var vPosition;
var vBuildTexCoord;
var samplerLoc;
var mvMatrixLoc, pMatrixLoc;


//texture objects
var buildingTex1,buildingTex2,buildingTex3,buildingTex4, buildingTex5;
var roofTex;

//buffers
var buildingGeoBuffer1,buildingGeoBuffer2,buildingGeoBuffer3,buildingGeoBuffer4, buildingGeoBuffer5;
var buildingTexBuffer1,buildingTexBuffer2,buildingTexBuffer3,buildingTexBuffer4, buildingTexBuffer5;

//transformation matrix
var buildingCtm =mat4();

var cubeVerticies = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];

var buildingTexCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

