var scene;
var aspect;
var camera;
var renderer;
var stats;
var controls;
var gridHelper;
var body = document.getElementsByTagName('body')[0];

var sphere;

function setup() {
  scene = new THREE.Scene();
  aspect = window.innerWidth / window.innerHeight;

  //PerspectiveCamera( fov, aspect, near, far )
  camera = new THREE.PerspectiveCamera( 75, aspect, 0.1, 1000 );
  camera.position.z = -5;
  camera.position.y = 2;

  controls = new THREE.OrbitControls(camera);
  controls.enablePan = false;
  controls.enableZoom = false;
  // controls.enableRotate = false;

  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // var gridHelper = new THREE.GridHelper(200, 40, 0x0000dd, 0x808080);
  // scene.add(gridHelper);

  var light = new THREE.AmbientLight(0x404040); // soft white light
  scene.add(light);

  var directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
  directionalLight.position.set( 1, 1, -1.1 ).normalize();
  scene.add( directionalLight );

  addSkyBox();
}

function fillScene() {
  //create ground
  var groundPlaneGeometry = new THREE.PlaneGeometry(60,40,1,1);
  var groundPlaneMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
  var groundPlane = new THREE.Mesh(groundPlaneGeometry,groundPlaneMaterial);

  addSphere();
}

function addSkyBox() {
  var path = "textures/cube/golden-gate-bridge-2/";
  var format = '.jpg';
  var urls = [
    'posx' + format, 'negx' + format,
    'posy' + format, 'negy' + format,
    'posz' + format, 'negz' + format
  ];

  scene.background = new THREE.CubeTextureLoader()
    .setPath(path)
    .load(urls);
  scene.background.format = THREE.RGBFormat;
}

function addSphere() {
  var geometry = new THREE.SphereGeometry(2, 128, 128);
  var material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    specular: 0xeeeeee,
    // specularMap: scene.background,
    envMap: scene.background,
    shininess: 65
  });
  sphere = new THREE.Mesh(geometry, material);
  sphere.translateY(0.5);
  scene.add(sphere);
}

function render() {
  requestAnimationFrame(render);
  // cube.rotation.x += 0.1;
  // cube.rotation.y += 0.1;

  if(stats && stats.update)         stats.update();
  if(controls && controls.update)   controls.update();

  renderer.render(scene, camera);
}

function insertStatsGUI() {
  stats = new Stats();
  stats.domElement.style.bottom = '0px';
  stats.domElement.style.right = '0px'
  stats.domElement.style.left = ''
  stats.domElement.style.top = '';
  // stats.domElement.style.zIndex = 1000;
  body.appendChild(stats.dom);
}

setup();
fillScene();
render();
insertStatsGUI();
