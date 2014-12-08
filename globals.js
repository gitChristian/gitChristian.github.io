var canvas;
var gl;
var program;
var collided = 0;
//how many rows of buildings to be drawn
var buildIter=300;

//geometry arrays
var buildingPointsArray1 = [], buildingPointsArray2 = [], buildingPointsArray3 = [], 
	buildingPointsArray4 = [], buildingPointsArray5 = [],
	mainGeoArray = [], mainGeoArray_copy = [], suffledGeoArray = [], mainGeoRoofArray = [];
var cubeArray = [];
var worldArray = [];

//texture coordinate arrays
var buildingTexCoordsArray1 = [], buildingTexCoordsArray2 = [],buildingTexCoordsArray3 = [],
	buildingTexCoordsArray4 = [], buildingTexCoordsArray5 = [],
	mainTexCoordsArray = [], suffledTexCoordsArray = [], mainRoofTexCoordsArray = [];
var cubeTexCoordsArray = [];
var worldTexCoords=[], worldTexCoordsFar = [];

//location in shaders
var vPosition;
var vBuildTexCoord;
var samplerLoc, changeColorLoc;
var mvMatrixLoc, pMatrixLoc;

//Color variables
var UNIFORM_specularProduct;
var UNIFORM_lightPosition;
var UNIFORM_shininess;
var ATTRIBUTE_position;
var ATTRIBUTE_normal;
var normalBuffer;


var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var materialAmbient = vec4(0.0, 0.0, 1.0, 1.0);
var ambientProduct = mult(lightAmbient, materialAmbient);

var lightDiffuse = vec4(0.6, 0.6, 0.6, 1.0);
var materialDiffuse = vec4(0.0, 0.6, 0.6, 1.0);
var diffuseProduct = mult(lightDiffuse, materialDiffuse);

var lightSpecular = vec4(0.4, 0.4, 0.4, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var specularProduct = mult(lightSpecular, materialSpecular);

var shininess = 50;
var lightPosition = vec3(-9.0, 7.0, -2.0);

var normals = [
   vec3(0,0,1),vec3(0,0,1),vec3(0,0,1),vec3(0,0,1),vec3(0,0,1),vec3(0,0,1),
   vec3(1,0,0),vec3(1,0,0),vec3(1,0,0),vec3(1,0,0),vec3(1,0,0),vec3(1,0,0),
   vec3(0,-1,0),vec3(0,-1,0),vec3(0,-1,0),vec3(0,-1,0),vec3(0,-1,0),vec3(0,-1,0),
   vec3(0,1,0),vec3(0,1,0),vec3(0,1,0),vec3(0,1,0),vec3(0,1,0),vec3(0,1,0),
   vec3(0,0,-1),vec3(0,0,-1),vec3(0,0,-1),vec3(0,0,-1),vec3(0,0,-1),vec3(0,0,-1),
   vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0), vec3(-1,0,0)  
];

//texture objects
var buildingTex1,buildingTex2,buildingTex3,buildingTex4, buildingTex5;
var roofTex, floorTex, skyTex, farTex;

