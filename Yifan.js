var program;
var canvas;
var gl;
window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    var VA=(0,0,0);
    var B=vec3(-0.340,0,0.810);
    var C=vec3(-0.340,0,0.859);
    var D=vec3(-0.300,0,0.900);
    var E=vec3(-0.140,0,0.707);
    var F=vec3(-0.130,0,0.745);
    var G=vec3(0.000,0.000,0.900);
    var H=vec3(0.130,0.000,0.745);
    var I=vec3(0.140,0.000,0.707);
    var J=vec3(0.300,0.000,0.900);
    var K=vec3(0.340,0.000,0.859);
    var L=vec3(0.340,0.000,0.810);    

    var Z1=vec3(0,0.111,0.229);
    var Z2=vec3(0.106,0,0.265);
    var Z3=vec3(0.140,0,0.451);
    var Z4=vec3(-0.106,0,0.265);
    var Z5=vec3(-0.140,0,0.451);    

    var VA0=vec3(0,0,0.113);
    var VA2=vec3(-0.028,0,0.069);
    var VA3=vec3(0.028,0,0.069);    

    var Y1=vec3(-0.024,0.027,0.751);
    var Y2=vec3(-0.095,0.100,0.967);
    var Y3=vec3(-0.092,0.100,1.066);
    var Y4=vec3(0.092,0.100,1.066);
    var Y5=vec3(0.095,0.100,0.967);
    var Y6=vec3(0.024,0.027,0.751);    
    

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
        ]
    var Indices = 
    [
                0, 1, 2,       0, 2, 3,                                       // Front face
                4, 5, 6,       4, 6, 7,     4, 7, 8,                          // left front armor
                9,10,11,       9,11,14,     11,12,14,   12,13,14,             //left wing
                15,16,18,      16,17,18,                                      //back
                27,28,29,      27,29,30,    27,30,32,   30,31,32,             //right wing
                33,34,37,      34,36,37,    34,35,36,                         //right armor
                38,39,40,      38,40,41,    38,41,42,   38,42,43,   38,43,44,   
                38,44,45,      38,45,46,    38,46,47,   38,47,48,   38,48,49, //bottom    

    ];


    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW );
    ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 3, gl.FLOAT, false, 0, 0 );
    






}
