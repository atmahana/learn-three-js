import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as dat from "dat.gui";

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2( 0xcccccc, 0 )

const camera = new THREE.PerspectiveCamera(
  90,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; //enable webgl to render shadow
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

let element = document.getElementById("main");
element.appendChild(renderer.domElement);

// Camera control
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(-5, 2.5, 6);
controls.enableDamping = true;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.minDistance = 1;
controls.maxDistance = 20;
controls.maxPolarAngle = Math.PI / 2.1;
controls.update();

// skybox
const skyGeo = new THREE.SphereGeometry( 500, 60, 40 );
// invert the geometry on the x-axis so that all of the faces point inward
skyGeo.scale( - 1, 1, 1 );
const skyTexture = new THREE.TextureLoader().load( 'assets/sky.jpg' );
skyTexture.colorSpace = THREE.SRGBColorSpace;
const skyMat = new THREE.MeshBasicMaterial( { map: skyTexture, color: 0x17203f} );
const sky = new THREE.Mesh( skyGeo, skyMat );
scene.add( sky );

// RectAreaLight for shop signboard
RectAreaLightUniformsLib.init();
const signLight = new THREE.RectAreaLight(0xFFFFFF, 1, 2.7, 1);
signLight.position.set(0, 4.9, 0.8);
signLight.lookAt(0, 0, 0);
const signLightHelper = new RectAreaLightHelper(signLight);

// Directional lighting imitating sunlight
const dl = new THREE.DirectionalLight(0x7d89ff, 1);
dl.castShadow = true;
dl.position.set(-20, 20, 20);
dl.target.position.set(0, 0, 0);
const dlHelper = new THREE.DirectionalLightHelper(dl, 2, 0xFFFFFF);
// Hemisphere light for softer looking scene
const hl = new THREE.HemisphereLight(0x17203f, 0x080820, 0.5);
const hlHelper = new THREE.HemisphereLightHelper(hl, 2, 0xFFFFFF);

hl.position.set(0, 20, 0);
const lightGroup = new THREE.Group();
lightGroup.add(dl, hl, signLight);

// ground base texture
const map = new THREE.TextureLoader().load("assets/asphalt.jpg");

// ground bump texture
const bmap = new THREE.TextureLoader().load("assets/asphalt_bump.jpg");

// ground mesh
const groundGeo = new THREE.BoxGeometry(25, 0.2, 25);
const groundMat = new THREE.MeshPhongMaterial({
  map: map,
  bumpMap: bmap,
  bumpScale: 1.4,
  color: 0x737373,
});
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.receiveShadow = true; //default false: won't cast shadow

// main scene
scene.add(lightGroup);
scene.add(ground);

let car;
// Load 3D models 
function loadModel() {
  const loader = new GLTFLoader();

  loader.load("assets/japanese_restaurant.glb", (model1) => {
    const shop = model1.scene;
    shop.scale.set(0.5, 0.5, 0.5);
    shop.position.set(0, 0.15, -1)
    shop.traverse(
      (node) => {
        if (node.isMesh) {
          node.castShadow = true;
        }
        scene.add(model1.scene);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );
    loader.load(
      "assets/porsche.glb",
      (model2) => {
        car = model2.scene;
        car.position.set(0, 0.1, 3.5);
        car.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
          }
        });
        scene.add(model2.scene);
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );
  });
}

// dat.GUI starts
const gui = new dat.GUI();
const sceneControl = {
  density: 0.002,
  color: 0xCCCCCC,
  signHelper: false,
  signLightColor: 0xFFFFFF
}
// Scene GUI folder items
const sceneFolder = gui.addFolder("Scene");
sceneFolder.add(sceneControl, "density", 0, 0.15).name("Fog Density").onChange((e) => {
  scene.fog.density = e;
});
sceneFolder.addColor(sceneControl, 'color').name("Fog Color").onChange((e) => {
  scene.fog.color.set(e);
});
sceneFolder.addColor(sceneControl, 'signLightColor').name("Sign Light Color").onChange((e) => {
  signLight.color.set(e);
});
sceneFolder.add(sceneControl, "signHelper").name("Toggle Helper").onChange((e) => {
  if(e === true)
    lightGroup.add(signLightHelper);
  else
    lightGroup.remove(signLightHelper);
});

// Directional light GUI folder items
const dlControl = {
  x : -20,
  y : 0, 
  z : 20,
  intensity : 1,
  color: 0x7d89ff,
  helper: false
}
const dlFolder = gui.addFolder("Directional Light");
dlFolder.add(dlControl, 'x', -30, 30).name("X position").onChange((e) => {
  dl.position.x = e;
  dlHelper.update();
});
dlFolder.add(dlControl, 'y', 0, 20).name("Y position").onChange((e) => {
  dl.position.y = e;
  dlHelper.update();
});;
dlFolder.add(dlControl, 'z', -30, 30).name("Z position").onChange((e) => {
  dl.position.z = e;
  dlHelper.update();
});;
dlFolder.add(dlControl, 'intensity', 0, 1).name("Light Intensity").onChange((e) => {
  dl.intensity = e;
});
dlFolder.addColor(dlControl, "color").name("Light Color").onChange((e) => {
  dl.color.set(e);
});
dlFolder.add(dlControl, "helper").name("Toggle Helper").onChange((e) => {
  if(e === true)
    lightGroup.add(dlHelper);
  else
    lightGroup.remove(dlHelper);
});

// HemisphereLight GUI folder items
const hlControl = {
  skyColor: 0x17203f,
  groundColor: 0x080820,
  intensity:  0.5,
  helper: false,
}
const hlFolder = gui.addFolder("Hemisphere Light");
hlFolder.addColor(hlControl, "skyColor").name("Sky Color").onChange((e) => {
  hl.color.set(e);
  sky.material.color.set(e);
});
hlFolder.addColor(hlControl, "groundColor").name("Ground Color").onChange((e) => {
  hl.groundColor.set(e);
});
hlFolder.add(hlControl, "intensity", 0, 1).name("Light Intensity").onChange((e) => {
  hl.intensity = e;
});
hlFolder.add(hlControl, "helper").name("Toggle Helper").onChange((e) => {
  if(e === true)
    lightGroup.add(hlHelper);
  else
    lightGroup.remove(hlHelper);
});

// Car GUI folder items
const carControl = {
  bodyColor: 0x6F2020,
  wheelColor: 0x9B6E00,
}
const carFolder = gui.addFolder("Car");
carFolder.addColor(carControl, "bodyColor").name("Body Color").onChange((e) => {
  car.getObjectByName("bumper_rear2_CAR_PAINT_0").material.color.setHex(e);
});
carFolder.addColor(carControl, "wheelColor").name("Wheel Color").onChange((e) => {
  car.getObjectByName("wheel_fr001_CAR_PAINT001_0").material.color.setHex(e);
});
// dat.GUI ends

window.addEventListener(
  "resize",
  () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    // bloomComposer.setSize(window.innerWidth, window.innerHeight);
  },
  false
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
}

if (WebGL.isWebGLAvailable()) {
  animate();
  loadModel();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("main").appendChild(warning);
}
