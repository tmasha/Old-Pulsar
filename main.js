import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FlyControls } from 'three/addons/controls/FlyControls.js';

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
const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 100000);
camera.position.set(0, 0, 50);

// set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// set up camera controls
const controls = new FlyControls(camera, renderer.domElement);
controls.movementSpeed = 100;
controls.rollSpeed = 0.2;
controls.dragToLook = true;




// Create a representation for the orbit
// PARAMETERS
// a: semi-major axis in million km
// b: semi-major axis in million km
// tilt: the axial tilt in degrees (i.e. 23.44)
// inclination: the orbital inclination to the ecliptic in degrees (i.e. 7.155)
function createOrbit(body, a, e, inclination, lAN) {
	// eccentricity = Math.sqrt(1 - (b*b) / (a*a))
    // create ellipse curve for orbit
	var b = a * Math.sqrt(1 - e*e); 
    a *= 111;
	b *= 111;
	
	// total rotation of orbit around 
	lAN *= Math.PI / 180;

	const curve = new THREE.EllipseCurve(
        0, 0, // x, y
        a, b, // xRadius, yRadius
        0, 2 * Math.PI, // startAngle, endAngle
        true, // clockwise
        0 // rotation
    );
	
	// total rotation of the orbit around the x axis
	// convert inclination to radians first
    inclination *= Math.PI / 180;
	const totalOrbitRotationY = inclination + (Math.PI / 2);

		
    // create orbit path from curve
    const orbitPath = curve.getPoints(50000);
    const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPath);
	orbitGeom.rotateX(totalOrbitRotationY);
	orbitGeom.rotateY(lAN);

    const orbitMat = new THREE.LineBasicMaterial({ 
		color: 0xffffff,
		transparent: true,
		opacity: 0.5
	 });
    const orbit = new THREE.Line(orbitGeom, orbitMat);
	
	// add orbit to scene
    scene.add(orbit);
	
	// return the BUFFER GEOMETRY of the orbit
	return orbitGeom;
}

// sets the axial tilt of the planet (body, tilt in degrees)
function setTilt(body, tilt) {
	// convert to radians
	tilt *= Math.PI / 180;
	// set it
	body.rotation.x += tilt;
}

function createBody(bodyName, bodyRadius, orbitParameters, axialTilt, ringRadii) {

	// Create the body's geometry using the body's Radius
	const bodyGeom = new THREE.SphereGeometry(bodyRadius);
	// Create a path name for the body texture image file, then use that to make a body texture
	const bodyPath = "assets/maps/" + bodyName + ".png";
	const bodyTexture = new THREE.TextureLoader().load(bodyPath);
	// Use the body texture and body material to make a body mesh
	const bodyMat = new THREE.MeshStandardMaterial({
		map: bodyTexture,
	});
	// creates a body and add it to the scene
	const body = new THREE.Mesh(bodyGeom, bodyMat);
	scene.add(body);
	setTilt(body, axialTilt);

	const orbit = createOrbit(
		bodyName, 
		orbitParameters.a,
		orbitParameters.e,
		orbitParameters.i,
		orbitParameters.lAN);

	// this if statement is run if the ring's inner and outer radii are passed in a list
	if (ringRadii) {
		
		const ring = createRing(bodyName, ringRadii);

		// Add the ring to the pivot and set its distance from the Sun
		scene.add(ring);
		// ring.position.set(distance, 0, 0);
		ring.rotation.x += (0.5 * Math.PI) + (axialTilt * (Math.PI / 180));

		// return body, ring, and orbit
		return {body, orbit, ring}

	}

	// If ring is not rendered, just return a body and pivot
	return {body, orbit}
}

function createRing(bodyName, ringRadii) {
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
	return new THREE.Mesh(ringGeom, ringMat);
}

// Sun
const sunGeom = new THREE.SphereGeometry(5);
const sunMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const pointLight = new THREE.PointLight(0xffffff, 1.3, 0);

// add wanted objects to scene
scene.add(sun);
scene.add(pointLight);


