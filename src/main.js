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

// main.js (updated)
import { scene, camera } from './scene.js';
import gsap from 'gsap';

// Define camera positions (keep your original positions array)
const positions = [ /* your existing position configs */ ];

// Listen for parent page scroll using cross-domain techniques
let parentScroll = 0;

// Method 1: Use Intersection Observer
const observer = new IntersectionObserver((entries) => {
    const ratio = entries[0].intersectionRatio;
    parentScroll = 1 - ratio; // Invert for scroll correlation
    updateCamera();
}, {
    threshold: Array.from({ length: 100 }, (_, i) => i / 100)
});

// Method 2: Use wheel event bubbling (works even when focused outside iframe)
document.addEventListener('wheel', (e) => {
    parentScroll = Math.max(0, Math.min(1, parentScroll + (e.deltaY * 0.0005)));
    updateCamera();
}, { passive: true });

// Update camera based on scroll
function updateCamera() {
    const mappedProgress = parentScroll * (positions.length - 1);
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

// Initial setup
observer.observe(document.body);
document.body.style.overflow = 'hidden';
document.body.style.height = '100vh';

// Remove all original scroll-related code
