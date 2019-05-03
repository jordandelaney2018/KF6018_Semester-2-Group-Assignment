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
var radius = 0.2, segments = 10, rings = 10;
var radiusTop =1 , radiusBottom = 1, height = 1, radialSegments =7;


function spawnTarget(){
    var geometry = new THREE.CylinderGeometry( radiusTop, radiusBottom, height, radialSegments );
    var targetLoader = new THREE.TextureLoader();
    targetLoader.load(
        // resource URL
        'Media/target.jpg',
        function ( targetTexture ) {
            var targetMat = new THREE.MeshBasicMaterial({map: targetTexture});
            for (var i = 0; i <= 2; i++) {
                target[i] = new THREE.Mesh(geometry, targetMat);
                target[i].rotation.x -= Math.PI / 2;
                scene.add(target[i]);
            }


        })
}
// add the targets to the scene
spawnTarget();
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


// -------------- Movement --------------
var startX = 45;
var endX = -30;
var startY = 5;

function interpolateCurve(u) {
    if (u > 1) u = 1;
    if (u < 0) u = 0;

    x = u * (endX - startX) + startX;
    y = (Math.cos(u * 15) * 5) + startY;
    return [x, y];
}

var startXTwo = -30;
var endXTwo = 50;
var startYTwo = 5;

function interpolateCurveTwo(j) {
    if (j > 1) j = 1;
    if (j < 0) j = 0;

    x = j * (endXTwo - startXTwo) + startXTwo;
    y = (Math.cos(j * 10) * 5) + startYTwo;
    return [x, y];
}

var startXThree = -25;
var endXThree = 50;
var startYThree = 5;

function interpolateCurveThree(i) {
    if (i > 1) i = 1;
    if (i < 0) i = 0;

    x = i * (endXThree - startXThree) + startXThree;
    y = (Math.cos(i * 30) * 5) + startYThree;
    return [x, y];
}


// get G
var G = [];
G[0] = 0;
for (var i = 1; i <= 20; i++) {
    pos1 = interpolateCurve((i - 1) * 0.05);
    pos2 = interpolateCurve(i * 0.05);

    // distance between the current point and the previous point
    distance = Math.sqrt(Math.pow(pos1[0] - pos2[0], 2) + Math.pow(pos1[1] - pos2[1], 2));
    G[i] = distance + G[i - 1];

    console.log(G[i]);
}
// normalize arc length
for (var i = 1; i <= 20; i++) {
    G[i] /= G[20];

    console.log(G[i]);
}

function getUbyArcLen(arcLen) {
    for (var i = 0; i <= 20; i++) {
        if (G[i] > arcLen) {
            return (i - 1) * 1 / 20 + (arcLen - G[i - 1]) / (G[i] - G[i - 1]) * 1 / 20;
        }
    }

    return 1;
}

function ease(t) {
    if (t > 1) t = 1;
    if (t < 0) t = 0;

    return (Math.sin(t * Math.PI - Math.PI / 2) + 1) / 2;
}

var score = 0;
var iFrame = 0;
/*
// drawing the curve using te interpolateCurve() function
var lineMaterial = new THREE.LineBasicMaterial({
    color: 0xFFFFFF
});
var geom = new THREE.Geometry();
for (var k=0;k<50;k++) {
    pos = interpolateCurve(k/50);
    geom.vertices.push(new THREE.Vector3(pos[0],pos[1],0));
}
var curve = new THREE.Line(geom, lineMaterial);
scene.add(curve);
*/
// -------------- Extra Controls and Functions --------------
// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();


// -------------- Animate Function --------------
function animate() {
// -------------- Collision --------------

    /*
    var ballFloorCollision = target.position.y < 0.05;
*/
    // -------------- Movement --------------
    var steps = 1500;
    var u = iFrame / steps;
    if (u <= 1) {
        console.log(u);
    } else if (u >= 1) {
        u = 0;
        iFrame = 0;

    }
    requestAnimationFrame(animate);

    pos = interpolateCurve(u);
    target[0].position.x = pos[0];
    target[0].position.y = pos[1];

    pos = interpolateCurveTwo(getUbyArcLen(u));
    target[1].position.x = pos[0];
    target[1].position.y = pos[1];

    pos = interpolateCurveThree(u);
    target[2].position.x = pos[0];
    target[2].position.y = pos[1];

    /*
    function testingScore() {

        if (target[2] !== undefined) {
            var distance = Math.sqrt((target[2].position.x - testball.position.x) * (target[2].position.x - testball.position.x) + // Working out square root
                (target[2].position.y - testball.position.y) * (target[2].position.y - testball.position.y) +
                (target[2].position.z - testball.position.z) * (target[2].position.z - testball.position.z)
            );
                    var sumOfRadious = 0.2 + 1; // Radious of both balls added together

                    var collision = distance < sumOfRadious; // true if condidion is met

         }



            if (collision && target[2] !== undefined) {
                score++;

               // console.log("This worked")
              document.getElementById("test").innerHTML = "Your Score is" + score;

            }

    }

     window.onload=testingScore();

    if(score >= 200){
        document.getElementById("test").innerHTML = "You Win";
    }
    */


    iFrame++;

    renderer.render(scene, camera);
}

animate();



