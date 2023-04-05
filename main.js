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
function createSphere(name, radius) {
	
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

// Sun
const sunGeom = new THREE.SphereGeometry(5);
const sunMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const pointLight = new THREE.PointLight(0xffffff, 2, 300);

// Main planets
const mercury = createSphere("mercury", 1);
const venus = createSphere("venus", 3);
const earth = createSphere("earth", 3);

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

const venusObj = new THREE.Object3D();
scene.add(venusObj);
venusObj.add(venus);
venus.position.set(50, 0, 0);

const earthObj = new THREE.Object3D();
scene.add(earthObj);
earthObj.add(earth);
earth.position.set(75, 0, 0);

// Do all animation in this function
function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.005;


	// Mercury
	mercury.rotation.y += 0.001;
	mercuryObj.rotation.y += 0.00088 * 2;

	// Venus
	venus.rotation.y += 0.001;
	venusObj.rotation.y += 0.000225 * 2;

	// Earth
	earth.rotation.y += 0.001;
	earthObj.rotation.y += 0.000365 * 2;


    renderer.render(scene, camera);
}

animate();