// -------------- Initial Setup --------------
// Scene
var scene = new THREE.Scene();
var target = [];

// Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -1;
camera.position.z = 4;
camera.position.y = 10;

// Render
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// -------------- Lights --------------
// Ambient light
var lightAmbient = new THREE.AmbientLight(0x888888);
scene.add(lightAmbient);

// Point light
var lightThis = new THREE.PointLight(0xffffff);
lightThis.position.set(3, 10, 3);
lightThis.intensity = 0.8;
scene.add(lightThis);

// -------------- Objects --------------

// set up the target vars

// create the sphere's material
var sphereMaterial = new THREE.MeshLambertMaterial(
    {
        color: 0x00AACC
    });

var sphereMaterial2 = new THREE.MeshLambertMaterial(
    {
        color: 0xFF0000		//red
    });

var sphereMaterial3 = new THREE.MeshLambertMaterial(
    {
        color: 0x00FF00		//green
    });

var sphereMaterial4 = new THREE.MeshLambertMaterial(
    {
        color: 0x00FFff	//green
    });


// set up the sphere vars
var radius = 1, segments = 16, rings = 16;

// create a new mesh with sphere geometry -
var sphere = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, rings),
    sphereMaterial);

var sphere2 = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, rings),
    sphereMaterial2);

var sphere3 = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, rings),
    sphereMaterial3);

var testBall = new THREE.Mesh(
    new THREE.SphereGeometry(radius, segments, rings),
    sphereMaterial4);



sphere.position.set(0,5,0);
sphere2.position.set(5,5,0);
sphere3.position.set(10,5,0);
testBall.position.set(0,5,5);

// add the sphere to the scene
scene.add(sphere);
scene.add(sphere2);
scene.add(sphere3);
scene.add(testBall);

// Creates a floor and 4 walls around it
function createRoom(roomSize, wallPosition) {
    // Floor Mesh
    var floorLoader = new THREE.TextureLoader();
    floorLoader.load(
        // resource URL
        'Media/wall.jpg',
        function (floorTexture) {
            var floorMat = new THREE.MeshPhongMaterial({map: floorTexture});
            var floorGeom = new THREE.PlaneGeometry(roomSize, roomSize, 50, 50, 20, 20, 20),
                meshFloor = new THREE.Mesh(floorGeom, floorMat);

            meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
            scene.add(meshFloor);
        });
    // Wall Meshes
    var wallLoader = new THREE.TextureLoader();
    wallLoader.load(
        // resource URL
        'Media/wall.jpg',
        function (wallTexture) {
            var wallMat = new THREE.MeshPhongMaterial({map: wallTexture});
            var wallGeom = new THREE.BoxGeometry(roomSize, 5, 1,),
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
            scene.add(wallMesh1, wallMesh2, wallMesh3, wallMesh4);
        });

}

// --------------------------------------------------------------------------------

createRoom(50, 25)

// -------------- Extra Controls and Functions --------------
// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

var score =0;
var iFrame = 0;
// -------------- Animate Function --------------
function animate() {

// -------------- Collision --------------

    /*
    var ballFloorCollision = target.position.y < 0.05;
*/

    requestAnimationFrame(animate);
    testBall.position.z -= 0.007;

    var distance = Math.sqrt((sphere.position.x - testBall.position.x) * (sphere.position.x - testBall.position.x) + // Working out square root
        (sphere.position.y - testBall.position.y) * (sphere.position.y - testBall.position.y) +
        (sphere.position.z - testBall.position.z) * (sphere.position.z - testBall.position.z)
    );
     var sumOfRadious = 1 + 1; // Radious of both balls added together

     var collision = distance < sumOfRadious; // true if condidion is met

     if (collision ) {
         window.location.href = "targetTest.html";
     }
    iFrame++;

    renderer.render(scene, camera);
}

animate();



