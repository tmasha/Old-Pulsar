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

// This function creates a celestial body
// PARAMETERS;
// bodyName: The name of the body as a lowercase String (for example: "mercury")
// bodyRadius: The radius of the body (for example: 20.0)
// 

function createBody(bodyName, bodyRadius, distance, ringRadii) {

	// Create the body's geometry using the body's Radius
	const bodyGeom = new THREE.SphereGeometry(bodyRadius);

	// Create a path name for the body texture image file, then use that to make a body texture
	const bodyPath = "assets/maps/" + bodyName + ".png";
	const bodyTexture = new THREE.TextureLoader().load(bodyPath);

	// Use the body texture and body material to make a body mesh
	const bodyMat = new THREE.MeshStandardMaterial({
		map: bodyTexture,
	});
	
	// Create a planet
	const body = new THREE.Mesh(bodyGeom, bodyMat);

	// Create a pivot to control the planet's orbit around the Sun, then add the body to the pivot
	const pivot = new THREE.Object3D();
	pivot.add(body);

	// Add the pivot and set the body's distance from the Sun
	scene.add(pivot);
	body.position.set(distance, 0, 0);

	// This if statement is run if the ring's inner and outer radii are passed in a list
	if (ringRadii) {
		
		const ringGeom = new THREE.RingGeometry(
			ringRadii.innerRadius, 
			ringRadii.outerRadius
		);
		
		// Make a path name for the ring texture image file, then use that to make a ring texture
		const ringPath = "assets/maps/" + bodyName + "Ring.png";
		const ringTexture = new THREE.TextureLoader().load(ringPath);

		// Use the ring geometry and ring material to make a ring mesh
		const ringMat = new THREE.MeshBasicMaterial({
			map: ringTexture,
			side: THREE.DoubleSide
		});
		const ring = new THREE.Mesh(ringGeom, ringMat);

		// Add the ring to the pivot and set its distance from the Sun
		pivot.add(ring);
		ring.position.set(distance, 0, 0);
		ring.rotation.x = -0.5 * Math.PI;

		// Return body, ring, pivot so they can be accessed later
		return {body, ring, pivot}

	}

	// If ring is not rendered, just return a body and pivot
	return {body, pivot}
}

// Sun
const sunGeom = new THREE.SphereGeometry(5);
const sunMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const pointLight = new THREE.PointLight(0xffffff, 1.3, 0);

// Main planets
const mercury = createBody("mercury", 1, 25);
const venus = createBody("venus", 3, 50);
const earth = createBody("earth", 3, 75);
const mars = createBody("mars", 1.5, 100);
const jupiter = createBody("jupiter", 10, 200);

const saturn = createBody("saturn", 9, 300, {innerRadius: 10, outerRadius: 20});

const uranus = createBody("uranus", 6, 400);
const neptune = createBody("neptune", 6, 500);

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
	mercury.body.rotation.y += 0.0001;
	mercury.pivot.rotation.y += 0.008;

	// Venus
	venus.body.rotation.y += 0.0001;
	venus.pivot.rotation.y += 0.006;

	// Earth
	earth.body.rotation.y += 0.0001;
	earth.pivot.rotation.y += 0.006;


    renderer.render(scene, camera);
}

animate();