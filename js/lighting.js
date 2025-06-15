import * as THREE from 'three';
import { LIGHT_GROUP_NAME, MAIN_DESK_Y } from './constants.js';
import { LIGHTING_POSITIONS } from './lighting-positions.js';

// This Map is the single source of truth for all light states.
let currentLightStates = new Map();

/**
 * Completely removes the existing light group from the scene.
 * This is a necessary cleanup step before generating a new set of lights.
 * @param {THREE.Scene} scene The main scene.
 */
function clearAndRemoveLights(scene) {
    const lightGroup = scene.getObjectByName(LIGHT_GROUP_NAME);
    if (lightGroup) {
        // Properly dispose of geometries and materials to prevent memory leaks.
        lightGroup.traverse(child => {
            if (child.isMesh) {
                child.geometry.dispose();
                child.material.dispose();
            }
        });
        scene.remove(lightGroup);
    }
}

/**
 * Generates a complete set of lights based on a given scheme.
 * This function RESETS all light states to match the provided scheme IDs.
 * @param {THREE.Scene} scene The main scene.
 * @param {number[]} ids The array of light IDs for the selected scheme.
 */
export function generateLightsFromIDs(scene, ids) {
    clearAndRemoveLights(scene);
    
    const lightGroup = new THREE.Group();
    lightGroup.name = LIGHT_GROUP_NAME;

    const allPossibleIds = Object.keys(LIGHTING_POSITIONS).map(Number);
    
    // This is the HARD RESET. It sets the state exactly to the scheme's definition.
    allPossibleIds.forEach(id => {
        currentLightStates.set(id, ids.includes(id));
    });

    // Create 3D objects for all possible lights.
    for (const id of allPossibleIds) {
        const spec = LIGHTING_POSITIONS[id];
        if (!spec) continue;

        let light, lightRep;
        
        // Special creation logic for the spotlight.
        if (id === 99) {
            light = new THREE.SpotLight(0xffffff, 20);
            light.angle = Math.PI / 4;
            light.penumbra = 0.8;
            light.decay = 2;
            light.distance = 3;
            const target = new THREE.Object3D();
            target.position.set(0, MAIN_DESK_Y, -0.6);
            light.target = target;
            lightGroup.add(target); // Add target to the group for proper transform.
            lightRep = new THREE.Mesh(
                new THREE.CylinderGeometry(0.08, 0.08, 0.01, 32),
                new THREE.MeshBasicMaterial({ color: 0xdddddd })
            );
        } else { // Creation logic for standard RectAreaLights.
            light = new THREE.RectAreaLight(0xffffff, 40, spec.size.width, spec.size.height);
            // This rotation is crucial for vertical lights to shine outwards.
            if (spec.isVertical) {
                const rotationAngle = spec.position.x < 0 ? -Math.PI / 2 : Math.PI / 2;
                light.rotateX(rotationAngle);
            }
            lightRep = new THREE.Mesh(
                new THREE.BoxGeometry(spec.size.width, spec.size.height, spec.size.depth),
                new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false })
            );
        }

        // Apply common properties to both the light and its visual representation.
        light.position.copy(spec.position);
        light.rotation.copy(spec.rotation);
        light.userData.lightId = id;
        if(spec.groupId) light.userData.groupId = spec.groupId;
        
        lightRep.position.copy(spec.position);
        lightRep.rotation.copy(spec.rotation);
        lightRep.userData.isLightRepresentation = true;
        lightRep.userData.lightId = id;
        if(spec.groupId) lightRep.userData.groupId = spec.groupId;

        lightGroup.add(light, lightRep);
    }

    scene.add(lightGroup);
}

/**
 * Toggles the state of a single light or a group of lights.
 * This is the dedicated function for manual overrides via the UI switches.
 * @param {number} lightId The ID of the light to toggle.
 */
export function toggleIndividualLight(lightId) {
    const isCurrentlyOn = currentLightStates.get(lightId) || false;
    currentLightStates.set(lightId, !isCurrentlyOn);
    return !isCurrentlyOn;
}

/**
 * Retrieves the current on/off state of a specific light.
 * The animation loop uses this to determine visibility.
 * @param {number} lightId The ID of the light to check.
 * @returns {boolean} The current state (true for on, false for off).
 */
export function getLightState(lightId) {
    // Return the state from the map, defaulting to false if not found.
    return currentLightStates.get(lightId) || false;
}
