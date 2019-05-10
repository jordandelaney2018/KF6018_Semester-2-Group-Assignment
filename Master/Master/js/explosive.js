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

// -------------- Initial Map Setup --------------
var spawned = false;
// Scene
var scene = new THREE.Scene();
fogColor = new THREE.Color(0x000000);

scene.background = fogColor;
scene.fog = new THREE.Fog(fogColor, 20, 40);

var tree =[];

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


// -------------- Models --------------

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
    houseMesh.position.z = -5;
    houseMesh.position.x =8;
    houseMesh.position.y =1.5;

    // Roof of house
    var roofGeom = new THREE.BoxGeometry( 2.5, 2.5, 4.9 );
    var roofMesh = new THREE.Mesh( roofGeom, roofMat );
    scene.add(roofMesh);
    roofMesh.rotation.z = 95;
    roofMesh.position.z = -5;
    roofMesh.position.x =8;
    roofMesh.position.y =3;

    // Chimney
    var chimGeom = new THREE.BoxGeometry( 0.5, 0.5, 2);
    var chimMesh = new THREE.Mesh( chimGeom, roofMat );
    scene.add(chimMesh);
    chimMesh.rotation.x -= Math.PI / 2;
    chimMesh.position.z = -3;
    chimMesh.position.x =7;
    chimMesh.position.y =4;

    //Door
    var doorGeom = new THREE.BoxGeometry( 1.8, 0.1, 0.8 );
    var doorMesh = new THREE.Mesh( doorGeom, doorMat );
    scene.add(doorMesh);
    doorMesh.rotation.z -= Math.PI / 2;
    doorMesh.position.z = -5;
    doorMesh.position.x =6.4;
    doorMesh.position.y =1;

    //Window
    var winGeom = new THREE.BoxGeometry( 0.8, 0.1, 0.8 );
    var winMesh = new THREE.Mesh( winGeom, winMat );
    scene.add(winMesh);
    winMesh.rotation.z -= Math.PI / 2;
    winMesh.position.z = -3.5;
    winMesh.position.x =6.4;
    winMesh.position.y =1.7;
}

// Add models to scene
spawnTrees();
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


// -------------- Movement --------------
var startX = 45;
var endX = -30;
var startY = 5;