// body: body (i.e. Mercury)
// orbitalPeriod: orbital period in days
// rotationPeriod: rotation period in days
function updateBodyPosition(body, orbitalPeriod, rotationPeriod) {
	
	// creates accurate orbital periods
	const timeConversionFactor = ( (2 * Math.PI) / (orbitalPeriod * 86400) ) * 300;

	// gets the time elapsed
	const time = performance.now() * timeConversionFactor;

	// retrieves position info from the orbit's buffer geometry
	const position = body.orbit.getAttribute('position');

  	// calculates the index of the point on the buffer geometry at the current time
  	const pointIndex = Math.floor((time % 1) * (position.count - 1));

  	// add the x, y, and z position at the current time to a point object
	const point = new THREE.Vector3();
  	point.x = position.getX(pointIndex);
  	point.y = position.getY(pointIndex);
  	point.z = position.getZ(pointIndex);

  	// set the position of the actual body to the point on the buffer geometry
  	body.body.position.set(point.x, point.y, point.z);
	
	// rotation of planet
	rotationPeriod = (2 * Math.PI) / rotationPeriod * 0.1;
	body.body.rotation.y += rotationPeriod * (Math.PI / 180);

	// modify ring position as well, if the ring exists
	if (body.ring) {
		body.ring.position.set(point.x, point.y, point.z);
		body.body.rotation.y += rotationPeriod * (Math.PI / 180);
	}
}

// name, radius, {semimajor axis, semiminor axis, inclination}, {ring inner radius, ring outer radius}
// Main Planets
const mercury = createBody("mercury", 2.4397, {a: 0.3871, e: 0.2056, i: 7, lAN: 48.331}, 0.034);
const venus = createBody("venus", 6.0518, {a: 0.7233, e: 0.0068, i: 3.39, lAN: 76.680}, 177.36);
const earth = createBody("earth", 6.371, {a: 1, e: 0.0167, i: 0, lAN: 348.379}, 23.44);
const mars = createBody("mars", 3.3895, {a: 1.5237, e: 0.0934, i: 1.85, lAN: 49.562}, 25.19);

const jupiter = createBody("jupiter", 69.911, {a: 5.2026, e: 0.0489, i: 1.30, lAN: 100.492}, 3.13);
const saturn = createBody("saturn", 58.232, {a: 9.5549, e: 0.0565, i: 2.49, lAN: 113.642}, 26.73, {innerRadius: 66.9, outerRadius: 136.775});
const uranus = createBody("uranus", 25.362, {a: 19.2184, e: 0.0457, i: 0.77, lAN: 74.006}, 97.77);
const neptune = createBody("neptune", 24.622, {a: 30.1104, e: 0.0113, i: 1.77, lAN: 131.784}, 28.32);

const ceres = createBody("ceres", 0.4762, {a: 2.7675, e: 0.076, i: 10.59, lAN: 80.393}, 4);
const pluto = createBody("pluto", 1.186, {a: 39.4821, e: 0.2488, i: 17.14, lAN: 110.303}, 112.53);
const eris = createBody("eris", 1.163, {a: 67.781, e: 0.4417, i: 44.05, lAN: 35.953}, 75);
const makemake = createBody("makemake", 0.715, {a: 45.7912, e: 0.155, i: 29.006, lAN: 79.380}, 10);
const haumea = createBody("haumea", 0.62, {a: 43.3351, e: 0.195, i: 28.19, lAN: 240.739}, 115);

// const sedna = createBody("sedna", 0.498, {a: 76.04, b: 506.7, inclination: 11.93, lAN: 114.273}, 1);
// const quaoar = createBody("quaoar", 0.555, {a: 43.39, b: 41.65, inclination: 7.99, lAN: 118.183}, 1);
// const gonggong = createBody("gonggong", 0.615, {a: 82.1, b: 39.2, inclination: 30.59, lAN: 184.856}, 1);
// const orcus = createBody("orcus", {a: 39.29, b: 38.54, inclination: 20.57, lAN: 70.132}, 1);

// Do all animation in this function
function animate() {
    requestAnimationFrame(animate);
	controls.update(0.05);

	// Main planets 
	// name, year (days), day (days)
	updateBodyPosition(mercury, 87.97, 58.6);
	updateBodyPosition(venus, 224.70, -243);
	updateBodyPosition(earth, 365.26, 1);
	updateBodyPosition(mars, 686.98, 1.03);
	updateBodyPosition(jupiter, 4332.59, 0.41);
	updateBodyPosition(saturn, 10855.7, 0.44);
	updateBodyPosition(uranus, 30687.15, 0.72);
	updateBodyPosition(neptune, 60190.03, 0.67);

	// Dwarf planets
	updateBodyPosition(ceres, 1682.14, 0.38);
	updateBodyPosition(pluto, 90560.73, -6.4);
	updateBodyPosition(eris, 203810, 1.08);
	updateBodyPosition(makemake, 112897, 0.94);
	updateBodyPosition(haumea, 103721, 0.16);

	// updateBodyPosition(sedna, 4163850, 1);
	// updateBodyPosition(quaoar, 287.5, 0.736);
	// updateBodyPosition(gonggong, 558.5, 1);
	// updateBodyPosition(orcus, 247.2, 1);


    renderer.render(scene, camera);
}

animate();