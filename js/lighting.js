import * as THREE from 'three';
import { LIGHT_GROUP_NAME, DESK_HEIGHT, BOARD_THICKNESS, DESK_DEPTH, FRAME_THICKNESS, DESK_WIDTH } from './constants.js';

function clearLights(scene) {
    const lightGroup = scene.getObjectByName(LIGHT_GROUP_NAME);
    if (lightGroup) {
        lightGroup.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
        scene.remove(lightGroup);
    }
}

export function applyImmersiveLights(scene) {
    clearLights(scene);
    const lightGroup = new THREE.Group();
    lightGroup.name = LIGHT_GROUP_NAME;

    const lightIntensity = 40;
    const topAndBottomLength = 1.1;
    const verticalLightHeight = 0.4;

    const baseLightRepMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        toneMapped: false
    });

    // Light 1 (Top shelf)
    const light1 = new THREE.RectAreaLight(0xffffff, lightIntensity, topAndBottomLength, 0.02);
    light1.position.set(0, DESK_HEIGHT - BOARD_THICKNESS * 2, -DESK_DEPTH + 0.125);
    light1.rotation.x = Math.PI / 2;
    const light1Rep = new THREE.Mesh(new THREE.BoxGeometry(topAndBottomLength, 0.02, 0.02), baseLightRepMaterial.clone());
    light1Rep.position.copy(light1.position);
    light1Rep.rotation.copy(light1.rotation);
    light1Rep.userData.isLightRepresentation = true;
    light1Rep.userData.isVertical = false;

    // Light 2 (Behind main desk)
    const light2 = new THREE.RectAreaLight(0xffffff, lightIntensity, topAndBottomLength, 0.02);
    light2.position.set(0, 0.74 - BOARD_THICKNESS, -DESK_DEPTH + 0.1);
    light2.rotation.x = -Math.PI / 2.5;
    const light2Rep = new THREE.Mesh(new THREE.BoxGeometry(topAndBottomLength, 0.02, 0.02), baseLightRepMaterial.clone());
    light2Rep.position.copy(light2.position);
    light2Rep.rotation.copy(light2.rotation);
    light2Rep.userData.isLightRepresentation = true;
    light2Rep.userData.isVertical = false;

    // Light 3 & 4 (Vertical)
    const frameBackZ = -DESK_DEPTH;
    const lightYPos = 1.0;

    const light3X = -(DESK_WIDTH / 2 - FRAME_THICKNESS / 2);
    const light3 = new THREE.RectAreaLight(0xffffff, lightIntensity * 0.7, 0.02, verticalLightHeight);
    light3.position.set(light3X, lightYPos, frameBackZ);
    light3.lookAt(light3X, lightYPos, frameBackZ - 1);
    const light3Rep = new THREE.Mesh(new THREE.BoxGeometry(0.02, verticalLightHeight, 0.02), baseLightRepMaterial.clone());
    light3Rep.position.set(light3X, lightYPos, frameBackZ);
    light3Rep.userData.isLightRepresentation = true;
    light3Rep.userData.isVertical = true; 
    
    const light4X = (DESK_WIDTH / 2 - FRAME_THICKNESS / 2);
    const light4 = new THREE.RectAreaLight(0xffffff, lightIntensity * 0.7, 0.02, verticalLightHeight);
    light4.position.set(light4X, lightYPos, frameBackZ);
    light4.lookAt(light4X, lightYPos, frameBackZ - 1);
    const light4Rep = new THREE.Mesh(new THREE.BoxGeometry(0.02, verticalLightHeight, 0.02), baseLightRepMaterial.clone());
    light4Rep.position.set(light4X, lightYPos, frameBackZ);
    light4Rep.userData.isLightRepresentation = true;
    light4Rep.userData.isVertical = true;
    
    lightGroup.add(light1, light1Rep, light2, light2Rep, light3, light3Rep, light4, light4Rep);
    scene.add(lightGroup);
} 