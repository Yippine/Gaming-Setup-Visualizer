import { applyImmersiveLights } from './lighting.js';

export function setupUI(scene) {
    const controlsContainer = document.getElementById('light-controls');
    
    const immersiveBtn = document.createElement('button');
    immersiveBtn.textContent = '沉浸式氛圍';
    immersiveBtn.className = 'light-btn active';
    immersiveBtn.onclick = () => {
        // Pass the scene to the lighting function
        applyImmersiveLights(scene);
        document.querySelectorAll('.light-btn').forEach(btn => btn.classList.remove('active'));
        immersiveBtn.classList.add('active');
    };
    
    controlsContainer.appendChild(immersiveBtn);
} 