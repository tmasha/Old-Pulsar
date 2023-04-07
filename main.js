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
const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 10000 );
camera.position.set(0, 0, 50);

// set up renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// set up global controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.update();

// creates clock needed to track time
const clock = new THREE.Clock();

// This function creates a celestial body
// PARAMETERS;
// bodyName: The name of the body as a lowercase String (for example: "earth")
// bodyRadius: The radius of the body (for example: 20.0)
// distance: The body's distance from the Sun (for example: 100.0)
// ringRadii: A list containing the inner and outer ring radii (for example: {innerRadius: 10, outerRadius: 20})



// Create a representation for the object's orbit
// distance: distance from the Sun


// Create a representation for the orbit
// PARAMETERS
// a: semi-major axis in million km
// b: semi-major axis in million km
// tilt: the axial tilt in degrees (i.e. 23.44)
// inclination: the orbital inclination to the ecliptic in degrees (i.e. 7.155)
function createOrbit(body, a, b, inclination) {
    
	// eccentricity = Math.sqrt(1 - (b*b) / (a*a))
    // create ellipse curve for orbit
    const curve = new THREE.EllipseCurve(
        0, 0, // x, y
        a, b, // xRadius, yRadius
        0, 2 * Math.PI, // startAngle, endAngle
        true, // clockwise
        0 // rotation
    );
	
	// total rotation of the orbit around the x axis
    inclination *= Math.PI / 180;
	const totalOrbitRotationY = inclination + (Math.PI / 2);
		
    // create orbit path from curve
    const orbitPath = curve.getPoints(100000);
    const orbitGeom = new THREE.BufferGeometry().setFromPoints(orbitPath);
	orbitGeom.rotateX(totalOrbitRotationY);

    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff });
    const orbit = new THREE.Line(orbitGeom, orbitMat);
	// add orbit to scene
    scene.add(orbit);


	return orbitGeom;
}


function createBody(bodyName, bodyRadius, orbitParameters, ringRadii) {

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

	const orbit = createOrbit(
		bodyName, 
		orbitParameters.a,
		orbitParameters.b,
		orbitParameters.inclination);

	// this if statement is run if the ring's inner and outer radii are passed in a list
	if (ringRadii) {
		
		const ring = createRing(bodyName, ringRadii);

		// Add the ring to the pivot and set its distance from the Sun
		scene.add(ring);
		// ring.position.set(distance, 0, 0);
		ring.rotateX(0.5 * Math.PI);

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

// set the orbital period and rotation period
// PARAMETERS
// body: the body we want to modify (example: earth)
// yearLength: the year length in Earth days (i.e. 365)
// dayLength: the day length in Earth days (i.e. 1)

function setPeriods(body, dayLength, yearLength) {
	
	// orbitalPeriod: orbital period in radians/seconds
	// rotationPeriod: rotation period in radians/seconds
	var orbitalPeriod = (Math.PI * 2) / (yearLength * 86400);
	var rotationPeriod = (Math.PI * 2) / (dayLength * 86400);

	// Scale it so it doesn't take a gorillion years for anything to happen lmfao
	const scale = 250;
	orbitalPeriod *= scale;
	rotationPeriod *= scale;

	// implement each accordingly
	body.pivot.rotation.y += orbitalPeriod;
	body.body.rotation.y += rotationPeriod;

}

// set the axial tilt and orbital inclination
// PARAMETERS
// body: the body we want to modify (example: earth)
// tilt: the axial tilt in degrees (i.e. 23.44)
// inclination: the orbital inclination to the ecliptic in degrees (i.e. 7.155)
/* function setTilts(body, tilt, inclination) {
	// convert to radians
	tilt *= Math.PI / 180;
	inclination *= Math.PI / 180;

	// set each accordingly
	body.body.rotation.x += tilt;
	body.pivot.rotation.x += inclination;
	// body.orbit.rotation.x += inclination;
}
*/

// Sun
const sunGeom = new THREE.SphereGeometry(5);
const sunMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);
const pointLight = new THREE.PointLight(0xffffff, 1.3, 0);



/*
const venus = createBody("venus", 3, 50);
// setTilts(venus, 2.64, 3.39);

const earth = createBody("earth", 3, 75);
// setTilts(earth, 23.439, 0);

const mars = createBody("mars", 1.5, 100);
// setTilts(mars, 25.19, 1.85);

const jupiter = createBody("jupiter", 10, 200);
// setTilts(jupiter, 3.13, 1.3);

const saturn = createBody("saturn", 9, 300, {innerRadius: 10, outerRadius: 20});
// setTilts(saturn, 26.73, 2.49);

const uranus = createBody("uranus", 6, 400);
// setTilts(uranus, 97.77, 0.77);

const neptune = createBody("neptune", 6, 500);
// setTilts(neptune, 28, 1.77);

const pluto = createBody("pluto", 1, 550);
// setTilts(pluto, 120, 17.2);
*/

// add wanted objects to scene
scene.add(sun);
scene.add(pointLight);


// body: body (i.e. Mercury)
// bufferGeometry: orbit
// orbitalPeriod: year length in days


function updateBodyPosition(body, orbitalPeriod, rotationPeriod) {
	// creates accurate orbital periods
	const timeConversionFactor = ( (2 * Math.PI) / (orbitalPeriod * 86400) ) * 100;
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
	if (body.ring) {
		body.ring.position.set(point.x, point.y, point.z);
	}
}

// Main planets
const mercury = createBody("mercury", 2.4397, {a: 57.91, b: 55.91, inclination: 7});
const venus = createBody("venus", 6.0518, {a: 108.209475, b: 108.208930, inclination: 3.39});
const earth = createBody("earth", 6.371, {a: 149.598262, b: 149.577461, inclination: 0});
const mars = createBody("mars", 3.3895, {a: 227.943824, b: 227.943824, inclination: 1.85});
const jupiter = createBody("jupiter", 69.911, {a: 778.340821, b: 778.340821, inclination: 1.30});
const saturn = createBody("saturn", 58.232, {a: 1426.666422, b: 1426.666422, inclination: 2.49}, {innerRadius: 66.9, outerRing: 136.775});

// Do all animation in this function
function animate() {
    requestAnimationFrame(animate);

	// Main planets (final parameter: year length in days)
	updateBodyPosition(mercury, 87.97);
	updateBodyPosition(venus, 224.70);
	updateBodyPosition(earth, 365.26);
	updateBodyPosition(mars, 686.98);
	updateBodyPosition(jupiter, 4332.59);
	updateBodyPosition(saturn, 10855.7);

	/*

	// Earth
	setPeriods(earth, 1, 365.256);

	// Mars
	setPeriods(mars, 1.02749125, 686.980);

	// Jupiter
	setPeriods(jupiter, 0.42, 4333);

	// Saturn
	setPeriods(saturn, 0.46, 10756);

	// Uranus
	setPeriods(uranus, 0.71, 30687);

	// Neptune
	setPeriods(neptune, 0.67, 60190);

	setPeriods(pluto, 6, 90520);
	*/
    renderer.render(scene, camera);
}

animate();