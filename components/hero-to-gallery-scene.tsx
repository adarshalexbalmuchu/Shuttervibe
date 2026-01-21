"use client";

import React, { useLayoutEffect, useMemo, useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, Html } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'white', fontSize: 14 }}>Loading 3D model...</div>
    </Html>
  );
}

function CameraRig({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

  // State object GSAP will animate (clean pattern)
  const motion = useRef({
    x: 0,
    y: 0,
    z: 0,
    scale: 1.25,
    rotY: 0,
    rotX: 0,
    rotZ: 0,
    intensity: 1.0, // for "energy" feel if you want later
  });

  // Make materials slightly more "premium" (safe + subtle)
  useMemo(() => {
    scene.traverse((o: any) => {
      if (!o.isMesh || !o.material) return;
      o.castShadow = true;
      o.receiveShadow = true;
      
      // Enhanced material quality
      if (o.material.metalness != null) o.material.metalness = Math.min(1, o.material.metalness + 0.15);
      if (o.material.roughness != null) o.material.roughness = Math.max(0.05, o.material.roughness - 0.12);
      
      // Enable anisotropic filtering for sharper textures
      if (o.material.map) {
        o.material.map.anisotropy = 16; // Max anisotropic filtering
        o.material.map.needsUpdate = true;
      }
      if (o.material.normalMap) {
        o.material.normalMap.anisotropy = 16;
        o.material.normalMap.needsUpdate = true;
      }
      
      o.material.needsUpdate = true;
    });
  }, [scene]);

  useLayoutEffect(() => {
    // Wait for DOM to be ready
    const scrollWrap = document.getElementById('scrollWrap');
    const galleryPanel = document.getElementById('galleryPanel');
    
    if (!scrollWrap || !galleryPanel) {
      return;
    }

    // Small delay to ensure DOM is fully painted
    const timeoutId = setTimeout(() => {
      // FASTER, SNAPPIER ANIMATION TIMELINE
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scrollWrap",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5, // Lower = faster, more responsive (was 2)
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

    /**
     * Phase 1 (0% → ~25%): Quick zoom with dynamic rotation
     */
    tl.to(motion.current, { 
      z: 0.6, 
      scale: 1.6, 
      rotY: 0.2,
      ease: "power2.out" // Snappier easing
    }, 0);

    /**
     * Phase 2 (~25% → ~100%): Fast, smooth left slide
     */
    tl.to(motion.current, { 
      x: -2.0, 
      z: 0.2, 
      scale: 0.8,
      rotY: -0.7, 
      rotX: 0.12, 
      rotZ: 0.05,
      ease: "power3.inOut" // Stronger easing for premium feel
    }, 0.25);

    /**
     * Gallery panel - Fast elegant reveal
     */
    tl.to(
      "#galleryPanel",
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.6,
        ease: "power4.out"
      },
      0.3
    );

      // Cleanup function
      return () => {
        tl.kill();
        ScrollTrigger.getAll().forEach(st => st.kill());
      };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  useFrame(({ clock, mouse }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();

    // Faster, more dynamic idle motion
    const idleFloat = Math.sin(t * 1.2) * 0.05;
    const idleRot = t * 0.2;

    // Faster lerp for snappier response (higher = faster)
    const lerpFactor = 0.12; // Increased from 0.06

    // Apply GSAP-driven transforms with faster interpolation
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, motion.current.x, lerpFactor);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, motion.current.y + idleFloat, lerpFactor);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, motion.current.z, lerpFactor);

    const s = THREE.MathUtils.lerp(group.current.scale.x, motion.current.scale, lerpFactor);
    group.current.scale.set(s, s, s);

    // More responsive mouse parallax
    const targetY = motion.current.rotY + idleRot * 0.15;
    const targetX = motion.current.rotX + mouse.y * 0.1;
    const targetZ = motion.current.rotZ - mouse.x * 0.05;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, lerpFactor);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, lerpFactor);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetZ, lerpFactor);
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

// Preload the model
useGLTF.preload('/models/camera.glb');

export default function HeroToGalleryScene() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Refresh ScrollTrigger when component mounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  if (!isClient) {
    return (
      <div style={{ width: '100%', height: '100%', background: '#05060a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={[2, 3]} // HIGHER DPI for sharper model (was [1, 2])
      camera={{ position: [0, 0, 3.1], fov: 42 }}
      style={{ background: "transparent" }}
      gl={{ 
        antialias: true, 
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
        preserveDrawingBuffer: true, // Better quality
        logarithmicDepthBuffer: true, // Better depth precision
      }}
      shadows
      frameloop="always" // Ensure continuous rendering
    >
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-3, 2, -2]} intensity={0.6} />
        <spotLight position={[0, 10, 0]} angle={0.3} penumbra={1} intensity={0.8} castShadow />
        <Environment preset="city" environmentIntensity={0.4} />
        <CameraRig url="/models/camera.glb" />
      </Suspense>
    </Canvas>
  );
}
