var camera, controls, scene, renderer,box,meshLH,meshRH,meshCone,meshHead,collisionBall,ball,pin1;
// Graphics variables
var container, stats;
var camera, controls, scene, renderer;
var textureLoader;
var clock = new THREE.Clock();
var clickRequest = false;
var mouseCoords = new THREE.Vector2();
var handCoord = new THREE.Vector2();
var raycaster = new THREE.Raycaster();
var ballMaterial = new THREE.MeshPhongMaterial( { color: 0x202020 } );
var pos = new THREE.Vector3();
var quat = new THREE.Quaternion();

// Physics variables
var gravityConstanX =  0;
var gravityConstantY = -9;
var gravityConstanZ = 0;

var physicsWorld;
var rigidBodies = [];
var softBodies = [];
var margin = 0.05;
var transformAux1;
			var softBodyHelpers;

		Ammo().then( function( AmmoLib ) {

				Ammo = AmmoLib;

				init();
				animate();

			} );



function init()
{
	initGraphics();
	initPhysics();
	initStuff();
	initInput();
}			

	function initPhysics() {

				// Physics configuration
				var collisionConfiguration = new Ammo.btSoftBodyRigidBodyCollisionConfiguration();
				var dispatcher = new Ammo.btCollisionDispatcher( collisionConfiguration );
				var broadphase = new Ammo.btDbvtBroadphase();
				var solver = new Ammo.btSequentialImpulseConstraintSolver();
				var softBodySolver = new Ammo.btDefaultSoftBodySolver();
				physicsWorld = new Ammo.btSoftRigidDynamicsWorld( dispatcher, broadphase, solver, collisionConfiguration, softBodySolver );
				physicsWorld.setGravity( new Ammo.btVector3( gravityConstanX, gravityConstantY, gravityConstanZ ) );
				physicsWorld.getWorldInfo().set_m_gravity( new Ammo.btVector3( gravityConstanX, gravityConstantY, gravityConstanZ ) );

				transformAux1 = new Ammo.btTransform();
				softBodyHelpers = new Ammo.btSoftBodyHelpers();

			}
function initGraphics(){
// Scene
 scene = new THREE.Scene();

// Camera
 camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -4;
camera.position.z = 4;
camera.position.y = 2;
}
function initStuff(){
	// Render
	container = document.getElementById( 'container' );
	 renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	container.appendChild( renderer.domElement );

	// Add the ambient light
	var lightAmbient = new THREE.AmbientLight( 0x888888 ); 
	scene.add(lightAmbient);


	// drawHand variables
	var start = 30;
	var target = 100;
	var diameter = start;
	var light = 255;
	var dark = 100;
	var hueValue = light;
	var lerpAmt = 0.3;
	var state = 'ascending';

	// Add mouse/camera controls
	 controls = new THREE.OrbitControls(camera, renderer.domElement);
	controls.target.set(0, 0, 0);
	controls.update();



	// Initialize kinectron - edited by Edmond
	kinectron = new Kinectron("192.168.60.56"); // Define and create an instance of kinectron
	kinectron.makeConnection(); // Create connection between remote and application
	kinectron.startTrackedBodies(getBodies); // Start tracked bodies and set callback



	// Add a ball for the left hand grey
	var gLH= new THREE.SphereGeometry(0.1, 18, 18);
	var mLH = new THREE.MeshPhongMaterial( { color: 0xCCCCCC } ); 
	 meshLH = new THREE.Mesh(gLH, mLH);
	scene.add(meshLH);

	// Add a ball for the right hand blue
	var gRH= new THREE.SphereGeometry(0.1, 18, 18);
	var mRH = new THREE.MeshPhongMaterial( { color: 0x00CCCC } ); 
	 meshRH = new THREE.Mesh(gRH, mRH);
	scene.add(meshRH);

	// Add a ball for head red head
	var gH= new THREE.SphereGeometry(0.1, 18, 18);
	var mH = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); 
	 meshHead = new THREE.Mesh(gH, mH);
	scene.add(meshHead);

	// Add a ball for thumb
	var gT= new THREE.SphereGeometry(0.1, 18, 18);
	var mT = new THREE.MeshPhongMaterial( { color: 0xff0000 } ); 
	var thumbR = new THREE.Mesh(gT, mT);
	//scene.add(thumbR);

	var radius = 5, segments = 16, rings = 16;


	// Add a ball for thumb
	// Creates a ball
	var ballMass = 6;
	var ballRadius = 0.4;

	
	// Ground
	pos.set( 0, - 1.7, 0 );
	quat.set( 0, 0, 0, 1 );
	var ground = createParalellepiped( 40, 1, 40, 0, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFE4E1 } ) );
	ground.castShadow = true;
	ground.receiveShadow = true;
	
	
	
	// bowling pins
	var xPin=3,yPin=0,zPin=0;
	  pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFF0000 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFF0000 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFF0000 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFF0000 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;

	console.log(pin1);
	zPin=-1;xPin=1;
	pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFD700 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFD700 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFD700 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFD700 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFD700 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xFFD700 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );

	zPin=-5;xPin=-2;
	pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0x9ACD32 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0x9ACD32 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0x9ACD32} ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0x9ACD32 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0x9ACD32 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0x9ACD32 } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 
	 	 xPin=7; zPin=-7;
	  pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF} ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	console.log(pin1);

	pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;

	 xPin=-4; zPin=-1;
	  pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF} ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	console.log(pin1);

	pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;
	pos.set( xPin, yPin, zPin );
	quat.setFromAxisAngle( new THREE.Vector3( 0, 0, 0 ), 30 * Math.PI / 180 );
	
	 pin1 = createParalellepiped( 0.3,0.7,0.3,0.3, pos, quat, new THREE.MeshPhongMaterial( { color: 0xE0FFFF } ) );
	pin1.castShadow = true;
	pin1.receiveShadow = true;




	
}






