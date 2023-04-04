import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
camera.position.set(1200, -250, 20000);
// FoV, aspect ratio (width/height), cutoff values

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// Skybox
const skyboxGeom = new THREE.BoxGeometry( 10000, 10000, 10000 );
const skyboxMaterial = new THREE.MeshBasicMaterial( { color:0x000000 } );
const skybox = new THREE.Mesh( skyboxGeom, skyboxMaterial );

// Main Sun
const sunGeom = new THREE.SphereGeometry( 5, 10, 10 );
const sunMaterial = new THREE.MeshBasicMaterial( { color:0x111111 } );
const sun = new THREE.Mesh(sunGeom, sunMaterial);


function animate() {
    requestAnimationFrame(animate);
    // do all animation here

    //skybox
    skybox.rotation.x += 0.005;
    skybox.rotation.y += 0.005;


    sun.rotation.x += 0.01;
    sun.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();

// add wanted objects to scene
scene.add(sun);


camera.position.set(0,0,10);