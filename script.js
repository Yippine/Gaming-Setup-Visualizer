import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// We are removing the helper, so it's no longer needed.
// import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';

// --- CONSTANTS ---
const DESK_WIDTH = 1.4;
const DESK_HEIGHT = 1.46;
const DESK_DEPTH = 0.74;
const FRAME_THICKNESS = 0.05;
const BOARD_THICKNESS = 0.03;
const LIGHT_GROUP_NAME = 'dynamic_lights';

// --- GLOBAL VARIABLES ---
let scene, camera, renderer, controls, wall;

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

    // 3. Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, DESK_HEIGHT * 0.6, 0);

    // 4. UI & Event Listeners
    setupUI();
    window.addEventListener('resize', onWindowResize);

    // 5. Initial state
    applyImmersiveLights(); 
    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (wall && camera) {
        wall.visible = camera.position.z > wall.position.z;
    }
    controls.update();
    renderer.render(scene, camera);
}

// --- DESK MODEL ---
function createDesk() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8, metalness: 0.1 });

    // --- Side Assemblies ---
    const createSideAssembly = (isLeft) => {
        const side = new THREE.Group();
        const sign = isLeft ? -1 : 1;
        const xPos = sign * (DESK_WIDTH / 2 + FRAME_THICKNESS / 2);

        // Vertical Legs
        const legGeo = new THREE.BoxGeometry(FRAME_THICKNESS, DESK_HEIGHT, FRAME_THICKNESS);
        const backLeg = new THREE.Mesh(legGeo, material);
        backLeg.position.set(xPos, DESK_HEIGHT / 2, -DESK_DEPTH + FRAME_THICKNESS / 2);

        // Bottom Shelf - CONNECTED
        const bottomShelfGeo = new THREE.BoxGeometry(0.4, BOARD_THICKNESS, DESK_DEPTH);
        const bottomShelf = new THREE.Mesh(bottomShelfGeo, material);
        bottomShelf.position.set(xPos, 0.2, -DESK_DEPTH / 2);

        side.add(backLeg, bottomShelf);
        return side;
    };
    
    group.add(createSideAssembly(true), createSideAssembly(false));

    // --- Center Shelves & Desk ---
    const deskY = 0.74;
    const midShelfY = deskY + 0.1 + BOARD_THICKNESS; // Lowered monitor shelf

    // Top Shelf - intersects with side frames
    const topShelf = new THREE.Mesh(new THREE.BoxGeometry(DESK_WIDTH + FRAME_THICKNESS*2, BOARD_THICKNESS, 0.25), material);
    topShelf.position.set(0, DESK_HEIGHT - BOARD_THICKNESS / 2, -DESK_DEPTH + 0.125);
    
    // Middle Shelf (Monitor) - intersects with side frames
    const midShelf = new THREE.Mesh(new THREE.BoxGeometry(DESK_WIDTH + FRAME_THICKNESS*2, BOARD_THICKNESS, 0.35), material);
    midShelf.position.set(0, midShelfY, -DESK_DEPTH + 0.175);
    
    // Back Panel
    const backPanel = new THREE.Mesh(new THREE.BoxGeometry(DESK_WIDTH, midShelfY - deskY - BOARD_THICKNESS, BOARD_THICKNESS), material);
    backPanel.position.set(0, (deskY + midShelfY) / 2, -DESK_DEPTH);
    
    group.add(topShelf, midShelf, backPanel);
    
    // Upper Side Walls (NEW)
    const topShelfY = DESK_HEIGHT - BOARD_THICKNESS / 2;
    const upperWallHeight = topShelfY - midShelfY;
    const upperWallGeo = new THREE.BoxGeometry(FRAME_THICKNESS, upperWallHeight, 0.35);
    const upperWallL = new THREE.Mesh(upperWallGeo, material);
    upperWallL.position.set(-(DESK_WIDTH / 2), midShelfY + upperWallHeight / 2, -DESK_DEPTH + 0.175);
    const upperWallR = new THREE.Mesh(upperWallGeo, material);
    upperWallR.position.set(DESK_WIDTH / 2, midShelfY + upperWallHeight / 2, -DESK_DEPTH + 0.175);
    group.add(upperWallL, upperWallR);

    // Main Desk with Cutout - intersects with side frames
    const mainDeskWidth = DESK_WIDTH + FRAME_THICKNESS * 2;
    const cutoutWidth = 0.5;
    const cutoutDepth = 0.15;
    const sidePieceWidth = (mainDeskWidth - cutoutWidth) / 2;
    
    // Back piece of main desk
    const deskBackPiece = new THREE.Mesh(new THREE.BoxGeometry(mainDeskWidth, BOARD_THICKNESS, DESK_DEPTH - cutoutDepth), material);
    deskBackPiece.position.set(0, deskY, - (cutoutDepth + (DESK_DEPTH - cutoutDepth)/2) );
    
    // Left side piece of main desk
    const deskLeftPiece = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, BOARD_THICKNESS, cutoutDepth), material);
    deskLeftPiece.position.set( - (cutoutWidth + sidePieceWidth) / 2 , deskY, -cutoutDepth/2);

    // Right side piece of main desk
    const deskRightPiece = new THREE.Mesh(new THREE.BoxGeometry(sidePieceWidth, BOARD_THICKNESS, cutoutDepth), material);
    deskRightPiece.position.set( (cutoutWidth + sidePieceWidth) / 2 , deskY, -cutoutDepth/2);

    group.add(deskBackPiece, deskLeftPiece, deskRightPiece);

    // Speaker Wings - Moved to the back
    const wingGeo = new THREE.BoxGeometry(0.3, BOARD_THICKNESS, 0.25);
    const wingL = new THREE.Mesh(wingGeo, material);
    wingL.position.set(-DESK_WIDTH / 2 - 0.15, midShelfY, -DESK_DEPTH + 0.125);
    
    const wingR = new THREE.Mesh(wingGeo, material);
    wingR.position.set(DESK_WIDTH / 2 + 0.15, midShelfY, -DESK_DEPTH + 0.125);

    group.add(wingL, wingR);
    
    return group;
}

