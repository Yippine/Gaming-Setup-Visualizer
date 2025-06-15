/**
 * @typedef {Object} LightingScheme
 * @property {string} name - The display name of the scheme.
 * @property {number[]} ids - An array of light position IDs.
 */

/** @type {Object.<string, LightingScheme>} */
export const LIGHTING_SCHEMES = {
    immersiveCommandDeck: {
        name: '沉浸式指揮艙',
        ids: [2, 7, 8, 10, 11, 12]
    },
    ikeaClassic: {
        name: 'IKEA 經典氛圍',
        ids: [7, 8]
    },
    symmetricalFrame: {
        name: '對稱框架光',
        ids: [5, 6]
    },
    immersiveBacklight: {
        name: '沉浸式背光',
        ids: [8, 9]
    },
    immersive: {
        name: '沉浸式氛圍',
        ids: [1, 3, 5, 6],
    },
    focus: {
        name: '專注模式',
        ids: [4],
    },
    ambient: {
        name: '環境光暈',
        ids: [1, 5, 6],
    }
};