// Draw hands
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
var throwmode=false;
var throwBox =false;
var countDown=false;
var ableReset=false;
var clapping=0;
var headX,headY,headZ;

// Find out state of hands
function updateHandState(handState, hand) {
  switch (handState) {
    case 'closed':
        console.log("closed");
    
      
	handCoord.set(( handX )-0.3 ,( handY  ) );
	raycaster.setFromCamera( handCoord, camera );
	// Creates a ball
	var ballMass = 3;
	var ballRadius = 0.1;

	ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 18, 16 ), ballMaterial );
	ball.castShadow = true;
	ball.receiveShadow = true;
	var ballShape = new Ammo.btSphereShape( ballRadius );
	ballShape.setMargin( margin );
	pos.copy( raycaster.ray.direction );
	pos.add( raycaster.ray.origin );
	quat.set( 0, 0, 0, 1 );
	var ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat );
	ballBody.setFriction( 1 );
	console.log(ballBody.getCollisionFlags);
	pos.copy( raycaster.ray.direction );
	pos.multiplyScalar( 14 );
	ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) );

	clickRequest = false;
	countDown=true;
	console.log("Missle launched");
            
      break;

    case 'open':
            
 
           console.log("open");

      break;

    case 'lasso':
            console.log("lasso");

      break;

      // Created new state for clapping
    case 'clapping':
    if(ableReset){
    	clapping+=1;
    	console.log("clapping at:"+clapping);
    	if(clapping>=5){
			document.location.reload(true)
    		ableReset=false;
    	}
    }
    if(ableReset==false){
    	if(clapping!=0){
    		clapping=0;
    	}
    }
            console.log("clapping");

  }
}

var handX,handY,handZ
// The getBodies callback function: called once every time kinect obtain a frame
function getBodies(skevaron) 
{ 
  meshLH.position.x = skevaron.joints[kinectron.HANDLEFT].cameraX;
  meshLH.position.y = skevaron.joints[kinectron.HANDLEFT].cameraY;
  meshLH.position.z = skevaron.joints[kinectron.HANDLEFT].cameraZ;

  handX=meshRH.position.x = skevaron.joints[kinectron.HANDRIGHT].cameraX;
  handY=meshRH.position.y = skevaron.joints[kinectron.HANDRIGHT].cameraY;
  handZ=meshRH.position.z = skevaron.joints[kinectron.HANDRIGHT].cameraZ;

  meshHead.position.x = skevaron.joints[kinectron.HEAD ].cameraX;
  meshHead.position.y = skevaron.joints[kinectron.HEAD ].cameraY;
  meshHead.position.z = skevaron.joints[kinectron.HEAD ].cameraZ;
  headX=  meshHead.position.x = skevaron.joints[kinectron.HEAD ].cameraX;
  headY=  meshHead.position.y = skevaron.joints[kinectron.HEAD ].cameraY;
  headZ=  meshHead.position.z = skevaron.joints[kinectron.HEAD ].cameraZ;
  kinectron.getHands(drawHands);

}


