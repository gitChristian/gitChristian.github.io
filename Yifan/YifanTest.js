var program;
var canvas;
var gl;
var VertexIndexBuffer;
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
        VA2, VA0, VA3, Z1
    //  50   51   52   53
    //missed part
        ];
    
  var Indices [
                0, 1, 2,  //VA VA2 VA0, checked 12/5
                0, 2, 3, //VA VA0 VA3, checked 12/5                              // Front face
                4, 5, 6, //Z1 VA2 Z4, checked 12/5
                4, 6, 7, //Z1 Z4 Z5, checked 12/5
                4, 7, 15,  //Z1 Z5 F, added 12/5
                9, 10,11, //Z4 B C, checked 12/5
                9, 11,14, //Z4 C Z5, checked 12/5
                11,12,14, //C D Z5, checked 12/5
                12,13,14, //D E Z5, checked 12/5     //left wing
                //Y5 Y4 G, checked 12/5//right
                //27,28,29, //I J K not passed check redo label
                //27,29,30, //I K L
                // 27,30,32, //I L Z3
                //30,31,32, //L Z2 Z3 checked   




                29,30,31, //K L Z2  redo begin
                32,31,29, //Z3 Z2 K, redo, 12/5
                28,29,32, //J K Z3, redo, 12/5
                27,28,32, //I J Z3 redo 12/5  


                15,16,18, //F Z1 G, checked 12/5
                16,17,18, //Z1 H G, checked 12/5                               //back
                19,20,22, //Y1 Y2 G, checked 12/5
                20,21,22, //Y2 Y3 G, checked 12/5  //left back part
                23,24,26, //Y6, Y5, G, checked 12/5
                24,25,26, 


                       //right wing
                33,34,37,  //H Z1 Z3 changed  12/5
                34,36,37,  //Z1 Z2 Z3 checked 12/5  
                34,35,36,  //Z1 Z2 VA3 checked 12/5                      //right armor
                38,39,40,      
                38,40,41,    
                38,41,42,   
                38,42,43,   
                38,43,44,   
                38,44,45,      
                38,45,46,    
                38,46,47,   
                38,47,48,   
                38,48,49,
                50,51,53,
                52,51,53
] //missed part

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    positionBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW ); //***CHANGE INDICES TO VERTICES

    VertexIndexBuffer = gl.createBuffer(); //NEW
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VertexIndexBuffer);//NEW
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, flatten(Indices), gl.STATIC_DRAW);//NEW


    ATTRIBUTE_position = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( ATTRIBUTE_position );

    gl.bindBuffer( gl.ARRAY_BUFFER, positionBuffer );
    gl.vertexAttribPointer( ATTRIBUTE_position, 0, gl.FLOAT, false, 0, 0 );
    
    
    var pMatrixLoc = gl.getUniformLocation( program, "pMatrix" );
    var mvMatrixLoc = gl.getUniformLocation( program, "mvMatrix" );
    var pMatrix = perspective( 120, canvas.width/canvas.height, .0001, 100);
    //var pMatrix = mat4();
    var mvMatrix = mat4();
    mvMatrix = mult(mvMatrix, translate(vec3(0,0,-.7)));
    mvMatrix = mult(mvMatrix, rotate(90,[1,0,0]));
    gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(mvMatrix));
    gl.uniformMatrix4fv(pMatrixLoc, false, flatten(pMatrix));


    render();

}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, VertexIndexBuffer);//new
    gl.drawElements(gl.TRIANGLES, 34, gl.UNSIGNED_SHORT, 0);
    
    //gl.drawArrays( gl.TRIANGLES, 0, 102 );
    
}

                 //bottom   