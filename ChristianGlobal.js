var canvas;
var gl;
var program;

var buildingPointsArray = [];
var buildingTexCoordsArray = [];
var cubeTexCoordsArray = [];
var cubeArray = [];

var vPosition;
var vBuildTexCoord;
var samplerLoc;
var mvMatrixLoc, pMatrixLoc;


//texture objects
var buildingTex1,buildingTex2,buildingTex3,buildingTex4;

//buffers
var buildingGeoBuffer1,buildingGeoBuffer2,buildingGeoBuffer3,buildingGeoBuffer4;
var buildingTexBuffer1,buildingTexBuffer2,buildingTexBuffer3,buildingTexBuffer4;

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