function animate() {

	requestAnimationFrame( animate );

	render();

}
var iTime=0;
function render() {

	var deltaTime = clock.getDelta();
	camera.position.x=   headX;
	camera.position.y=  headY;
	camera.position.z=  headZ;

	

	updatePhysics( deltaTime );
	processClick();
	if(countDown==true){
		iTime++
		console.log(iTime);
		if(iTime>=100){
			countDown=false;
			ableReset=true;
		}
	}
	renderer.render( scene, camera );

}
function initInput() {

				window.addEventListener( 'mousedown', function ( event ) {

					if ( ! clickRequest ) {

						mouseCoords.set(
							( event.clientX / window.innerWidth ) * 2 - 1,
							- ( event.clientY / window.innerHeight ) * 2 + 1
						);

						clickRequest = true;
							console.log("mouse");

					}

				}, false );

			}
function processClick() {

				if ( clickRequest ) {

					raycaster.setFromCamera( mouseCoords, camera );

					// Creates a ball
					var ballMass = 6;
					var ballRadius = 0.4;

					var ball = new THREE.Mesh( new THREE.SphereGeometry( ballRadius, 18, 16 ), ballMaterial );
					ball.castShadow = true;
					ball.receiveShadow = true;
					var ballShape = new Ammo.btSphereShape( ballRadius );
					ballShape.setMargin( margin );
					pos.copy( raycaster.ray.direction );
					pos.add( raycaster.ray.origin );
					quat.set( 0, 0, 0, 1 );
					var ballBody = createRigidBody( ball, ballShape, ballMass, pos, quat );
					ballBody.setFriction( 0.4 );

					pos.copy( raycaster.ray.direction );
					pos.multiplyScalar( 14 );
					ballBody.setLinearVelocity( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
					clickRequest = false;
					countDown=true;
					console.log("mouse");

				}

			}
function updatePhysics( deltaTime ) {

	// Step world
	physicsWorld.stepSimulation( deltaTime, 10 );

	// Update soft volumes
	for ( var i = 0, il = softBodies.length; i < il; i ++ ) {

		var volume = softBodies[ i ];
		var geometry = volume.geometry;
		var softBody = volume.userData.physicsBody;
		var volumePositions = geometry.attributes.position.array;
		var volumeNormals = geometry.attributes.normal.array;
		var association = geometry.ammoIndexAssociation;
		var numVerts = association.length;
		var nodes = softBody.get_m_nodes();
		for ( var j = 0; j < numVerts; j ++ ) {

			var node = nodes.at( j );
			var nodePos = node.get_m_x();
			var x = nodePos.x();
			var y = nodePos.y();
			var z = nodePos.z();
			var nodeNormal = node.get_m_n();
			var nx = nodeNormal.x();
			var ny = nodeNormal.y();
			var nz = nodeNormal.z();

			var assocVertex = association[ j ];

			for ( var k = 0, kl = assocVertex.length; k < kl; k ++ ) {

				var indexVertex = assocVertex[ k ];
				volumePositions[ indexVertex ] = x;
				volumeNormals[ indexVertex ] = nx;
				indexVertex ++;
				volumePositions[ indexVertex ] = y;
				volumeNormals[ indexVertex ] = ny;
				indexVertex ++;
				volumePositions[ indexVertex ] = z;
				volumeNormals[ indexVertex ] = nz;

			}

		}

		geometry.attributes.position.needsUpdate = true;
		geometry.attributes.normal.needsUpdate = true;

	}

	// Update rigid bodies
	for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {

		var objThree = rigidBodies[ i ];
		var objPhys = objThree.userData.physicsBody;
		var ms = objPhys.getMotionState();
		if ( ms ) {

			ms.getWorldTransform( transformAux1 );
			var p = transformAux1.getOrigin();
			var q = transformAux1.getRotation();
			objThree.position.set( p.x(), p.y(), p.z() );
			objThree.quaternion.set( q.x(), q.y(), q.z(), q.w() );

		}

	}

}

function isTouchingCone(obj1,obj2)
{
    //get distance between both
    //get distance between both
    var ball1=Math.sqrt(Math.pow(obj1.position.x-obj2.position.x,2)+Math.pow(obj1.position.y-obj2.position.y,2)+Math.pow(obj1.position.z-obj2.position.z,2));
    var rad=obj1.geometry.parameters.radius+obj2.geometry.parameters.radiusTop ;
    var distance=ball1;
    //console.log("\n\nball1: "+ball1+"\ndistnace:"+distance+"\nradius: "+rad);
    
  
    
    if (distance<rad)
    {
        console.log("Touching");
        return true;

    }
    else{
      return false;
    }
   
}

function isTouchingBall(obj1,obj2)
{
	console.log("yo");
    //get distance between both
    //get distance between both
    var ball1=Math.sqrt(Math.pow(obj1.position.x-obj2.position.x,2)+Math.pow(obj1.position.y-obj2.position.y,2)+Math.pow(obj1.position.z-obj2.position.z,2));
    var rad=obj1.geometry.parameters.radius+obj2.geometry.parameters.radius;
    var distance=ball1;
    console.log("\n\nball1: "+ball1+"\ndistnace:"+distance+"\nradius: "+rad);
    
  
     if (distance<rad)
    {
        console.log("Touching");
        return true;

    }
    else{
      return false;
    }
 
  
}

function isTouchingCube(obj1,obj2)
{
    //get distance between both
    //get distance between both
    var ball1=Math.sqrt(Math.pow(obj1.position.x-obj2.position.x,2)+Math.pow(obj1.position.y-obj2.position.y,2)+Math.pow(obj1.position.z-obj2.position.z,2));
    var rad=(obj1.geometry.parameters.radius+obj2.geometry.parameters.width)/20;
    var distance=ball1;
    //console.log("\n\nball1: "+ball1+"\ndistnace:"+distance+"\nradius: "+rad);
    
   if (distance<rad)
    {
        console.log("Touching\n\n\n");
        return true;

    }
    else{
      return false;
    }
  
}


function createRigidBody( threeObject, physicsShape, mass, pos, quat ) {

	threeObject.position.copy( pos );
	threeObject.quaternion.copy( quat );

	var transform = new Ammo.btTransform();
	transform.setIdentity();
	transform.setOrigin( new Ammo.btVector3( pos.x, pos.y, pos.z ) );
	transform.setRotation( new Ammo.btQuaternion( quat.x, quat.y, quat.z, quat.w ) );
	var motionState = new Ammo.btDefaultMotionState( transform );

	var localInertia = new Ammo.btVector3( 0, 0, 0 );
	physicsShape.calculateLocalInertia( mass, localInertia );

	var rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, physicsShape, localInertia );
	var body = new Ammo.btRigidBody( rbInfo );

	threeObject.userData.physicsBody = body;

	scene.add( threeObject );
	if(threeObject.geometry.type=="SphereGeometry"){
		console.log("Sphere");
		console.log(threeObject.getContactPoint)
	}
	if ( mass > 0 ) {

		rigidBodies.push( threeObject );

		// Disable deactivation
		body.setActivationState( 4 );

	}
	physicsWorld.addRigidBody( body );

	return body;

}



