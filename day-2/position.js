import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff)

const camera = new THREE.PerspectiveCamera(
  40,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
let element = document.getElementById("position")
element.appendChild(renderer.domElement);

const geo1 = new THREE.BoxGeometry(1, 1, 1);
const mat1 = new THREE.MeshBasicMaterial({ color: "red" });
const cube1 = new THREE.Mesh(geo1, mat1);
cube1.position.set(-5, 2, 0);
scene.add(cube1);

const geo2 = new THREE.BoxGeometry(1, 1, 1);
const mat2 = new THREE.MeshBasicMaterial({ color: "orange" });
const cube2 = new THREE.Mesh(geo2, mat2);
cube2.position.set(0, 2, 0);
scene.add(cube2);

const geo3 = new THREE.BoxGeometry(1, 1, 1);
const mat3 = new THREE.MeshBasicMaterial({ color: "blue" });
const cube3 = new THREE.Mesh(geo3, mat3);
cube3.position.set(5, 2, 0);
scene.add(cube3);

const geo4 = new THREE.BoxGeometry(1, 1, 1);
const mat4 = new THREE.MeshBasicMaterial({ color: "green" });
const cube4 = new THREE.Mesh(geo4, mat4);
cube4.position.set(-5, 0, 0);
scene.add(cube4);

const geo5 = new THREE.BoxGeometry(1, 1, 1);
const mat5 = new THREE.MeshBasicMaterial({ color: "yellow" });
const cube5 = new THREE.Mesh(geo5, mat5);
cube5.position.set(0, 0, 0);
scene.add(cube5);

const geo6 = new THREE.BoxGeometry(1, 1, 1);
const mat6 = new THREE.MeshBasicMaterial({ color: "cyan" });
const cube6 = new THREE.Mesh(geo6, mat6);
cube6.position.set(5, 0, 0);
scene.add(cube6);

const geo7 = new THREE.BoxGeometry(1, 1, 1);
const mat7 = new THREE.MeshBasicMaterial({ color: "grey" });
const cube7 = new THREE.Mesh(geo7, mat7);
cube7.position.set(-5, -2, 0);
scene.add(cube7);

const geo8 = new THREE.BoxGeometry(1, 1, 1);
const mat8 = new THREE.MeshBasicMaterial({ color: "red" });
const cube8 = new THREE.Mesh(geo8, mat8);
cube8.position.set(0, -2, 0);
scene.add(cube8);

const geo9 = new THREE.BoxGeometry(1, 1, 1);
const mat9 = new THREE.MeshBasicMaterial({ color: "red" });
const cube9 = new THREE.Mesh(geo9, mat9);
cube9.position.set(5, -2, 0);
scene.add(cube9);

camera.position.z = 15;

function animate() {
  requestAnimationFrame(animate);

  cube1.rotation.x -= 0.01;
  cube1.rotation.y += 0.01;

  cube2.rotation.x += 0.01;
  cube2.rotation.y -= 0.01;

  cube3.rotation.x += 0.01;
  cube3.rotation.y += 0.01;

  cube4.rotation.x += 0.01;
  cube4.rotation.y -= 0.01;

  cube5.rotation.x -= 0.01;
  cube5.rotation.y -= 0.01;

  cube6.rotation.x -= 0.01;
  cube6.rotation.y += 0.01;

  cube7.rotation.x -= 0.01;
  cube7.rotation.y += 0.01;

  cube8.rotation.x -= 0.01;
  cube8.rotation.y -= 0.01;

  cube9.rotation.x -= 0.01;
  cube9.rotation.y += 0.01;

  renderer.render(scene, camera);
}

if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("position").appendChild(warning);
}