// --- LIGHTING ---
function clearLights() {
    const lightGroup = scene.getObjectByName(LIGHT_GROUP_NAME);
    if (lightGroup) {
        lightGroup.clear();
        scene.remove(lightGroup);
    }
}

function applyImmersiveLights() {
    clearLights();
    const lightGroup = new THREE.Group();
    lightGroup.name = LIGHT_GROUP_NAME;

    const lightColor = 0x00aaff;
    const lightIntensity = 40;
    const lightWidth = 1.0;
    const lightHeight = 0.02;

    const light1 = new THREE.RectAreaLight(lightColor, lightIntensity, lightWidth, lightHeight);
    light1.position.set(0, 0.74 + BOARD_THICKNESS, -DESK_DEPTH + 0.1);
    light1.rotation.x = -Math.PI / 2.5;
    
    const light2 = new THREE.RectAreaLight(lightColor, lightIntensity, lightWidth, lightHeight);
    light2.position.set(0, (0.74 + 0.1 + BOARD_THICKNESS) - BOARD_THICKNESS, -DESK_DEPTH + 0.2);
    light2.rotation.x = Math.PI / 2;
    
    const light3 = new THREE.RectAreaLight(lightColor, lightIntensity * 0.5, 0.6, lightHeight);
    light3.position.set(-DESK_WIDTH / 2 + FRAME_THICKNESS*2, 1.0, -DESK_DEPTH/2);
    light3.rotation.y = Math.PI / 2;
    
    const light4 = new THREE.RectAreaLight(lightColor, lightIntensity * 0.5, 0.6, lightHeight);
    light4.position.set(DESK_WIDTH / 2 - FRAME_THICKNESS*2, 1.0, -DESK_DEPTH/2);
    light4.rotation.y = -Math.PI / 2;
    
    lightGroup.add(light1, light2, light3, light4);
    scene.add(lightGroup);
}

// --- UI & EVENTS ---
function setupUI() {
    const controlsContainer = document.getElementById('light-controls');
    
    const immersiveBtn = document.createElement('button');
    immersiveBtn.textContent = '沉浸式氛圍';
    immersiveBtn.className = 'light-btn active'; // Active by default
    immersiveBtn.onclick = () => {
        applyImmersiveLights();
        // Deactivate other buttons and activate this one
        document.querySelectorAll('.light-btn').forEach(btn => btn.classList.remove('active'));
        immersiveBtn.classList.add('active');
    };
    
    controlsContainer.appendChild(immersiveBtn);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// --- START ---
init();