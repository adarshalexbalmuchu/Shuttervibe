"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Preload the model immediately
useGLTF.preload('/models/camera.glb');

function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 15;
      });
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <Html center>
      <div style={{ 
        color: "white", 
        fontSize: 14, 
        textAlign: "center",
        fontFamily: "system-ui, sans-serif"
      }}>
        <div style={{ marginBottom: 8 }}>Loading camera...</div>
        <div style={{ 
          width: 120, 
          height: 2, 
          background: "rgba(255,255,255,0.1)",
          borderRadius: 2,
          overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`,
            height: "100%",
            background: "rgba(255,255,255,0.6)",
            transition: "width 0.3s ease"
          }} />
        </div>
      </div>
    </Html>
  );
}

function CameraRig({ url, deviceType }: { url: string; deviceType: 'mobile' | 'tablet' | 'desktop' }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);
  const isTouchDevice = useRef(false);
  const isScrolling = useRef(false);
  const scrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Animated state driven by GSAP (we smooth application in useFrame)
  const motion = useRef({
    x: 0,
    y: 0,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 1.08,
  });

  // "Displayed" values for premium damping (prevents jitter)
  const displayed = useRef({
    x: 0,
    y: 0,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 1.08,
  });

  // Detect if device supports touch
  useEffect(() => {
    isTouchDevice.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // Detect scroll state to disable parallax during scroll
  useEffect(() => {
    const handleScroll = () => {
      isScrolling.current = true;
      
      // Clear existing timeout
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
      
      // Set scrolling to false after 150ms of no scroll
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleScroll, { passive: true });
    window.addEventListener('touchmove', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchmove', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, []);

  useMemo(() => {
    scene.traverse((o: any) => {
      if (!o.isMesh || !o.material) return;
      o.castShadow = false;
      o.receiveShadow = false;

      if (o.material.metalness != null) o.material.metalness = Math.min(1, o.material.metalness + 0.08);
      if (o.material.roughness != null) o.material.roughness = Math.max(0.08, o.material.roughness - 0.04);

      if (o.material.map) o.material.map.anisotropy = 4;
      if (o.material.normalMap) o.material.normalMap.anisotropy = 4;
    });
  }, [scene]);

  // Premium intro: overshoot + settle + micro-rotation
  useEffect(() => {
    if (!group.current) return;

    // Start small and slightly “back”
    group.current.scale.set(0.28, 0.28, 0.28);
    group.current.rotation.set(0.02, -0.25, 0.0);

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    intro
      .to(group.current.scale, { x: 1.18, y: 1.18, z: 1.18, duration: 1.15 }, 0)
      .to(group.current.rotation, { y: -0.05, x: 0.0, duration: 1.05 }, 0.05)
      // settle
      .to(group.current.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.45, ease: "power2.out" }, 1.05)
      .eventCallback("onComplete", () => {
        motion.current.scale = 1.08;
        displayed.current.scale = 1.08;
      });

    return () => {
      intro.kill();
    };
  }, []);

  // Scroll choreography: rotate-right -> micro push -> flash -> exit-left -> fade stage handled outside
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const scrollWrap = document.getElementById("scrollWrap");
    const heroStage = document.getElementById("heroStage");
    const flashOverlay = document.getElementById("flashOverlay");
    const flashGlow = document.getElementById("flashGlow");

    if (!scrollWrap) return;

    const ctx = gsap.context(() => {
      const isMobile = deviceType === 'mobile';
      const isTablet = deviceType === 'tablet';

      // Device-specific offsets for better composition
      const xOffset = isMobile ? 0.3 : isTablet ? 0.5 : 0.8;
      const EXIT_X = isMobile ? -3.3 : isTablet ? -3.8 : -4.4;

      // Important: restore visibility when scrolling back up
      if (heroStage) gsap.set(heroStage, { opacity: 1 });
      if (flashOverlay) gsap.set(flashOverlay, { opacity: 0 });
      if (flashGlow) gsap.set(flashGlow, { opacity: 0, scale: 0.98 });

      // Reset motion start (in case of refresh)
      gsap.set(motion.current, {
        x: 0,
        y: 0,
        z: 0,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
        scale: 1.08,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#scrollWrap",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.1,               // smoother premium scrub
          pin: "#heroStage",
          pinSpacing: true,         // ensures next section isn't clipped
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // keep hero visible when scrubbing back
          onEnterBack: () => {
            if (heroStage) gsap.set(heroStage, { opacity: 1 });
            if (flashOverlay) gsap.set(flashOverlay, { opacity: 0 });
            if (flashGlow) gsap.set(flashGlow, { opacity: 0, scale: 0.98 });
          },
          onRefresh: () => {
            if (heroStage) gsap.set(heroStage, { opacity: 1 });
            if (flashOverlay) gsap.set(flashOverlay, { opacity: 0 });
            if (flashGlow) gsap.set(flashGlow, { opacity: 0, scale: 0.98 });
          },
        },
      });

      /**
       * Phase 1 (0 → 0.35): premium rotate-right + tiny “ready” push
       */
      tl.to(
        motion.current,
        {
          rotY: 1.05,
          rotX: 0.08,
          z: 0.08,
          ease: "none",
        },
        0
      );

      /**
       * Phase 1b (0.35 → 0.48): pre-click micro snap (like pressing shutter)
       */
      tl.to(
        motion.current,
        {
          rotY: 1.12,
          z: 0.12,
          scale: 1.10,
          ease: "none",
        },
        0.35
      );

      /**
       * Phase 2 (flash) around 0.50
       * White flash + glow after-bloom
       */
      if (flashOverlay) {
        tl.to(flashOverlay, { opacity: 1, duration: 0.04, ease: "power1.in" }, 0.50)
          .to(flashOverlay, { opacity: 0, duration: 0.20, ease: "power2.out" }, 0.54);
      }

      if (flashGlow) {
        tl.to(flashGlow, { opacity: 0.9, scale: 1.02, duration: 0.10, ease: "power2.out" }, 0.50)
          .to(flashGlow, { opacity: 0, scale: 1.04, duration: 0.30, ease: "power2.out" }, 0.58);
      }

      /**
       * Phase 3 (0.58 → 0.92): exit-left + depth + slight roll
       */
      tl.to(
        motion.current,
        {
          x: EXIT_X,
          z: -0.10,      // pulls slightly away (feels physical)
          scale: 0.32,
          rotY: -0.65,
          rotZ: 0.08,    // slight roll for cinematic feel
          ease: "none",
        },
        0.58
      );

      /**
       * Phase 4 (0.92 → 1.0): fade stage cleanly
       */
      if (heroStage) {
        tl.to(heroStage, { opacity: 0, duration: 0.25, ease: "power2.out" }, 0.92);
      }

      return () => tl.kill();
    });

    return () => ctx.revert();
  }, [deviceType]);

  useFrame(({ mouse, clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    // Premium damping - more responsive
    const damp = 0.12;

    // Subtle breathing (very premium when minimal)
    const breathe = Math.sin(t * 0.35) * 0.012;

    // Device-specific xOffset for better composition
    const isMobile = deviceType === 'mobile';
    const isTablet = deviceType === 'tablet';
    const xOffset = isMobile ? 0.3 : isTablet ? 0.5 : 0.8;

    // Approach target motion smoothly
    displayed.current.x = THREE.MathUtils.lerp(displayed.current.x, motion.current.x + xOffset, damp);
    displayed.current.y = THREE.MathUtils.lerp(displayed.current.y, motion.current.y, damp);
    displayed.current.z = THREE.MathUtils.lerp(displayed.current.z, motion.current.z, damp);
    displayed.current.scale = THREE.MathUtils.lerp(displayed.current.scale, motion.current.scale, damp);

    displayed.current.rotY = THREE.MathUtils.lerp(displayed.current.rotY, motion.current.rotY, damp);
    displayed.current.rotX = THREE.MathUtils.lerp(displayed.current.rotX, motion.current.rotX, damp);
    displayed.current.rotZ = THREE.MathUtils.lerp(displayed.current.rotZ, motion.current.rotZ, damp);

    // Apply to group
    group.current.position.set(displayed.current.x, displayed.current.y, displayed.current.z);

    const s = displayed.current.scale;
    group.current.scale.set(s, s, s);

    // Mouse/touch parallax (disabled during scroll to prevent interference)
    const parallaxEnabled = !isTouchDevice.current && !isScrolling.current;
    const parallaxX = parallaxEnabled ? mouse.x * 0.05 : 0;  // Reduced from 0.12
    const parallaxY = parallaxEnabled ? mouse.y * 0.025 : 0; // Reduced from 0.06

    group.current.rotation.y = displayed.current.rotY + parallaxX + breathe;
    group.current.rotation.x = displayed.current.rotX + parallaxY;
    group.current.rotation.z = displayed.current.rotZ;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/camera.glb");

function useDeviceType() {
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  useEffect(() => {
    const getDeviceType = () => {
      const width = window.innerWidth;
      if (width < 768) return 'mobile';
      if (width < 1024) return 'tablet';
      return 'desktop';
    };

    setDeviceType(getDeviceType());

    const handleResize = () => setDeviceType(getDeviceType());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
}

export default function HeroToGalleryScene() {
  const [isClient, setIsClient] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [adaptiveDpr, setAdaptiveDpr] = useState<[number, number]>([1, 2]);
  const containerRef = useRef<HTMLDivElement>(null);
  const deviceType = useDeviceType();
  const fpsRef = useRef<number[]>([]);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    setIsClient(true);
  }, []);

  // IntersectionObserver to pause rendering when off-screen
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Adaptive quality based on FPS
  useEffect(() => {
    if (!isVisible) return;

    const checkPerformance = () => {
      const now = performance.now();
      const delta = now - lastTimeRef.current;
      const fps = 1000 / delta;
      lastTimeRef.current = now;

      fpsRef.current.push(fps);
      if (fpsRef.current.length > 60) fpsRef.current.shift();

      const avgFps = fpsRef.current.reduce((a, b) => a + b, 0) / fpsRef.current.length;

      const isMobile = deviceType === 'mobile';
      const isTablet = deviceType === 'tablet';

      // Adjust quality based on performance
      if (avgFps < 30) {
        setAdaptiveDpr([1, 1]); // Low quality
      } else if (avgFps < 45) {
        setAdaptiveDpr(isMobile ? [1, 1.2] : [1, 1.5]); // Medium quality
      } else {
        setAdaptiveDpr(isMobile ? [1, 1.5] : isTablet ? [1, 1.75] : [1, 2]); // High quality
      }

      requestAnimationFrame(checkPerformance);
    };

    const rafId = requestAnimationFrame(checkPerformance);
    return () => cancelAnimationFrame(rafId);
  }, [isVisible, deviceType]);

  if (!isClient) {
    return (
      <div style={{ width: "100%", height: "100%", background: "#05060a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "white", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';

  // Device-specific camera settings
  const cameraZ = isMobile ? 4.2 : isTablet ? 3.6 : 3.1;
  const cameraFov = isMobile ? 55 : isTablet ? 48 : 42;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", pointerEvents: "none" }}>
      <Canvas
        dpr={adaptiveDpr}
        camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
        style={{ width: "100%", height: "100%", background: "transparent", touchAction: "pan-y", pointerEvents: "none" }}
        gl={{ 
          antialias: !isMobile, 
          alpha: true, 
          powerPreference: "high-performance", 
          stencil: false, 
          depth: true,
          logarithmicDepthBuffer: false,
        }}
        frameloop={isVisible ? "always" : "never"}
        performance={{ min: 0.5 }}
        flat
      >
        <Suspense fallback={<Loader />}>
          <ambientLight intensity={0.55} />
          <directionalLight position={[6, 6, 6]} intensity={1.35} />
          <directionalLight position={[-3, 2, -2]} intensity={0.45} />
          <Environment preset="city" environmentIntensity={0.35} />
          <CameraRig url="/models/camera.glb" deviceType={deviceType} />
        </Suspense>
      </Canvas>
    </div>
  );
}
