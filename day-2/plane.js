import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x153038)
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;
camera.position.y = 3;

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
let element = document.getElementById("plane");
element.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(15, 15);
const material = new THREE.MeshBasicMaterial({
  color: "yellow",
  side: THREE.DoubleSide,
});
const plane = new THREE.Mesh(geometry, material);
plane.rotation.set(-1.6, 0, 0);

const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshMatcapMaterial({ color: "red" });
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.position.set(0, 0.5, 0);

const sphereGeo = new THREE.SphereGeometry( 1, 32, 16 ); 
const sphereMat = new THREE.MeshMatcapMaterial( { color: 'green' } ); 
const sphere = new THREE.Mesh( sphereGeo, sphereMat ); 
sphere.position.set(6, 1, 6)

const pyramidGeo = new THREE.ConeGeometry(1, 2, 3, 1);
const pyramidMat = new THREE.MeshMatcapMaterial({color: 'cyan'});
const pyramid = new THREE.Mesh(pyramidGeo, pyramidMat);
pyramid.position.set(-6, 0.8, -6)

const group = new THREE.Group();
group.add(plane, cube, sphere, pyramid);
scene.add(group);

function animate() {
  requestAnimationFrame(animate);

  group.rotation.y -= 0.005

  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("plane").appendChild(warning);
}
