// -------------- Initial Setup --------------
// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = 10;
camera.position.z = 4;
camera.position.y = 6;

// Render
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// -------------- Lights --------------
// Ambient light
var lightAmbient = new THREE.AmbientLight( 0x888888 );
scene.add(lightAmbient);

// Point light
var lightThis = new THREE.PointLight(0xffffff);
lightThis.position.set(3, 10, 3);
lightThis.intensity = 0.8;
scene.add(lightThis);


// -------------- Objects --------------
// Ball 1
var gBall1= new THREE.SphereGeometry(0.1, 5, 5);
var mBall1 = new THREE.MeshPhongMaterial( { color: 0x669900 } );
var meshBall1 = new THREE.Mesh(gBall1, mBall1);
meshBall1.position.y = 2.2;

meshBall1.position.x = 2.2;
scene.add(meshBall1);

// Ball 2
var gBall2= new THREE.SphereGeometry(0.3, 18, 18);
var mBall2 = new THREE.MeshPhongMaterial( { color: 0x66FF00 } );
var meshBall2 = new THREE.Mesh(gBall2, mBall2);
meshBall2.position.y = 2.2;
scene.add(meshBall2);


// Ball 3
var gBall3= new THREE.SphereGeometry(0.3, 18, 18);
var mBall3 = new THREE.MeshPhongMaterial( { color: 0x66FF00 } );
var meshBall3 = new THREE.Mesh(gBall3, mBall3);
meshBall3.position.y = 2.2;

meshBall3.position.x = 1;
scene.add(meshBall3);



// -------------- Extra Controls and Functions --------------
// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);// Creates a floor and 4 walls around it
function createRoom(roomSize,wallPosition){
    // Floor Mesh
    var floorLoader = new THREE.TextureLoader();
    floorLoader.load(
        // resource URL
        'Media/wall.jpg',
        function ( floorTexture ) {
            var floorMat = new THREE.MeshPhongMaterial({map: floorTexture});
            var floorGeom =  new THREE.PlaneGeometry(roomSize, roomSize, 50, 50, 20,20,20),
                meshFloor = new THREE.Mesh(floorGeom, floorMat);

            meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
            scene.add(meshFloor);
        });
    // Wall Meshes
    var wallLoader = new THREE.TextureLoader();
    wallLoader.load(
        // resource URL
        'Media/wall.jpg',
        function ( wallTexture ) {
            var wallMat = new THREE.MeshPhongMaterial({map: wallTexture});
            var wallGeom =  new THREE.BoxGeometry(roomSize, 5, 1,),
                wallMesh1 = new THREE.Mesh(wallGeom, wallMat),
                wallMesh2 = new THREE.Mesh(wallGeom, wallMat),
                wallMesh3 = new THREE.Mesh(wallGeom, wallMat),
                wallMesh4 = new THREE.Mesh(wallGeom, wallMat);
            wallMesh1.position.y = 0;
            wallMesh2.position.y = 0;
            wallMesh3.position.y = 0;
            wallMesh4.position.y = 0;
            // Positioning for walls
            wallMesh1.position.z = wallPosition;
            wallMesh2.position.z = -wallPosition;

            wallMesh3.rotation.y -= Math.PI / 2;
            wallMesh4.rotation.y -= Math.PI / 2;

            wallMesh3.position.x = wallPosition;
            wallMesh4.position.x = -wallPosition;
            scene.add(wallMesh1,wallMesh2,wallMesh3,wallMesh4);
        });

}
// --------------------------------------------------------------------------------

createRoom(10,5)

controls.update();


var startX = -10;
var endX = 30;
var startY = 0;
var endY = 0;
function interpolateCurve(u) {
    if (u > 1)	u = 1;
    if (u < 0)	u = 0;

    x = u * (endX - startX) + startX;
    y = (Math.cos(u* 10)*5) + startY;
    return [x, y];
}


// get G
var G = [];
G[0] = 0;
for (var i=1;i<=20;i++) {
    pos1 = interpolateCurve((i-1)*0.05);
    pos2 = interpolateCurve(i*0.05);

    // distance between the current point and the previous point
    distance = Math.sqrt(Math.pow(pos1[0]-pos2[0],2) + Math.pow(pos1[1]-pos2[1],2));
    G[i] = distance + G[i-1];

    console.log(G[i]);
}
// normalize arc length
for (var i=1;i<=20;i++) {
    G[i] /= G[20];

    console.log(G[i]);
}

function getUbyArcLen(arcLen) {
    for (var i=0;i<=20;i++) {
        if (G[i] > arcLen) {
            return (i-1)*1/20 + (arcLen - G[i-1]) / (G[i] - G[i-1])*1/20;
        }
    }

    return 1;
}

