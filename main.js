import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// set up scene and background
var scene = new THREE.Scene();
scene.background = new THREE.CubeTextureLoader()
	.setPath("assets/skybox/")
	.load([
		'px.jpg',
		'nx.jpg',
		'py.jpg',
		'ny.jpg',
		'pz.jpg',
		'nz.jpg',
	]);

// set up camera
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(0, 0, 50);

// set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// set up global controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// create any sphere
// name: the name of the object being projected, in lower case (i.e. mercury)
// radius: the radius of the sphere (i.e. 1.0)
function createSphere(name, radius, xPosition) {
	
	// inject name into a path string
	const path = "assets/maps/" + name + ".png";

	// create the sphere
	const geom = new THREE.SphereGeometry(radius);
	const texture = new THREE.TextureLoader().load(path);
	const material = new THREE.MeshStandardMaterial({
		map: texture,
	});
	
	// return it
	return new THREE.Mesh(geom, material);
}

function createRing(name, radius) {
	
	// inject name into a path string
	const path = "assets/maps/" + name + "Ring.png";

	// create the sphere
	const geom = new THREE.RingGeometry(radius, radius * 2, radius * 3.2);
	const texture = new THREE.TextureLoader().load(path);
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.DoubleSide
	});
	
	// return it
	return new THREE.Mesh(geom, material);
}


// Sun
const sunGeom = new THREE.SphereGeometry(5);
const sunMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const pointLight = new THREE.PointLight(0xffffff, 2, 500);

// Main planets
const mercury = createSphere("mercury", 1);
const venus = createSphere("venus", 3);
const earth = createSphere("earth", 3);
const mars = createSphere("mars", 1.5);
const jupiter = createSphere("jupiter", 10);

const saturn = createSphere("saturn", 9);
const saturnRing = createRing("saturn", 9);
saturnRing.rotation.x = -0.5 * Math.PI;

const uranus = createSphere("uranus", 6);
const neptune = createSphere("neptune", 6);

// Moons
const titan = createSphere("titan", 1);


// add wanted objects to scene
scene.add(sun);
scene.add(pointLight);

// Mercury
const mercuryObj = new THREE.Object3D();
scene.add(mercuryObj);
mercuryObj.add(mercury);
mercury.position.set(25, 0, 0)

// Venus
const venusObj = new THREE.Object3D();
scene.add(venusObj);
venusObj.add(venus);
venus.position.set(50, 0, 0);

// Earth
const earthObj = new THREE.Object3D();
scene.add(earthObj);
earthObj.add(earth);
earth.position.set(75, 0, 0);

// Mars
const marsObj = new THREE.Object3D();
scene.add(marsObj);
marsObj.add(mars);
mars.position.set(100, 0, 0);

// Jupiter
const jupiterObj = new THREE.Object3D();
scene.add(jupiterObj);
jupiterObj.add(jupiter);
jupiter.position.set(200, 0, 0);

// Saturn
const saturnObj = new THREE.Object3D();
scene.add(saturnObj);
saturnObj.add(saturn);
saturnObj.add(saturnRing);
saturn.position.set(300, 0, 0);
saturnRing.position.set(300, 0, 0);

// Do all animation in this function
function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.005;


	// planet.rotation.y += DAY LENGTH
	// planetObj.rotation.y += YEAR LENGTH

	// Mercury
	mercury.rotation.y += 0.0001;
	mercuryObj.rotation.y += 0.008;

	// Venus
	venus.rotation.y += 0.001;
	venusObj.rotation.y += 0.004;

	// Earth
	earth.rotation.y += 0.001;
	earthObj.rotation.y += 0.003;

	// Mars
	mars.rotation.y += 0.001;
	marsObj.rotation.y += 0.0015;

	// Jupiter
	jupiter.rotation.y += 0.001;
	jupiterObj.rotation.y += 0.0005;

	// Saturn
	saturn.rotation.y += 0.001;
	saturnObj.rotation.y += 0.0003;


    renderer.render(scene, camera);
}

animate();