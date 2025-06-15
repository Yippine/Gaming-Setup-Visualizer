import * as THREE from 'three';
import {
    DESK_WIDTH,
    DESK_DEPTH,
    DESK_HEIGHT,
    TOP_SHELF_DEPTH,
    TOP_SHELF_Y,
    MAIN_DESK_Y,
    LEG_WIDTH,
    SIDE_PANEL_DEPTH,
    SIDE_PANEL_HEIGHT,
    SIDE_PANEL_Y,
    UPPER_LEG_HEIGHT,
    UPPER_LEG_Y
} from './constants.js';

/**
 * @typedef {Object} LightPosition
 * @property {number} id - The unique identifier for the light position.
 * @property {string} description - A human-readable description of the position.
 * @property {object} size - The dimensions of the light strip.
 * @property {number} size.width - The width (length) of the light strip.
 * @property {number} size.height - The height (thickness) of the light strip.
 * @property {number} size.depth - The depth (usually negligible) of the light strip.
 * @property {THREE.Vector3} position - The center position of the light strip in 3D space.
 * @property {THREE.Euler} rotation - The rotation of the light strip.
 * @property {boolean} isVertical - True if the light strip is oriented vertically.
 */

const LIGHT_THICKNESS = 0.01;

/** @type {Object.<number, LightPosition>} */
export const LIGHTING_POSITIONS = {
    // --- Horizontal Positions ---

    // Top Shelf
    1: {
        id: 1,
        description: '上層架，後緣 (Top Shelf, Back Edge)',
        size: { width: DESK_WIDTH * 0.9, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y, -TOP_SHELF_DEPTH / 2 + 0.02),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },
    2: {
        id: 2,
        description: '上層架，前緣下方 (Top Shelf, Front Edge, Underside)',
        size: { width: DESK_WIDTH * 0.9, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y - 0.02, TOP_SHELF_DEPTH / 2 - 0.02),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },

    // Main Desk
    3: {
        id: 3,
        description: '主桌面，後緣下方 (Main Desk, Back Edge, Underside)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, MAIN_DESK_Y - 0.02, -DESK_DEPTH / 2 + 0.02),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },
    4: {
        id: 4,
        description: '主桌面，前緣下方 (Main Desk, Front Edge, Underside)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, MAIN_DESK_Y - 0.02, DESK_DEPTH / 2 - 0.02),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },

    // --- Vertical Positions (Symmetrical Pairs) ---

    // Back Frame
    5: {
        id: 5,
        description: '後方垂直支架，左側 (Back Vertical Frame, Left)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(-DESK_WIDTH / 2 + LEG_WIDTH / 2, SIDE_PANEL_Y, -SIDE_PANEL_DEPTH / 2 + 0.02),
        rotation: new THREE.Euler(0, 0, Math.PI / 2),
        isVertical: true,
    },
    6: {
        id: 6,
        description: '後方垂直支架，右側 (Back Vertical Frame, Right)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(DESK_WIDTH / 2 - LEG_WIDTH / 2, SIDE_PANEL_Y, -SIDE_PANEL_DEPTH / 2 + 0.02),
        rotation: new THREE.Euler(0, 0, Math.PI / 2),
        isVertical: true,
    },

    // Front Frame
    7: {
        id: 7,
        description: '前方垂直支架，左側 (Front Vertical Frame, Left)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(-DESK_WIDTH / 2 + LEG_WIDTH / 2, SIDE_PANEL_Y, SIDE_PANEL_DEPTH / 2 - 0.02),
        rotation: new THREE.Euler(0, 0, Math.PI / 2),
        isVertical: true,
    },
    8: {
        id: 8,
        description: '前方垂直支架，右側 (Front Vertical Frame, Right)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(DESK_WIDTH / 2 - LEG_WIDTH / 2, SIDE_PANEL_Y, SIDE_PANEL_DEPTH / 2 - 0.02),
        rotation: new THREE.Euler(0, 0, Math.PI / 2),
        isVertical: true,
    },
    
    // Upper Frame
    9: {
        id: 9,
        description: '上方垂直支架，左側 (Upper Vertical Frame, Left)',
        size: { width: UPPER_LEG_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(-DESK_WIDTH / 2 + LEG_WIDTH / 2, UPPER_LEG_Y, -SIDE_PANEL_DEPTH / 2 + 0.02),
        rotation: new THREE.Euler(0, 0, Math.PI / 2),
        isVertical: true,
    },
    10: {
        id: 10,
        description: '上方垂直支架，右側 (Upper Vertical Frame, Right)',
        size: { width: UPPER_LEG_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(DESK_WIDTH / 2 - LEG_WIDTH / 2, UPPER_LEG_Y, -SIDE_PANEL_DEPTH / 2 + 0.02),
        rotation: new THREE.Euler(0, 0, Math.PI / 2),
        isVertical: true,
    },
};