//buffers
var buildingGeoBuffer1,buildingGeoBuffer2,buildingGeoBuffer3,buildingGeoBuffer4, buildingGeoBuffer5, mainGeoBuffer, geoRoofBuffer;
var buildingTexBuffer1,buildingTexBuffer2,buildingTexBuffer3,buildingTexBuffer4, buildingTexBuffer5, mainTexCoordsBuffer, roofTexCoordsBuffer;
var worldBuffer, floorTexBuffer, farTexBuffer, planeBuffer, bullshitTexBuffer;

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


   var VA=vec4(0,0,0,1.0);
    var B=vec4(-0.340,0,0.810,1.0);
    var C=vec4(-0.340,0,0.859,1.0);
    var D=vec4(-0.300,0,0.900,1.0);
    var E=vec4(-0.140,0,0.707,1.0);
    var F=vec4(-0.130,0,0.745,1.0);
    var G=vec4(0.000,0.000,0.900,1.0);
    var H=vec4(0.130,0.000,0.745,1.0);
    var I=vec4(0.140,0.000,0.707,1.0);
    var J=vec4(0.300,0.000,0.900,1.0);
    var K=vec4(0.340,0.000,0.859,1.0);
    var L=vec4(0.340,0.000,0.810,1.0);    

    var Z1=vec4(0,0.111,0.229,1.0);
    var Z2=vec4(0.106,0,0.265,1.0);
    var Z3=vec4(0.140,0,0.451,1.0);
    var Z4=vec4(-0.106,0,0.265,1.0);
    var Z5=vec4(-0.140,0,0.451,1.0);    

    var VA0=vec4(0,0,0.113,1.0);
    var VA2=vec4(-0.028,0,0.069,1.0);
    var VA3=vec4(0.028,0,0.069,1.0);    

    var Y1=vec4(-0.024,0.027,0.751,1.0);
    var Y2=vec4(-0.095,0.100,0.967,1.0);
    var Y3=vec4(-0.092,0.100,1.066,1.0);
    var Y4=vec4(0.092,0.100,1.066,1.0);
    var Y5=vec4(0.095,0.100,0.967,1.0);
    var Y6=vec4(0.024,0.027,0.751,1.0);    
    

    //data is visualized in the plane model pdf    

    var vertices = [
        VA, VA2, VA0, VA3,
      //0   1   2   3
        //front part
        Z1, VA2, Z4, Z5, E,
      //4   5   6   7   8
        //left front armor
        Z4, B, C, D, E, Z5,
      //9   10 11 12 13 14
        //left wring 
        F, Z1, H, G, 
      //15 16 17 18 
        //back
        Y1, Y2, Y3, G,
      //19  20  21  22
        //back left wing
        Y6, Y5, Y4, G,
      //23  24  25  26
        //back right wing
        I, J, K, L, Z2, Z3,
      //27 28 29 30 31  32
        //right wing
        H, Z1,VA3,Z2,Z3,
      //33 34 35 36 37
        //right armor
        VA, B, C, D, E, F, G, H, I, J, K, L,
      //38 39 40 41 42 43 44 45 46 47 48 49 
        //BOTTOM
        VA2, VA0, VA3, Z1
    //  50   51   52   53
    //missed part
        ];
    
    var Indices = 
    [
                vertices[0], vertices[1], vertices[2],  //VA VA2 VA0, checked 12/5
                vertices[0], vertices[2], vertices[3], //VA VA0 VA3, checked 12/5                              // Front face
                vertices[4], vertices[5], vertices[6], //Z1 VA2 Z4, checked 12/5
                vertices[4], vertices[6], vertices[7], //Z1 Z4 Z5, checked 12/5
                vertices[4], vertices[7], vertices[15],  //Z1 Z5 F, added 12/5
                vertices[9], vertices[10],vertices[11], //Z4 B C, checked 12/5
                vertices[9], vertices[11],vertices[14], //Z4 C Z5, checked 12/5
                vertices[11],vertices[12],vertices[14], //C D Z5, checked 12/5
                vertices[12],vertices[13],vertices[14], //D E Z5, checked 12/5     //left wing
                //Y5 Y4 G, checked 12/5//right
                //vertices[27],vertices[28],vertices[29], //I J K not passed check redo label
                //vertices[27],vertices[29],vertices[30], //I K L
                // vertices[27],vertices[30],vertices[32], //I L Z3
                //vertices[30],vertices[31],vertices[32], //L Z2 Z3 checked   




                vertices[29],vertices[30],vertices[31], //K L Z2  redo begin
                vertices[32],vertices[31],vertices[29], //Z3 Z2 K, redo, 12/5
                vertices[28],vertices[29],vertices[32], //J K Z3, redo, 12/5
                vertices[27],vertices[28],vertices[32], //I J Z3 redo 12/5  


                vertices[15],vertices[16],vertices[18], //F Z1 G, checked 12/5
                vertices[16],vertices[17],vertices[18], //Z1 H G, checked 12/5                               //back
                vertices[19],vertices[20],vertices[22], //Y1 Y2 G, checked 12/5
                vertices[20],vertices[21],vertices[22], //Y2 Y3 G, checked 12/5  //left back part
                vertices[23],vertices[24],vertices[26], //Y6, Y5, G, checked 12/5
                vertices[24],vertices[25],vertices[26], 


                       //right wing
                vertices[33],vertices[34],vertices[37],  //H Z1 Z3 changed  12/5
                vertices[34],vertices[36],vertices[37],  //Z1 Z2 Z3 checked 12/5  
                vertices[34],vertices[35],vertices[36],  //Z1 Z2 VA3 checked 12/5                      //right armor
                vertices[38],vertices[39],vertices[40],      
                vertices[38],vertices[40],vertices[41],    
                vertices[38],vertices[41],vertices[42],   
                vertices[38],vertices[42],vertices[43],   
                vertices[38],vertices[43],vertices[44],   
                vertices[38],vertices[44],vertices[45],      
                vertices[38],vertices[45],vertices[46],    
                vertices[38],vertices[46],vertices[47],   
                vertices[38],vertices[47],vertices[48],   
                vertices[38],vertices[48],vertices[49],
                vertices[50],vertices[51],vertices[53],
                vertices[52],vertices[51],vertices[53] //missed part
                 //bottom   

    ];

var seed = 1;
function random() {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

