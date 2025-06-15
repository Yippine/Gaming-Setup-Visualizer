import * as THREE from 'three';
import {
    DESK_WIDTH,
    DESK_DEPTH,
    TOP_SHELF_DEPTH,
    TOP_SHELF_Y,
    MAIN_DESK_Y,
    LEG_WIDTH,
    SIDE_PANEL_HEIGHT,
    SIDE_PANEL_Y,
    FRAME_THICKNESS,
    BOARD_THICKNESS
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
 * @property {string} [groupId] - An optional ID to group lights for animation.
 */

const LIGHT_THICKNESS = 0.01;
// A small offset to prevent Z-fighting, bringing the light slightly forward/up
const VISIBILITY_OFFSET = 0.01; 


/** @type {Object.<number, LightPosition>} */
export const LIGHTING_POSITIONS = {
    // --- Horizontal Positions ---

    // Top Shelf
    1: {
        id: 1,
        description: '上層架，前緣頂部 (Top Shelf, Front Edge, On Top)',
        size: { width: DESK_WIDTH * 0.9, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y + VISIBILITY_OFFSET, -DESK_DEPTH / 2),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
        isVertical: false,
    },
    2: {
        id: 2,
        description: '天幕光: 上層架，前緣下方 (Canopy: Top Shelf, Front Edge, Underside)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y - BOARD_THICKNESS + 0.015, -DESK_DEPTH + TOP_SHELF_DEPTH - VISIBILITY_OFFSET),
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

    // Frame Pillars
    5: {
        id: 5,
        description: '前方垂直支架，左側 (Front Vertical Frame, Left)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(-DESK_WIDTH / 2 + LEG_WIDTH / 2, SIDE_PANEL_Y, -DESK_DEPTH / 2),
        rotation: new THREE.Euler(0, Math.PI / 2, Math.PI / 2),
        isVertical: true,
    },
    6: {
        id: 6,
        description: '前方垂直支架，右側 (Front Vertical Frame, Right)',
        size: { width: SIDE_PANEL_HEIGHT, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(DESK_WIDTH / 2 - LEG_WIDTH / 2, SIDE_PANEL_Y, -DESK_DEPTH / 2),
        rotation: new THREE.Euler(0, -Math.PI / 2, Math.PI / 2),
        isVertical: true,
    },

    // --- IKEA Classic & Monitor Shelf Specific Positions ---
    7: {
        id: 7,
        description: 'IKEA 特調：螢幕層板，後方 (朝牆)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, 0.87, -DESK_DEPTH - VISIBILITY_OFFSET),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
        isVertical: false,
    },
    8: {
        id: 8,
        description: '頂部背景光: 上層架，後緣 (朝上)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, TOP_SHELF_Y, -DESK_DEPTH - VISIBILITY_OFFSET),
        rotation: new THREE.Euler(-Math.PI / 2, 0, 0),
        isVertical: false,
    },

    // --- Custom Scheme Positions ---
    9: {
        id: 9,
        description: '主背景光: 主桌面，後緣 (朝牆)',
        size: { width: DESK_WIDTH, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, MAIN_DESK_Y, -DESK_DEPTH - VISIBILITY_OFFSET),
        rotation: new THREE.Euler(Math.PI / 2, 0, 0),
        isVertical: false,
    },
    // U-Shape Underglow (3 parts, Light facing DOWN)
    10: {
        id: 10,
        description: '懸浮光場-前: 主桌面，底部前緣',
        size: { width: DESK_WIDTH - 2 * FRAME_THICKNESS, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(0, MAIN_DESK_Y - BOARD_THICKNESS - VISIBILITY_OFFSET, -0.15),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false,
        groupId: 'underglow',
    },
    11: {
        id: 11,
        description: '懸浮光場-左: 主桌面，底部左緣',
        size: { width: DESK_DEPTH - 0.15, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(-DESK_WIDTH / 2 + FRAME_THICKNESS, MAIN_DESK_Y - BOARD_THICKNESS - VISIBILITY_OFFSET, (-DESK_DEPTH - 0.15) / 2),
        rotation: new THREE.Euler(0, Math.PI / 2, 0),
        isVertical: false,
        groupId: 'underglow',
    },
    12: {
        id: 12,
        description: '懸浮光場-右: 主桌面，底部右緣',
        size: { width: DESK_DEPTH - 0.15, height: LIGHT_THICKNESS, depth: LIGHT_THICKNESS },
        position: new THREE.Vector3(DESK_WIDTH / 2 - FRAME_THICKNESS, MAIN_DESK_Y - BOARD_THICKNESS - VISIBILITY_OFFSET, (-DESK_DEPTH - 0.15) / 2),
        rotation: new THREE.Euler(0, -Math.PI / 2, 0),
        isVertical: false,
        groupId: 'underglow',
    },


    // --- Special Lights ---
    99: {
        id: 99,
        description: '任務聚光燈 (Task Spotlight)',
        size: { width: 0.1, height: 0.01, depth: 0.1 }, // Representative size for the mesh
        position: new THREE.Vector3(0, TOP_SHELF_Y - BOARD_THICKNESS + 0.015, -DESK_DEPTH + TOP_SHELF_DEPTH - 0.1),
        rotation: new THREE.Euler(0, 0, 0),
        isVertical: false, // Not applicable
    },
};