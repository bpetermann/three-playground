import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Loader
const gltfLoader = new GLTFLoader();

// Textures
const texture = textureLoader.load('/blender/baking.jpg');
texture.flipY = false;
texture.colorSpace = THREE.SRGBColorSpace;

// Materials
const material = new THREE.MeshBasicMaterial({ map: texture });
const poleLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffe5 });
const portalLightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

// Model
gltfLoader.load('/blender/portal.glb', (gltf) => {
  gltf.scene.traverse((child) => {
    child.material = material;
  });

  gltf.scene.children.find(({ name }) => name === 'portalLight').material =
    portalLightMaterial;
  gltf.scene.children.find(({ name }) => name === 'portLightA').material =
    poleLightMaterial;
  gltf.scene.children.find(({ name }) => name === 'portLightB').material =
    poleLightMaterial;

  scene.add(gltf.scene);
});

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

// Animate
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
