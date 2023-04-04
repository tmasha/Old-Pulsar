import * as THREE from 'three';

// create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// FoV, aspect ratio (width / height), cutoff values
const camera = new THREE.PerspectiveCamera( 55, window.innerWidth / window.innerHeight, 45, 30000 );
camera.position.set( 1200, -250, 20000 );

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Skybox
const skyboxGeom = new THREE.BoxGeometry( 10000, 10000, 10000 );
const skyboxMaterial = new THREE.MeshBasicMaterial( { color:0xffffff } );
const skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );

// Main Sun
const sunGeom = new THREE.SphereGeometry( 5, 10, 10 );
const sunMaterial = new THREE.MeshBasicMaterial( { color:0x111111 } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);

// 2 ways to create a line
const sunEdges = new THREE.EdgesGeometry(sunGeom);
const sunOutlineMaterial = new THREE.LineBasicMaterial({color: 0xfff700});
const sunOutline = new THREE.LineSegments(sunEdges, sunOutlineMaterial);

// do all animation in this function
function animate() {
    requestAnimationFrame(animate);

    //skybox
    skybox.rotation.x += 0.005;
    skybox.rotation.y += 0.005;

    sun.rotation.y += 0.005;

    sunOutline.rotation.y += 0.005;

    renderer.render(scene, camera);
}

// add wanted objects to scene
scene.add(sun);
scene.add(skybox);
scene.add(sunOutline);

animate();