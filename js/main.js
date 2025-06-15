import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { LIGHT_GROUP_NAME, DESK_DEPTH, DESK_HEIGHT } from './constants.js';
import { createDesk } from './desk.js';
import { generateLightsFromIDs, getLightState } from './lighting.js';
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
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
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

    // 4. Initial lighting state
    generateLightsFromIDs(scene, LIGHTING_SCHEMES.immersiveCommandDeck.ids); 

    // 5. UI & Event Listeners (after lights are created)
    createSchemeButtons(scene, generateLightsFromIDs, 'immersiveCommandDeck');
    window.addEventListener('resize', onWindowResize);

    // 6. Start animation
    animate();
}

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    if (wall && camera) {
        const isBehindWall = camera.position.z < wall.position.z;
        
        if (isBehindWall) {
            wall.material.opacity = 0.15;
            wall.material.transparent = true;
        } else {
            wall.material.opacity = 1.0;
            wall.material.transparent = false;
        }
        
        const lightGroup = scene.getObjectByName(LIGHT_GROUP_NAME);
        if (lightGroup) {
            
            // --- Final, Corrected Color Logic ---

            // 1. Identify visible lights and sort them into two categories.
            const individualVisibleIds = [];
            let isUnderglowVisible = false;
            
            lightGroup.children.forEach(child => {
                const lightId = child.userData.lightId;
                if (lightId && getLightState(lightId) && child.isRectAreaLight) {
                    if (child.userData.groupId === 'underglow') {
                        isUnderglowVisible = true;
                    } else {
                        if (!individualVisibleIds.includes(lightId)) {
                            individualVisibleIds.push(lightId);
                        }
                    }
                }
            });

            // 2. Determine the total number of distinct color "slots" needed.
            const totalColorSlots = individualVisibleIds.length + (isUnderglowVisible ? 1 : 0);
            
            // 3. Create a map for individual strips to their color index.
            const colorIndexMap = new Map(individualVisibleIds.map((id, index) => [id, index]));
            
            // 4. Assign a unique color index to the underglow group. It gets the last index.
            const underglowColorIndex = individualVisibleIds.length;

            // 5. Calculate the final hue for the underglow group, ensuring it's part of the even distribution.
            const underglowHue = totalColorSlots > 0 ? (elapsedTime * 0.1 + underglowColorIndex / totalColorSlots) % 1 : 0;

            // 6. Apply visibility and colors to all lights.
            lightGroup.children.forEach((child) => {
                const lightId = child.userData.lightId;
                if (lightId === undefined) return;

                const isVisible = getLightState(lightId);
                child.visible = isVisible;

                if (isVisible && !child.isSpotLight) {
                    let hue;
                    
                    if (child.userData.groupId === 'underglow') {
                        // All underglow lights share a single, pre-calculated hue.
                        hue = underglowHue;
                    } else if (colorIndexMap.has(lightId)) {
                        // Individual strips get their unique, evenly spaced color.
                        const colorIndex = colorIndexMap.get(lightId);
                        hue = totalColorSlots > 0 ? (elapsedTime * 0.1 + colorIndex / totalColorSlots) % 1 : 0;
                    } else {
                        // Fallback for safety.
                        hue = 0; 
                    }

                    // Apply the calculated color to the 3D object.
                    if (child.isRectAreaLight) {
                        child.color.setHSL(hue, 1, 0.5);
                    } else if (child.userData.isLightRepresentation) {
                        child.material.color.setHSL(hue, 1, 0.5);
                    }
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