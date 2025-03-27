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

let progress = 0;
let currentSection = 0;
let isAnimating = false;

// Set up scroll sections
const totalDistance = (positions.length - 1) * 1000; // Total scroll distance needed
document.body.style.height = `${totalDistance}px`;

// Smooth scroll handling
let scrollVelocity = 0;
let lastScrollPosition = 0;
let scrollTimeout;

// Function to interpolate between two positions based on progress
function interpolatePositions(curr, next, t) {
    return {
        pos: {
            x: gsap.utils.interpolate(curr.pos.x, next.pos.x, t),
            y: gsap.utils.interpolate(curr.pos.y, next.pos.y, t),
            z: gsap.utils.interpolate(curr.pos.z, next.pos.z, t)
        },
        rot: {
            x: gsap.utils.interpolate(curr.rot.x, next.rot.x, t),
            y: gsap.utils.interpolate(curr.rot.y, next.rot.y, t),
            z: gsap.utils.interpolate(curr.rot.z, next.rot.z, t)
        }
    };
}

// Update camera position based on scroll
function updateCamera() {
    const scrollPercent = window.scrollY / totalDistance;
    progress = Math.max(0, Math.min(positions.length - 1, scrollPercent * (positions.length - 1)));
    
    const currentIndex = Math.floor(progress);
    const nextIndex = Math.min(currentIndex + 1, positions.length - 1);
    const t = progress - currentIndex;
    
    const interpolated = interpolatePositions(positions[currentIndex], positions[nextIndex], t);
    
    camera.position.set(
        interpolated.pos.x,
        interpolated.pos.y,
        interpolated.pos.z
    );
    
    camera.rotation.set(
        interpolated.rot.x,
        interpolated.rot.y,
        interpolated.rot.z
    );
}

// Smooth scroll handler
function handleScroll() {
    const currentScrollPosition = window.scrollY;
    scrollVelocity = currentScrollPosition - lastScrollPosition;
    lastScrollPosition = currentScrollPosition;
    
    // Clear existing timeout
    if (scrollTimeout) {
        clearTimeout(scrollTimeout);
    }
    
    // Update camera
    updateCamera();
    
    // Set timeout for smooth stop
    scrollTimeout = setTimeout(() => {
        const currentIndex = Math.round(progress);
        const targetScrollPosition = currentIndex * (totalDistance / (positions.length - 1));
        
        if (!isAnimating) {
            isAnimating = true;
            gsap.to(window, {
                scrollTo: targetScrollPosition,
                duration: 0.5,
                ease: "power2.out",
                onComplete: () => {
                    isAnimating = false;
                }
            });
        }
    }, 150);
}

// Add scroll event listener
window.addEventListener('scroll', handleScroll, { passive: true });

// Initial position setup
camera.position.copy(positions[0].pos);
camera.rotation.set(positions[0].rot.x, positions[0].rot.y, positions[0].rot.z);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});
// Modify your existing main.js

// Add message listener for scroll synchronization
window.addEventListener('message', (event) => {
  if (event.data.type === 'scrollSync') {
    // Convert progress to actual scroll position
    const totalDistance = (positions.length - 1) * 1000;
    const scrollPosition = event.data.progress * totalDistance;
    
    // Manually set scroll position
    window.scrollTo(0, scrollPosition);
    
    // Update camera based on new scroll position
    updateCamera();
    
    // If scroll reaches the end, notify parent
    if (event.data.progress >= 0.99) {
      window.parent.postMessage({
        type: 'iframeScrollLimit'
      }, '*');
    }
  }
});

// Modify updateCamera to ensure precise positioning
function updateCamera() {
  const scrollPercent = window.scrollY / totalDistance;
  progress = Math.max(0, Math.min(positions.length - 1, scrollPercent * (positions.length - 1)));
  
  const currentIndex = Math.floor(progress);
  const nextIndex = Math.min(currentIndex + 1, positions.length - 1);
  const t = progress - currentIndex;
  
  const interpolated = interpolatePositions(positions[currentIndex], positions[nextIndex], t);
  
  camera.position.set(
    interpolated.pos.x,
    interpolated.pos.y,
    interpolated.pos.z
  );
  
  camera.rotation.set(
    interpolated.rot.x,
    interpolated.rot.y,
    interpolated.rot.z
  );
}
