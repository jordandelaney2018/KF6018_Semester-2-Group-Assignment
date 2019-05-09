class Bow extends THREE.Group
{
	constructor()
	{
		super();
        
        var BOW_RADIUS = 0.35;
        this.nocked = false;

		//Bow
		var bow_geo = new THREE.TorusGeometry( BOW_RADIUS, 0.05, 12, 5, Math.PI );
		var bow_mat = new THREE.MeshPhongMaterial( {color: 0x654321} ); //brown
		this.bow_msh = new THREE.Mesh( bow_geo, bow_mat );
		this.add(this.bow_msh);
		
		
		//Grip
		var grip_geo = new THREE.CylinderGeometry( 0.07, 0.07, .1, 8 );
		var grip_mat = new THREE.MeshPhongMaterial( {color: 0x332211} ); //dark brown		
		
		var grip_msh = new THREE.Mesh( grip_geo, grip_mat );
		this.bow_msh.add(grip_msh);
		grip_msh.position.y+=0.325;
		grip_msh.rotation.z+=Math.PI/2;
		
		//Caps for open ends of torus
		var cap_geo = new THREE.CylinderGeometry( 0.06, 0.06, .01, 8 );
		var cap_mat = new THREE.MeshPhongMaterial( {color: 0x332211} ); //dark brown		
        //Top
		var capTop_msh    = new THREE.Mesh( cap_geo, cap_mat );
		this.bow_msh.add(capTop_msh);
		capTop_msh.position.x+=BOW_RADIUS;
		//Bottom
		var capBottom_msh = new THREE.Mesh( cap_geo, cap_mat );
        this.bow_msh.add(capBottom_msh);
		capBottom_msh.position.x-=BOW_RADIUS;

		//String
		this.string_geo = new THREE.Geometry();
		
        this.string_geo.vertices.push(
	       capTop_msh.position,
	       new THREE.Vector3( 0,0,0 ),
	       capBottom_msh.position
        );

       var string_mat = new THREE.LineBasicMaterial({color: 0xffffff});

        this.string = new THREE.Line( this.string_geo, string_mat );
        this.bow_msh.add( this.string );

        //Reposition for neutral state
        this.rotation.y =  Math.PI/2;
		this.rotation.z = -Math.PI/2;
		this.position.z =  0.3;
	}
	nock(hand)
	{
		this.hand = hand;
		this.nocked = true;
	}
	animate()
	{
		if(this.nocked)
		{
			//String is pulled
			this.string.geometry.vertices[1] = this.worldToLocal(this.hand.position.clone());
			this.string.geometry.verticesNeedUpdate = true;
		}
	}
	reset()
	{
	    this.string.geometry.vertices[1] = new THREE.Vector3(0,0,0);
	    this.string.geometry.verticesNeedUpdate = true;
	    this.nocked = false;

	    //Reposition for neutral state
        this.rotation.y =  Math.PI/2;
		this.rotation.z = -Math.PI/2;
		this.position.z =  0.3;
	}
}
