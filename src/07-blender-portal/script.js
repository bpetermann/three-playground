import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'lil-gui';
import firefliesVertexShader from './shaders/fireflies/vertex.glsl';
import firefliesFragmentShader from './shaders/fireflies/fragment.glsl';
import portalVertexShader from './shaders/portal/vertex.glsl';
import portalFragmentShader from './shaders/portal/fragment.glsl';

// Gui
const gui = new dat.GUI();
const guiParameters = {};

guiParameters.speed = 0.004;
guiParameters.red = 0.5;
guiParameters.blue = 1.0;

gui
  .add(guiParameters, 'red')
  .min(0)
  .max(1)
  .step(0.001)
  .onChange(() => {
    portalLightMaterial.uniforms.uRedContent.value = guiParameters.red;
  });

gui
  .add(guiParameters, 'blue')
  .min(0)
  .max(1)
  .step(0.001)
  .onChange(() => {
    portalLightMaterial.uniforms.uBlueContent.value = guiParameters.blue;
  });

gui.add(guiParameters, 'speed').min(0.002).max(0.1).step(0.001);

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
const portalLightMaterial = new THREE.ShaderMaterial({
  vertexShader: portalVertexShader,
  fragmentShader: portalFragmentShader,
  uniforms: {
    uDegree: { value: guiParameters.speed },
    uRedContent: { value: guiParameters.red },
    uBlueContent: { value: guiParameters.blue },
  },
  side: THREE.DoubleSide,
});

// Model
gltfLoader.load('/blender/scene.glb', (gltf) => {
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

// Fireflies
const firefliesGeometry = new THREE.BufferGeometry();
const firefliesCount = 30;
const positionArray = new Float32Array(firefliesCount * 3);
const scaleArray = new Float32Array(firefliesCount);

for (let i = 0; i < firefliesCount; i++) {
  positionArray[i * 3 + 0] = (Math.random() - 0.5) * 4;
  positionArray[i * 3 + 1] = Math.random() * 1.5;
  positionArray[i * 3 + 2] = (Math.random() - 0.5) * 4;

  scaleArray[i] = Math.random();
}

firefliesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positionArray, 3)
);

firefliesGeometry.setAttribute(
  'aScale',
  new THREE.BufferAttribute(scaleArray, 1)
);

const firefliesMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
    uSize: { value: 100 },
  },
  vertexShader: firefliesVertexShader,
  fragmentShader: firefliesFragmentShader,
  transparent: true,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});

const fireflies = new THREE.Points(firefliesGeometry, firefliesMaterial);
scene.add(fireflies);

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

  firefliesMaterial.uniforms.uPixelRatio.value = Math.min(
    window.devicePixelRatio,
    2
  );
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

  // Update materials
  firefliesMaterial.uniforms.uTime.value = elapsedTime;
  portalLightMaterial.uniforms.uDegree.value =
    Math.sin(elapsedTime * guiParameters.speed) * 50;

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
