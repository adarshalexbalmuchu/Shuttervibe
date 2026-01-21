"use client";

import React, { useLayoutEffect, useMemo, useRef, useEffect, useState, Suspense } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF, Html } from "@react-three/drei";
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

  // Animate these values with GSAP; R3F reads them each frame.
  const motion = useRef({
    x: 0,
    y: 0,
    z: -0.6,
    scale: 0.45,
    rotX: 0,
    rotY: 0,
    rotZ: 0,
  });

  // One-time material pass for performance (no needsUpdate spam).
  useMemo(() => {
    scene.traverse((o: any) => {
      if (!o.isMesh || !o.material) return;

      o.castShadow = false;
      o.receiveShadow = false;

      if (o.material.metalness != null) o.material.metalness = Math.min(1, o.material.metalness + 0.1);
      if (o.material.roughness != null) o.material.roughness = Math.max(0.1, o.material.roughness - 0.05);

      if (o.material.map) o.material.map.anisotropy = 4;
      if (o.material.normalMap) o.material.normalMap.anisotropy = 4;
    });
  }, [scene]);

  useLayoutEffect(() => {
    // Register plugin only on client
    gsap.registerPlugin(ScrollTrigger);

    const scrollWrap = document.getElementById("scrollWrap");
    const heroStage = document.getElementById("heroStage");

    if (!scrollWrap) return;

    // These may or may not exist — code handles both cases safely.
    const flashOverlay = document.getElementById("flashOverlay");
    const barTop = document.getElementById("barTop");
    const barBottom = document.getElementById("barBottom");

    // Create a scoped GSAP context for safe cleanup
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 768;

      // Always reset hero stage opacity when timeline is rebuilt or user scrolls back up.
      if (heroStage) {
        gsap.set(heroStage, { opacity: 1 });
      }
      if (flashOverlay) gsap.set(flashOverlay, { opacity: 0 });
      if (barTop) gsap.set(barTop, { height: "0%" });
      if (barBottom) gsap.set(barBottom, { height: "0%" });

      // Explicit initial camera state (Phase 0)
      gsap.set(motion.current, {
        x: 0,
        y: 0,
        z: -0.6,
        scale: 0.45,
        rotX: 0,
        rotY: 0,
        rotZ: 0,
      });

      // Use matchMedia so resize swaps values cleanly
      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 767px)",
          isDesktop: "(min-width: 768px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean; isDesktop: boolean };

          // Tuned end values; adjust x for your exact model width.
          const EXIT_X = isMobile ? -3.2 : -4.5;
          const EXIT_SCALE = isMobile ? 0.42 : 0.40;
          const ZOOM_SCALE = isMobile ? 1.45 : 1.6;

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: "#scrollWrap",
              start: "top top",
              end: "bottom bottom",
              scrub: isMobile ? 1.15 : 0.85,
              invalidateOnRefresh: true,

              // Critical: restore heroStage when user scrolls back up
              onEnterBack: () => {
                if (heroStage) gsap.set(heroStage, { opacity: 1 });
              },
              onLeaveBack: () => {
                if (heroStage) gsap.set(heroStage, { opacity: 1 });
              },
              onRefresh: () => {
                if (heroStage) gsap.set(heroStage, { opacity: 1 });
                if (flashOverlay) gsap.set(flashOverlay, { opacity: 0 });
                if (barTop) gsap.set(barTop, { height: "0%" });
                if (barBottom) gsap.set(barBottom, { height: "0%" });
              },
            },
          });

          /**
           * Phase 1 (0 → 0.30): Zoom in (small → big), in place.
           * IMPORTANT: For scrubbed timelines, use ease:"none" for predictable behavior.
           */
          tl.to(
            motion.current,
            {
              z: 0.6,
              scale: ZOOM_SCALE,
              rotY: 0.25,
              ease: "none",
            },
            0
          );

          /**
           * Phase 2 (0.30 → 0.80): Slide left and shrink (exit).
           */
          tl.to(
            motion.current,
            {
              x: EXIT_X,
              z: 0.25,
              scale: EXIT_SCALE,
              rotY: -0.9,
              rotX: 0,
              rotZ: 0,
              ease: "none",
            },
            0.30
          );

          /**
           * Phase 3 (0.80 → 0.92): Shutter effect (flash + bars).
           * These are not scrub-critical; small timed tweens are fine.
           */
          if (flashOverlay) {
            tl.to(
              flashOverlay,
              { opacity: 1, duration: 0.05, ease: "power1.in" },
              0.82
            ).to(
              flashOverlay,
              { opacity: 0, duration: 0.18, ease: "power2.out" },
              0.87
            );
          }

          if (barTop && barBottom) {
            tl.to(
              [barTop, barBottom],
              { height: "18%", duration: 0.08, ease: "power2.inOut" },
              0.82
            ).to(
              [barTop, barBottom],
              { height: "0%", duration: 0.12, ease: "power2.out" },
              0.90
            );
          }

          /**
           * Phase 4 (0.92 → 1.0): Fade out heroStage so gallery becomes primary.
           */
          if (heroStage) {
            tl.to(
              heroStage,
              { opacity: 0, duration: 0.25, ease: "power2.out" },
              0.92
            );
          }

          return () => {
            tl.kill();
          };
        }
      );

      return () => {
        mm.revert();
      };
    });

    return () => {
      ctx.revert();
    };
  }, []);

  useFrame(({ clock, mouse }) => {
    if (!group.current) return;

    const t = clock.getElapsedTime();
    const lerpFactor = 0.085;

    // Apply transforms
    group.current.position.x = THREE.MathUtils.lerp(group.current.position.x, motion.current.x, lerpFactor);
    group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, motion.current.y, lerpFactor);
    group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, motion.current.z, lerpFactor);

    const s = THREE.MathUtils.lerp(group.current.scale.x, motion.current.scale, lerpFactor);
    group.current.scale.set(s, s, s);

    // Subtle idle + mouse tilt (keep minimal; model is high poly)
    const idleRot = Math.sin(t * 0.3) * 0.04;

    const targetY = motion.current.rotY + idleRot + mouse.x * 0.25;
    const targetX = motion.current.rotX + mouse.y * 0.08;

    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, targetY, lerpFactor);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetX, lerpFactor);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, motion.current.rotZ, lerpFactor);
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

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const timer = window.setTimeout(() => {
      // Refresh after mount to ensure ScrollTrigger reads correct layout
      try {
        ScrollTrigger.refresh();
      } catch {}
    }, 150);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  if (!isClient) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#05060a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ color: "white", fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  return (
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
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