function ease(t) {
    if (t > 1)	t = 1;
    if (t < 0)	t = 0;

    return (Math.sin(t*Math.PI-Math.PI/2) + 1)/2;
}



// The animate function: called every frame
var iFrame = 0;
function animate()
{
    requestAnimationFrame(animate);
    //Target Movement
    var steps = 100;
    var u = iFrame/steps;
    if (u <= 1) {
        requestAnimationFrame(animate);
    }

    pos = interpolateCurve(u);
    meshBall2.position.x = pos[0];
    meshBall2.position.y = pos[1];


    // Move ball bits by bits
    meshBall1.position.x -= 0.007;

    var distance = Math.sqrt(
        (meshBall1.position.x -  meshBall2.position.x) * (meshBall1.position.x -  meshBall2.position.x) + // Working out square root
        (meshBall1.position.y -  meshBall2.position.y) * (meshBall1.position.y -  meshBall2.position.y) +
        (meshBall1.position.z -  meshBall2.position.z) * (meshBall1.position.z -  meshBall2.position.z)
    );

    var distance2 = Math.sqrt(
        (meshBall1.position.x -  meshBall3.position.x) * (meshBall1.position.x -  meshBall3.position.x) + // Working out square root
        (meshBall1.position.y -  meshBall3.position.y) * (meshBall1.position.y -  meshBall3.position.y) +
        (meshBall1.position.z -  meshBall3.position.z) * (meshBall1.position.z -  meshBall3.position.z)
    );

    var sumOfRadious = 0.1 + 0.3; // Radious of both balls added together


    var collision = distance < sumOfRadious; // true if condidion is met

    var collision2 = distance2 < sumOfRadious; // true if condidion is met

    // floor collision
    var ballFloorCollision = meshBall1.position.y < 0.05; // Floor is at 0.05( normally would be 0.00 however is on an anagle ),

    if (collision) {
        meshBall1.material.color.setHex(0xFF0000);
        // window.location.href = "http://www.w3schools.com";

    }
    else
    {
        meshBall1.material.color.setHex(0x3642AF);
    }

    if (collision2) {
        meshBall1.material.color.setHex(0xECFF00);
        // window.location.href = "http://www.w3schools.com";

    }




    iFrame ++;
    renderer.render(scene, camera);
}
animate();
/*
document.addEventListener("click", addCube, false);


function addCube(){
    var geometry = new THREE.CubeGeometry( 200, 200, 200 );

    var material = new THREE.MeshBasicMaterial( { color: 0x000000 } );

    var mesh = new THREE.Mesh( geometry, material );

    //scene is global
    scene.add(mesh);
}
*/

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Kinectron codes starting from here///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize kinectron
kinectron = new Kinectron("192.168.60.25"); // Define and create an instance of kinectron
kinectron.makeConnection(); // Create connection between remote and application
kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback

// Add a ball for the left hand
var gLH= new THREE.SphereGeometry(0.1, 18, 18);
var mLH = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } );
var meshLH = new THREE.Mesh(gLH, mLH);
scene.add(meshLH);

// Add a ball for the right hand
var gRH= new THREE.SphereGeometry(0.1, 18, 18);
var mRH = new THREE.MeshPhongMaterial( { color: 0x00CCCC } );
var meshRH = new THREE.Mesh(gRH, mRH);
scene.add(meshRH);

// Draw a line with 4 points
var mLine = new THREE.LineBasicMaterial({color: 0xff9999});
var gLine = new THREE.Geometry();
gLine.vertices.push(new THREE.Vector3(0,0,0));
gLine.vertices.push(new THREE.Vector3(0,1,0));
gLine.vertices.push(new THREE.Vector3(0,1,1));
gLine.vertices.push(new THREE.Vector3(0,2,2));
var meshLine = new THREE.Line(gLine, mLine);
scene.add(meshLine);

// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton)
{
    meshLH.position.x = skeleton.joints[kinectron.HANDLEFT].cameraX;
    meshLH.position.y = skeleton.joints[kinectron.HANDLEFT].cameraY;
    meshLH.position.z = skeleton.joints[kinectron.HANDLEFT].cameraZ;

    meshRH.position.x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
    meshRH.position.y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
    meshRH.position.z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;


    meshLine.geometry.vertices[3].x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
    meshLine.geometry.vertices[3].y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
    meshLine.geometry.vertices[3].z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;

    meshLine.geometry.vertices[0].x = skeleton.joints[kinectron.HANDLEFT].cameraX;
    meshLine.geometry.vertices[0].y = skeleton.joints[kinectron.HANDLEFT].cameraY;
    meshLine.geometry.vertices[0].z = skeleton.joints[kinectron.HANDLEFT].cameraZ;





    meshLine.geometry.verticesNeedUpdate = true;
}