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
    UPPER_LEG_Y,
    FRAME_THICKNESS
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
const Z_OFFSET = -0.37; // = -DESK_DEPTH / 2
const VISIBILITY_OFFSET_Z = FRAME_THICKNESS; // A small offset to prevent Z-fighting on Z-axis
const VISIBILITY_OFFSET_X = 0.03; // A small offset for X-axis

/** @type {Object.<number, LightPosition>} */
export const LIGHTING_POSITIONS = {
    // --- Horizontal Positions ---

    // Top Shelf
    1: {
        id: 1,
        description: '上層架，後緣 (Top Shelf, Back Edge)',
        size: { width: DESK_WIDTH * 0.9, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y, -TOP_SHELF_DEPTH / 2 + VISIBILITY_OFFSET_Z + Z_OFFSET),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },
    2: {
        id: 2,
        description: '上層架，前緣下方 (Top Shelf, Front Edge, Underside)',
        size: { width: DESK_WIDTH * 0.9, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y - 0.02, TOP_SHELF_DEPTH / 2 - 0.02 + Z_OFFSET),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },

    // Main Desk
    3: {
        id: 3,
        description: '主桌面，後緣下方 (Main Desk, Back Edge, Underside)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, MAIN_DESK_Y - 0.02, -DESK_DEPTH + 0.05),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },
    4: {
        id: 4,
        description: '主桌面，前凹槽樑 (Main Desk, Front Cutout Beam)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, MAIN_DESK_Y - 0.02, -0.15),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
    },

    // --- Vertical Positions (Symmetrical Pairs) ---

    // Frame Pillars (Now moved to the front)
    5: {
        id: 5,
        description: '前方垂直支架，左側 (Front Vertical Frame, Left)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(-DESK_WIDTH / 2 + LEG_WIDTH / 2, SIDE_PANEL_Y, -0.37 + Z_OFFSET),
        rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2),
        isVertical: true,
    },
    6: {
        id: 6,
        description: '前方垂直支架，右側 (Front Vertical Frame, Right)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(DESK_WIDTH / 2 - LEG_WIDTH / 2, SIDE_PANEL_Y, -0.37 + Z_OFFSET),
        rotation: new THREE.Euler(0, -Math.PI / 2, Math.PI / 2),
        isVertical: true,
    },

    // --- IKEA Classic & Monitor Shelf Specific Positions ---
    7: {
        id: 7,
        description: 'IKEA 特調：螢幕層板，後方 (朝牆)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, 0.87, -DESK_DEPTH),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
        isVertical: false,
    },
    8: {
        id: 8,
        description: 'IKEA 特調：頂部層板，後方 (朝牆)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y, -DESK_DEPTH),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
        isVertical: false,
    },
};