function createParalellepiped( sx, sy, sz, mass, pos, quat, material ) {

var threeObject = new THREE.Mesh( new THREE.BoxGeometry( sx, sy, sz, 1, 1, 1 ), material );
var shape = new Ammo.btBoxShape( new Ammo.btVector3( sx * 0.5, sy * 0.5, sz * 0.5 ) );
shape.setMargin( margin );

createRigidBody( threeObject, shape, mass, pos, quat );

return threeObject;

}

      function createSoftVolume( bufferGeom, mass, pressure ) {

                processGeometry( bufferGeom );

                var volume = new THREE.Mesh( bufferGeom, new THREE.MeshPhongMaterial( { color: 0xFFFFFF } ) );
                volume.castShadow = true;
                volume.receiveShadow = true;
                volume.frustumCulled = false;
                scene.add( volume );


                // Volume physic object

                var volumeSoftBody = softBodyHelpers.CreateFromTriMesh(
                    physicsWorld.getWorldInfo(),
                    bufferGeom.ammoVertices,
                    bufferGeom.ammoIndices,
                    bufferGeom.ammoIndices.length / 3,
                    true );

                var sbConfig = volumeSoftBody.get_m_cfg();
                sbConfig.set_viterations( 40 );
                sbConfig.set_piterations( 40 );

                // Soft-soft and soft-rigid collisions
                sbConfig.set_collisions( 0x11 );

                // Friction
                sbConfig.set_kDF( 0.1 );
                // Damping
                sbConfig.set_kDP( 0.01 );
                // Pressure
                sbConfig.set_kPR( pressure );
                // Stiffness
                volumeSoftBody.get_m_materials().at( 0 ).set_m_kLST( 0.9 );
                volumeSoftBody.get_m_materials().at( 0 ).set_m_kAST( 0.9 );

                volumeSoftBody.setTotalMass( mass, false )
                Ammo.castObject( volumeSoftBody, Ammo.btCollisionObject ).getCollisionShape().setMargin( margin );
                physicsWorld.addSoftBody( volumeSoftBody, 1, -1 );
                volume.userData.physicsBody = volumeSoftBody;
                // Disable deactivation
                volumeSoftBody.setActivationState( 4 );

                softBodies.push( volume );

            }

         