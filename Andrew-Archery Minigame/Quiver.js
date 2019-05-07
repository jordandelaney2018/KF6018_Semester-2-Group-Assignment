class Quiver extends THREE.Group
{
	constructor()
	{
		super();
		//Main mesh
		var main_geo = new THREE.CylinderGeometry( 0.05, 0.05, .25, 8 );
		var main_mat = new THREE.MeshPhongMaterial( {color: 0x654321} ); //brown
		var main_msh = new THREE.Mesh( main_geo, main_mat );
		this.add(main_msh);
		
		//Decoration
		var dec_geo = new THREE.CylinderGeometry( 0.06, 0.06, .025, 8 );
		var dec_mat = new THREE.MeshPhongMaterial( {color: 0x332211} ); //dark brown		
		
		var rim_msh = new THREE.Mesh( dec_geo, dec_mat );
		main_msh.add(rim_msh);
		rim_msh.position.y += 0.125;

		var mid_msh = new THREE.Mesh( dec_geo, dec_mat );
		main_msh.add(mid_msh);
		
		var base_msh = new THREE.Mesh( dec_geo, dec_mat );
		this.add(base_msh);
		base_msh.position.y -= 0.125;
		
		//Attach 'dummy' arrow to quiver
		var arrow = new Arrow(0.25);
		main_msh.add(arrow);
		arrow.rotation.x-=Math.PI/2;
		arrow.position.y+=0.1;
	}
}
