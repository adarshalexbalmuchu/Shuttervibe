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

  // Make materials more efficient (run once)
  useMemo(() => {
    scene.traverse((o: any) => {
      if (!o.isMesh || !o.material) return;
      
      // Disable shadows on complex models (major performance boost)
      o.castShadow = false;
      o.receiveShadow = false;
      
      // Simpler material adjustments
      if (o.material.metalness != null) o.material.metalness = Math.min(1, o.material.metalness + 0.1);
      if (o.material.roughness != null) o.material.roughness = Math.max(0.1, o.material.roughness - 0.05);
      
      // Set anisotropic filtering once (no needsUpdate spam)
      if (o.material.map) {
        o.material.map.anisotropy = 4;
      }
      if (o.material.normalMap) {
        o.material.normalMap.anisotropy = 4;
      }
    });
  }, [scene]);

  useLayoutEffect(() => {
    const scrollWrap = document.getElementById('scrollWrap');
    const heroStage = document.getElementById('heroStage');
    
    if (!scrollWrap) return;

    // Use gsap.context for scoped, safe cleanup
    const ctx = gsap.context(() => {
      const isMobileView = window.innerWidth < 768;
      
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scrollWrap",
          start: "top top",
          end: "bottom bottom",
          scrub: isMobileView ? 1.2 : 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      /**
       * Phase 1 (0 → 0.25): Zoom in with rotation
       */
      tl.to(motion.current, { 
        z: 0.6, 
        scale: 1.8, 
        rotY: 0.3,
        ease: "power2.out"
      }, 0);

      /**
       * Phase 2 (0.25 → 1.0): Move left and disappear off screen
       */
      tl.to(motion.current, { 
        x: -4.0,
        z: 0.3,
        scale: 0.5,
        rotY: -0.8,
        rotX: 0.1,
        rotZ: 0.05,
        ease: "power3.inOut"
      }, 0.25);

      /**
       * Fade out entire hero stage (0.78 → 1.0)
       * Ensures clean disappearance before gallery
       */
      if (heroStage) {
        tl.to(heroStage, {
          opacity: 0,
          ease: "power2.out"
        }, 0.78);
      }
    });

    // Cleanup: only kills animations created in THIS context
    return () => {
      ctx.revert();
    };
  }, []);

  useFrame(({ clock, mouse }) => {
    if (!group.current) return;
    const t = clock.getElapsedTime();

    // Simplified idle motion for better performance
    const idleFloat = Math.sin(t * 0.5) * 0.03; // Reduced frequency and amplitude
    const idleRot = t * 0.1; // Slower rotation

    // Optimized lerp factor (lower = smoother, less CPU)
    const lerpFactor = 0.08; // Reduced from 0.12

    // Apply transforms (optimized)
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, motion.current.x, lerpFactor);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, motion.current.y + idleFloat, lerpFactor);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, motion.current.z, lerpFactor);

    const s = THREE.MathUtils.lerp(group.current.scale.x, motion.current.scale, lerpFactor);
    group.current.scale.set(s, s, s);

    // Simplified mouse parallax (less calculations)
    const targetY = motion.current.rotY + idleRot * 0.1;
    const targetX = motion.current.rotX + mouse.y * 0.05; // Reduced sensitivity
    const targetZ = motion.current.rotZ - mouse.x * 0.03; // Reduced sensitivity
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    // Refresh ScrollTrigger when component mounts
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
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
      dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower DPI on mobile
      camera={{ position: [0, 0, isMobile ? 4.2 : 3.1], fov: isMobile ? 55 : 42 }}
      style={{ width: "100%", height: "100%", background: "transparent", touchAction: "pan-y" }}
      gl={{ 
        antialias: !isMobile, 
        alpha: true,
        powerPreference: isMobile ? "default" : "high-performance",
        stencil: false,
        depth: true,
      }}
      frameloop="always"
    >
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1.2} />
        <directionalLight position={[-3, 2, -2]} intensity={0.4} />
        <Environment preset="city" environmentIntensity={0.3} />
        <CameraRig url="/models/camera.glb" />
      </Suspense>
    </Canvas>
  );
}
