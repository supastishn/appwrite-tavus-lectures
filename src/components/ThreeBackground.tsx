import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '../contexts/ThemeContext';

const ThreeBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create particles
    const particleCount = 3000;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    
    for(let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 200;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material with theme-aware colors
    const colors = {
      light: new THREE.Color(0x93c5fd),
      dark: new THREE.Color(0x3b82f6)
    };
    
    const material = new THREE.PointsMaterial({
      size: 0.25,
      color: theme === 'dark' ? colors.dark : colors.light,
      transparent: true,
      opacity: 0.5,
    });
    
    const particleSystem = new THREE.Points(particles, material);
    scene.add(particleSystem);
    
    camera.position.z = 5;
    
    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      
      particleSystem.rotation.x += 0.0005;
      particleSystem.rotation.y += 0.001;
      
      const positions = particles.attributes.position.array;
      for(let i = 0; i < positions.length; i += 3) {
        positions[i + 1] -= 0.015;
        if(positions[i + 1] < -100) positions[i + 1] = 100;
      }
      particles.attributes.position.needsUpdate = true;
      
      renderer.render(scene, camera);
    };
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [theme]);

  return <div ref={containerRef} className="absolute inset-0 z-0" />;
};

export default ThreeBackground;
