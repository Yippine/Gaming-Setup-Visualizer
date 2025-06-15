/**
 * @typedef {Object} LightingScheme
 * @property {string} name - The human-readable name of the scheme.
 * @property {number[]} ids - An array of light position IDs from lighting-positions.js.
 */

/**
 * A dictionary of predefined lighting schemes.
 * The key is a machine-readable identifier for the scheme.
 * @type {Object.<string, LightingScheme>}
 */
export const LIGHTING_SCHEMES = {
    ikeaClassic: {
        name: 'IKEA 經典 (IKEA Classic)',
        ids: [3, 4, 7, 8],
    },
    immersive: {
        name: '沉浸式氛圍 (Immersive)',
        ids: [1, 3, 5, 6],
    },
    focus: {
        name: '專注模式 (Focus)',
        ids: [4],
    },
    ambient: {
        name: '環境光暈 (Ambient)',
        ids: [1, 5, 6],
    },
    none: {
        name: '關閉所有 (All Off)',
        ids: [],
    }
};