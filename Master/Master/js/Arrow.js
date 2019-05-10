class Arrow extends THREE.Group
{
	constructor(length)
	{
		super();
		this.length = length || 0.5; //Default if no length provided

		//Arrow stick (root)
		var stick_geo = new THREE.BoxGeometry( 0.05, 0.05, length );
		var stick_mat = new THREE.MeshPhongMaterial( {color: 0x654321} ); //brown
		this.stick_msh = new THREE.Mesh( stick_geo, stick_mat );
		this.add(this.stick_msh);

		//Arrow tip
		var tip_geo = new THREE.ConeGeometry( .05, 0.15, 8 );
		var tip_mat = new THREE.MeshPhongMaterial( {color: 0xffffff} ); //white
		this.tip_msh = new THREE.Mesh( tip_geo, tip_mat );
		
		this.stick_msh.add(this.tip_msh);

		this.tip_msh.position.z+= length / 1.75;
		this.tip_msh.rotation.x+= Math.PI/2;

		var collision_geo = new THREE.SphereGeometry(0.1, 32, 32);
		var collision_mat = new THREE.MeshBasicMaterial({color: 0xFF0000, visible:true});

		this.collision_msh = new THREE.Mesh(collision_geo, collision_mat);
		this.tip_msh.add(this.collision_msh);
		
		//Arrow fletching 
		var fletch_geo = new THREE.BoxGeometry( 0.025, 0.1, 0.1 );
		var fletch_mat = new THREE.MeshPhongMaterial( {color: 0xffffff} ); //white
		//Fletching A		
		this.fletchA_msh = new THREE.Mesh( fletch_geo, fletch_mat );
		this.stick_msh.add(this.fletchA_msh);
		this.fletchA_msh.position.z-= length / 2;
		this.fletchA_msh.rotation.z+= Math.PI/4;
		//Fletching B
		this.fletchB_msh = new THREE.Mesh( fletch_geo, fletch_mat );
		this.stick_msh.add(this.fletchB_msh);
		this.fletchB_msh.position.z-= length / 2;
		this.fletchB_msh.rotation.z-= Math.PI/4;

		//vars
		this.velocity = new THREE.Vector3(0,0,0);
		this.flightDuration = 0;
		this.equipped = false;
		this.nocked = false;
		this.mainHand = null;
		this.offHand = null;
		this.active = true;

		console.log("NEW ARROW CREATED");
	}
	equip(mainHand)
	{
		this.mainHand = mainHand;
		mainHand.add(this);
		this.equipped = true;

		this.stick_msh.position.z -= this.length/2;

		//Quickfix: Rotate at equip() and unrotate at nock()
		this.stick_msh.rotation.x += Math.PI;

		console.log("ARROW EQUIPPED");
	}
	nock(offHand)
	{
		this.offHand = offHand;
		this.nocked = true;

		//Quickfix: Rotate at equip() and unrotate at nock()
		this.stick_msh.rotation.x += Math.PI;

		console.log("ARROW NOCKED");
	}
	updateLength()
	{
		//Calculate hand distance
		var length_dx = Math.pow(this.mainHand.position.x - this.offHand.position.x, 2);
		var length_dy = Math.pow(this.mainHand.position.y - this.offHand.position.y, 2);
		var length_dz = Math.pow(this.mainHand.position.z - this.offHand.position.z, 2);

		var length = Math.sqrt(length_dx + length_dy + length_dz);

		this.stick_msh.position.z = length / 2;
		

		//update root (stick_msh)
		this.stick_msh.geometry = new THREE.BoxGeometry( 0.05, 0.05, length );

		//this.position.x = -(length/2);

		//Update deco (tip, fletching)
		this.tip_msh.position.z = length/1.75;
		this.fletchA_msh.position.z= -(length / 2);
		this.fletchB_msh.position.z= -(length / 2);
	}
	shoot()
	{
		//Change arrow parent from hand to scene
		THREE.SceneUtils.detach(this, this.mainHand, scene );
		//Update vars
		this.equipped = false;
		this.nocked = false;
	
		//Apply force (CHANGE TO CANNON.js IF POSSIBLE)
		this.velocity = new THREE.Vector3( 0, 0, 0.1 ).applyQuaternion( this.quaternion );

	}
	animate()
	{
		if(this.nocked)
		{
			//Update rotation
			this.lookAt(this.offHand.position);
			//Update length
			this.updateLength();
		}
		else
		{
			if(this.flightDuration >= 300)
			{
				scene.remove(this);
				delete this;
			}
			else if(!this.equipped && !this.nocked && this.active)
			{	
				//Update position			
				this.position.x += this.velocity.x;
				this.position.y += this.velocity.y;
				this.position.z += this.velocity.z;
				
				//Hacky gravity
				this.position.y -= this.flightDuration * 0.0005;
				this.flightDuration++;
			}			
		}
	}
}