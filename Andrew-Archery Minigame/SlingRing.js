class SlingRing extends THREE.Group
{
	constructor(size, distance)
	{
		super();

		size     = size     || 0.1; //Default if no size provided
		distance = distance || 0.1; //Default if no distance provided

		this.percentage = 0;
		//Root
		var root_geo = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
		var root_mat = new THREE.MeshBasicMaterial( { color: 0xAAAAAA } );
		this.root_msh = new THREE.Mesh( root_geo, root_mat );
		this.add(this.root_msh);

		//Orb   		
		var orb_geo = new THREE.SphereGeometry(size, 32, 32);
		var orb_mat = new THREE.MeshPhongMaterial({color: 0xFF0000, visible: false});
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

			this.percentage += 1;
			if(this.percentage > 100)
			{
				//DO THE THING
				//then reset
				this.percentage = 0;
			}
		}
		else
		{
			this.orb_msh.material.color.setHex(0xFF0000);
			if(this.percentage > 0)
			{
				this.percentage -= .5;
			}
		}
		//console.log(this.percentage);
	}
}