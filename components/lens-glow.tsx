"use client";

import { useEffect, useRef } from "react";

export function LensGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!glowRef.current) return;
      // Direct transform for better performance, let GPU handle it
      glowRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-30"
      style={{
        width: "400px",
        height: "400px",
        marginLeft: "-200px",
        marginTop: "-200px",
        background: "radial-gradient(circle, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 70%)",
        mixBlendMode: "screen",
        opacity: 0.75,
        filter: "blur(40px)",
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
        transition: "transform 0.15s ease-out"
      }}
    />
  );
}
