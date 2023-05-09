import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three';

// Navigation control
let navigation = 'y';
const directionX = document.getElementById('directionX');
const directionY = document.getElementById('directionY');

directionX.addEventListener('click', () => {
  directionX.style.opacity = '0.6';
  directionY.style.opacity = '1';
  navigation = 'x';
});

directionY.addEventListener('click', () => {
  directionX.style.opacity = '1';
  directionY.style.opacity = '0.6';
  navigation = 'y';
});

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Models
let product = null;
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  '/models/MaterialsVariantsShoe/glTF/MaterialsVariantsShoe.gltf',
  (gltf) => {
    product = gltf.scene;
    window.innerWidth <= 500
      ? product.scale.set(8, 8, 8)
      : product.scale.set(10, 10, 10);
    scene.add(product);
  }
);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Sizes
const sizes = {
  width: window.innerWidth <= 500 ? 375 : 500,
  height: window.innerWidth <= 500 ? 375 : 500,
};

window.addEventListener('resize', () => {
  window.innerWidth <= 500
    ? product.scale.set(8, 8, 8)
    : product.scale.set(10, 10, 10);

  // Update sizes
  (sizes.width = window.innerWidth <= 500 ? 375 : 500),
    (sizes.height = window.innerWidth <= 500 ? 375 : 500),
    // Update camera
    (camera.aspect = sizes.width / sizes.height);
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});

renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 3;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  if (product)
    navigation === 'y'
      ? (product.rotation.y = elapsedTime * 0.2)
      : (product.rotation.x = elapsedTime * 0.2);

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
