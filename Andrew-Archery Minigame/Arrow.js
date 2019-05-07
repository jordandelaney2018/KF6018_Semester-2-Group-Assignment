class Arrow extends THREE.Group
{
	constructor(length)
	{
		super();
		length = length || 0.5; //Default if no length provided

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

		this.tip_msh.position.z-= length / 1.75;
		this.tip_msh.rotation.x-= Math.PI/2;
		
		//Arrow fletching 
		var fletch_geo = new THREE.BoxGeometry( 0.025, 0.1, 0.1 );
		var fletch_mat = new THREE.MeshPhongMaterial( {color: 0xffffff} ); //white
		//Fletching A		
		this.fletchA_msh = new THREE.Mesh( fletch_geo, fletch_mat );
		this.stick_msh.add(this.fletchA_msh);
		this.fletchA_msh.position.z+= length / 2;
		this.fletchA_msh.rotation.z+= Math.PI/4;
		//Fletching B
		this.fletchB_msh = new THREE.Mesh( fletch_geo, fletch_mat );
		this.stick_msh.add(this.fletchB_msh);
		this.fletchB_msh.position.z+= length / 2;
		this.fletchB_msh.rotation.z-= Math.PI/4;

		//vars
		this.velocity = new THREE.Vector3(0,0,0);
		this.flightDuration = 0;
		this.equipped = false;
	}
	updateLength(length)
	{
		length = length || 0.5; //Default if no length provided
		
		//Arrow stick (root)
		this.stick_msh.geometry.depth = length;

		//Arrow tip
		this.tip_msh.position.z = -(length/1.75)
		
		//Arrow fletching 
		var fletch_geo = new THREE.BoxGeometry( 0.025, 0.1, 0.1 );
		var fletch_mat = new THREE.MeshPhongMaterial( {color: 0xffffff} ); //white
		//Fletching A		
		this.fletchA_msh = new THREE.Mesh( fletch_geo, fletch_mat );
		this.stick_msh.add(this.fletchA_msh);
		this.fletchA_msh.position.z+= length / 2;
		this.fletchA_msh.rotation.z+= Math.PI/4;
		//Fletching B
		this.fletchB_msh = new THREE.Mesh( fletch_geo, fletch_mat );
		this.stick_msh.add(this.fletchB_msh);
		this.fletchB_msh.position.z+= length / 2;
		this.fletchB_msh.rotation.z-= Math.PI/4;
	}
	shoot()
	{
		//Change arrow parent from hand to scene
		THREE.SceneUtils.detach(this, this.parent, scene );
	
		//Apply force (CHANGE TO CANNON.js IF POSSIBLE)
		this.velocity.z = 0.1;
		console.log("SHOOT: " + this.velocity.z);
	}
	animate()
	{
		
		if(this.velocity.x > 0 || this.velocity.y > 0 || this.velocity.z > 0)
		{
			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
			this.position.z -= this.velocity.z;
			
			if(this.flightDuration >= 300)
			{
				//scene.remove(this);

				//TEMP SOLUTION: Return to hand				
			}

			this.flightDuration++;
		}
		
	}
}