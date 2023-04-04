import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x003D66);

const camera = new THREE.PerspectiveCamera( 80, window.innerWidth / window.innerHeight, 0.1, 1000 );
// FoV, aspect ratio (width/height), cutoff values

const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

// cube
const geometry = new THREE.BoxGeometry(1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0xD500FF } );
const cube = new THREE.Mesh(geometry, material);

// 2 ways to create a line
const edges = new THREE.EdgesGeometry(geometry);
const lineMaterial = new THREE.LineBasicMaterial({color: 0xA400FF});
const line = new THREE.LineSegments(edges, lineMaterial);

const points = [];
points.push(new THREE.Vector3(-1, 0, 0));
points.push(new THREE.Vector3(0, 1, 0));
points.push(new THREE.Vector3(1, 0, 0));
const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
const line2 = new THREE.LineSegments(edges, lineMaterial);

// cylinder
const cylGeometry = new THREE.CylinderGeometry(1, 1, 0.5, 32);
const cylinder = new THREE.Mesh(cylGeometry, material);
cylinder.position.set(5, 5, 0);

// sphere
const SphereGeom = new THREE.SphereGeometry(2, 32, 16);
const sphere = new THREE.Mesh(SphereGeom, material);
scene.add(sphere);
sphere.position.set(-5, -5, 0);

function animate() {
    requestAnimationFrame(animate);
    // do all animation here
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    line.rotation.x += 0.01;
    line.rotation.y += 0.01;

    line2.rotation.x += 0.01;
    line2.rotation.y += 0.01;

    cylinder.rotation.x += 0.05;

    sphere.rotation.y += 0.01;

    renderer.render(scene, camera);
}

animate();


scene.add(cube);
scene.add(line);
scene.add(line2);
scene.add(cylinder);
scene.add(sphere);

camera.position.set(0,0,10);