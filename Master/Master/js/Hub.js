function collision(meshA, meshB)
{
    var meshApos = meshA.getWorldPosition(new THREE.Vector3());
    var meshBpos = meshB.getWorldPosition(new THREE.Vector3());

    var distance = Math.sqrt(Math.pow(meshApos.x - meshBpos.x, 2)
        + Math.pow(meshApos.y - meshBpos.y, 2)
        + Math.pow(meshApos.z - meshBpos.z, 2));
    var sumRadius = meshA.geometry.parameters.radius + meshB.geometry.parameters.radius;

    if (distance < sumRadius)
    {
        return true;
    }
    else
    {
        return false;
    }
}
// -------------- Initial Setup --------------
// Scene
var scene = new THREE.Scene();
fogColor = new THREE.Color(0x000000);

scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 20, 40);

var tree =[];
var target = [];
// Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -2;
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


// -------------- Models --------------

// Floor with texture
var floorLoader = new THREE.TextureLoader();
floorLoader.load(
    // resource URL
    'Media/floor.jpg',
    function (floorTexture) {
        var floorMat = new THREE.MeshPhongMaterial({map: floorTexture});
        var floorGeom = new THREE.PlaneGeometry(100, 100, 0, 0, 0, 0, 0),
            meshFloor = new THREE.Mesh(floorGeom, floorMat);

        meshFloor.rotation.x -= Math.PI / 2; // Rotate the floor 90 degrees
        scene.add(meshFloor);
    });

// Tree Function
function spawnTrees()
{
    var treeGeom = new THREE.CylinderGeometry( 0.8, 0.6, 40, 32 );
    //Loader For textures
    var treeLoader = new THREE.TextureLoader();
    treeLoader.setCrossOrigin("anonymous");
    treeLoader.load
    (
        // resource URL
        'Media/tree.jpg',
        function (treeTexture) {

            // Loop and make array of trees
            var treeMat = new THREE.MeshPhongMaterial({map: treeTexture});
            for (var i = 0; i <= 30; i++)
            {
                tree[i] = new THREE.Mesh( treeGeom, treeMat );
                scene.add( tree[i] );
            }

            // Loops to place tree randomly
            //Left side Trees
            for (var j=0; j <= 15; j++ ){

                tree[j].position.z = 15 + Math.random() * 15-1 ;
                tree[j].position.x = Math.random() * 25 - 1;
            }
            //Right side Trees
            for (var l=16; l <= 30; l++ ){

                tree[l].position.z =  15 + Math.random() * 15-1;
                tree[l].position.x = Math.random() * -25 - 1;
            }

        }
    );

}

// Create Spheres for Game Selection
// create the sphere's material
var sphereMaterial = new THREE.MeshLambertMaterial(
    {
        color: 0x00AACC //blue
    });

var sphereMaterial2 = new THREE.MeshLambertMaterial(
    {
        color: 0xFF0000		//red
    });

var sphereMaterial3 = new THREE.MeshLambertMaterial(
    {
        color: 0x00FF00		//green
    });


// set up the sphere vars
var radius = 0.3, segments = 16, rings = 16;

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

sphere.position.set(1,0.7,2);
sphere2.position.set(0,0.7,1);
sphere3.position.set(-1,0.7,2);

// add the sphere to the scene
scene.add(sphere);
scene.add(sphere2);
scene.add(sphere3);
spawnTrees();

// Create Table models for the scene
function makeTable(zPos,xPos,yPos,rotation){
    //Material
    var tabeleMat= new THREE.MeshBasicMaterial( {color: 0x8B4513} );

    //Main Part of Table
    var tabelGeom = new THREE.BoxGeometry( 1, 0.1, 0.5 );
    var tableTop = new THREE.Mesh( tabelGeom, tabeleMat );
    tableTop.position.y = 2;

    // Legs Of Table
    var tableLegGeom = new THREE.CylinderGeometry( 0.1, 0.1, 0.5, 20 );

    var tableLeg = new THREE.Mesh(tableLegGeom, tabeleMat);
    tableLeg.position.y = 1.8;

    //Merge Shapes
    var table = new THREE.Geometry();
    tableTop.updateMatrix(); // as needed
    table.merge(tableTop.geometry, tableTop.matrix);

    tableLeg.updateMatrix(); // as needed
    table.merge(tableLeg.geometry, tableLeg.matrix);

    // Adds gun model to the scene
     var tableMesh= new THREE.Mesh(table, tabeleMat);
    scene.add(tableMesh);
    tableMesh.position.z =zPos;
    tableMesh.position.x =xPos;
    tableMesh.position.y =yPos;
    tableMesh.rotation.y -=rotation;


}
makeTable(2,1,-1.5,Math.PI / 2);
makeTable(1,0,-1.5,0);
makeTable(2,-1,-1.5,Math.PI / 2);

