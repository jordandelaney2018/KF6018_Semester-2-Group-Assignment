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
var radius = 0.2, segments = 16, rings = 16;

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



sphere.position.set(0.4,0,0.2);
sphere2.position.set(0,0,0.2);
sphere3.position.set(-0.4,0,0.2);


// add the sphere to the scene
scene.add(sphere);
scene.add(sphere2);
scene.add(sphere3);


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

createRoom(50, 25)
//Node spheres
//Hands
var node_geo = new THREE.SphereGeometry(0.1, 18, 18);
var node_mat = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 

//Left Hand
var leftHand_msh = new THREE.Mesh(node_geo, node_mat);
scene.add(leftHand_msh);

//Right Hand
var rightHand_msh = new THREE.Mesh(node_geo, node_mat);
scene.add(rightHand_msh);

//Head
var head_geo = new THREE.SphereGeometry(0.1, 18, 18);
var head_mat = new THREE.MeshPhongMaterial( { color: 0xffff00 } ); 
var head_msh = new THREE.Mesh(node_geo, node_mat);
scene.add(head_msh);

//Pelvis
var pelvis_geo = new THREE.SphereGeometry(0.1, 18,18);
var pelvis_mat = new THREE.MeshPhongMaterial( { color: 0xffff00 } ); 
var pelvis_msh = new THREE.Mesh(pelvis_geo, pelvis_mat);
scene.add(pelvis_msh);

//Eyes
var eye_geo = new THREE.SphereGeometry(0.025, 18, 18);
var eye_mat = new THREE.MeshPhongMaterial( { color: 0x000000 } ); 

//Left Eye
var eyeL_msh = new THREE.Mesh(eye_geo, eye_mat);
head_msh.add(eyeL_msh);
eyeL_msh.position.x -= 0.05;
eyeL_msh.position.z -= 0.075;
eyeL_msh.position.y += 0.025;

//Right Eye
var eyeR_msh = new THREE.Mesh(eye_geo, eye_mat);
head_msh.add(eyeR_msh);
eyeR_msh.position.x += 0.05;
eyeR_msh.position.y += 0.025;
eyeR_msh.position.z -= 0.075;

//Skeleton lines
var skeleton_mat = new THREE.LineBasicMaterial({color: 0xff9999});
var LeftArm_geo = new THREE.Geometry();
LeftArm_geo.vertices.push(new THREE.Vector3(0,0,0));
LeftArm_geo.vertices.push(new THREE.Vector3(0,1,0));
LeftArm_geo.vertices.push(new THREE.Vector3(0,1,1));
LeftArm_geo.vertices.push(new THREE.Vector3(0,2,2));
var LeftArm = new THREE.Line(LeftArm_geo, skeleton_mat);
scene.add(LeftArm);

var RightArm_geo = new THREE.Geometry();
RightArm_geo.vertices.push(new THREE.Vector3(0,0,0));
RightArm_geo.vertices.push(new THREE.Vector3(0,1,0));
RightArm_geo.vertices.push(new THREE.Vector3(0,1,1));
RightArm_geo.vertices.push(new THREE.Vector3(0,2,2));
var RightArm = new THREE.Line(RightArm_geo, skeleton_mat);
scene.add(RightArm);

var Spine_geo = new THREE.Geometry();
Spine_geo.vertices.push(new THREE.Vector3(0,0,0));
Spine_geo.vertices.push(new THREE.Vector3(0,1,0));
Spine_geo.vertices.push(new THREE.Vector3(0,1,1));
Spine_geo.vertices.push(new THREE.Vector3(0,2,2));
var Spine = new THREE.Line(Spine_geo, skeleton_mat);
scene.add(Spine);


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
   // testBall.position.z -= 0.007;

    var distance = Math.sqrt((sphere.position.x - leftHand_msh.position.x) * (sphere.position.x - leftHand_msh.position.x) + // Working out square root
        (sphere.position.y - leftHand_msh.position.y) * (sphere.position.y - leftHand_msh.position.y) +
        (sphere.position.z - leftHand_msh.position.z) * (sphere.position.z - leftHand_msh.position.z)
    );
     var sumOfRadious = 0.2 + 0.1; // Radious of both balls added together

      var distance2 = Math.sqrt((sphere2.position.x - leftHand_msh.position.x) * (sphere2.position.x - leftHand_msh.position.x) + // Working out square root
        (sphere2.position.y - leftHand_msh.position.y) * (sphere2.position.y - leftHand_msh.position.y) +
        (sphere2.position.z - leftHand_msh.position.z) * (sphere2.position.z - leftHand_msh.position.z)
    );
     var sumOfRadious2 = 0.2 + 0.1; // Radious of both balls added together

     var distance3 = Math.sqrt((sphere3.position.x - leftHand_msh.position.x) * (sphere3.position.x - leftHand_msh.position.x) + // Working out square root
        (sphere3.position.y - leftHand_msh.position.y) * (sphere3.position.y - leftHand_msh.position.y) +
        (sphere3.position.z - leftHand_msh.position.z) * (sphere3.position.z - leftHand_msh.position.z)
    );
     var sumOfRadious3 = 0.2 + 0.1; // Radious of both balls added together

    

     var collision = distance < sumOfRadious; // true if condidion is met

     var collision2 = distance2 < sumOfRadious2; // true if condidion is met

     var collision3 = distance3 < sumOfRadious3; // true if condidion is met

     if (collision ) {
      //   window.location.href = "targetTest.html";
      alert("Game one");
     }
     if (collision2 ) {
      //   window.location.href = "targetTest.html";
      alert("Game Two");
     }
     if (collision3 ) {
      //   window.location.href = "targetTest.html";
      alert("Game Three");
     }
    iFrame++;

    renderer.render(scene, camera);
}

