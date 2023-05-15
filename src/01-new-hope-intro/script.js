import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import textToDisplay from './textToDisplay';
import * as dat from 'lil-gui';
import * as THREE from 'three';
import './style.css';

// Gui
const gui = new dat.GUI();
const guiParameters = {};
guiParameters.speed = 0.008;

gui.add(guiParameters, 'speed').min(0).max(0.02).step(0.001).name('speed');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Textures
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/1.png');

// Particles
const particlesGeometry = new THREE.BufferGeometry();

const count = 2000;
const positions = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.001;
const space = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(space);

// Font
const animatedText = [];
const fontStart = 7;
const fontIncrement = 1.5;

const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

const createFont = (position, str) => {
  const fontLoader = new FontLoader();
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(str, {
      font,
      size: 0.8,
      height: 0.2,
      curveSegments: 5,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 4,
    });

    textGeometry.center();

    const text = new THREE.Mesh(textGeometry, material);
    text.rotation.x = Math.PI * -0.5;
    text.position.z = fontStart + fontIncrement * position;
    scene.add(text);

    animatedText.push({
      text,
    });
  });
};

const startAnimation = () => {
  if (animatedText.length) {
    resetAnimation();
  }
  textToDisplay.map((text, index) => createFont(index, text));
};

const resetAnimation = () => {
  for (const object of animatedText) {
    //Remove mesh
    scene.remove(object.text);
  }
  animatedText.splice(0, animatedText.length);
};

guiParameters.start = startAnimation;
guiParameters.reset = resetAnimation;

gui.add(guiParameters, 'start');
gui.add(guiParameters, 'reset');

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
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

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 10, 8);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  controls.update();

  for (const object of animatedText) {
    object.text.position.z += -deltaTime * 100 * guiParameters.speed;
  }

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
