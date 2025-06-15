import { LIGHTING_SCHEMES } from './lighting-schemes.js';

/**
 * Dynamically creates lighting scheme buttons and attaches them to the DOM.
 * @param {THREE.Scene} scene - The main scene object.
 * @param {(scene: THREE.Scene, ids: number[]) => void} onButtonClickCallback - The function to call when a button is clicked.
 * @param {string} defaultSchemeKey - The key of the scheme to be active by default.
 */
export function createSchemeButtons(scene, onButtonClickCallback, defaultSchemeKey) {
    const controlsContainer = document.getElementById('light-controls');
    if (!controlsContainer) return;
    
    controlsContainer.innerHTML = ''; // Clear any existing buttons

    Object.entries(LIGHTING_SCHEMES).forEach(([key, scheme]) => {
        const button = document.createElement('button');
        button.textContent = scheme.name;
        button.className = 'light-btn';

        if (key === defaultSchemeKey) {
            button.classList.add('active');
        }

        button.onclick = () => {
            onButtonClickCallback(scene, scheme.ids);
            
            // Update active class for all buttons
            document.querySelectorAll('.light-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
        };

        controlsContainer.appendChild(button);
    });
}