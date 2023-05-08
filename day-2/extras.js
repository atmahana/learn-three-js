import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1122)

const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //enable webgl to render shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

let element = document.getElementById("extras");
element.appendChild(renderer.domElement);

// Camera control
const controls = new OrbitControls( camera, renderer.domElement );
camera.position.set( 0, 4, 15 );
controls.update();

// Directional lighting imitating sunlight 
const dl = new THREE.DirectionalLight( 0xffffff, 1 );
dl.castShadow = true;
dl.position.set(3, 6, 0);
dl.target.position.set(0,0,0);
// Hemisphere light for softer looking scene
const hl = new THREE.HemisphereLight( 0xffffe0, 0x080820, 1 );

// case
const cubeGeo = new RoundedBoxGeometry( 3, 5, 5, 7, 0.2 );
const cubeMat = new THREE.MeshLambertMaterial();
const cube = new THREE.Mesh(cubeGeo, cubeMat);
cube.castShadow = true;
cube.receiveShadow = false;

// side panel
const sideGeo = new RoundedBoxGeometry(0.3, 4.5, 4.4, 7, 0.2);
const sideMat = new THREE.MeshBasicMaterial({color: 0x292929}); //0x292929
const side = new THREE.Mesh(sideGeo, sideMat);
side.position.set(-1.4, 0, -0.1);

// Fan blade starts
const bladeGeo1 = new THREE.CircleGeometry(1, 6, 0, 0.7);
const bladeMat1 = new THREE.MeshMatcapMaterial({color: 0x00000});
const blade1 = new THREE.Mesh(bladeGeo1, bladeMat1);

const bladeGeo2 = new THREE.CircleGeometry(1, 6, 1.3, 0.7);
const bladeMat2 = new THREE.MeshMatcapMaterial({color: 0x00000});
const blade2 = new THREE.Mesh(bladeGeo2, bladeMat2);

const bladeGeo3 = new THREE.CircleGeometry(1, 6, 2.7, 0.7);
const bladeMat3 = new THREE.MeshMatcapMaterial({color: 0x00000});
const blade3 = new THREE.Mesh(bladeGeo3, bladeMat3);

const bladeGeo4 = new THREE.CircleGeometry(1, 6, 4, 0.7);
const bladeMat4 = new THREE.MeshMatcapMaterial({color: 0x00000});
const blade4 = new THREE.Mesh(bladeGeo4, bladeMat4);

const bladeGeo5 = new THREE.CircleGeometry(1, 6, 5.2, 0.7);
const bladeMat5 = new THREE.MeshMatcapMaterial({color: 0x00000});
const blade5 = new THREE.Mesh(bladeGeo5, bladeMat5);
// Fan blade ends

// Ground
const planeGeo = new THREE.BoxGeometry(15, 0.2, 15);
const planeMat = new THREE.MeshPhongMaterial({color: 0x529dbf});
const plane = new THREE.Mesh(planeGeo, planeMat);

plane.receiveShadow = true; //default false: won't cast shadow
plane.position.set(0, -4, 0);

// Grouping blades into one object: fan
const fan = new THREE.Group();
fan.add(blade1, blade2, blade3, blade4, blade5);
fan.position.set(0.02, -0.7, 2.51);

// Grouping component into one object: pc
const pc = new THREE.Group();
pc.add(cube, fan, side);

// main group to display on canvas
const mainGroup = new THREE.Group();
mainGroup.add(pc, plane, dl, dl.target, hl);
mainGroup.rotation.set(0, 0.5, 0)
scene.add(mainGroup);

function animate() {
    requestAnimationFrame(animate);
    fan.rotation.z -= 0.1;
    mainGroup.rotation.y -= -0.005;
    renderer.render(scene, camera);
  }
  
  if (WebGL.isWebGLAvailable()) {
    animate();
  } else {
    const warning = WebGL.getWebGLErrorMessage();
    document.getElementById("extras").appendChild(warning);
  }