// Create House Model for scene
function makeHouse(){
    //Material
    var houseMat= new THREE.MeshBasicMaterial( {color: 0x8B4513} );
    var roofMat= new THREE.MeshBasicMaterial( {color: 0x59332A} );
    var doorMat= new THREE.MeshBasicMaterial( {color: 0x704B48} );
    var winMat= new THREE.MeshBasicMaterial( {color: 0xABE9E9} );

    //Main Part of House
    var houseGeom = new THREE.BoxGeometry( 3, 3, 5 );
    var houseMesh = new THREE.Mesh( houseGeom, houseMat );
    scene.add(houseMesh);
    houseMesh.position.z = 5;
    houseMesh.position.x =5;
    houseMesh.position.y =1.5;

    // Roof of house
    var roofGeom = new THREE.BoxGeometry( 2.5, 2.5, 4.9 );
    var roofMesh = new THREE.Mesh( roofGeom, roofMat );
    scene.add(roofMesh);
    roofMesh.rotation.z = 95;
    roofMesh.position.z = 5;
    roofMesh.position.x =5;
    roofMesh.position.y =3;

    // Chimney
    var chimGeom = new THREE.BoxGeometry( 0.5, 0.5, 2);
    var chimMesh = new THREE.Mesh( chimGeom, roofMat );
    scene.add(chimMesh);
    chimMesh.rotation.x -= Math.PI / 2;
    chimMesh.position.z = 3;
    chimMesh.position.x =4;
    chimMesh.position.y =4;

    //Door
    var doorGeom = new THREE.BoxGeometry( 1.8, 0.1, 0.8 );
    var doorMesh = new THREE.Mesh( doorGeom, doorMat );
    scene.add(doorMesh);
    doorMesh.rotation.z -= Math.PI / 2;
    doorMesh.position.z = 5;
    doorMesh.position.x =3.4;
    doorMesh.position.y =1;

    //Window
    var winGeom = new THREE.BoxGeometry( 0.8, 0.1, 0.8 );
    var winMesh = new THREE.Mesh( winGeom, winMat );
    scene.add(winMesh);
    winMesh.rotation.z -= Math.PI / 2;
    winMesh.position.z = 3.5;
    winMesh.position.x =3.4;
    winMesh.position.y =1.7;
}
makeHouse();

// Rain Effect
// An array of particles
var geoArray = [];
var matArray = [];
var meshArray = [];
var iNumber = 400;

var posInititalArray = [];

// Create the particles for the rain in the scene
for (var i=0; i<iNumber; i++)
{
    geoArray.push(new THREE.SphereGeometry(0.1, 0.1, 5));
    matArray.push(new THREE.MeshPhongMaterial( {color: 0x2A5759, transparent: true, opacity: 0.5} ));
    meshArray.push(new THREE.Mesh(geoArray[i], matArray) );

    // Rain
    meshArray[i].position.y = 10 + Math.random()*10;
    meshArray[i].position.x = Math.random()*40 - 5;
    meshArray[i].position.z = Math.random()*40 - 5;


    // Backup initial position
    posInititalArray.push(new THREE.Vector3() );
    posInititalArray[i].x = meshArray[i].position.x;
    posInititalArray[i].y = meshArray[i].position.y;
    posInititalArray[i].z = meshArray[i].position.z;

    scene.add(meshArray[i]);
}

// Create the skeleton
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

var iFrame = 0;

// -------------- Animate Function --------------
function animate() {

    // Move the Particle array to create rain effect
    for (var i=0; i<iNumber; i++)
    {
        meshArray[i].position.y = meshArray[i].position.y - 0.2;
        if (meshArray[i].position.y < 0)
        {
            meshArray[i].position.y = 10;
        }
    }
    //Call Collision function to check what game the user has selected
    if (collision(sphere,leftHand_msh)|| collision(sphere,rightHand_msh)  ) {

        window.location.href = "knifeGame.html";
    }
    if (collision(sphere2,leftHand_msh)|| collision(sphere2,rightHand_msh) ) {

        window.location.href = "bowGame.html";
    }
    if (collision(sphere3,leftHand_msh)|| collision(sphere3,rightHand_msh) ) {

        window.location.href = "explosiveGame.html";
    }

    requestAnimationFrame(animate);

    iFrame++;

    renderer.render(scene, camera);
}

animate();

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Kinectron codes starting from here///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize kinectron
kinectron = new Kinectron("192.168.60.56"); // Define and create an instance of kinectron
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
