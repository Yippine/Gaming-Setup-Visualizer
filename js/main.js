import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LIGHT_GROUP_NAME, DESK_DEPTH, DESK_HEIGHT } from './constants.js';
import { createDesk } from './desk.js';
import { generateLightsFromIDs } from './lighting.js';
import { createSchemeButtons } from './ui.js';
import { LIGHTING_SCHEMES } from './lighting-schemes.js';

// --- GLOBAL VARIABLES ---
let scene, camera, renderer, controls, wall;
const clock = new THREE.Clock();

// --- CORE FUNCTIONS ---
function init() {
    // 1. Scene Setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x282828);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(-1.8, 1.6, 2.5);

    renderer = new THREE.WebGLRenderer({
      canvas: document.querySelector('#c'),
      antialias: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // 2. Base Scene Elements
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);
    scene.add(ambientLight);

    const desk = createDesk();
    scene.add(desk);

    wall = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 5),
        new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.DoubleSide })
    );
    wall.position.set(0, 2.5, -DESK_DEPTH - 0.05);
    scene.add(wall);

    const ground = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),
        new THREE.MeshStandardMaterial({ color: 0xeaeaea, side: THREE.DoubleSide })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // 3. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, DESK_HEIGHT * 0.6, 0);

    // 4. UI & Event Listeners
    createSchemeButtons(scene, generateLightsFromIDs, 'ikeaClassic');
    window.addEventListener('resize', onWindowResize);

    // 5. Initial state
    generateLightsFromIDs(scene, LIGHTING_SCHEMES.ikeaClassic.ids); 
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (wall && camera) {
        const isBehindWall = camera.position.z < wall.position.z;
        
        // New: Make the wall translucent when behind it, instead of invisible
        if (isBehindWall) {
            wall.material.opacity = 0.15;
            wall.material.transparent = true;
        } else {
            wall.material.opacity = 1.0;
            wall.material.transparent = false;
        }
        
        const lightGroup = scene.getObjectByName(LIGHT_GROUP_NAME);
        if (lightGroup) {
            lightGroup.children.forEach((child, index) => {
                const pairIndex = Math.floor(index / 2);
                const hue = (elapsedTime * 0.1 + pairIndex * 0.2) % 1;
                
                if (child.isRectAreaLight) {
                    child.visible = true; 
                    child.color.setHSL(hue, 1, 0.5);
                }
                
                if (child.userData.isLightRepresentation) {
                    child.material.color.setHSL(hue, 1, 0.5);
                    // The physical light strip models should always be visible,
                    // as they are now correctly positioned and will not clip.
                    child.visible = true;
                }
            });
        }
    }
    controls.update();
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- INITIALIZATION ---
init();