import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";

function init() {

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xcccccc, 0);
  scene.background = new THREE.Color(0xa8def0);

  const camera = new THREE.PerspectiveCamera(
    70,
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

  function generateFloor() {
    const floorGeo = new THREE.BoxGeometry(10, 0.05, 10);
    const floorMat = new THREE.MeshPhongMaterial({  color: 0x737373 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.receiveShadow = true;
    scene.add(floor);
  }

  // Camera control
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0.5, 2, 3);
  controls.target.set(0,1,0)
  controls.enableDamping = true;
  controls.minDistance = 1;
  controls.maxDistance = 5;
  controls.maxPolarAngle = Math.PI / 3;
  controls.update();

  function directLight() {
    const dl = new THREE.DirectionalLight(0xffffff, 2);
    const dlHelper = new THREE.DirectionalLightHelper(dl, 1);
    dl.castShadow = true;
    dl.position.set(0, 5, 2);
    dl.target.position.set(0, 0, 0);
    dlHelper.update();
    scene.add(dl);
    scene.add(dlHelper);
  }

  function hemisphereLight() {
    const hl = new THREE.HemisphereLight(0xffffff, 0x080820, 2);
    const hlHelper = new THREE.HemisphereLightHelper(hl, 1);
    hl.position.set(0, 5, 0);
    scene.add(hl);
    scene.add(hlHelper);
  }

  let mixer, characterControls;
  function loadModel() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath("node_modules/three/examples/jsm/libs/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/Soldier.glb",
      (model) => {
        const gltf = model.scene;
        gltf.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
          }
        });
        scene.add(gltf);

        mixer = new THREE.AnimationMixer(gltf);
        const animations = model.animations;
        
        let animationsMap = new Map();
        let filter = animations.filter((clip) => clip.name != "TPose");
        filter.forEach(clip => {
          animationsMap.set(clip.name, mixer.clipAction(clip));
          let action = mixer.clipAction(clip);
          action.play();
        });
      },
      undefined,
      (err) => {
        console.error(err);
      }
    );
  }

  window.addEventListener(
    "resize",
    () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    },
    false
  );

  const clock = new THREE.Clock();
  function animate() {
    if(mixer) mixer.update(clock.getDelta());
    controls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }
  directLight();
  hemisphereLight();
  generateFloor();
  loadModel();
  animate();
}

if (WebGL.isWebGLAvailable()) {
  init();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("main").appendChild(warning);
}
