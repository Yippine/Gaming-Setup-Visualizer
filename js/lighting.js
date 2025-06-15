import * as THREE from 'three';
import { LIGHT_GROUP_NAME } from './constants.js';
import { LIGHTING_POSITIONS } from './lighting-positions.js';

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

export function generateLightsFromIDs(scene, ids) {
    clearLights(scene);
    const lightGroup = new THREE.Group();
    lightGroup.name = LIGHT_GROUP_NAME;

    const lightIntensity = 40;

    const baseLightRepMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        toneMapped: false
    });

    for (const id of ids) {
        const spec = LIGHTING_POSITIONS[id];
        if (!spec) {
            console.warn(`Light position with ID ${id} not found.`);
            continue;
        }

        const light = new THREE.RectAreaLight(0xffffff, lightIntensity, spec.size.width, spec.size.height);
        light.position.copy(spec.position);
        light.rotation.copy(spec.rotation);
        
        // For vertical lights, the RectAreaLight needs a rotation to shine "outwards".
        // The direction depends on whether it's the left or right light.
        if (spec.isVertical) {
            // If x is negative, it's the left light, otherwise it's the right.
            const rotationAngle = spec.position.x < 0 ? -Math.PI / 2 : Math.PI / 2;
            light.rotateX(rotationAngle);
        }

        const lightRep = new THREE.Mesh(
            new THREE.BoxGeometry(spec.size.width, spec.size.height, spec.size.depth), 
            baseLightRepMaterial.clone()
        );
        lightRep.position.copy(spec.position);
        lightRep.rotation.copy(spec.rotation);
        lightRep.userData.isLightRepresentation = true;
        lightRep.userData.isVertical = spec.isVertical;

        lightGroup.add(light, lightRep);
    }

    scene.add(lightGroup);
}