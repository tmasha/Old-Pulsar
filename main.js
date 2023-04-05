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
function createSphere(name, radius, x, ringParams) {
	
	// inject name into a path string
	const path = "assets/maps/" + name + ".png";

	// create the sphere
	const geom = new THREE.SphereGeometry(radius);
	const texture = new THREE.TextureLoader().load(path);
	const material = new THREE.MeshStandardMaterial({
		map: texture,
	});
	
	// create planet
	const planet = new THREE.Mesh(geom, material);
	const planetObj = new THREE.Object3D();
	planetObj.add(planet);

	// if there is a ring, create one
	if (ringParams) {
		const ringGeom = new THREE.RingGeometry(
			ringParams.innerRadius, 
			ringParams.outerRadius, 
			32
		);
		const ringPath = "assets/maps/" + name + "Ring.png";
		const ringTexture = new THREE.TextureLoader().load(ringPath);
		const ringMaterial = new THREE.MeshBasicMaterial({
			map: ringTexture,
			side: THREE.DoubleSide
		});
		const ring = new THREE.Mesh(ringGeom, ringMaterial);
		planetObj.add(ring);
		ring.position.set(x, 0, 0);
		ring.rotation.x = -0.5 * Math.PI;

	}

	scene.add(planetObj);
	planet.position.set(x, 0, 0);

	return {planet, planetObj}
}

// Sun
const sunGeom = new THREE.SphereGeometry(5);
const sunMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const pointLight = new THREE.PointLight(0xffffff, 1.3, 0);

// Main planets
const mercury = createSphere("mercury", 1, 25);
const venus = createSphere("venus", 3, 50);
const earth = createSphere("earth", 3, 75);
const mars = createSphere("mars", 1.5, 100);
const jupiter = createSphere("jupiter", 10, 200);

const saturn = createSphere("saturn", 9, 300, {innerRadius: 10, outerRadius: 20});

const uranus = createSphere("uranus", 6, 400);
const neptune = createSphere("neptune", 6, 500);

// Moons
const moon = createSphere("moon", 1, 5);

// add wanted objects to scene
scene.add(sun);
scene.add(pointLight);

// Do all animation in this function
function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.005;


	// planet.rotation.y += DAY LENGTH
	// planetObj.rotation.y += YEAR LENGTH

	// Mercury
	mercury.planet.rotation.y += 0.0001;
	mercury.planetObj.rotation.y += 0.008;

	// Venus
	venus.planet.rotation.y += 0.0001;
	venus.planetObj.rotation.y += 0.006;

	// Earth
	earth.planet.rotation.y += 0.0001;
	earth.planetObj.rotation.y += 0.0035;

	// Mars
	mars.planet.rotation.y += 0.0001;
	mars.planetObj.rotation.y += 0.002;

	// Jupiter
	jupiter.planet.rotation.y += 0.0001;
	jupiter.planetObj.rotation.y += 0.0005;

	// Saturn
	saturn.planet.rotation.y += 0.0001;
	saturn.planetObj.rotation.y += 0.0002;

	// Uranus
	uranus.planet.rotation.y += 0.0001;
	uranus.planetObj.rotation.y += 0.0001;

	// Neptune
	neptune.planet.rotation.y += 0.0001;
	neptune.planetObj.rotation.y += 0.00005;


    renderer.render(scene, camera);
}

animate();