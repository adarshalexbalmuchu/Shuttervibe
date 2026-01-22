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

function CameraRig({ url }: { url: string }) {
  const group = useRef<THREE.Group>(null);
  const { scene } = useGLTF(url);

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

  // “Displayed” values for premium damping (prevents jitter)
  const displayed = useRef({
    x: 0,
    y: 0,
    z: 0,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
    scale: 1.08,
  });

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
      const isMobile = window.innerWidth < 768;

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

      const EXIT_X = isMobile ? -3.3 : -4.4;

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
  }, []);

  useFrame(({ mouse, clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    // Premium damping (lower is smoother)
    const damp = 0.075;

    // Subtle breathing (very premium when minimal)
    const breathe = Math.sin(t * 0.35) * 0.015;

    // Shift camera to the right for better composition
    const xOffset = 0.8;

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

    // Mouse parallax (very controlled)
    const mx = mouse.x * 0.12;
    const my = mouse.y * 0.06;

    group.current.rotation.y = displayed.current.rotY + mx + breathe;
    group.current.rotation.x = displayed.current.rotX + my;
    group.current.rotation.z = displayed.current.rotZ;
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload("/models/camera.glb");

export default function HeroToGalleryScene() {
  const [isClient, setIsClient] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!isClient) {
    return (
      <div style={{ width: "100%", height: "100%", background: "#05060a", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "white", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, isMobile ? 4.2 : 3.1], fov: isMobile ? 55 : 42 }}
      style={{ width: "100%", height: "100%", background: "transparent", touchAction: "pan-y" }}
      gl={{ antialias: !isMobile, alpha: true, powerPreference: isMobile ? "default" : "high-performance", stencil: false, depth: true }}
    >
      <Suspense fallback={<Loader />}>
        <ambientLight intensity={0.55} />
        <directionalLight position={[6, 6, 6]} intensity={1.35} />
        <directionalLight position={[-3, 2, -2]} intensity={0.45} />
        <Environment preset="city" environmentIntensity={0.35} />
        <CameraRig url="/models/camera.glb" />
      </Suspense>
    </Canvas>
  );
}
