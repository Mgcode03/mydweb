// main.js
import { scene, camera } from './scene.js';
import gsap from 'gsap';

// Define fixed camera positions
const positions = [
    { pos: { x: -0.6, y: 1.3, z: 2.4 }, rot: { x: -1.36, y: 0, z: -1 } },
    { pos: { x: 0, y: 2, z: 5 }, rot: { x: -0.38, y: 0, z: 0 } },
    { pos: { x: 1, y: 2.1, z: 0.8}, rot: { x: -0.07, y: -2, z: 0 } },
    { pos: { x: 1, y: 1.7, z: 1.1 }, rot: { x: 0.07, y: 0.8, z: 0 } },
    { pos: { x: -1, y: 1.9, z: 0.8 }, rot: { x: 0.06, y: 0, z: 0 } },
    { pos: { x: -1, y: 1.9, z: 0.8 }, rot: { x: -1.5, y: 0, z: 0 } },
    { pos: { x: 1, y: 1.9, z: 1.9 }, rot: { x: -0.75, y: 1, z: 1 } },
    // { pos: { x: 0, y: 1.7, z: 2.4 }, rot: { x: -1.36, y: 0, z: -1 } },
    { pos: { x: 0, y: 2, z: 5 }, rot: { x: -0.38, y: 0, z: 0 } },
    { pos: { x: 0, y: 2, z: 5 }, rot: { x: -0.38, y: 0, z: 0 } }
   
];

let externalProgress = 0;

// Update camera position based on external progress (0-1)
function updateCamera(progress) {
    const mappedProgress = progress * (positions.length - 1);
    const currentIndex = Math.floor(mappedProgress);
    const nextIndex = Math.min(currentIndex + 1, positions.length - 1);
    const t = mappedProgress - currentIndex;
    
    const interpolated = interpolatePositions(positions[currentIndex], positions[nextIndex], t);
    
    gsap.to(camera.position, {
        x: interpolated.pos.x,
        y: interpolated.pos.y,
        z: interpolated.pos.z,
        duration: 0.5,
        ease: "power2.out"
    });

    gsap.to(camera.rotation, {
        x: interpolated.rot.x,
        y: interpolated.rot.y,
        z: interpolated.rot.z,
        duration: 0.5,
        ease: "power2.out"
    });
}

// Listen for messages from parent (Framer)
window.addEventListener('message', (event) => {
    if (event.data.type === 'SCROLL_PROGRESS') {
        updateCamera(event.data.progress);
    }
});

// Disable local scrolling
document.body.style.overflow = 'hidden';
window.addEventListener('wheel', e => e.preventDefault(), { passive: false });
