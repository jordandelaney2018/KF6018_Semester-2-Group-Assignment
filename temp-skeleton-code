//Temp file just to share the code I have for drawing skeleton
// Feel free to delete once it's copied into main project

//Node spheres
var node_geo = new THREE.SphereGeometry(0.1, 18, 18);
var node_mat = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 

//Head
var head_msh = new THREE.Mesh(node_geo, node_mat);
scene.add(head_msh);

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

//Left Hand
var leftHand_msh = new THREE.Mesh(node_geo, node_mat);
scene.add(leftHand_msh);

//Right Hand
var rightHand_msh = new THREE.Mesh(node_geo, node_mat);
scene.add(rightHand_msh);

//Pelvis
var pelvis_msh = new THREE.Mesh(node_geo, node_mat);
scene.add(pelvis_msh);

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
