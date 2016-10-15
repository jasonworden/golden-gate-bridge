var camera,
    scene,
    renderer;
var mesh;

var headlight,
  spotlight;

var PARTICLE_COUNT = 50;
var PILL_BODY_HEIGHT = 40;
var PILL_RADIUS = 15;
var PILL_SEGMENTS = 200;

init();
animate();

function createDualColoredPill(bodyHeight, topMaterial, bottomMaterial, radius) {
  var pill = new THREE.Object3D();
  var materials = [topMaterial, bottomMaterial];
  var cylinder,
    sphere,
    material,
    r,
    cylinderGeometry,
    sphereGeometry;

  for (var i = 0; i < 2; ++i) {
    r = (i == 0) ? radius + 1 : radius;
    cylinderGeometry = new THREE.CylinderGeometry(r, r, PILL_BODY_HEIGHT/2, PILL_SEGMENTS);
    sphereGeometry = new THREE.SphereGeometry(r, PILL_SEGMENTS, PILL_SEGMENTS);

    material = materials[i];
    var cylinder = new THREE.Mesh(cylinderGeometry, material);
    cylinder.translateY(i == 0
      ? bodyHeight / 4
      : -bodyHeight / 4
    );
    pill.add(cylinder);

    var sphere = new THREE.Mesh(sphereGeometry, material);
    sphere.translateY(i == 0
      ? bodyHeight / 2
      : -bodyHeight / 2
    );
    pill.add(sphere);
  }

  pill.traverse(function(object) {
    if ( object instanceof THREE.Mesh ) {
      object.castShadow = true;
      object.receiveShadow = true;
    }
  });
  pill.castShadow = true;
  pill.receiveShadow = true;

  return pill;
}

function createLighting(scene) {
  // LIGHTS
	scene.add( new THREE.AmbientLight( 0x222222 ) );

	headlight = new THREE.PointLight( 0x606060, 1.0 );
  headlight.castShadow = true;
	scene.add( headlight );

	spotlight = new THREE.SpotLight( 0xFFFFFF, 1.0 );
	spotlight.position.set( 100, 1000, 300 );
	spotlight.angle = 30 * Math.PI / 180;
	spotlight.exponent = 1;
	spotlight.target.position.set( 50, 200, 120 );
  spotlight.castShadow = true;
  // spotlight.receiveShadow = true;
	scene.add( spotlight );

	var lightSphere = new THREE.Mesh(
		new THREE.SphereGeometry( 10, 12, 6 ),
		new THREE.MeshBasicMaterial() );
	lightSphere.position.copy( spotlight.position );

	scene.add( lightSphere );

  //
  // scene.add( new THREE.AmbientLight( 0x777777 ) );
  //
  // var light = new THREE.DirectionalLight( 0xFFFFFF, 0.9 );
  // light.position.set( 200, 500, 500 );
  // light.castShadow = true;
  // // light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
  // scene.add( light );
  //
  // light = new THREE.DirectionalLight( 0xFFFFFF, 0.3 );
  // light.position.set( -200, -100, -400 );
  // light.castShadow = true;
  // // light.shadow = new THREE.LightShadow( new THREE.PerspectiveCamera( 50, 1, 1200, 2500 ) );
  // scene.add( light );
}

function init() {

  camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 5000);
  camera.position.z = 800;

  scene = new THREE.Scene();
  createLighting(scene);

  var materialRed = new THREE.MeshPhongMaterial({color: 0xff0000, shininess: 99});
  var materialBlue = new THREE.MeshPhongMaterial({color: 0x0000ff, shininess: 27});
  var materialWhite = new THREE.MeshPhongMaterial({color: 0xeeeeee, shininess: 70});

  mesh = createDualColoredPill(
    PILL_BODY_HEIGHT,
    materialRed,
    materialBlue,
    PILL_RADIUS
  );
  mesh.scale.set(5,5,5);
  mesh.translateY(190);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(new THREE.Color(0,250,250));
  renderer.shadowMap.enabled = true;
  document.body.appendChild(renderer.domElement);

  //

  window.addEventListener('resize', onWindowResize, false);

  //

  var solidGround = createSolidGround();
  scene.add(solidGround);

}

function createSolidGround() {
  var solidGround = new THREE.Mesh(
		new THREE.PlaneGeometry( 10000, 10000 ),
		new THREE.MeshPhongMaterial({ color: 0xFF00FF,
			// polygonOffset moves the plane back from the eye a bit, so that the lines on top of
			// the grid do not have z-fighting with the grid:
			// Factor == 1 moves it back relative to the slope (more on-edge means move back farther)
			// Units == 4 is a fixed amount to move back, and 4 is usually a good value
			polygonOffset: true, polygonOffsetFactor: 1.0, polygonOffsetUnits: 4.0
		}));
	solidGround.rotation.x = -Math.PI / 2 + .2;
  solidGround.receiveShadow = true;

  return solidGround;
}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

    requestAnimationFrame(animate);

    // mesh.rotation.x += .03; //0.005;
    mesh.rotation.x += .03;
    // mesh.rotation.y += .2; 0.01;

    headlight.position.copy(camera.position);
  	spotlight.shadow.bias = .0001;
  	// renderer.render(scene, camera);

    renderer.render(scene, camera);

}