animate();

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Kinectron codes starting from here///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize kinectron
kinectron = new Kinectron("192.168.60.26"); // Define and create an instance of kinectron
kinectron.makeConnection(); // Create connection between remote and application
kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback


// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton) 
{ 
leftHand_msh.position.x = skeleton.joints[kinectron.HANDLEFT].cameraX;
leftHand_msh.position.y = skeleton.joints[kinectron.HANDLEFT].cameraY;
leftHand_msh.position.z = skeleton.joints[kinectron.HANDLEFT].cameraZ;
rightHand_msh.position.x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
rightHand_msh.position.y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
rightHand_msh.position.z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;

head_msh.position.x = skeleton.joints[kinectron.HEAD].cameraX;
head_msh.position.y = skeleton.joints[kinectron.HEAD].cameraY;
head_msh.position.z = skeleton.joints[kinectron.HEAD].cameraZ;

//Left arm
LeftArm.geometry.vertices[0].x = skeleton.joints[kinectron.SPINESHOULDER].cameraX;
LeftArm.geometry.vertices[0].y = skeleton.joints[kinectron.SPINESHOULDER].cameraY;
LeftArm.geometry.vertices[0].z = skeleton.joints[kinectron.SPINESHOULDER].cameraZ;

LeftArm.geometry.vertices[1].x = skeleton.joints[kinectron.SHOULDERLEFT].cameraX;
LeftArm.geometry.vertices[1].y = skeleton.joints[kinectron.SHOULDERLEFT].cameraY;
LeftArm.geometry.vertices[1].z = skeleton.joints[kinectron.SHOULDERLEFT].cameraZ;

LeftArm.geometry.vertices[2].x = skeleton.joints[kinectron.ELBOWLEFT].cameraX;
LeftArm.geometry.vertices[2].y = skeleton.joints[kinectron.ELBOWLEFT].cameraY;
LeftArm.geometry.vertices[2].z = skeleton.joints[kinectron.ELBOWLEFT].cameraZ; 

LeftArm.geometry.vertices[3].x = skeleton.joints[kinectron.HANDLEFT].cameraX;
LeftArm.geometry.vertices[3].y = skeleton.joints[kinectron.HANDLEFT].cameraY;
LeftArm.geometry.vertices[3].z = skeleton.joints[kinectron.HANDLEFT].cameraZ; 
LeftArm.geometry.verticesNeedUpdate = true;

//Right arm
RightArm.geometry.vertices[0].x = skeleton.joints[kinectron.SPINESHOULDER].cameraX;
RightArm.geometry.vertices[0].y = skeleton.joints[kinectron.SPINESHOULDER].cameraY;
RightArm.geometry.vertices[0].z = skeleton.joints[kinectron.SPINESHOULDER].cameraZ; 
//Add mesh to shoulder
rightShoulder_msh.position.x = skeleton.joints[kinectron.SPINESHOULDER].cameraX;
rightShoulder_msh.position.y = skeleton.joints[kinectron.SPINESHOULDER].cameraY;
rightShoulder_msh.position.z = skeleton.joints[kinectron.SPINESHOULDER].cameraZ;


RightArm.geometry.vertices[1].x = skeleton.joints[kinectron.SHOULDERRIGHT].cameraX;
RightArm.geometry.vertices[1].y = skeleton.joints[kinectron.SHOULDERRIGHT].cameraY;
RightArm.geometry.vertices[1].z = skeleton.joints[kinectron.SHOULDERRIGHT].cameraZ;

RightArm.geometry.vertices[2].x = skeleton.joints[kinectron.ELBOWRIGHT].cameraX;
RightArm.geometry.vertices[2].y = skeleton.joints[kinectron.ELBOWRIGHT].cameraY;
RightArm.geometry.vertices[2].z = skeleton.joints[kinectron.ELBOWRIGHT].cameraZ;

RightArm.geometry.vertices[3].x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
RightArm.geometry.vertices[3].y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
RightArm.geometry.vertices[3].z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;
RightArm.geometry.verticesNeedUpdate = true;

//Spine 
Spine.geometry.vertices[0].x = skeleton.joints[kinectron.HEAD].cameraX;
Spine.geometry.vertices[0].y = skeleton.joints[kinectron.HEAD].cameraY;
Spine.geometry.vertices[0].z = skeleton.joints[kinectron.HEAD].cameraZ;

Spine.geometry.vertices[1].x = skeleton.joints[kinectron.NECK].cameraX;
Spine.geometry.vertices[1].y = skeleton.joints[kinectron.NECK].cameraY;
Spine.geometry.vertices[1].z = skeleton.joints[kinectron.NECK].cameraZ;

Spine.geometry.vertices[2].x = skeleton.joints[kinectron.SPINEMID].cameraX;
Spine.geometry.vertices[2].y = skeleton.joints[kinectron.SPINEMID].cameraY;
Spine.geometry.vertices[2].z = skeleton.joints[kinectron.SPINEMID].cameraZ;

Spine.geometry.vertices[3].x = skeleton.joints[kinectron.SPINEBASE].cameraX;
Spine.geometry.vertices[3].y = skeleton.joints[kinectron.SPINEBASE].cameraY;
Spine.geometry.vertices[3].z = skeleton.joints[kinectron.SPINEBASE].cameraZ;
Spine.geometry.verticesNeedUpdate = true;

pelvis_msh.position.x = skeleton.joints[kinectron.SPINEBASE].cameraX;
pelvis_msh.position.y = skeleton.joints[kinectron.SPINEBASE].cameraY;
pelvis_msh.position.z = skeleton.joints[kinectron.SPINEBASE].cameraZ;

//Left Leg
LeftLeg.geometry.vertices[0].x = skeleton.joints[kinectron.HIPLEFT].cameraX;
LeftLeg.geometry.vertices[0].y = skeleton.joints[kinectron.HIPLEFT].cameraY;
LeftLeg.geometry.vertices[0].z = skeleton.joints[kinectron.HIPLEFT].cameraZ;

LeftLeg.geometry.vertices[1].x = skeleton.joints[kinectron.KNEELEFT].cameraX;
LeftLeg.geometry.vertices[1].y = skeleton.joints[kinectron.KNEELEFT].cameraY;
LeftLeg.geometry.vertices[1].z = skeleton.joints[kinectron.KNEELEFT].cameraZ;

LeftLeg.geometry.vertices[2].x = skeleton.joints[kinectron.ANKLELEFT].cameraX;
LeftLeg.geometry.vertices[2].y = skeleton.joints[kinectron.ANKLELEFT].cameraY;
LeftLeg.geometry.vertices[2].z = skeleton.joints[kinectron.ANKLELEFT].cameraZ;
LeftLeg.geometry.verticesNeedUpdate = true;

//Right Leg
RightLeg.geometry.vertices[0].x = skeleton.joints[kinectron.HIPRIGHT].cameraX;
RightLeg.geometry.vertices[0].y = skeleton.joints[kinectron.HIPRIGHT].cameraY;
RightLeg.geometry.vertices[0].z = skeleton.joints[kinectron.HIPRIGHT].cameraZ;

RightLeg.geometry.vertices[1].x = skeleton.joints[kinectron.KNEERIGHT].cameraX;
RightLeg.geometry.vertices[1].y = skeleton.joints[kinectron.KNEERIGHT].cameraY;
RightLeg.geometry.vertices[1].z = skeleton.joints[kinectron.KNEERIGHT].cameraZ;

RightLeg.geometry.vertices[2].x = skeleton.joints[kinectron.ANKLERIGHT].cameraX;
RightLeg.geometry.vertices[2].y = skeleton.joints[kinectron.ANKLERIGHT].cameraY;
RightLeg.geometry.vertices[2].z = skeleton.joints[kinectron.ANKLERIGHT].cameraZ;
RightLeg.geometry.verticesNeedUpdate = true;
}