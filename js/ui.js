import { toggleIndividualLight, getLightState } from './lighting.js';
import { LIGHTING_SCHEMES } from './lighting-schemes.js';

// This variable will hold the light IDs of the last selected scheme.
let lastSelectedSchemeIds = [];

/**
 * Creates and manages all UI components (scheme buttons and toggle switches).
 * @param {THREE.Scene} scene The main scene.
 * @param {(scene: THREE.Scene, ids: number[]) => void} onSchemeChangeCallback The function to call when a scheme is selected.
 * @param {string} defaultSchemeKey The key of the scheme to be active by default.
 */
export function createSchemeButtons(scene, onSchemeChangeCallback, defaultSchemeKey) {
    // Set the initial scheme IDs on load.
    lastSelectedSchemeIds = LIGHTING_SCHEMES[defaultSchemeKey].ids;
    
    createPresetButtons(scene, onSchemeChangeCallback, defaultSchemeKey);
    createIndividualSwitches(); // scene is not needed here anymore
    updateIndividualSwitches();
}

/**
 * Creates the top row of buttons for selecting a lighting scheme.
 * @param {THREE.Scene} scene The main scene.
 * @param {(scene: THREE.Scene, ids: number[]) => void} onSchemeChangeCallback The function to call when a scheme is selected.
 * @param {string} defaultSchemeKey The key of the scheme to be active by default.
 */
function createPresetButtons(scene, onSchemeChangeCallback, defaultSchemeKey) {
    const controlsContainer = document.getElementById('light-controls');
    if (!controlsContainer) return;
    
    controlsContainer.innerHTML = '';

    Object.entries(LIGHTING_SCHEMES).forEach(([key, scheme]) => {
        const button = document.createElement('button');
        button.textContent = scheme.name;
        button.className = 'light-btn';

        if (key === defaultSchemeKey) {
            button.classList.add('active');
        }

        button.onclick = () => {
            // Update the tracker for the last selected scheme.
            lastSelectedSchemeIds = [...scheme.ids];
            
            onSchemeChangeCallback(scene, scheme.ids);
            
            document.querySelectorAll('.light-btn').forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            updateIndividualSwitches();
        };

        controlsContainer.appendChild(button);
    });
}

/**
 * Creates the bottom row of switches for manual light control.
 */
function createIndividualSwitches() {
    const individualContainer = document.getElementById('individual-controls');
    if (!individualContainer) return;

    const title = individualContainer.querySelector('.control-section-title');
    individualContainer.innerHTML = '';
    if (title) {
        individualContainer.appendChild(title);
    }

    const controlOptions = [
        { name: '所有燈條', type: 'strips' },
        { name: '聚光燈', type: 'spotlight' }
    ];

    controlOptions.forEach(option => {
        const switchElement = document.createElement('button');
        switchElement.textContent = option.name;
        switchElement.className = 'light-switch';
        switchElement.dataset.controlType = option.type;
        
        switchElement.onclick = () => {
            let idsToToggle;
            if (option.type === 'strips') {
                // The switch now controls ONLY the strips from the last selected scheme.
                idsToToggle = lastSelectedSchemeIds.filter(id => id !== 99);
            } else { // spotlight
                idsToToggle = [99];
            }

            if (idsToToggle.length === 0 && option.type === 'strips') {
                // If the current scheme has no strips, do nothing.
                return;
            }

            // Determine the new state.
            const currentlyAllOn = idsToToggle.every(id => getLightState(id));
            const newState = !currentlyAllOn;
            
            // Apply the new state.
            idsToToggle.forEach(id => {
                if (getLightState(id) !== newState) {
                    toggleIndividualLight(id);
                }
            });

            // Using a toggle switch signifies a "custom" state, so we remove the scheme highlight.
            document.querySelectorAll('.light-btn').forEach(btn => btn.classList.remove('active'));

            updateIndividualSwitches();
        };

        individualContainer.appendChild(switchElement);
    });
}

/**
 * Updates the visual state (on/off) of the bottom switches based on the
 * actual state of the lights from `getLightState`.
 */
function updateIndividualSwitches() {
    const switches = document.querySelectorAll('.light-switch');
    switches.forEach(switchElement => {
        const type = switchElement.dataset.controlType;
        let idsToCheck;

        if (type === 'strips') {
            idsToCheck = lastSelectedSchemeIds.filter(id => id !== 99);
        } else { // spotlight
            idsToCheck = [99];
        }

        if (!idsToCheck || idsToCheck.length === 0) {
            // If there are no lights to check (e.g., a scheme with no strips), set switch to off.
            switchElement.classList.remove('on');
            switchElement.classList.add('off');
            return;
        }
        
        const allOn = idsToCheck.every(id => getLightState(id));
        
        switchElement.classList.remove('on', 'off');
        switchElement.classList.add(allOn ? 'on' : 'off');
    });
}