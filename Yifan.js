var program;
var canvas;
var gl;

window.onload = function init()
{

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    var VA=vec3(0,0,0);
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
        ];
    
    var test = [
    	VA,
    	VA2,
    	VA0
    	
    ]; 
    
    var test2 = [
    	vec3(0,0,0),
    	vec3(.1,.5,.5),
    	vec3(-.1,-.9,.5),
    ];
    
    var Indices = 
    [
                vec3( vertices[0], vertices[1],vertices[ 2]),
                vec3(vertices[0], vertices[2], vertices[3]),                               // Front face
                vec3(vertices[4], vertices[5], vertices[6]), 
                vec3(vertices[4], vertices[6], vertices[7]),
                vec3(vertices[4], vertices[7], vertices[8]),                      // left front armor
                vec3(vertices[9],vertices[10],vertices[11]),    
                vec3(vertices[9],vertices[11],vertices[14]),   
                vec3(vertices[11],vertices[12],vertices[14]),
                vec3(vertices[12],vertices[13],vertices[14]),      //left wing
                vec3(vertices[15],vertices[16],vertices[18]),
                vec3(vertices[16],vertices[17],vertices[18]),                                //back
                vec3(vertices[27],vertices[28],vertices[29]), 
                vec3(vertices[27],vertices[29],vertices[30]),
               vec3( vertices[27],vertices[30],vertices[32]),
                vec3(vertices[30],vertices[31],vertices[32]),           //right wing
                vec3(vertices[33],vertices[34],vertices[37]),     
                vec3(vertices[34],vertices[36],vertices[37]),    
                vec3(vertices[34],vertices[35],vertices[36]),                         //right armor
                vec3(vertices[38],vertices[39],vertices[40]),      
               vec3( vertices[38],vertices[40],vertices[41]),    
               vec3( vertices[38],vertices[41],vertices[42]),   
               vec3( vertices[38],vertices[42],vertices[43]),   
               vec3( vertices[38],vertices[43],vertices[44]),   
               vec3( vertices[38],vertices[44],vertices[45]),      
                vec3(vertices[38],vertices[45],vertices[46]),    
                vec3(vertices[38],vertices[46],vertices[47]),   
                vec3(vertices[38],vertices[47],vertices[48]),   
               vec3( vertices[38],vertices[48],vertices[49]) //bottom   

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
    
    
    var pMatrixLoc = gl.getUniformLocation( program, "pMatrix" );
 	var mvMatrixLoc = gl.getUniformLocation( program, "mvMatrix" );
	var pMatrix = perspective( 120, canvas.width/canvas.height, .0001, 100);
	//var pMatrix = mat4();
	var mvMatrix = mat4();
	mvMatrix = mult(mvMatrix, translate(vec3(0,0,-1.3)));
	mvMatrix = mult(mvMatrix, rotate(30,[1,0,0]));
	gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(pMatrixLoc, false, flatten(pMatrix));


	render();

}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    gl.drawArrays( gl.TRIANGLES, 0, 49 );
    
}
