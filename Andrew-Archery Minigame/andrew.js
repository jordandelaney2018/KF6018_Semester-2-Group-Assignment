class SlingRing extends THREE.Group
{
	constructor(size, distance)
	{
		super();

		size     = size     || 0.1; //Default to 1 if no size provided
		distance = distance || 0.1; //Default to 1 if no distance provided

		this.percentage = 0;
		//Root
    	var root_geo = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    	var root_mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
    	this.root_msh = new THREE.Mesh( root_geo, root_mat );
    	this.add(this.root_msh);

    	//Orb   		
		var orb_geo = new THREE.SphereGeometry(size, 32, 32);		
		var orb_mat = new THREE.MeshPhongMaterial({color: 0xFF0000});
    	this.orb_msh = new THREE.Mesh( orb_geo, orb_mat ); //use this for public
    	this.root_msh.add(this.orb_msh);	
    	this.orb_msh.position.x += distance;
	}
	contact(hand) //Check if hand has touched this.orb_msh
	{
		var distance = Math.sqrt(Math.pow(hand.position.x - this.orb_msh.position.x, 2)
           			       	   + Math.pow(hand.position.y - this.orb_msh.position.y, 2)
           			           + Math.pow(hand.position.z - this.orb_msh.position.z, 2));
		var sumRadius = hand.geometry.parameters.radius + this.orb_msh.geometry.parameters.radius;

		if (collision(hand, this.orb_msh))
		{
			this.orb_msh.material.color.setHex(0x00FF00);
			this.root_msh.rotation.z -= 0.1;
			console.log(this.root_msh.rotation.z);


			this.percentage += 1;
		}
		else
		{
			this.orb_msh.material.color.setHex(0xFF0000);
			this.percentage -= 0.5;
		}
	}
}

class Arrow extends THREE.Group
{
	constructor()
	{
		super();

//Arrow Mesh
var arrow_geo = new THREE.BoxGeometry( 0.05, 0.05, 0.5 );
var arrow_mat = new THREE.MeshBasicMaterial( {color: 0x654321} );
var arrow_msh = new THREE.Mesh( arrow_geo, arrow_mat );

var geometry = new THREE.ConeGeometry( 5, 20, 32 );
var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
var cone = new THREE.Mesh( geometry, material );
	}
}

function collision(meshA, meshB)
{

	var meshApos = meshA.getWorldPosition();
	var meshBpos = meshB.getWorldPosition();

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

// Scene
var scene = new THREE.Scene();

// Camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -1;
camera.position.z = 4;
camera.position.y = 2;

// Render
var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
container.appendChild( renderer.domElement );

// Ambient light
var lightAmbient = new THREE.AmbientLight( 0x888888 ); 
scene.add(lightAmbient);

// Point light
var lightThis = new THREE.PointLight(0xffffff);
lightThis.position.set(3, 10, 3);
lightThis.intensity = 0.8;
scene.add(lightThis);

// Floor
var gFloor = new THREE.PlaneGeometry(3, 3);
var mFloor = new THREE.MeshPhongMaterial( {color: 0x33FF33, side: THREE.DoubleSide} );
var floor = new THREE.Mesh(gFloor, mFloor);
floor.rotation.x = Math.PI/2;
floor.position.x = floor.position.y = floor.position.z = -1;
scene.add(floor);

// Add mouse/camera controls
var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();

//Node spheres
//Left Hand
var gLH= new THREE.SphereGeometry(0.1, 18, 18);
var mLH = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 
var meshLH = new THREE.Mesh(gLH, mLH);
scene.add(meshLH);

//Right Hand
var gRH= new THREE.SphereGeometry(0.1, 18, 18);
var mRH = new THREE.MeshPhongMaterial( { color: 0x00CCCC } ); 
var meshRH = new THREE.Mesh(gRH, mRH);
scene.add(meshRH);

//Add SlingRing to hand
var slingRing = new SlingRing();
meshLH.add(slingRing);

//Right Shoulder
var rightShoulder_msh = new THREE.Mesh(gLH, mLH);
scene.add(rightShoulder_msh);


// The animate function: called every frame
var iFrame = 0;
function animate()
{
	requestAnimationFrame(animate);

	//Get json
	if (jsonFrm>0) {
		getBodies(jsonMotion[iFrame]);
		iFrame ++;
		iFrame = iFrame % jsonFrm;   //Keep looping the frame
	}
	
	//Check slingRing contact
	slingRing.contact(meshRH);
	if(slingRing.percentage >= 100)
	{
		meshLH.material.color.setHex(0x0000FF);
	}

	//Check shoulder contact
	if(collision(meshRH, rightShoulder_msh))
	{
		//if(equipped)
		//{
				//fire arrow
		//}
		//else
		//{
				//meshRH.add(new Arrow());
				//equipped = true;
		//}
	}
	
	//Check hand contact
	if(collision(meshRH, meshLH))
	{
		//Attach arrow to both hands?
	}

	renderer.render(scene, camera);
}
animate();

// init json array
var jsonFrm = 0;
var jsonMotion = null;

//usage:
readTextFile("recording.json", function(text){
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Kinectron codes starting from here///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Initialize kinectron
kinectron = new Kinectron(); // Define and create an instance of kinectron
//kinectron.makeConnection(); // Create connection between remote and application
//kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback

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
eyeL_msh.position.y += 0.025;
eyeL_msh.position.z -= 0.075;

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

// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skeleton) 
{ 
	meshLH.position.x = skeleton.joints[kinectron.HANDLEFT].cameraX;
	meshLH.position.y = skeleton.joints[kinectron.HANDLEFT].cameraY;
	meshLH.position.z = skeleton.joints[kinectron.HANDLEFT].cameraZ;
	meshRH.position.x = skeleton.joints[kinectron.HANDRIGHT].cameraX;
	meshRH.position.y = skeleton.joints[kinectron.HANDRIGHT].cameraY;
	meshRH.position.z = skeleton.joints[kinectron.HANDRIGHT].cameraZ;

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
    /*LeftLeg.geometry.vertices[0].x = skeleton.joints[kinectron.HIPLEFT].cameraX;
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
	RightLeg.geometry.verticesNeedUpdate = true;*/
}