function interpolateCurve(u) {
    if (u > 1) u = 1;
    if (u < 0) u = 0;

    x = u * (endX - startX) + startX;
    y = (Math.cos(u * 15) * 5) + startY;
    return [x, y,];
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

    //console.log(G[i]);
}
// normalize arc length
for (var i = 1; i <= 20; i++) {
    G[i] /= G[20];

    //console.log(G[i]);
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

// Game setup=================================================
save = false;
read = false;
instance=0;
var expgrp = new THREE.Object3D();
var casgrp = new THREE.Object3D();
var frameWait = 0;
var oldPos = new THREE.Vector3(0,0,0);
var newPos = new THREE.Vector3(0,0,0);
var dir= new THREE.Vector3(0,0,0);
var lastdir = new THREE.Vector3(0,0,0);
var newBomb = new Bomb();
var sd1, sd2, sd3 = 0;
var xPos,yPos,zPos = false;
var slowDown = new THREE.Vector3(0,0,0);
var blankV3 = new THREE.Vector3(0,0,0);




//c4 test
var c4_geo = new THREE.BoxGeometry(0.15,0.05,0.15);
var c4_mat = new THREE.MeshPhongMaterial( { color:0xffebc4 } );
var c4_msh = new THREE.Mesh(c4_geo, c4_mat);


//explosion mesh
var exp_geo = new THREE.SphereGeometry(0.1, 18, 18);
var exp_mat = new THREE.MeshPhongMaterial( {color:0xd85c42} );
exp_mat.transparent = true;
exp_mat.opacity = 0.2;
var exp_msh = new THREE.Mesh(exp_geo, exp_mat);

//target test
var tar_geo = new THREE.BoxGeometry(5,2,3);
var tar_mat = new THREE.MeshPhongMaterial( {color:0x335533});
tar_mat.transparent=true;
var tar_msh = new THREE.Mesh(tar_geo, tar_mat);
tar_msh.position.z = -5;
tar_msh.position.y = 1;
scene.add(tar_msh);
var boundingBox = new THREE.Box3().setFromObject(tar_msh);

////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Kinectron codes starting from here///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize kinectron
kinectron = new Kinectron("192.168.60.56"); // Define and create an instance of kinectron
kinectron.makeConnection(); // Create connection between remote and application
kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback


//Node spheres
//Hands
var node_geo = new THREE.SphereGeometry(0.04, 18, 18);
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
var head_msh = new THREE.Mesh(head_geo, head_mat);
head_msh.position.y=100;
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


// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();




// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton) 
{ 
var offset = 1;
leftHand_msh.position.x = skeleton.joints[kinectron.HANDLEFT].cameraX;
leftHand_msh.position.y = skeleton.joints[kinectron.HANDLEFT].cameraY+offset;
leftHand_msh.position.z = skeleton.joints[kinectron.HANDLEFT].cameraZ;
rightHand_msh.position.x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
rightHand_msh.position.y = skeleton.joints[kinectron.HANDRIGHT].cameraY+offset;
rightHand_msh.position.z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;

kinectron.getHands(drawHands);// put this in get bodies


head_msh.position.x = skeleton.joints[kinectron.HEAD].cameraX;
head_msh.position.y = skeleton.joints[kinectron.HEAD].cameraY+offset;
head_msh.position.z = skeleton.joints[kinectron.HEAD].cameraZ;


//Left arm
LeftArm.geometry.vertices[0].x = skeleton.joints[kinectron.SPINESHOULDER].cameraX;
LeftArm.geometry.vertices[0].y = skeleton.joints[kinectron.SPINESHOULDER].cameraY+offset;
LeftArm.geometry.vertices[0].z = skeleton.joints[kinectron.SPINESHOULDER].cameraZ;

LeftArm.geometry.vertices[1].x = skeleton.joints[kinectron.SHOULDERLEFT].cameraX;
LeftArm.geometry.vertices[1].y = skeleton.joints[kinectron.SHOULDERLEFT].cameraY+offset;
LeftArm.geometry.vertices[1].z = skeleton.joints[kinectron.SHOULDERLEFT].cameraZ;

LeftArm.geometry.vertices[2].x = skeleton.joints[kinectron.ELBOWLEFT].cameraX;
LeftArm.geometry.vertices[2].y = skeleton.joints[kinectron.ELBOWLEFT].cameraY+offset;
LeftArm.geometry.vertices[2].z = skeleton.joints[kinectron.ELBOWLEFT].cameraZ; 

LeftArm.geometry.vertices[3].x = skeleton.joints[kinectron.HANDLEFT].cameraX;
LeftArm.geometry.vertices[3].y = skeleton.joints[kinectron.HANDLEFT].cameraY+offset;
LeftArm.geometry.vertices[3].z = skeleton.joints[kinectron.HANDLEFT].cameraZ; 
LeftArm.geometry.verticesNeedUpdate = true;

//Right arm
RightArm.geometry.vertices[0].x = skeleton.joints[kinectron.SPINESHOULDER].cameraX;
RightArm.geometry.vertices[0].y = skeleton.joints[kinectron.SPINESHOULDER].cameraY+offset;
RightArm.geometry.vertices[0].z = skeleton.joints[kinectron.SPINESHOULDER].cameraZ; 


RightArm.geometry.vertices[1].x = skeleton.joints[kinectron.SHOULDERRIGHT].cameraX;
RightArm.geometry.vertices[1].y = skeleton.joints[kinectron.SHOULDERRIGHT].cameraY+offset;
RightArm.geometry.vertices[1].z = skeleton.joints[kinectron.SHOULDERRIGHT].cameraZ;

RightArm.geometry.vertices[2].x = skeleton.joints[kinectron.ELBOWRIGHT].cameraX;
RightArm.geometry.vertices[2].y = skeleton.joints[kinectron.ELBOWRIGHT].cameraY+offset;
RightArm.geometry.vertices[2].z = skeleton.joints[kinectron.ELBOWRIGHT].cameraZ;

RightArm.geometry.vertices[3].x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
RightArm.geometry.vertices[3].y = skeleton.joints[kinectron.HANDRIGHT].cameraY+offset;
RightArm.geometry.vertices[3].z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;
RightArm.geometry.verticesNeedUpdate = true;

//Spine 
Spine.geometry.vertices[0].x = skeleton.joints[kinectron.HEAD].cameraX;
Spine.geometry.vertices[0].y = skeleton.joints[kinectron.HEAD].cameraY+offset;
Spine.geometry.vertices[0].z = skeleton.joints[kinectron.HEAD].cameraZ;

Spine.geometry.vertices[1].x = skeleton.joints[kinectron.NECK].cameraX;
Spine.geometry.vertices[1].y = skeleton.joints[kinectron.NECK].cameraY+offset;
Spine.geometry.vertices[1].z = skeleton.joints[kinectron.NECK].cameraZ;

Spine.geometry.vertices[2].x = skeleton.joints[kinectron.SPINEMID].cameraX;
Spine.geometry.vertices[2].y = skeleton.joints[kinectron.SPINEMID].cameraY+offset;
Spine.geometry.vertices[2].z = skeleton.joints[kinectron.SPINEMID].cameraZ;

Spine.geometry.vertices[3].x = skeleton.joints[kinectron.SPINEBASE].cameraX;
Spine.geometry.vertices[3].y = skeleton.joints[kinectron.SPINEBASE].cameraY+offset;
Spine.geometry.vertices[3].z = skeleton.joints[kinectron.SPINEBASE].cameraZ;
Spine.geometry.verticesNeedUpdate = true;

pelvis_msh.position.x = skeleton.joints[kinectron.SPINEBASE].cameraX;
pelvis_msh.position.y = skeleton.joints[kinectron.SPINEBASE].cameraY+offset;
pelvis_msh.position.z = skeleton.joints[kinectron.SPINEBASE].cameraZ;



if(save)
{
	if (frmCnt<maxFrm) {
		allFrames[frmCnt] = skeleton;
		frmCnt++;
		console.log(frmCnt);

    	if (frmCnt==maxFrm) {
    		download(JSON.stringify(allFrames), 'test.json', 'text/plain');
    		save = false;
    	}
    }
    

    console.log(frmCnt);
}
}


function drawHands(hands) {
  //check if hands are touching 
  if ((Math.abs(hands.leftHand.depthX - hands.rightHand.depthX) < 0.01) && (Math.abs(hands.leftHand.depthY - hands.rightHand.depthY) < 0.01)) {
    hands.leftHandState = 'clapping';
    hands.rightHandState = 'clapping';
  }
  // draw hand states
  updateHandState(hands.leftHandState, hands.leftHand);
  updateHandState(hands.rightHandState, hands.rightHand);
}
//Detects if hands are open, closed, doing a lasso motion or held together
function updateHandState(handState, hand) {
  switch (handState) {
    case 'closed':
       // console.log("closed");
           if(!newBomb.mesh)
           	equip();
      break;

    case 'open':
         // console.log("open");
		  if(newBomb.held)
		  	newBomb.held = false;
      break;

    case 'lasso':
    	  	//window.location.href = "explosiveGame.html";
      break;

    case 'clapping':
		//console.log("clapping");
		if(!newBomb.held)
			detonate();
  }
}

    function createExplosion(expPos)
    {
		expInstance = exp_msh.clone();
		expInstance.position.add(expPos);
		expgrp.add(expInstance);
		scene.add(expgrp);
    }

    function cascade(casPos)
    {
		casInstance = exp_msh.clone();
		casInstance.position.add(casPos);
		casgrp.add(casInstance);
		scene.add(casgrp);
    }

    function cascading()
    {
    	for (var i = casgrp.children.length-1; i>=0; i--)
        {
        	currCas=casgrp.children[i];
			currCas.scale.x+=0.2;
			currCas.scale.y+=0.2;
			currCas.scale.z+=0.2;
		
			if (currCas.scale.x>4)
				casgrp.remove(currCas);
        }
    }
    function explode(){
    	if(expgrp.children[expgrp.children.length-1])
    	{
			for (var i = expgrp.children.length-1; i>=0; i--)
			{
				currExp=expgrp.children[i];
				currExp.scale.x+=0.4;
				currExp.scale.y+=0.4;
				currExp.scale.z+=0.4;
				
			if((currExp.scale.x > 2) && (currExp.scale.x <7))
    		{
				rand1=(Math.random()*2-1)/2;
				rand2=(Math.random()*2-1)/2;
				rand3=(Math.random()*2-1)/2;
				randvector= new THREE.Vector3(rand1,rand2,rand3);
				miniPos =new THREE.Vector3 (currExp.position.x, currExp.position.y, currExp.position.z);
			    miniPos.add(randvector);
				cascade(miniPos);
    		}
    		
			if (currExp.scale.x>10)
				expgrp.remove(currExp);
			
    		
			}
    	}
    }



// The animate function: called every frame
var iFrame = 0;
function animate()
{
	if(frameWait>55)
	{
	if (collision(head_msh,leftHand_msh)|| collision(head_msh,rightHand_msh))
	{
	if(tar_msh.material.opacity==0)
		window.location.href = "explosiveGame.html";
	else
		window.location.href = "gameHub.html";
	}
	}
	if (collision(pelvis_msh,leftHand_msh)|| collision(pelvis_msh,rightHand_msh))
	equip();

	 // Move the Particle array to create rain effect
    for (var i=0; i<iNumber; i++)
    {
        meshArray[i].position.y = meshArray[i].position.y - 0.2;
        if (meshArray[i].position.y < 0)
        {
            meshArray[i].position.y = 10;
        }
    }

    // -------------- Movement --------------
    var steps = 1500;
    var u = iFrame / steps;
    if (u <= 1) {
        //console.log(u);
    } else if (u >= 1) {
        u = 0;
        iFrame = 0;

    }
  requestAnimationFrame(animate);

    
  	

    // get json
    if (jsonFrm>0) {
      getBodies(jsonMotion[iFrame]);
      iFrame ++;
      iFrame = iFrame % jsonFrm;   // keep looping the frame
    }
    frameWait++;


   	if(newBomb.held)
   	{
   		hold();
   	}
   
    if(frameWait <60)
 	{
 		newPos.set(leftHand_msh.position.x,leftHand_msh.position.y,leftHand_msh.position.z);
 	}
 	else if (frameWait==65)
 	{
 		frameWait=60;
 		oldPos.set(newPos.x,newPos.y,newPos.z);
 		newPos.set(leftHand_msh.position.x,leftHand_msh.position.y,leftHand_msh.position.z);
 		lastdir.set(dir.x,dir.y,dir.z);
 		dir.subVectors( newPos, oldPos ).normalize();
 	}	

 	if ((!newBomb.held) && (newBomb.mesh) )
 	{
 		if( (newBomb.movement.equals(blankV3)) && (newBomb.stopped == false))
		{
			newBomb.movement.set(dir.x,dir.y,dir.z);
			newBomb.movement.divideScalar(8);
			//console.log(newBomb.mesh.position);
			if(newBomb.movement.x <0)
				xPos = false;
			else
				xPos = true;
			sd1=newBomb.movement.x/-100;
			sd2 = -0.00098;
			if(newBomb.movement.z <0)
				zPos = false;
			else
				zPos = true;
			sd3=newBomb.movement.z/-100;
			slowDown.set(sd1,sd2,sd3);
		}
		else
		{
			newBomb.mesh.position.add(newBomb.movement);
			//console.log(newBomb.movement);
			newBomb.movement.add(slowDown);
			if((newBomb.movement.x < 0) &&(xPos))
			{
				slowDown.setX(0);
				newBomb.movement.setX(0);
				//console.log("xset");
				stopCheck();
			}
			else if((newBomb.movement.x > 0) && (!xPos))
			{
				slowDown.setX(0);
				newBomb.movement.setX(0);
				//console.log("xset");
				stopCheck();
			}
			if(newBomb.movement.y <-0.1)
			{
				slowDown.setY(0);
				newBomb.movement.setY(-0.1);
				//console.log("yset");
				stopCheck();
			}
			if(newBomb.mesh.position.y < 1)//Or whatever the floor y is
			{
				slowDown.setY(0);
				newBomb.movement.setY(0);
				//console.log("yset");
				stopCheck();
			}
			if((newBomb.movement.z < 0) &&(zPos))
			{
				slowDown.setZ(0);
				newBomb.movement.setZ(0);
				//console.log("zset");
				stopCheck();
			}
			else if((newBomb.movement.z > 0) && (!zPos))
			{
				slowDown.setZ(0);
				newBomb.movement.setZ(0);
				//console.log("zset");
				stopCheck();
			}
			//console.log(newBomb.movement)
			//console.log(slowDown);
		}
 	}
 	
 
   		explode();
   		cascading();
   	
   	renderer.render(scene, camera);
}
animate();

function stopCheck()
{
	if (newBomb.movement.equals(blankV3))
	{
		newBomb.stopped = true;
		//console.log("stopped");
	}
}
if(save)
{
// init json array
var allFrames = {};
var frmCnt = 0;
var maxFrm = 500;

var save = true;
}


if(save)
{
function download(content, fileName, contentType) {
    var a = document.createElement("a");
    var file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}
}

if(read)
{
// init json array
var jsonFrm = 0;
var jsonMotion = null;

//usage:
readTextFile("motion.json", function(text){
    jsonMotion = JSON.parse(text);
  	var count = Object.keys(jsonMotion).length;
  	console.log(count);
  	jsonFrm = count;
  	iFrame = 0;
});


function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4) {//} && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
}

//keyboardcontrols for testing
document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) 
{
	var keyCode = event.which;
	if (keyCode == 49) 
	{
		  if(newBomb.held)
		  	newBomb.held = false;
	
	}
	else if (keyCode == 50)
	{
		 if(newBomb.held)
		  	newBomb.held = false;
	}
	else if (keyCode == 51)
	{
		if(!newBomb.held)
			detonate();
	}
}



