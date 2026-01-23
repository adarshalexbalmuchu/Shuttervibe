"use client";

import { useEffect, useRef } from "react";

export function LensGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updatePosition = () => {
      if (glowRef.current) {
        glowRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
      }
      rafRef.current = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(updatePosition);
    rafRef.current = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="fixed pointer-events-none z-[3]"
      style={{
        width: "400px",
        height: "400px",
        marginLeft: "-200px",
        marginTop: "-200px",
        background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)",
        mixBlendMode: "screen",
        opacity: 0.6,
        filter: "blur(50px)",
        willChange: "transform",
        transform: "translateZ(0)",
        backfaceVisibility: "hidden"
      }}
    />
  );
}
