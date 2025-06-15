import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

// 1. Scene Setup
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.5, 3.5);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#c'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.physicallyCorrectLights = true;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 2. Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

// 3. Desk Model
const deskMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

// Main surface
const mainDesk = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.7), deskMaterial);
mainDesk.position.y = 0.8;
scene.add(mainDesk);

// Top shelf
const topShelf = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.04, 0.3), deskMaterial);
topShelf.position.set(0, 1.5, -0.2);
scene.add(topShelf);

// Side panels
const sidePanelL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.8), deskMaterial);
sidePanelL.position.set(-0.92, 0.8, 0);
scene.add(sidePanelL);

const sidePanelR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.8), deskMaterial);
sidePanelR.position.set(0.92, 0.8, 0);
scene.add(sidePanelR);

// Back wall (for light to bounce off)
const wall = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 3),
    new THREE.MeshStandardMaterial({ color: 0x444444 })
);
wall.position.set(0, 1.5, -0.4);
scene.add(wall);


// 4. Lights Setup (Immersive Atmosphere Plan)
const lightColor = 0x00aaff; // Blueish light
const lightIntensity = 5;
const lightWidth = 1.0; // VATTENSTEN length
const lightHeight = 0.02;

// Light 1 (Back, on main desk, pointing up)
const light1 = new THREE.RectAreaLight(lightColor, lightIntensity, lightWidth, lightHeight);
light1.position.set(0, 0.83, -0.3); // On the desk, near the back
light1.rotation.x = -Math.PI / 2;
scene.add(light1);
scene.add(new RectAreaLightHelper(light1));

// Light 2 (Top, under shelf, pointing down)
const light2 = new THREE.RectAreaLight(lightColor, lightIntensity, lightWidth, lightHeight);
light2.position.set(0, 1.48, -0.2); // Under the top shelf
light2.rotation.x = Math.PI / 2;
scene.add(light2);
scene.add(new RectAreaLightHelper(light2));

// Light 3 (Left wing)
const light3 = new THREE.RectAreaLight(lightColor, lightIntensity, 0.6, lightHeight);
light3.position.set(-0.90, 1.1, 0); // On the left panel
light3.rotation.y = -Math.PI / 2;
scene.add(light3);
scene.add(new RectAreaLightHelper(light3));

// Light 4 (Right wing)
const light4 = new THREE.RectAreaLight(lightColor, lightIntensity, 0.6, lightHeight);
light4.position.set(0.90, 1.1, 0); // On the right panel
light4.rotation.y = Math.PI / 2;
scene.add(light4);
scene.add(new RectAreaLightHelper(light4));


// 5. Animation Loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

animate();