//Call bomb constructor
function equip()
{
	if(!newBomb.mesh)
	{
		instance = c4_msh.clone();
		instance.position.add(leftHand_msh.position);
		newBomb = new Bomb(instance);
		scene.add(newBomb.mesh)
	}
}

//move mesh to player hand
function hold()
{
	if(newBomb.mesh)
	{
		newBomb.mesh.position.set(leftHand_msh.position.x,leftHand_msh.position.y,leftHand_msh.position.z);
	}		
}

//Make explosion then dispose of mesh and bomb
function detonate()
{
	if(newBomb.mesh)
	{
		sphere = new THREE.Sphere(newBomb.mesh.position,1);
		if(boundingBox.intersectsSphere(sphere))
		{
			console.log("hit");
			tarHit();
		}
		else
		{
			console.log(boundingBox);

		}
		createExplosion(newBomb.mesh.position);
		scene.remove(newBomb.mesh);
		newBomb.mesh = undefined;
		delete newBomb.mesh;
		delete newBomb.movement;
		delete newBomb.held;
		delete newBomb.stopped;
	}
}

//bomb constructor
function Bomb(bombmesh)
{
	this.mesh = bombmesh;
	this.movement = new THREE.Vector3(0,0,0);
	this.held = true;
	this.stopped = false;
}

function tarHit()
{
	if(!(tar_msh.material.opacity == 0))
	{
		for (var i = 0; i<6; i++)
		{
			randexpx=(Math.random()*10)-5;
			randexpy=(Math.random()*6)-3;
			randexpz=(Math.random()*4)-2;
			createExplosion(new THREE.Vector3(tar_msh.position.x+randexpx,tar_msh.position.y+randexpy,tar_msh.position.z+randexpz));
		}
	}
	tar_msh.material.opacity=0;

}


