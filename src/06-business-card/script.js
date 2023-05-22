import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import * as dat from 'lil-gui';
import CANNON from 'cannon';

// Debug
const gui = new dat.GUI();
const guiParameters = {};
guiParameters.color = true;

guiParameters.email = 'john.doe@gmail.com';
guiParameters.telephone = '518-308-3928';
guiParameters.name = 'John Doe';
guiParameters.job = 'Frontend Developer';
guiParameters.address = 'Upper West Side, New York, NY 10024, USA';

guiParameters.create = () => {
  if (businesCardData.length) {
    const { coodinates, text, size } =
      businesCardData[businesCardData.length - 1];
    create(coodinates, text, size);
    businesCardData.pop();
  }
};

const businesCardData = [
  {
    coodinates: {
      x: 0,
      y: 1,
      z: 3.5,
    },
    text: guiParameters.address,
  },
  {
    coodinates: {
      x: 0,
      y: 1,
      z: 0.25,
    },
    text: guiParameters.job,
  },
  {
    coodinates: {
      x: 0,
      y: 1,
      z: -1,
    },
    text: guiParameters.name,
    size: 'large',
  },
  {
    coodinates: {
      x: 5,
      y: 1,
      z: -3.5,
    },
    text: guiParameters.telephone,
  },
  {
    coodinates: {
      x: -5,
      y: 1,
      z: -3.5,
    },
    text: guiParameters.email,
  },
];

gui
  .add(guiParameters, 'name')
  .onChange(() => {
    businesCardData[2].text = guiParameters.name;
  })
  .name('Name');
gui
  .add(guiParameters, 'email')
  .onChange(() => {
    businesCardData[4].text = guiParameters.email;
  })
  .name('Email');
gui
  .add(guiParameters, 'telephone')
  .onChange(() => {
    businesCardData[3].text = guiParameters.telephone;
  })
  .name('Telephone');
gui
  .add(guiParameters, 'job')
  .onChange(() => {
    businesCardData[1].text = guiParameters.job;
  })
  .name('Job');
gui
  .add(guiParameters, 'address')
  .onChange(() => {
    businesCardData[0].text = guiParameters.address;
  })
  .name('Address');

gui.add(guiParameters, 'create');

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Matcap
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('/textures/matcaps/3.png');

// Physics World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Materials
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);

world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// Card
const cardShape = new CANNON.Plane();
const cardBody = new CANNON.Body();
cardBody.mass = 0;
cardBody.addShape(cardShape);
cardBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
world.addBody(cardBody);

const cardMaterial = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  side: THREE.DoubleSide,
  uniforms: {
    uColor: { value: guiParameters.color },
  },
});

const card = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), cardMaterial);
card.rotation.x = -Math.PI * 0.5;
scene.add(card);

// GUI
gui
  .add(guiParameters, 'color')
  .onChange(() => {
    cardMaterial.uniforms.uColor.value = guiParameters.color;
  })
  .name('Color');

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.position.y = window.innerWidth <= 928 ? 24 : 14;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.y = window.innerWidth <= 928 ? 24 : 14;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Material
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });

// Background
const bgGeometries = [];

for (let i = 0; i < 100; i++) {
  const torusGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const coneGeometry = new THREE.ConeGeometry(0.3, 0.2, 32);

  torusGeometry.rotateX(Math.random() * Math.PI);
  torusGeometry.rotateY(Math.random() * Math.PI);

  coneGeometry.rotateX(Math.random() * Math.PI);
  coneGeometry.rotateY(Math.random() * Math.PI);

  torusGeometry.translate(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  );

  coneGeometry.translate(
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100,
    (Math.random() - 0.5) * 100
  );

  bgGeometries.push(torusGeometry, coneGeometry);
}

const mergedGeometry = BufferGeometryUtils.mergeBufferGeometries(bgGeometries);
const mesh = new THREE.Mesh(mergedGeometry, material);
scene.add(mesh);

// Utils
const objectsToUpdate = [];

const create = (position, textToDisplay, textSize) => {
  const fontLoader = new FontLoader();
  fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    const textGeometry = new TextGeometry(textToDisplay, {
      font,
      size: textSize === 'large' ? 0.8 : 0.45,
      height: 0.1,
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
    scene.add(text);

    const shape = new CANNON.Sphere(0.1);
    const body = new CANNON.Body({
      mass: 1,
      position: new CANNON.Vec3(0, 3, 0),
      shape,
      material: defaultMaterial,
    });
    body.position.copy(position);
    world.add(body);

    objectsToUpdate.push({
      text,
      body,
    });
  });
};

// Animate
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  world.step(1 / 60, deltaTime, 3);

  for (const object of objectsToUpdate) {
    object.text.position.copy(object.body.position);
  }

  controls.update();
  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
