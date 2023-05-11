import * as THREE from "three";
import WebGL from "three/addons/capabilities/WebGL.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import * as dat from "dat.gui";

function init() {
  const loadingContainer = document.querySelector(".wrapper");
  console.log(loadingContainer);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xcccccc, 0);

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

  const planeGeo = new THREE.BoxGeometry(1, 0.1, 1);
  const planeMat = new THREE.MeshPhongMaterial();
  const plane = new THREE.Mesh(planeGeo, planeMat);
  scene.add(plane);

  // Camera control
  const controls = new OrbitControls(camera, renderer.domElement);
  camera.position.set(0, 2, 0);
  controls.enableDamping = true;
  controls.update();

  function skybox() {
    const skyGeo = new THREE.SphereGeometry(500, 60, 40);
    // invert the geometry on the x-axis so that all of the faces point inward
    skyGeo.scale(-1, 1, 1);
    const skyTexture = new THREE.TextureLoader().load("/sky.jpg");
    skyTexture.colorSpace = THREE.SRGBColorSpace;
    const skyMat = new THREE.MeshBasicMaterial({
      map: skyTexture,
    });
    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
  }

  function directLight(){
    const dl = new THREE.DirectionalLight(0xFFFFFF, 1);
    const dlHelper = new THREE.DirectionalLightHelper(dl, 2);
    dl.position.set(0, 3, 5);
    dl.target.position.set(0, 0, 0);
    scene.add(dl);
    scene.add(dlHelper);
  }

  function hemisphereLight() {
    // Hemisphere light for softer looking scene
    const hl = new THREE.HemisphereLight(0x17203f, 0x080820, 0.5);
    const hlHelper = new THREE.HemisphereLightHelper(hl, 2, 0xffffff);

    hl.position.set(0, 5, 0);
    scene.add(hl);
    scene.add(hlHelper);
  }

  let mixer;
  // Load 3D models
  function loadModel() {
    const loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath("node_modules/three/examples/jsm/libs/draco/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/knight.glb",
      (model) => {
        const knight = model.scene;
        knight.traverse((child) => {
          if (child.isMesh && child.name == "Cube") child.visible = false;
          if (child.isMesh) child.castShadow = true;
        });
        mixer = new THREE.AnimationMixer(knight);
        const clips = model.animations;
        // const clip = THREE.AnimationClip.findByName(clips, 'Dance')
        // const action = mixer.clipAction(clip);
        // action.play();

        clips.forEach(clip => {
          const name = clip.name.toLowerCase();
          const action = mixer.clipAction(clip);
          action.play();
        });

        scene.add(knight);
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
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
    if(mixer) mixer.update(clock.getDelta());
  }
  directLight();
  hemisphereLight();
  skybox();
  loadModel();
  animate();
}

if (WebGL.isWebGLAvailable()) {
  init();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.getElementById("main").appendChild(warning);
}
