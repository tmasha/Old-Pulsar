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
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 50000 );
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

function createRing(name, parameters) {
	
	const geom = new THREE.RingGeometry(
		parameters.innerRadius, 
		parameters.outerRadius, 
		32
	);
	const path = "assets/maps/" + name + "Ring.png";
	const texture = new THREE.TextureLoader().load(path);
	const material = new THREE.MeshBasicMaterial({
		map: texture,
		side: THREE.DoubleSide
	});
	const ring = new THREE.Mesh(geom, material);
	ring.rotation.x = -0.5 * Math.PI;
	
	// return it
	return new THREE.Mesh(geom, material);
}


// Sun
const sunGeom = new THREE.SphereGeometry(5);
const sunMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const pointLight = new THREE.PointLight(0xffffff, 1.3, 0);

// Main planets
const mercury = createSphere("mercury", 2.44);
const venus = createSphere("venus", 6.052);
const earth = createSphere("earth", 6.371);
const mars = createSphere("mars", 3.390);
const jupiter = createSphere("jupiter", 69.911);

const saturn = createSphere("saturn", 58.232);
const saturnRing = createRing("saturn", {innerRadius: 70, outerRadius: 130});
saturnRing.rotation.x = -0.5 * Math.PI;

const uranus = createSphere("uranus", 25.362);

const neptune = createSphere("neptune", 24.622);

// Moons
const titan = createSphere("titan", 1);


// add wanted objects to scene
scene.add(sun);
scene.add(pointLight);

// Mercury
const mercuryObj = new THREE.Object3D();
scene.add(mercuryObj);
mercuryObj.add(mercury);
mercury.position.set(57.9, 0, 0)

// Venus
const venusObj = new THREE.Object3D();
scene.add(venusObj);
venusObj.add(venus);
venus.position.set(108.2, 0, 0);

// Earth
const earthObj = new THREE.Object3D();
scene.add(earthObj);
earthObj.add(earth);
earth.position.set(149.6, 0, 0);
earth.rotation.z += 0.383972

// Mars
const marsObj = new THREE.Object3D();
scene.add(marsObj);
marsObj.add(mars);
mars.position.set(227.9, 0, 0);

// Jupiter
const jupiterObj = new THREE.Object3D();
scene.add(jupiterObj);
jupiterObj.add(jupiter);
jupiter.position.set(778.6, 0, 0);

// Saturn
const saturnObj = new THREE.Object3D();
scene.add(saturnObj);
saturnObj.add(saturn);
saturnObj.add(saturnRing);
saturn.position.set(1433.5, 0, 0);
saturnRing.position.set(1433.5, 0, 0);

// Uranus
const uranusObj = new THREE.Object3D();
scene.add(uranusObj);
uranusObj.add(uranus);
uranus.position.set(2872.5, 0, 0);

// Neptune
const neptuneObj = new THREE.Object3D();
scene.add(neptuneObj);
neptuneObj.add(neptune);
neptune.position.set(4495.1, 0, 0);


// Do all animation in this function
function animate() {
    requestAnimationFrame(animate);

    sun.rotation.y += 0.005;


	// planet.rotation.y += 1 radian / num days
	// planetObj.rotation.y += orbital angular velocity
	// Mercury
	mercury.rotation.y += 0.00001695;
	mercuryObj.rotation.y += 0.008264;

	// Venus
	venus.rotation.y -= 0.000004444;
	venusObj.rotation.y += 0.003232;

	// Earth
	earth.rotation.y += 0.001;
	earthObj.rotation.y += 0.001992;

	// Mars
	mars.rotation.y += 0.0009732;
	marsObj.rotation.y += 0.001059;

	// Jupiter
	jupiter.rotation.y -= 0.0023809;
	jupiterObj.rotation.y += 0.0001673;

	// Saturn
	saturn.rotation.y += 0.00217391;
	saturnObj.rotation.y += 0.00009294;

	// Uranus
	uranus.rotation.y += 0.00140845;
	uranusObj.rotation.y += 0.0000237;

	// Neptune
	neptune.rotation.y += 0.0014925;
	neptuneObj.rotation.y += 0.00001208;


    renderer.render(scene, camera);
}

animate();