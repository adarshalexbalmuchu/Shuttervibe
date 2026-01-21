"use client";

import React, { useEffect, useMemo, useRef, useState, Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Html, useGLTF } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function Loader() {
  return (
    <Html center>
      <div style={{ color: "white", fontSize: 14 }}>Loading 3D model...</div>
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

    // Start small and slightly "back"
    group.current.scale.set(0.25, 0.25, 0.25);
    group.current.rotation.set(0.03, -0.3, 0.0);

    const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

    intro
      // Overshoot zoom with rotation
      .to(group.current.scale, { x: 1.22, y: 1.22, z: 1.22, duration: 1.4, ease: "power3.out" }, 0)
      .to(group.current.rotation, { y: 0.0, x: 0.0, duration: 1.2, ease: "power2.out" }, 0.1)
      // Perfect settle
      .to(group.current.scale, { x: 1.08, y: 1.08, z: 1.08, duration: 0.6, ease: "power2.out" }, 1.3)
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
          scrub: 0.95,              // even smoother scrub
          pin: "#heroStage",
          pinSpacing: true,
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
       * Phase 1 (0 → 0.32): premium rotate-right + tiny "ready" push
       */
      tl.to(
        motion.current,
        {
          rotY: 0.95,
          rotX: 0.06,
          z: 0.06,
          ease: "none",
        },
        0
      );

      /**
       * Phase 1b (0.32 → 0.45): pre-click micro snap (like pressing shutter)
       */
      tl.to(
        motion.current,
        {
          rotY: 1.08,
          z: 0.14,
          scale: 1.12,
          ease: "none",
        },
        0.32
      );

      /**
       * Phase 2 (flash) around 0.47 - shorter, punchier
       * White flash + glow after-bloom
       */
      if (flashOverlay) {
        tl.to(flashOverlay, { opacity: 1, duration: 0.03, ease: "power1.in" }, 0.47)
          .to(flashOverlay, { opacity: 0, duration: 0.22, ease: "power2.out" }, 0.50);
      }

      if (flashGlow) {
        tl.to(flashGlow, { opacity: 0.95, scale: 1.03, duration: 0.08, ease: "power2.out" }, 0.47)
          .to(flashGlow, { opacity: 0, scale: 1.06, duration: 0.35, ease: "power2.out" }, 0.55);
      }

      /**
       * Phase 3 (0.55 → 0.90): exit-left + depth + cinematic roll
       */
      tl.to(
        motion.current,
        {
          x: EXIT_X,
          y: -0.05,      // slight drop adds weight
          z: -0.15,      // pulls away more dramatically
          scale: 0.28,
          rotY: -0.75,
          rotZ: 0.12,    // more roll for cinematic feel
          ease: "none",
        },
        0.55
      );

      /**
       * Phase 4 (0.90 → 1.0): fade stage smoothly
       */
      if (heroStage) {
        tl.to(heroStage, { opacity: 0, duration: 0.28, ease: "power2.out" }, 0.90);
      }

      return () => tl.kill();
    });

    return () => ctx.revert();
  }, []);

  useFrame(({ mouse, clock }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();

    // Premium damping (lower is smoother, more cinematic)
    const damp = 0.065;

    // Ultra-subtle breathing (barely perceptible = premium)
    const breathe = Math.sin(t * 0.28) * 0.012;

    // Approach target motion smoothly
    displayed.current.x = THREE.MathUtils.lerp(displayed.current.x, motion.current.x, damp);
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

    // More refined mouse parallax (subtle = premium)
    const mx = mouse.x * 0.10;
    const my = mouse.y * 0.05;

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
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1.4} castShadow={false} />
        <directionalLight position={[-3, 2, -2]} intensity={0.5} />
        <Environment preset="city" environmentIntensity={0.4} />
        <CameraRig url="/models/camera.glb" />
      </Suspense>
    </Canvas>
  );
}
